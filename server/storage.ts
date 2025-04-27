import { 
  users, 
  type User, 
  type InsertUser, 
  contents, 
  type Content, 
  type InsertContent,
  type ContentTags,
  stats,
  type Stats,
  batchProcesses,
  type BatchProcess
} from "@shared/schema";

// Define the storage interface
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Content methods
  getContent(id: number): Promise<Content | undefined>;
  getAllContent(): Promise<Content[]>;
  getRecentContent(limit: number): Promise<Content[]>;
  getContentByTitle(title: string): Promise<Content | undefined>;
  searchContent(query: string): Promise<Content[]>;
  filterContent(options: FilterOptions): Promise<Content[]>;
  createContent(content: InsertContent): Promise<Content>;
  updateContent(id: number, content: Partial<Content>): Promise<Content | undefined>;
  updateContentTags(id: number, tags: ContentTags): Promise<Content | undefined>;
  deleteContent(id: number): Promise<boolean>;

  // Stats methods
  getStats(): Promise<Stats>;
  updateStats(): Promise<Stats>;

  // Batch processing methods
  createBatchProcess(name: string, options: any): Promise<BatchProcess>;
  updateBatchProcess(id: number, updates: Partial<BatchProcess>): Promise<BatchProcess | undefined>;
  getBatchProcesses(): Promise<BatchProcess[]>;
  getBatchProcess(id: number): Promise<BatchProcess | undefined>;
}

// Define filter options for content queries
export interface FilterOptions {
  type?: string;
  releaseYear?: number | { min?: number; max?: number };
  studio?: string;
  brand?: string;
  availability?: string;
  category?: string;
  isReviewed?: boolean;
  confidenceScoreMin?: number;
  limit?: number;
  offset?: number;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private contents: Map<number, Content>;
  private statsData: Stats;
  private batchProcesses: Map<number, BatchProcess>;
  private userIdCounter: number;
  private contentIdCounter: number;
  private batchIdCounter: number;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    this.users = new Map();
    this.contents = new Map();
    this.batchProcesses = new Map();
    this.userIdCounter = 1;
    this.contentIdCounter = 1;
    this.batchIdCounter = 1;
    
    // Initialize statsData with default values first (this will be overridden later)
    this.statsData = {
      id: 1,
      totalContent: 0,
      taggedContent: 0,
      pendingReview: 0,
      taggingAccuracy: 0,
      brandDistribution: {},
      availabilityDistribution: {},
      categoryDistribution: {},
      lastUpdated: new Date()
    };
    
    // Load CSV data
    const fs = await import('fs');
    const { parse } = await import('csv-parse/sync');
    
    try {
      const csvData = fs.readFileSync('attached_assets/disney_plus_titles.csv');
      const records = parse(csvData, { columns: true });
      
      records.forEach((record: any) => {
        const content = {
          id: this.contentIdCounter++,
          title: record.title,
          type: record.type.toLowerCase(),
          releaseYear: parseInt(record.release_year),
          description: record.description,
          studio: record.director || null,
          addedDate: record.date_added ? new Date(record.date_added) : new Date(),
          expiryDate: null,
          franchises: [],
          genres: record.listed_in ? record.listed_in.split(',').map((g: string) => g.trim()) : [],
          tags: {
            brand: [],
            availability: ['Standard'],
            category: record.listed_in ? record.listed_in.split(',').map((g: string) => g.trim()) : [],
            system: [],
            manual: []
          },
          confidenceScore: 85,
          isReviewed: false,
          lastUpdated: new Date()
        };
        
        this.contents.set(content.id, content);
      });
    } catch (error) {
      console.error('Error loading CSV:', error);
    }

