
import axios from 'axios';
import { Content } from '@shared/schema';

export class TMDBClient {
  private baseUrl = 'https://api.themoviedb.org/3';
  
  constructor(private apiKey: string) {}

  async searchDisneyContent(page = 1) {
    try {
      // Search for Disney/Marvel/Pixar/Star Wars content
      const response = await axios.get(`${this.baseUrl}/discover/movie`, {
        params: {
          api_key: this.apiKey,
          with_companies: '2|3475|3|9353', // Disney|Marvel|Pixar|Lucasfilm
          page
        }
      });

      return response.data.results.map((item: any) => ({
        title: item.title,
        type: 'movie',
        releaseYear: new Date(item.release_date).getFullYear(),
        description: item.overview,
        studio: this.getStudioFromProductionCompany(item.production_companies),
        genres: item.genres?.map((g: any) => g.name) || []
      }));
    } catch (error) {
      console.error('Error fetching from TMDB:', error);
      throw error;
    }
  }

  private getStudioFromProductionCompany(companies: any[]) {
    const studioMap: {[key: string]: string} = {
      '2': 'Walt Disney Pictures',
      '3475': 'Marvel Studios',
      '3': 'Pixar',
      '9353': 'Lucasfilm'
    };

    if (!companies?.length) return 'Unknown';
    const company = companies.find(c => Object.keys(studioMap).includes(c.id.toString()));
    return company ? studioMap[company.id.toString()] : companies[0].name;
  }
}
