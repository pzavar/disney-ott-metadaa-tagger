import { pgTable, text, serial, integer, timestamp, json, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Content schema for Disney+ titles
export const contents = pgTable("contents", {
  id: serial("id").primaryKey(),
  showId: text("show_id"),
  title: text("title").notNull(),
  type: text("type").notNull(), // Movie, Series, Short
  director: text("director"),
  cast: json("cast").$type<string[]>(),
  country: text("country"),
  releaseYear: integer("release_year").notNull(),
  rating: text("rating"),
  duration: text("duration"),
  description: text("description"),
  addedDate: timestamp("added_date").notNull().defaultNow(),
  expiryDate: timestamp("expiry_date"),
  studio: text("studio"),
  franchises: json("franchises").$type<string[]>(),
  genres: json("genres").$type<string[]>(),
  listedIn: json("listed_in").$type<string[]>(),
  tags: json("tags").$type<ContentTags>(),
  confidenceScore: integer("confidence_score").default(0), // 0-100
  isReviewed: boolean("is_reviewed").default(false),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
});

export const insertContentSchema = createInsertSchema(contents).omit({
  id: true,
  addedDate: true, 
  lastUpdated: true,
});

export type ContentTags = {
  availability: string[];
  brand: string[];
  category: string[];
  system: string[]; // Auto-generated tags
  manual: string[]; // Human-edited tags
};

export type Tag = {
  name: string;
  type: "availability" | "brand" | "category" | "system" | "manual";
  confidence?: number;
};

export type InsertContent = z.infer<typeof insertContentSchema>;
export type Content = typeof contents.$inferSelect;

// Stats schema for dashboard analytics
export const stats = pgTable("stats", {
  id: serial("id").primaryKey(),
  totalContent: integer("total_content").default(0),
  taggedContent: integer("tagged_content").default(0),
  pendingReview: integer("pending_review").default(0),
  taggingAccuracy: integer("tagging_accuracy").default(0), // 0-100
  brandDistribution: json("brand_distribution").$type<{[key: string]: number}>(),
  availabilityDistribution: json("availability_distribution").$type<{[key: string]: number}>(),
  categoryDistribution: json("category_distribution").$type<{[key: string]: number}>(),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
});

export type Stats = typeof stats.$inferSelect;

// Batch processing schema
export const batchProcesses = pgTable("batch_processes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  status: text("status").notNull(), // Pending, Processing, Completed, Failed, Partial
  totalItems: integer("total_items").default(0),
  processedItems: integer("processed_items").default(0),
  successItems: integer("success_items").default(0),
  failedItems: integer("failed_items").default(0),
  skippedItems: integer("skipped_items").default(0),
  startedAt: timestamp("started_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
  options: json("options").$type<{[key: string]: any}>(),
});

export type BatchProcess = typeof batchProcesses.$inferSelect;
