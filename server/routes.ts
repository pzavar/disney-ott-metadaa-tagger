import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { tagEngine } from "./tag-engine";
import { z } from "zod";
import { insertContentSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const apiRouter = express.Router();

  // ===== Stats Endpoints =====
  apiRouter.get("/stats", async (req: Request, res: Response) => {
    try {
      const stats = await storage.getStats();
      return res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      return res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // ===== Content Endpoints =====
  apiRouter.get("/content", async (req: Request, res: Response) => {
    try {
      const contents = await storage.getAllContent();
      return res.json(contents);
    } catch (error) {
      console.error("Error fetching all content:", error);
      return res.status(500).json({ message: "Failed to fetch content" });
    }
  });

  apiRouter.get("/content/recent", async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 5;
      const contents = await storage.getRecentContent(limit);
      return res.json(contents);
    } catch (error) {
      console.error("Error fetching recent content:", error);
      return res.status(500).json({ message: "Failed to fetch recent content" });
    }
  });

  apiRouter.get("/content/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const content = await storage.getContent(id);
      
      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }
      
      return res.json(content);
    } catch (error) {
      console.error(`Error fetching content with id ${req.params.id}:`, error);
      return res.status(500).json({ message: "Failed to fetch content" });
    }
  });

  apiRouter.post("/content", async (req: Request, res: Response) => {
    try {
      // Validate request body
      const validationResult = insertContentSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid content data", 
          errors: validationResult.error.flatten() 
        });
      }
      
      // Generate tags if not provided
      if (!req.body.tags || !Object.keys(req.body.tags).length) {
        const { tags, confidenceScore } = tagEngine.generateTags(req.body);
        req.body.tags = tags;
        req.body.confidenceScore = confidenceScore;
      }
      
      const newContent = await storage.createContent(req.body);
      return res.status(201).json(newContent);
    } catch (error) {
      console.error("Error creating content:", error);
      return res.status(500).json({ message: "Failed to create content" });
    }
  });

  apiRouter.put("/content/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const content = await storage.getContent(id);
      
      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }
      
      // Update content
      const updatedContent = await storage.updateContent(id, req.body);
      return res.json(updatedContent);
    } catch (error) {
      console.error(`Error updating content with id ${req.params.id}:`, error);
      return res.status(500).json({ message: "Failed to update content" });
    }
  });

  apiRouter.put("/content/:id/tags", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const content = await storage.getContent(id);
      
      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }
      
      // Check if tags are valid
      const tagsSchema = z.object({
        availability: z.array(z.string()),
        brand: z.array(z.string()),
        category: z.array(z.string()),
        system: z.array(z.string()),
        manual: z.array(z.string())
      });
      
      const validationResult = tagsSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid tags data", 
          errors: validationResult.error.flatten() 
        });
      }
      
      // Update tags
      const updatedContent = await storage.updateContentTags(id, req.body);
      
      // Mark content as reviewed if not already
      if (!content.isReviewed) {
        await storage.updateContent(id, { isReviewed: true });
      }
      
      return res.json(updatedContent);
    } catch (error) {
      console.error(`Error updating tags for content with id ${req.params.id}:`, error);
      return res.status(500).json({ message: "Failed to update tags" });
    }
  });

  apiRouter.delete("/content/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const content = await storage.getContent(id);
      
      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }
      
      const deleted = await storage.deleteContent(id);
      
      if (deleted) {
        return res.status(204).send();
      } else {
        return res.status(500).json({ message: "Failed to delete content" });
      }
    } catch (error) {
      console.error(`Error deleting content with id ${req.params.id}:`, error);
      return res.status(500).json({ message: "Failed to delete content" });
    }
  });

  apiRouter.get("/search", async (req: Request, res: Response) => {
    try {
      const query = req.query.q as string;
      
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      const results = await storage.searchContent(query);
      return res.json(results);
    } catch (error) {
      console.error("Error searching content:", error);
      return res.status(500).json({ message: "Failed to search content" });
    }
  });

  apiRouter.get("/filter", async (req: Request, res: Response) => {
    try {
      const filterOptions = {
        type: req.query.type as string,
        brand: req.query.brand as string,
        availability: req.query.availability as string,
        category: req.query.category as string,
        isReviewed: req.query.isReviewed === 'true',
        confidenceScoreMin: req.query.confidenceScoreMin ? parseInt(req.query.confidenceScoreMin as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        offset: req.query.offset ? parseInt(req.query.offset as string) : undefined
      };
      
      const results = await storage.filterContent(filterOptions);
      return res.json(results);
    } catch (error) {
      console.error("Error filtering content:", error);
      return res.status(500).json({ message: "Failed to filter content" });
    }
  });

  // ===== Tagging Endpoints =====
  apiRouter.post("/tag", async (req: Request, res: Response) => {
    try {
      // Validate that the request contains required content fields
      const contentSchema = z.object({
        title: z.string(),
        type: z.string(),
        releaseYear: z.number().int().positive(),
        description: z.string().optional(),
        studio: z.string().optional(),
        franchises: z.array(z.string()).optional(),
        genres: z.array(z.string()).optional()
      });
      
      const validationResult = contentSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid content data", 
          errors: validationResult.error.flatten() 
        });
      }
      
      // Generate tags
      const startTime = Date.now();
      const { tags, confidenceScore } = tagEngine.generateTags(req.body);
      const processingTime = `${Date.now() - startTime}ms`;
      
      return res.json({ tags, confidence: confidenceScore, processingTime });
    } catch (error) {
      console.error("Error generating tags:", error);
      return res.status(500).json({ message: "Failed to generate tags" });
    }
  });

  apiRouter.post("/content/import/tmdb", async (req: Request, res: Response) => {
  try {
    const tmdbClient = new TMDBClient(process.env.TMDB_API_KEY!);
    const page = parseInt(req.query.page as string) || 1;
    
    const items = await tmdbClient.searchDisneyContent(page);
    const results = [];

    for (const item of items) {
      try {
        // Generate tags
        const { tags, confidenceScore } = tagEngine.generateTags(item);
        item.tags = tags;
        item.confidenceScore = confidenceScore;

        // Save to storage
        const newContent = await storage.createContent(item);
        results.push({
          title: item.title,
          success: true,
          id: newContent.id
        });
      } catch (error) {
        results.push({
          title: item.title,
          success: false,
          error: "Failed to create content"
        });
      }
    }

    return res.status(200).json({
      total: items.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results
    });
  } catch (error) {
    console.error("Error importing content:", error);
    return res.status(500).json({ message: "Failed to import content" });
  }
});

