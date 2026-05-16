import { Router } from "express";
import {
  createShortUrl,
  redirectToOriginal,
  getShortUrlDetails,
  getUserUrls,
} from "../controllers/shortUrlController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const shortURLRouter = Router();

// Get user's all URLs (protected) - MUST BE BEFORE /:shortCode
shortURLRouter.get("/user/all", authMiddleware, getUserUrls);

// Create short URL (protected)
shortURLRouter.post("/", authMiddleware, createShortUrl);

// Redirect to original URL (public)
shortURLRouter.get("/:shortCode", redirectToOriginal);

// Get short URL details (analytics) (public)
shortURLRouter.get("/details/:shortCode", getShortUrlDetails);

export default shortURLRouter;
