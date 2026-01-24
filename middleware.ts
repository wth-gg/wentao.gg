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

// US state codes to names
const usStates: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", FL: "Florida", GA: "Georgia",
  HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa",
  KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
  MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi", MO: "Missouri",
  MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey",
  NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota", OH: "Ohio",
  OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina",
  SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont",
  VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
  DC: "Washington D.C.",
};

// Country codes to names for non-US
const countryNames: Record<string, string> = {
  CA: "Canada", GB: "United Kingdom", DE: "Germany", FR: "France", JP: "Japan", CN: "China",
  KR: "South Korea", AU: "Australia", BR: "Brazil", IN: "India", MX: "Mexico", ES: "Spain",
  IT: "Italy", NL: "Netherlands", SE: "Sweden", NO: "Norway", DK: "Denmark", FI: "Finland",
  PL: "Poland", RU: "Russia", SG: "Singapore", HK: "Hong Kong", TW: "Taiwan", NZ: "New Zealand",
  IE: "Ireland", CH: "Switzerland", AT: "Austria", BE: "Belgium", PT: "Portugal",
  AR: "Argentina", CL: "Chile", CO: "Colombia", TH: "Thailand", VN: "Vietnam",
  PH: "Philippines", ID: "Indonesia", MY: "Malaysia", ZA: "South Africa", AE: "UAE", IL: "Israel", TR: "Turkey",
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
  // Note: IP geolocation has inherent accuracy limitations - ISPs often register
  // IPs to data centers rather than actual user locations
  const country = request.headers.get("x-vercel-ip-country") || "";
  const region = request.headers.get("x-vercel-ip-country-region") || "";
  const rawCity = request.headers.get("x-vercel-ip-city") || "";
  const city = rawCity ? decodeURIComponent(rawCity) : "";
  const timezone = request.headers.get("x-vercel-ip-timezone") || "America/New_York";

  // Calculate local hour based on timezone
  let hour = new Date().getUTCHours();
  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      hour: "numeric",
      hour12: false,
    });
    const parts = formatter.formatToParts(new Date());
    const hourPart = parts.find(p => p.type === "hour");
    if (hourPart) {
      hour = parseInt(hourPart.value, 10);
      // Handle midnight (some locales return 24)
      if (hour === 24) hour = 0;
    }
  } catch {
    // Fallback to UTC if timezone is invalid
  }

  // Build greeting
  const timeGreeting = getTimeGreeting(hour);
  const countryEmoji = countryEmojis[country] || "";

  // Build location string based on available data
  let locationString = "";

  if (country === "US") {
    // For US: "City, State" or just "State" if city unavailable
    const stateName = usStates[region] || region;
    if (city && stateName) {
      locationString = `${city}, ${region}`; // e.g., "Mountain View, CA"
    } else if (stateName) {
      locationString = stateName; // e.g., "California"
    }
  } else if (country) {
    // For international: "City, Country" or just "Country"
    const countryName = countryNames[country] || country;
    if (city) {
      locationString = `${city}, ${countryName}`; // e.g., "Toronto, Canada"
    } else if (region && countryName) {
      locationString = `${region}, ${countryName}`; // e.g., "Ontario, Canada"
    } else {
      locationString = countryName; // e.g., "Canada"
    }
  }

  let locationPart = "";
  if (locationString && countryEmoji) {
    locationPart = `, visitor from ${locationString} ${countryEmoji}`;
  } else if (locationString) {
    locationPart = `, visitor from ${locationString}`;
  } else if (countryEmoji) {
    locationPart = ` from ${countryEmoji}`;
  }

  const greeting = (locationString || country) ? `${timeGreeting}${locationPart}` : "Hey there 👋";

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
