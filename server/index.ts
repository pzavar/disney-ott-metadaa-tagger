import express from "express";
import session from "express-session";
import { Server } from "http";
import { setupVite, serveStatic, log } from "./vite";
import { registerRoutes } from "./routes";
import { storage } from "./storage";

// Initialize storage
storage.updateStats().then(() => {
  log("Storage initialized");
});

// Set up the Express server
const app = express();
const port = Number(process.env.PORT) || 5000;

// Middleware
app.use(express.json());

// Set up session support
app.use(
  session({
    secret: process.env.SESSION_SECRET || "disney-plus-metadata-tagger-secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === "production" },
  })
);

// API routes setup
registerRoutes(app).then((server: Server) => {
  // In development, Vite handles frontend static assets
  if (process.env.NODE_ENV === "development") {
    setupVite(app, server).then(() => {
      log(`Dev server ready at http://localhost:${port}`);
    });
  } else {
    // In production, serve static files
    serveStatic(app);
    server.listen(port, "0.0.0.0", () => {
      log(`Production server listening on port ${port}`);
    });
  }
});

// Global error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});