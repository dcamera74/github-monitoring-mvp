import { NextRequest, NextResponse } from "next/server";
import { getAllDashboardRepoIdentifiers, getDashboardData, type RepoSnapshotMap } from "../../../lib/dashboard";

export const dynamic = "force-dynamic";

type GitHubRepoResponse = {
  stargazers_count?: number;
  forks_count?: number;
};

type RefreshPayload = ReturnType<typeof getDashboardData> & {
  warning?: string;
  message?: string;
};

const REFRESH_THROTTLE_MS = 30_000;
const REFRESH_LOG_TTL_MS = 10 * 60_000;
const refreshRequestLog = new Map<string, number>();

function parseGitHubCount(value: string) {
  const normalized = value.trim().toLowerCase().replace(/,/g, "");
  if (!normalized) {
    return null;
  }

  if (normalized.endsWith("k")) {
    const numberPart = Number(normalized.slice(0, -1));
    return Number.isFinite(numberPart) ? Math.round(numberPart * 1_000) : null;
  }

  if (normalized.endsWith("m")) {
    const numberPart = Number(normalized.slice(0, -1));
    return Number.isFinite(numberPart) ? Math.round(numberPart * 1_000_000) : null;
  }

  const integerValue = Number(normalized);
  return Number.isFinite(integerValue) ? Math.round(integerValue) : null;
}

function parseRepoStatsFromHtml(html: string, fullName: string) {
  const escapedFullName = fullName.replace("/", "\\/");
  const exactStars = html.match(/([0-9,]+) users? starred this repository/i)?.[1] ?? null;
  const compactStars =
    html.match(
      new RegExp(
        `href="/${escapedFullName}/stargazers"[\\s\\S]{0,1200}?<strong>([0-9.,kKmM]+)</strong>\\s*stars`,
        "i"
      )
    )?.[1] ?? null;
  const compactForks =
    html.match(
      new RegExp(
        `href="/${escapedFullName}/forks"[\\s\\S]{0,1200}?<strong>([0-9.,kKmM]+)</strong>\\s*forks`,
        "i"
      )
    )?.[1] ?? null;

  const stars = parseGitHubCount(exactStars ?? compactStars ?? "");
  if (stars === null) {
    return null;
  }

  const forks = compactForks ? parseGitHubCount(compactForks) : null;
  return {
    stars,
    forks: forks ?? undefined
  };
}

async function fetchRepoSnapshotFromHtml(fullName: string) {
  const response = await fetch(`https://github.com/${fullName}`, {
    cache: "no-store"
  });

  if (!response.ok) {
    return null;
  }

  const html = await response.text();
  return parseRepoStatsFromHtml(html, fullName);
}

function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

function getRefreshRequestKey(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = request.headers.get("x-real-ip");
  const userAgent = request.headers.get("user-agent") ?? "unknown";

  return `${forwardedFor ?? realIp ?? "unknown"}:${userAgent}`;
}

function pruneRefreshRequestLog(now: number) {
  for (const [key, lastSeen] of refreshRequestLog.entries()) {
    if (now - lastSeen > REFRESH_LOG_TTL_MS) {
      refreshRequestLog.delete(key);
    }
  }
}

export async function POST(request: NextRequest) {
  const now = Date.now();
  pruneRefreshRequestLog(now);

  const requestKey = getRefreshRequestKey(request);
  const lastRefresh = refreshRequestLog.get(requestKey);
  if (lastRefresh && now - lastRefresh < REFRESH_THROTTLE_MS) {
    const retryAfterSeconds = Math.ceil((REFRESH_THROTTLE_MS - (now - lastRefresh)) / 1000);
    return NextResponse.json(
      {
        message: `Refresh is temporarily throttled. Try again in ${retryAfterSeconds} seconds.`
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfterSeconds)
        }
      }
    );
  }

  refreshRequestLog.set(requestKey, now);

  const repoIdentifiers = getAllDashboardRepoIdentifiers();
  const githubToken = process.env.GITHUB_TOKEN;

  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "User-Agent": "github-monitoring-mvp"
  };

  if (githubToken) {
    headers.Authorization = `Bearer ${githubToken}`;
  }

  const useApi = Boolean(githubToken);
  let htmlFallbackCount = 0;
  const responses = await Promise.allSettled(
    repoIdentifiers.map(async (repoInfo) => {
      if (useApi) {
        const response = await fetch(`https://api.github.com/repos/${repoInfo.fullName}`, {
          headers,
          cache: "no-store"
        });

        if (response.ok) {
          const payload = (await response.json()) as GitHubRepoResponse;
          if (typeof payload.stargazers_count === "number") {
            return {
              id: repoInfo.id,
              fullName: repoInfo.fullName,
              stars: payload.stargazers_count,
              forks: typeof payload.forks_count === "number" ? payload.forks_count : undefined
            };
          }
        }
      }

      const htmlSnapshot = await fetchRepoSnapshotFromHtml(repoInfo.fullName);
      if (!htmlSnapshot) {
        return null;
      }

      htmlFallbackCount += 1;
      return {
        id: repoInfo.id,
        fullName: repoInfo.fullName,
        stars: htmlSnapshot.stars,
        forks: htmlSnapshot.forks
      };
    })
  );

  const snapshots: RepoSnapshotMap = {};
  for (const response of responses) {
    if (response.status !== "fulfilled" || !response.value) {
      continue;
    }

    snapshots[response.value.id] = {
      stars: response.value.stars,
      forks: response.value.forks
    };
    snapshots[response.value.fullName] = {
      stars: response.value.stars,
      forks: response.value.forks
    };
  }

  const snapshotCount = Object.keys(snapshots).length / 2;
  const lastUpdated = getTodayDate();
  if (snapshotCount === 0) {
    const message = useApi
      ? "GitHub refresh is temporarily unavailable. Showing seeded dashboard data."
      : "Live refresh requires a valid GITHUB_TOKEN in production. Showing seeded dashboard data.";
    return NextResponse.json(
      {
        ...getDashboardData({
          lastUpdated
        }),
        message
      } as RefreshPayload,
      { status: 503 }
    );
  }

  const warning =
    snapshotCount < repoIdentifiers.length
      ? `Partial refresh (${snapshotCount}/${repoIdentifiers.length}). Some repositories could not be updated.`
      : htmlFallbackCount > 0
        ? `Refresh completed with HTML fallback for ${htmlFallbackCount} repositories. Configure GITHUB_TOKEN for stable production updates.`
        : undefined;

  return NextResponse.json(
    {
      ...getDashboardData({
        snapshots,
        lastUpdated
      }),
      warning
    } as RefreshPayload
  );
}