apiRouter.post("/content/import", async (req: Request, res: Response) => {
  try {
    const contentArray = req.body;
    
    if (!Array.isArray(contentArray)) {
      return res.status(400).json({ message: "Request body must be an array of content items" });
    }

    const results = [];
    for (const item of contentArray) {
      try {
        const validationResult = insertContentSchema.safeParse(item);
        if (!validationResult.success) {
          results.push({
            title: item.title,
            success: false,
            error: "Validation failed"
          });
          continue;
        }

        if (!item.tags || !Object.keys(item.tags).length) {
          const { tags, confidenceScore } = tagEngine.generateTags(item);
          item.tags = tags;
          item.confidenceScore = confidenceScore;
        }

        const newContent = await storage.createContent(item);
        results.push({
          title: item.title,
          success: true,
          id: newContent.id
        });
      } catch (error) {
        results.push({
          title: item.title,
          success: false,
          error: "Failed to create content"
        });
      }
    }

    return res.status(200).json({
      total: contentArray.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results
    });
  } catch (error) {
    console.error("Error importing content:", error);
    return res.status(500).json({ message: "Failed to import content" });
  }
});

apiRouter.post("/batch", async (req: Request, res: Response) => {
    try {
      // Validate request body
      const batchSchema = z.object({
        name: z.string(),
        contents: z.array(z.object({
          title: z.string(),
          type: z.string(),
          releaseYear: z.number().int().positive(),
          description: z.string().optional(),
          studio: z.string().optional(),
          franchises: z.array(z.string()).optional(),
          genres: z.array(z.string()).optional()
        })),
        options: z.object({
          overwriteExisting: z.boolean().optional(),
          applyHighConfidenceOnly: z.boolean().optional(),
          confidenceThreshold: z.number().min(0).max(100).optional()
        }).optional()
      });
      
      const validationResult = batchSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid batch data", 
          errors: validationResult.error.flatten() 
        });
      }
      
      // Create batch process record
      const batchProcess = await storage.createBatchProcess(req.body.name, req.body.options || {});
      
      // Process the batch
      const { results } = tagEngine.batchGenerateTags(req.body.contents);
      
      // Update batch process with results
      const totalProcessed = results.length;
      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;
      
      const confidenceThreshold = req.body.options?.confidenceThreshold || 0;
      const highConfidenceOnly = req.body.options?.applyHighConfidenceOnly || false;
      const skipped = highConfidenceOnly ? 
        results.filter(r => r.success && r.confidenceScore < confidenceThreshold).length : 0;
      
      // Update batch process status
      await storage.updateBatchProcess(batchProcess.id, {
        status: failed > 0 ? "Partial" : "Completed",
        totalItems: totalProcessed,
        processedItems: totalProcessed,
        successItems: successful,
        failedItems: failed,
        skippedItems: skipped
      });
      
      // Return batch results
      return res.json({
        batchId: batchProcess.id,
        status: failed > 0 ? "Partial" : "Completed",
        summary: {
          totalProcessed,
          successful,
          failed, 
          skipped
        },
        results: results.map(r => ({
          title: r.content.title,
          success: r.success,
          confidenceScore: r.confidenceScore,
          tags: r.success ? r.tags : null
        }))
      });
    } catch (error) {
      console.error("Error processing batch:", error);
      return res.status(500).json({ message: "Failed to process batch" });
    }
  });

  apiRouter.get("/batch", async (req: Request, res: Response) => {
    try {
      const batchProcesses = await storage.getBatchProcesses();
      return res.json(batchProcesses);
    } catch (error) {
      console.error("Error fetching batch processes:", error);
      return res.status(500).json({ message: "Failed to fetch batch processes" });
    }
  });

  apiRouter.get("/batch/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const batchProcess = await storage.getBatchProcess(id);
      
      if (!batchProcess) {
        return res.status(404).json({ message: "Batch process not found" });
      }
      
      return res.json(batchProcess);
    } catch (error) {
      console.error(`Error fetching batch process with id ${req.params.id}:`, error);
      return res.status(500).json({ message: "Failed to fetch batch process" });
    }
  });

  // Register the API router
  app.use("/api", apiRouter);

  const httpServer = createServer(app);
  return httpServer;
}
