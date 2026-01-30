import { ClearinghouseState, Fill } from "./types";

const API_BASE = "https://api.hyperliquid.xyz/info";

// Rate limiting: wait between requests
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

async function fetchWithRetry<T>(
  body: object,
  retries = 3
): Promise<ApiResponse<T>> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(API_BASE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        if (response.status === 429) {
          // Rate limited - wait and retry
          await delay(1000 * (i + 1));
          continue;
        }
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      if (i === retries - 1) {
        return {
          data: null,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
      await delay(500 * (i + 1));
    }
  }
  return { data: null, error: "Max retries exceeded" };
}

export async function getClearinghouseState(
  address: string
): Promise<ApiResponse<ClearinghouseState>> {
  return fetchWithRetry<ClearinghouseState>({
    type: "clearinghouseState",
    user: address,
  });
}

export async function getUserFills(
  address: string,
  startTime?: number
): Promise<ApiResponse<Fill[]>> {
  const body: { type: string; user: string; startTime?: number } = {
    type: "userFills",
    user: address,
  };

  if (startTime) {
    body.startTime = startTime;
  }

  return fetchWithRetry<Fill[]>(body);
}

export async function getUserFillsByTime(
  address: string,
  startTime: number,
  endTime?: number
): Promise<ApiResponse<Fill[]>> {
  const body: { type: string; user: string; startTime: number; endTime?: number } = {
    type: "userFillsByTime",
    user: address,
    startTime,
  };

  if (endTime) {
    body.endTime = endTime;
  }

  return fetchWithRetry<Fill[]>(body);
}

// Batch fetch multiple addresses with delays to avoid rate limits
export async function batchFetchTraderData(
  addresses: string[],
  timePeriodMs: number,
  onProgress?: (completed: number, total: number) => void
): Promise<
  Map<
    string,
    { state: ClearinghouseState | null; fills: Fill[]; error?: string }
  >
> {
  const results = new Map<
    string,
    { state: ClearinghouseState | null; fills: Fill[]; error?: string }
  >();
  const startTime = Date.now() - timePeriodMs;

  for (let i = 0; i < addresses.length; i++) {
    const address = addresses[i];

    // Fetch clearinghouse state and fills in parallel for each address
    const [stateResult, fillsResult] = await Promise.all([
      getClearinghouseState(address),
      timePeriodMs === Infinity
        ? getUserFills(address)
        : getUserFillsByTime(address, startTime),
    ]);

    results.set(address, {
      state: stateResult.data,
      fills: fillsResult.data || [],
      error: stateResult.error || fillsResult.error || undefined,
    });

    if (onProgress) {
      onProgress(i + 1, addresses.length);
    }

    // Add delay between addresses to avoid rate limiting
    if (i < addresses.length - 1) {
      await delay(100);
    }
  }

  return results;
}