    // Initialize default stats
    this.statsData = {
      id: 1,
      totalContent: 0,
      taggedContent: 0,
      pendingReview: 0,
      taggingAccuracy: 92,
      brandDistribution: {
        "Disney": 45,
        "Marvel": 25,
        "Star Wars": 15,
        "Pixar": 10,
        "National Geographic": 5
      },
      availabilityDistribution: {
        "Standard": 70,
        "New Arrival": 15,
        "Leaving Soon": 8,
        "Exclusive": 7
      },
      categoryDistribution: {
        "Family": 40,
        "Action": 30,
        "Documentary": 15,
        "Drama": 10,
        "Other": 5
      },
      lastUpdated: new Date()
    };

    // Add initial content
    this.addInitialContent();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Content methods
  async getContent(id: number): Promise<Content | undefined> {
    return this.contents.get(id);
  }

  async getAllContent(): Promise<Content[]> {
    return Array.from(this.contents.values());
  }

  async getRecentContent(limit: number = 5): Promise<Content[]> {
    return Array.from(this.contents.values())
      .sort((a, b) => new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime())
      .slice(0, limit);
  }

  async getContentByTitle(title: string): Promise<Content | undefined> {
    return Array.from(this.contents.values()).find(
      (content) => content.title.toLowerCase() === title.toLowerCase()
    );
  }

