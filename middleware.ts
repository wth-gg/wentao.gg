import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Country to emoji mapping
const countryEmojis: Record<string, string> = {
  US: "🇺🇸", CA: "🇨🇦", GB: "🇬🇧", DE: "🇩🇪", FR: "🇫🇷", JP: "🇯🇵", CN: "🇨🇳",
  KR: "🇰🇷", AU: "🇦🇺", BR: "🇧🇷", IN: "🇮🇳", MX: "🇲🇽", ES: "🇪🇸", IT: "🇮🇹",
  NL: "🇳🇱", SE: "🇸🇪", NO: "🇳🇴", DK: "🇩🇰", FI: "🇫🇮", PL: "🇵🇱", RU: "🇷🇺",
  SG: "🇸🇬", HK: "🇭🇰", TW: "🇹🇼", NZ: "🇳🇿", IE: "🇮🇪", CH: "🇨🇭", AT: "🇦🇹",
  BE: "🇧🇪", PT: "🇵🇹", AR: "🇦🇷", CL: "🇨🇱", CO: "🇨🇴", TH: "🇹🇭", VN: "🇻🇳",
  PH: "🇵🇭", ID: "🇮🇩", MY: "🇲🇾", ZA: "🇿🇦", AE: "🇦🇪", IL: "🇮🇱", TR: "🇹🇷",
};

// Time-based greetings with emojis
function getTimeGreeting(hour: number): string {
  if (hour >= 5 && hour < 9) return "Rise and shine ☀️";
  if (hour >= 9 && hour < 12) return "Good morning ☕";
  if (hour >= 12 && hour < 14) return "Hope you're having a great day 🌤️";
  if (hour >= 14 && hour < 17) return "Happy afternoon 🌞";
  if (hour >= 17 && hour < 21) return "Good evening ✨";
  if (hour >= 21 && hour < 24) return "Burning the midnight oil 🦉";
  return "Up late huh 🌙";
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Get geolocation data from Vercel headers (city may be URL-encoded)
  const country = request.headers.get("x-vercel-ip-country") || "";
  const rawCity = request.headers.get("x-vercel-ip-city") || "";
  const city = rawCity ? decodeURIComponent(rawCity) : "";
  const timezone = request.headers.get("x-vercel-ip-timezone") || "America/New_York";

  // Calculate local hour based on timezone
  let hour = new Date().getUTCHours();
  try {
    const localTime = new Date().toLocaleString("en-US", { timeZone: timezone, hour: "numeric", hour12: false });
    hour = parseInt(localTime) || hour;
  } catch {
    // Fallback to UTC if timezone is invalid
  }

  // Build greeting
  const timeGreeting = getTimeGreeting(hour);
  const countryEmoji = countryEmojis[country] || "";
  const locationPart = city ? `, visitor from ${city} ${countryEmoji}`.trim() : country ? ` ${countryEmoji}`.trim() : "";
  const greeting = locationPart ? `${timeGreeting}${locationPart}` : "Hey there 👋";

  // Set cookie for client to read
  response.cookies.set("visitor-greeting", greeting, {
    maxAge: 60 * 60, // 1 hour
    path: "/",
  });

  return response;
}

export const config = {
  matcher: ["/"],
};
