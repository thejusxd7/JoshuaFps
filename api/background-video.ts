import type { IncomingMessage, ServerResponse } from "http";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
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
    res.writeHead(302, { 
      "Location": cdnUrl,
      "Cache-Control": "public, max-age=1800" // Cache redirects for 30 minutes
    });
    res.end();

  } catch (e) {
    console.error("Vercel background video resolver failed:", e);
    // Dynamic Fallback Redirect
    res.writeHead(302, { "Location": "https://cdn.jumpshare.com/preview/WR8DI70LGweWY4NPhtwuxDd-khmF6nPki11uyTftpV0bD2wDg6mlYuDFzmI42NEI-ipT_Xq2ET8qSoxLBbRO7uCD54QYc_f8DJccyjNSNnFgVj9KbFj63B0IciTexJOmJj74o2hN7YSlWpLzy5XokG6yjbN-I2pg_cnoHs_AmgI.mp4" });
    res.end();
  }
}
