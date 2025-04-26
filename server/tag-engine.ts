import { Content, ContentTags, Tag } from "@shared/schema";

/**
 * Tag engine that automatically generates tags for Disney+ content
 */
export class TagEngine {
  /**
   * Generate availability tags based on content data
   */
  generateAvailabilityTags(content: Partial<Content>): string[] {
    const tags: string[] = [];
    const now = new Date();
    const oneMonthAgo = new Date(now);
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const oneMonthLater = new Date(now);
    oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

    // Check if content is new
    if (content.addedDate && new Date(content.addedDate) > oneMonthAgo) {
      tags.push('New Arrival');
    }

    // Check if content is leaving soon
    if (content.expiryDate && new Date(content.expiryDate) < oneMonthLater) {
      tags.push('Leaving Soon');
    }

    // Check if content is exclusive
    if (this.isExclusive(content)) {
      tags.push('Exclusive');
    }

    // If no specific availability tag, it's standard
    if (tags.length === 0) {
      tags.push('Standard');
    }

    return tags;
  }

  /**
   * Detect brand based on content metadata
   */
  detectBrand(content: Partial<Content>): string[] {
    const brands: string[] = [];

    const brandPatterns = {
      'Disney': ['Disney', 'Walt Disney', 'Disney Animation', 'Disney Classics'],
      'Marvel': ['Marvel', 'MCU', 'Avengers', 'Marvel Studios'],
      'Star Wars': ['Star Wars', 'Mandalorian', 'Jedi', 'Lucasfilm'],
      'Pixar': ['Pixar', 'Toy Story', 'Finding', 'Incredibles'],
      'National Geographic': ['National Geographic', 'Nat Geo', 'Geography', 'Nature', 'Wildlife'],
    };

    // Combine all content text for pattern matching
    const contentText = [
      content.title || '',
      content.description || '',
      content.studio || '',
      content.director || '',
      ...(content.cast || []),
      ...(content.franchises || []),
      ...(content.genres || []),
      ...(content.listedIn || [])
    ].join(' ');

    // Check for brand patterns
    Object.entries(brandPatterns).forEach(([brand, patterns]) => {
      if (patterns.some(pattern => contentText.toLowerCase().includes(pattern.toLowerCase()))) {
        brands.push(brand);
      }
    });

    return brands;
  }

  /**
   * Classify content categories
   */
  classifyCategories(content: Partial<Content>): string[] {
    const categories: string[] = [];

    // Add age rating categories
    if (content.rating) {
      if (content.rating.includes('G') || content.rating.includes('TV-Y')) {
        categories.push('Kids');
      } else if (content.rating.includes('PG')) {
        categories.push('Family');
      } else if (content.rating.includes('R') || content.rating.includes('TV-MA')) {
        categories.push('Mature');
      }
    }

    const categoryPatterns = {
      'Family': ['Family', 'Kids', 'Animation', 'Disney Classics', 'Children', 'Pixar'],
      'Action': ['Action', 'Adventure', 'Superhero', 'Marvel', 'Star Wars', 'Fighting'],
      'Documentary': ['Documentary', 'Nature', 'Wildlife', 'National Geographic', 'Educational'],
      'Drama': ['Drama', 'Emotional', 'Character', 'Relationships'],
      'Comedy': ['Comedy', 'Funny', 'Humor', 'Laugh'],
      'Sci-Fi': ['Sci-Fi', 'Science Fiction', 'Future', 'Space', 'Star Wars', 'Marvel'],
      'Animation': ['Animation', 'Animated', 'Cartoon', 'Pixar', 'Disney Animation']
    };

    // Combine all content text for pattern matching
    const contentText = [
      content.title || '',
      content.description || '',
      ...(content.genres || []),
      ...(content.franchises || [])
    ].join(' ');

    // Check for category patterns
    Object.entries(categoryPatterns).forEach(([category, patterns]) => {
      if (patterns.some(pattern => contentText.toLowerCase().includes(pattern.toLowerCase()))) {
        categories.push(category);
      }
    });

    // If content has 'Animation' genre, add Animation category
    if ((content.genres || []).some(genre => genre.toLowerCase() === 'animation')) {
      if (!categories.includes('Animation')) {
        categories.push('Animation');
      }
    }

    return categories;
  }

