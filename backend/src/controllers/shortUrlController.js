import { ShortURL } from "../models/shorturl.model.js";
import { nanoid } from "nanoid";
import QRCode from "qrcode";

// Create a short URL
export const createShortUrl = async (req, res) => {
  try {
    const { originalUrl, customUrl, title, expiresAt } = req.body;
    const userId = req.user?.id || null;

    // Validate original URL
    if (!originalUrl) {
      return res.status(400).json({ message: "Original URL is required" });
    }

    // Check if URL is valid
    try {
      new URL(originalUrl);
    } catch (err) {
      return res.status(400).json({ message: "Invalid URL format" });
    }

    // Use custom URL or generate short code
    const shortCode = customUrl || nanoid(7);

    // Check if short code already exists
    const existingUrl = await ShortURL.findOne({ shortCode });
    if (existingUrl) {
      return res.status(400).json({ message: "Short code already exists, try another one" });
    }

    // Create short URL record
    const newShortUrl = new ShortURL({
      originalUrl,
      shortCode,
      userId,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      title: title || null,
    });

    const shortUrlFull = `${req.protocol}://${req.get("host")}/api/s/${newShortUrl.shortCode}`;

    // Generate QR code
    let qrCodeDataUrl = null;
    try {
      qrCodeDataUrl = await QRCode.toDataURL(shortUrlFull, {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        quality: 0.95,
        margin: 1,
        width: 300,
      });
      newShortUrl.qrCode = qrCodeDataUrl;
    } catch (qrErr) {
      console.error("Error generating QR code:", qrErr);
      // Continue even if QR code fails
    }

    await newShortUrl.save();

    res.status(201).json({
      message: "Short URL created successfully",
      shortCode: newShortUrl.shortCode,
      shortUrl: shortUrlFull,
      originalUrl: newShortUrl.originalUrl,
      qrCode: newShortUrl.qrCode,
    });
  } catch (err) {
    console.error("Error creating short URL:", err);
    res.status(500).json({ message: "Error creating short URL", error: err.message });
  }
};

// Redirect to original URL
export const redirectToOriginal = async (req, res) => {
  try {
    const { shortCode } = req.params;

    // Find the short URL
    const shortUrl = await ShortURL.findOne({ shortCode, isActive: true });

    if (!shortUrl) {
      return res.status(404).json({ message: "Short URL not found" });
    }

    // Check if URL has expired
    if (shortUrl.expiresAt && new Date() > shortUrl.expiresAt) {
      return res.status(410).json({ message: "Short URL has expired" });
    }

    // Increment click count
    shortUrl.clickCount += 1;
    await shortUrl.save();

    // Redirect to original URL
    res.redirect(shortUrl.originalUrl);
  } catch (err) {
    console.error("Error redirecting to original URL:", err);
    res.status(500).json({ message: "Error redirecting", error: err.message });
  }
};

// Get short URL details
export const getShortUrlDetails = async (req, res) => {
  try {
    const { shortCode } = req.params;

    const shortUrl = await ShortURL.findOne({ shortCode });

    if (!shortUrl) {
      return res.status(404).json({ message: "Short URL not found" });
    }

    res.json({
      shortCode: shortUrl.shortCode,
      originalUrl: shortUrl.originalUrl,
      createdAt: shortUrl.createdAt,
      clickCount: shortUrl.clickCount,
      title: shortUrl.title,
      expiresAt: shortUrl.expiresAt,
    });
  } catch (err) {
    console.error("Error fetching short URL details:", err);
    res.status(500).json({ message: "Error fetching details", error: err.message });
  }
};

// Get all URLs created by a user
export const getUserUrls = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized - User not logged in" });
    }

    // Get all URLs for this user, sorted by newest first
    const userUrls = await ShortURL.find({ userId }).sort({ createdAt: -1 });

    res.json({
      message: "User URLs retrieved successfully",
      urls: userUrls.map((url) => ({
        _id: url._id,
        shortCode: url.shortCode,
        originalUrl: url.originalUrl,
        title: url.title,
        clickCount: url.clickCount,
        createdAt: url.createdAt,
        expiresAt: url.expiresAt,
        isActive: url.isActive,
        qrCode: url.qrCode,
        shortUrl: `${req.protocol}://${req.get("host")}/api/s/${url.shortCode}`,
      })),
    });
  } catch (err) {
    console.error("Error fetching user URLs:", err);
    res.status(500).json({ message: "Error fetching user URLs", error: err.message });
  }
};