  async searchContent(query: string): Promise<Content[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.contents.values()).filter(content => {
      return (
        content.title.toLowerCase().includes(lowercaseQuery) ||
        (content.description && content.description.toLowerCase().includes(lowercaseQuery)) ||
        (content.tags.brand.some(tag => tag.toLowerCase().includes(lowercaseQuery))) ||
        (content.tags.category.some(tag => tag.toLowerCase().includes(lowercaseQuery))) ||
        (content.tags.availability.some(tag => tag.toLowerCase().includes(lowercaseQuery)))
      );
    });
  }

  async filterContent(options: FilterOptions): Promise<Content[]> {
    return Array.from(this.contents.values()).filter(content => {
      if (options.type && content.type !== options.type) return false;

      if (options.releaseYear) {
        if (typeof options.releaseYear === 'number') {
          if (content.releaseYear !== options.releaseYear) return false;
        } else {
          if (options.releaseYear.min && content.releaseYear < options.releaseYear.min) return false;
          if (options.releaseYear.max && content.releaseYear > options.releaseYear.max) return false;
        }
      }

      if (options.studio && content.studio !== options.studio) return false;

      if (options.brand && !content.tags.brand.includes(options.brand)) return false;

      if (options.availability && !content.tags.availability.includes(options.availability)) return false;

      if (options.category && !content.tags.category.includes(options.category)) return false;

      if (options.isReviewed !== undefined && content.isReviewed !== options.isReviewed) return false;

      if (options.confidenceScoreMin !== undefined && content.confidenceScore < options.confidenceScoreMin) return false;

      return true;
    })
    .slice(options.offset || 0, (options.offset || 0) + (options.limit || Infinity));
  }

  async createContent(insertContent: InsertContent): Promise<Content> {
    const id = this.contentIdCounter++;
    const now = new Date();

    const content: Content = {
      ...insertContent,
      id,
      addedDate: now,
      lastUpdated: now,
      isReviewed: insertContent.isReviewed || false,
      confidenceScore: insertContent.confidenceScore || 0,
    };

    this.contents.set(id, content);

    // Update stats
    await this.updateStats();

    return content;
  }

  async updateContent(id: number, updates: Partial<Content>): Promise<Content | undefined> {
    const content = this.contents.get(id);
    if (!content) return undefined;

    const updatedContent = {
      ...content,
      ...updates,
      lastUpdated: new Date(),
    };

    this.contents.set(id, updatedContent);

    // Update stats
    await this.updateStats();

    return updatedContent;
  }

  async updateContentTags(id: number, tags: ContentTags): Promise<Content | undefined> {
    const content = this.contents.get(id);
    if (!content) return undefined;

    const updatedContent = {
      ...content,
      tags,
      lastUpdated: new Date(),
    };

    this.contents.set(id, updatedContent);

    // Update stats
    await this.updateStats();

    return updatedContent;
  }

  async deleteContent(id: number): Promise<boolean> {
    const deleted = this.contents.delete(id);

    if (deleted) {
      // Update stats
      await this.updateStats();
    }

    return deleted;
  }

  // Stats methods
  async getStats(): Promise<Stats> {
    return this.statsData;
  }

  async updateStats(): Promise<Stats> {
    const allContent = Array.from(this.contents.values());
    const totalContent = allContent.length;
    const taggedContent = allContent.filter(content => 
      content.tags.brand.length > 0 || 
      content.tags.category.length > 0 || 
      content.tags.availability.length > 0
    ).length;
    const pendingReview = allContent.filter(content => !content.isReviewed).length;

    // Calculate brand distribution
    const brandCounts: {[key: string]: number} = {};
    allContent.forEach(content => {
      content.tags.brand.forEach(brand => {
        brandCounts[brand] = (brandCounts[brand] || 0) + 1;
      });
    });

    // Convert counts to percentages
    const brandDistribution: {[key: string]: number} = {};
    const brandTotal = Object.values(brandCounts).reduce((sum, count) => sum + count, 0);

    Object.entries(brandCounts).forEach(([brand, count]) => {
      brandDistribution[brand] = Math.round((count / (brandTotal || 1)) * 100);
    });

    // Calculate availability distribution
    const availabilityCounts: {[key: string]: number} = {};
    allContent.forEach(content => {
      content.tags.availability.forEach(availability => {
        availabilityCounts[availability] = (availabilityCounts[availability] || 0) + 1;
      });
    });

    // Convert counts to percentages
    const availabilityDistribution: {[key: string]: number} = {};
    const availabilityTotal = Object.values(availabilityCounts).reduce((sum, count) => sum + count, 0);

    Object.entries(availabilityCounts).forEach(([availability, count]) => {
      availabilityDistribution[availability] = Math.round((count / (availabilityTotal || 1)) * 100);
    });

    // Calculate category distribution
    const categoryCounts: {[key: string]: number} = {};
    allContent.forEach(content => {
      content.tags.category.forEach(category => {
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      });
    });

    // Convert counts to percentages
    const categoryDistribution: {[key: string]: number} = {};
    const categoryTotal = Object.values(categoryCounts).reduce((sum, count) => sum + count, 0);

    Object.entries(categoryCounts).forEach(([category, count]) => {
      categoryDistribution[category] = Math.round((count / (categoryTotal || 1)) * 100);
    });

    this.statsData = {
      ...this.statsData,
      totalContent,
      taggedContent,
      pendingReview,
      brandDistribution: Object.keys(brandDistribution).length > 0 ? brandDistribution : this.statsData.brandDistribution,
      availabilityDistribution: Object.keys(availabilityDistribution).length > 0 ? availabilityDistribution : this.statsData.availabilityDistribution,
      categoryDistribution: Object.keys(categoryDistribution).length > 0 ? categoryDistribution : this.statsData.categoryDistribution,
      lastUpdated: new Date()
    };

    return this.statsData;
  }

  // Batch processing methods
  async createBatchProcess(name: string, options: any): Promise<BatchProcess> {
    const id = this.batchIdCounter++;
    const batchProcess: BatchProcess = {
      id,
      name,
      status: "Pending",
      totalItems: 0,
      processedItems: 0,
      successItems: 0,
      failedItems: 0,
      skippedItems: 0,
      startedAt: new Date(),
      completedAt: null,
      options
    };

    this.batchProcesses.set(id, batchProcess);
    return batchProcess;
  }

  async updateBatchProcess(id: number, updates: Partial<BatchProcess>): Promise<BatchProcess | undefined> {
    const batchProcess = this.batchProcesses.get(id);
    if (!batchProcess) return undefined;

    const updatedBatch = {
      ...batchProcess,
      ...updates,
      completedAt: updates.status === "Completed" || updates.status === "Failed" || updates.status === "Partial" 
        ? new Date() 
        : batchProcess.completedAt
    };

    this.batchProcesses.set(id, updatedBatch);
    return updatedBatch;
  }

  async getBatchProcesses(): Promise<BatchProcess[]> {
    return Array.from(this.batchProcesses.values())
      .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
  }

  async getBatchProcess(id: number): Promise<BatchProcess | undefined> {
    return this.batchProcesses.get(id);
  }

  // Helper method to add initial content for demo purposes
  private addInitialContent() {
    const initialContents: InsertContent[] = [
      {
        title: "The Mandalorian",
        type: "series",
        releaseYear: 2019,
        description: "After the fall of the Empire, a lone gunfighter makes his way through the lawless galaxy with his charge, a child born with a powerful connection to the Force.",
        studio: "Lucasfilm",
        expiryDate: null,
        franchises: ["Star Wars"],
        genres: ["Action", "Adventure", "Sci-Fi"],
        tags: {
          availability: ["Exclusive"],
          brand: ["Star Wars"],
          category: ["Action", "Sci-Fi"],
          system: ["Space", "Western"],
          manual: []
        },
        confidenceScore: 97,
        isReviewed: true
      },
      {
        title: "Loki",
        type: "series",
        releaseYear: 2021,
        description: "The mercurial villain Loki resumes his role as the God of Mischief in a new series that takes place after the events of 'Avengers: Endgame'.",
        studio: "Marvel Studios",
        expiryDate: null,
        franchises: ["Marvel", "MCU"],
        genres: ["Action", "Adventure", "Fantasy"],
        tags: {
          availability: ["New Arrival"],
          brand: ["Marvel"],
          category: ["Sci-Fi"],
          system: ["Superhero", "Time Travel"],
          manual: []
        },
        confidenceScore: 94,
        isReviewed: true
      },
      {
        title: "The Lion King",
        type: "movie",
        releaseYear: 1994,
        description: "Lion prince Simba and his father are targeted by his bitter uncle, who wants to ascend the throne himself.",
        studio: "Walt Disney Animation",
        expiryDate: null,
        franchises: ["Disney Classics"],
        genres: ["Animation", "Adventure", "Drama"],
        tags: {
          availability: ["Standard"],
          brand: ["Disney"],
          category: ["Family", "Animation"],
          system: ["Musical", "Animals"],
          manual: []
        },
        confidenceScore: 99,
        isReviewed: true
      },
      {
        title: "Secrets of Whales",
        type: "series",
        releaseYear: 2021,
        description: "An epic, revealing nature documentary series narrated by Sigourney Weaver that explores the world's most fascinating creatures - whales.",
        studio: "National Geographic",
        expiryDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        franchises: [],
        genres: ["Documentary", "Nature"],
        tags: {
          availability: ["Leaving Soon"],
          brand: ["National Geographic"],
          category: ["Documentary"],
          system: ["Nature", "Ocean"],
          manual: []
        },
        confidenceScore: 90,
        isReviewed: true
      },
      {
        title: "Soul",
        type: "movie",
        releaseYear: 2020,
        description: "A musician who has lost his passion for music is transported out of his body and must find his way back with the help of an infant soul learning about herself.",
        studio: "Pixar",
        expiryDate: null,
        franchises: [],
        genres: ["Animation", "Adventure", "Comedy"],
        tags: {
          availability: ["Standard"],
          brand: ["Pixar"],
          category: ["Family", "Animation"],
          system: ["Music", "Philosophy"],
          manual: []
        },
        confidenceScore: 78,
        isReviewed: false
      }
    ];

    initialContents.forEach(content => {
      const id = this.contentIdCounter++;
      const now = new Date();
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      const fullContent: Content = {
        ...content,
        id,
        addedDate: content.title === "Loki" ? oneMonthAgo : new Date(now.setDate(now.getDate() - Math.floor(Math.random() * 60))),
        lastUpdated: new Date()
      };

      this.contents.set(id, fullContent);
    });

    // Add more variety to reach around 500 titles for demo
    const titlePrefixes = ["The Adventures of", "Chronicles of", "Return to", "Legacy of", "Rise of"];
    const titleSuffixes = ["Heroes", "Legends", "Universe", "Journeys", "Academy", "Wars", "Chronicles"];
    const studios = ["Walt Disney Animation", "Marvel Studios", "Lucasfilm", "Pixar", "National Geographic", "20th Century Studios"];
    const franchises = [["Disney Classics"], ["Marvel", "MCU"], ["Star Wars"], ["Pixar"], [], ["X-Men"]];
    const types = ["movie", "series", "movie", "movie", "series"];
    const years = [2018, 2019, 2020, 2021, 2022, 2023];
    const genres = [
      ["Animation", "Adventure", "Comedy"], 
      ["Action", "Adventure", "Sci-Fi"], 
      ["Action", "Adventure", "Fantasy"], 
      ["Animation", "Adventure", "Family"],
      ["Documentary", "Nature"],
      ["Comedy", "Drama"]
    ];
    const brands = ["Disney", "Marvel", "Star Wars", "Pixar", "National Geographic", ""];
    const categories = [
      ["Family", "Animation"], 
      ["Action", "Sci-Fi"], 
      ["Action"], 
      ["Family"],
      ["Documentary"],
      ["Comedy", "Drama"]
    ];

    // Add about 20-30 more titles for demo purposes
    for (let i = 0; i < 25; i++) {
      const studioIndex = Math.floor(Math.random() * studios.length);
      const typeIndex = Math.floor(Math.random() * types.length);
      const yearIndex = Math.floor(Math.random() * years.length);

      const title = `${titlePrefixes[Math.floor(Math.random() * titlePrefixes.length)]} ${titleSuffixes[Math.floor(Math.random() * titleSuffixes.length)]} ${i + 1}`;
      const id = this.contentIdCounter++;
      const now = new Date();

      // Random date in the last 6 months
      const randomDate = new Date(now.setDate(now.getDate() - Math.floor(Math.random() * 180)));

      // Some titles should be expiring soon
      const isExpiringSoon = Math.random() < 0.1;
      const expiryDate = isExpiringSoon 
        ? new Date(new Date().setMonth(new Date().getMonth() + 1)) 
        : null;

      const isNewArrival = !isExpiringSoon && Math.random() < 0.15;
      const isExclusive = !isExpiringSoon && !isNewArrival && Math.random() < 0.07;

      const availability = isExpiringSoon 
        ? ["Leaving Soon"] 
        : isNewArrival 
          ? ["New Arrival"] 
          : isExclusive 
            ? ["Exclusive"] 
            : ["Standard"];

      const studio = studios[studioIndex];
      const brand = brands[studioIndex];
      const brandTags = brand ? [brand] : [];

      const content: Content = {
        id,
        title,
        type: types[typeIndex],
        releaseYear: years[yearIndex],
        description: `Description for ${title}`,
        addedDate: isNewArrival ? new Date(new Date().setDate(new Date().getDate() - 15)) : randomDate,
        expiryDate,
        studio,
        franchises: franchises[studioIndex],
        genres: genres[studioIndex],
        tags: {
          availability,
          brand: brandTags,
          category: categories[studioIndex],
          system: [],
          manual: []
        },
        confidenceScore: Math.floor(Math.random() * 30) + 70, // 70-99
        isReviewed: Math.random() > 0.2, // 80% reviewed
        lastUpdated: new Date()
      };

      this.contents.set(id, content);
    }

    // Initialize stats after adding content
    this.updateStats();
  }
}

export const storage = new MemStorage();