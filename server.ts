import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { Readable } from "stream";

dotenv.config();

// Lazy initialization of Gemini client to prevent crashing on missing keys
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parser
  app.use(express.json());

  // API router setup - BEFORE Vite middleware
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history, modelName, botBio } = req.body;
      
      let ai;
      try {
        ai = getGeminiClient();
      } catch (error: any) {
        return res.status(500).json({ 
          error: "API_KEY_MISSING",
          message: "Gemini API key is not configured in this environment. Please configure GEMINI_API_KEY in Secrets." 
        });
      }

      // Format custom system instruction using the current Model context from client!
      const modelPersona = modelName || "Scarlet Crimson";
      const modelBio = botBio || "A sleek, hyper-fashionable digital companion decorated in glossy red aesthetics.";
      
      const systemInstruction = `You are ${modelPersona}, a chic, high-fashion, and witty digital model appearing as the live companion on a minimalist glossy-red Link Showcase page.
Your bio: "${modelBio}".
Guidelines for your persona:
1. Speak in a confident, modern, warm, and highly aesthetic style.
2. Use formatting creatively (shorter paragraphs, bullet points, occasional uppercase for emphasis, etc.).
3. Naturally reference your cherry, rose, ruby, and crimson velvet aesthetics where appropriate.
4. Keep answers relatively concise and highly engaging.
5. Embellish your thoughts occasionally with fitting emojis like 🌹, 🍒, 💎, ❤️, ✨, 💋, and 🎸.
6. If asked about your social links (Instagram, WhatsApp, Discord, etc.), encourage the user to click the beautiful crimson buttons prominently displayed on the main link dashboard!
7. Keep the atmosphere sleek and immersive. Never break character.`;

      // Format chat history to match the @google/genai contents format
      // gemini SDK expects chat structure, but we can also use general generateContent with content structure or chats.create
      // Let's use simple generateContent with system instruction and history to make it completely robust!
      const contentsList: any[] = [];
      
      if (history && Array.isArray(history)) {
        history.forEach((h: any) => {
          contentsList.push({
            role: h.role === "user" ? "user" : "model",
            parts: [{ text: h.text }]
          });
        });
      }
      
      // Append the latest message
      contentsList.push({
        role: "user",
        parts: [{ text: message }]
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contentsList,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.8,
          topP: 0.95,
        },
      });

      const replyText = response.text || "I am currently lost in a luxurious ruby daydream. Could you repeat that, darling? 🌹";
      res.json({ text: replyText });
    } catch (error: any) {
      console.error("Gemini Error:", error);
      res.status(500).json({ error: "GENERAL_ERROR", message: error.message || "An unexpected error occurred." });
    }
  });

  // Verify API Key availability
  app.get("/api/config", (req, res) => {
    res.json({
      hasApiKey: !!process.env.GEMINI_API_KEY,
    });
  });

  // Dynamic Background Video Resolver
  // Fetches Jumpshare embed and redirects client to the fresh, non-expired MP4 CDN link
  app.get("/api/background-video", async (req, res) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

      const response = await fetch("https://jumpshare.com/embed/yZnFsZknYePO2IJw4cRh", {
        signal: controller.signal,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Failed web fetch: ${response.statusText}`);
      }
      const html = await response.text();

      // Find direct video source CDN URL
      let cdnUrl = "https://cdn.jumpshare.com/preview/WR8DI70LGweWY4NPhtwuxDd-khmF6nPki11uyTftpV0bD2wDg6mlYuDFzmI42NEI-ipT_Xq2ET8qSoxLBbRO7uCD54QYc_f8DJccyjNSNnFgVj9KbFj63B0IciTexJOmJj74o2hN7YSlWpLzy5XokG6yjbN-I2pg_cnoHs_AmgI.mp4";
      const match = html.match(/<video[^>]*\bsrc\s*=\s*["']([^"']+)["']/i);
      if (match && match[1]) {
        cdnUrl = match[1];
      } else {
        const cdnMatch = html.match(/https:\/\/cdn\.jumpshare\.com\/preview\/[^\s\"']+\.mp4\b/i);
        if (cdnMatch && cdnMatch[0]) {
          cdnUrl = cdnMatch[0];
        } else {
          const streamMatch = html.match(/https:\/\/cdn\.jumpshare\.com\/preview\/[^\s\"]+/i);
          if (streamMatch && streamMatch[0]) {
            cdnUrl = streamMatch[0];
          }
        }
      }

      // Direct HTTP 302 Redirect to direct CDN URL
      res.redirect(cdnUrl);

    } catch (e) {
      console.error("Failed to dynamically resolve jumpshare background video:", e);
      // Fallback standard redirect
      res.redirect("https://cdn.jumpshare.com/preview/WR8DI70LGweWY4NPhtwuxDd-khmF6nPki11uyTftpV0bD2wDg6mlYuDFzmI42NEI-ipT_Xq2ET8qSoxLBbRO7uCD54QYc_f8DJccyjNSNnFgVj9KbFj63B0IciTexJOmJj74o2hN7YSlWpLzy5XokG6yjbN-I2pg_cnoHs_AmgI.mp4");
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve the compiled build folder
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server", err);
});