  /**
   * Calculate confidence score for tag generation
   */
  calculateConfidenceScore(content: Partial<Content>, tags: ContentTags): number {
    let score = 0;
    let maxPossibleScore = 0;

    // Brand confidence
    if (tags.brand.length > 0) {
      score += 25;
      // Higher confidence for explicit studio match
      if (content.studio && tags.brand.some(brand => content.studio?.includes(brand))) {
        score += 15;
      }
    }
    maxPossibleScore += 40;

    // Category confidence
    if (tags.category.length > 0) {
      score += 20;
      // Higher confidence for genre matches
      if (content.genres && content.genres.length > 0) {
        const genreMatchCount = content.genres.filter(genre => 
          tags.category.some(category => 
            category.toLowerCase() === genre.toLowerCase()
          )
        ).length;

        if (genreMatchCount > 0) {
          score += Math.min(15, genreMatchCount * 5);
        }
      }
    }
    maxPossibleScore += 35;

    // Availability confidence (usually high)
    if (tags.availability.length > 0) {
      score += 20;
    }
    maxPossibleScore += 20;

    // Additional metadata points
    if (content.description && content.description.length > 20) score += 3;
    if (content.franchises && content.franchises.length > 0) score += 2;
    maxPossibleScore += 5;

    // Calculate percentage
    return Math.min(99, Math.round((score / maxPossibleScore) * 100));
  }

  /**
   * Process content and generate all tags
   */
  generateTags(content: Partial<Content>): { tags: ContentTags; confidenceScore: number } {
    // Generate the tags
    const availabilityTags = this.generateAvailabilityTags(content);
    const brandTags = this.detectBrand(content);
    const categoryTags = this.classifyCategories(content);

    const tags: ContentTags = {
      availability: availabilityTags,
      brand: brandTags,
      category: categoryTags,
      system: [],
      manual: []
    };

    // Calculate confidence score
    const confidenceScore = this.calculateConfidenceScore(content, tags);

    return { tags, confidenceScore };
  }

  /**
   * Generate all tags for a batch of content
   */
  batchGenerateTags(contentItems: Partial<Content>[]): { 
    results: Array<{ 
      content: Partial<Content>; 
      tags: ContentTags; 
      confidenceScore: number;
      success: boolean;
    }> 
  } {
    const results = contentItems.map(content => {
      try {
        const { tags, confidenceScore } = this.generateTags(content);
        return {
          content,
          tags,
          confidenceScore,
          success: true
        };
      } catch (error) {
        console.error(`Failed to generate tags for content: ${content.title}`, error);
        return {
          content,
          tags: {
            availability: [],
            brand: [],
            category: [],
            system: [],
            manual: []
          },
          confidenceScore: 0,
          success: false
        };
      }
    });

    return { results };
  }

  /**
   * Helper method to determine if content should be marked as exclusive
   */
  private isExclusive(content: Partial<Content>): boolean {
    // Logic to determine if content is exclusive
    // Usually original content from Disney+
    const exclusiveKeywords = ['Original', 'Only on Disney+', 'Disney+ Original', 'Exclusive'];

    const contentText = [
      content.title || '',
      content.description || '',
      ...(content.franchises || [])
    ].join(' ');

    // Check for exclusive keywords
    if (exclusiveKeywords.some(keyword => contentText.includes(keyword))) {
      return true;
    }

    // Check if it's a more recent title from certain studios, which are often exclusive
    if (content.releaseYear && content.releaseYear >= 2019) {
      if (content.studio && 
         (content.studio.includes('Marvel Studios') || 
          content.studio.includes('Lucasfilm') || 
          content.studio.includes('Disney+'))
      ) {
        return true;
      }
    }

    return false;
  }
}

export const tagEngine = new TagEngine();