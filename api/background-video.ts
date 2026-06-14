import type { IncomingMessage, ServerResponse } from 'http';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    const response = await fetch("https://jumpshare.com/embed/yZnFsZknYePO2IJw4cRh", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch embed: ${response.statusText}`);
    }

    const html = await response.text();

    // Find the direct video src in the player markup or json preview structure
    const match = html.match(/<video[^>]*\bsrc\s*=\s*["']([^"']+)["']/i);
    if (match && match[1]) {
      res.writeHead(302, { Location: match[1] });
      res.end();
      return;
    }

    // Fallback 1: match CDN url ending in .mp4 on that page
    const cdnMatch = html.match(/https:\/\/cdn\.jumpshare\.com\/preview\/[^\s\"']+\.mp4\b/i);
    if (cdnMatch && cdnMatch[0]) {
      res.writeHead(302, { Location: cdnMatch[0] });
      res.end();
      return;
    }

    // Fallback 2: grab general preview stream URLs
    const streamMatch = html.match(/https:\/\/cdn\.jumpshare\.com\/preview\/[^\s\"]+/i);
    if (streamMatch && streamMatch[0]) {
      res.writeHead(302, { Location: streamMatch[0] });
      res.end();
      return;
    }

    // Safe static fallback
    res.writeHead(302, { Location: "https://cdn.jumpshare.com/preview/WR8DI70LGweWY4NPhtwuxDd-khmF6nPki11uyTftpV0bD2wDg6mlYuDFzmI42NEI-ipT_Xq2ET8qSoxLBbRO7uCD54QYc_f8DJccyjNSNnFgVj9KbFj63B0IciTexJOmJj74o2hN7YSlWpLzy5XokG6yjbN-I2pg_cnoHs_AmgI.mp4" });
    res.end();
  } catch (e) {
    console.error("Vercel background video resolver failed:", e);
    res.writeHead(302, { Location: "https://cdn.jumpshare.com/preview/WR8DI70LGweWY4NPhtwuxDd-khmF6nPki11uyTftpV0bD2wDg6mlYuDFzmI42NEI-ipT_Xq2ET8qSoxLBbRO7uCD54QYc_f8DJccyjNSNnFgVj9KbFj63B0IciTexJOmJj74o2hN7YSlWpLzy5XokG6yjbN-I2pg_cnoHs_AmgI.mp4" });
    res.end();
  }
}
