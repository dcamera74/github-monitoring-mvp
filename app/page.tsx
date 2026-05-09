"use client";

import { useEffect, useState } from "react";
import { getDashboardData } from "../lib/dashboard";

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

type DashboardResponse = ReturnType<typeof getDashboardData> & {
  warning?: string;
  message?: string;
};

async function requestDashboardData() {
  const response = await fetch("/api/refresh-data", {
    method: "POST",
    cache: "no-store"
  });

  const payload = (await response.json()) as DashboardResponse;
  if (!response.ok) {
    throw new Error(payload.message ?? `Refresh failed with status ${response.status}`);
  }

  return payload;
}

type SheetId = "top" | "growth" | "claude" | "agent" | "skills" | "mcp";

function SheetMark({ variant }: { variant: "github" | "claude" }) {
  if (variant === "claude") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true" className="sheet-mark-svg">
        <g
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.6"
          opacity="0.95"
        >
          <path d="M16 4v6" />
          <path d="M16 22v6" />
          <path d="M4 16h6" />
          <path d="M22 16h6" />
          <path d="m7.5 7.5 4.2 4.2" />
          <path d="m20.3 20.3 4.2 4.2" />
          <path d="m7.5 24.5 4.2-4.2" />
          <path d="m20.3 11.7 4.2-4.2" />
        </g>
        <circle cx="16" cy="16" r="3.1" fill="var(--sheet-panel)" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="sheet-mark-svg">
      <path
        fill="currentColor"
        d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.39.6.11.82-.26.82-.58 0-.29-.01-1.04-.02-2.04-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49.99.11-.77.42-1.3.76-1.6-2.66-.3-5.47-1.34-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.6-2.8 5.63-5.48 5.92.43.37.82 1.1.82 2.22 0 1.6-.01 2.89-.01 3.29 0 .32.22.7.83.58A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z"
      />
    </svg>
  );
}

function SheetThemeBadge({ variant }: { variant: "github" | "claude" }) {
  return (
    <div className={`sheet-mark sheet-mark-${variant}`}>
      <SheetMark variant={variant} />
    </div>
  );
}

function RankBadge({ rank }: { rank: number }) {
  if (rank <= 3) {
    const medalClass =
      rank === 1 ? "repo-rank-gold" : rank === 2 ? "repo-rank-silver" : "repo-rank-bronze";

    return (
      <span className={`repo-rank repo-rank-medal ${medalClass}`} aria-label={`Rank ${rank}`}>
        <svg viewBox="0 0 32 32" aria-hidden="true" className="repo-medal-svg">
          <path d="M10 3h5l1 8-3.8 2.2L10 3Z" fill="currentColor" opacity="0.78" />
          <path d="M17 3h5l-2.2 10L16 11.2 17 3Z" fill="currentColor" opacity="0.58" />
          <circle cx="16" cy="19" r="7.2" fill="currentColor" />
          <path d="M16 14.2 18 18l4.2.6-3.1 3 .7 4.2-3.8-2-3.8 2 .7-4.2-3.1-3 4.2-.6 2-3.8Z" fill="var(--sheet-panel)" opacity="0.96" />
        </svg>
      </span>
    );
  }

  return <span className="repo-rank">{rank}</span>;
}

const sheetThemes: Record<
  SheetId,
  {
    label: string;
    title: string;
    copy: string;
    icon: "github" | "claude";
    themeClass: string;
  }
> = {
  top: {
    label: "Top repositories",
    title: "Top AI repositories",
    copy: "Sorted by total stars.",
    icon: "github",
    themeClass: "sheet-theme-top"
  },
  growth: {
    label: "7-day growth",
    title: "Fastest-growing AI repositories",
    copy: "Filtered to repos that started the 7-day window below 150 stars.",
    icon: "github",
    themeClass: "sheet-theme-growth"
  },
  claude: {
    label: "Claude CLI",
    title: "Claude CLI",
    copy: "Top 10 repositories by stars for the selected ecosystem.",
    icon: "claude",
    themeClass: "sheet-theme-claude"
  },
  agent: {
    label: "Agent",
    title: "Agent",
    copy: "Top 10 repositories by stars for the selected ecosystem.",
    icon: "github",
    themeClass: "sheet-theme-agent"
  },
  skills: {
    label: "Skills",
    title: "Skills",
    copy: "Top 10 repositories by stars for the selected ecosystem.",
    icon: "github",
    themeClass: "sheet-theme-skills"
  },
  mcp: {
    label: "MCP",
    title: "MCP",
    copy: "Top 10 repositories by stars for the selected ecosystem.",
    icon: "github",
    themeClass: "sheet-theme-mcp"
  }
};

function RepoWidget({
  repo,
  rank,
  accentLabel,
  primaryLabel,
  primaryValue,
  secondaryLabel,
  secondaryValue,
  fillPercent
}: {
  repo: {
    id: string;
    name: string;
    description: string;
    language: string;
    stars: number;
    forks?: number;
    topics: string[];
    url: string;
  };
  rank: number;
  accentLabel: string;
  primaryLabel: string;
  primaryValue: string;
  secondaryLabel: string;
  secondaryValue: string;
  fillPercent: number;
}) {
  return (
    <article className="repo-widget">
      <div className="repo-widget-top">
        <RankBadge rank={rank} />
        <span className="repo-language">{repo.language}</span>
      </div>

      <div>
        <p className="repo-kicker">{accentLabel}</p>
        <h3 className="repo-title">
          <a href={repo.url} target="_blank" rel="noreferrer">
            {repo.name}
          </a>
        </h3>
        <p className="repo-description">{repo.description}</p>
      </div>

      <div className="repo-meter" aria-hidden="true">
        <span style={{ width: `${fillPercent}%` }} />
      </div>

      <div className="repo-metrics">
        <div>
          <span>{primaryLabel}</span>
          <strong>{primaryValue}</strong>
        </div>
        <div>
          <span>{secondaryLabel}</span>
          <strong>{secondaryValue}</strong>
        </div>
      </div>

      <div className="repo-topics">
        {repo.topics.slice(0, 3).map((topic) => (
          <span key={topic}>{topic}</span>
        ))}
      </div>
    </article>
  );
}

export default function HomePage() {
  const [dashboardData, setDashboardData] = useState<DashboardResponse>(() => getDashboardData());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState<string | null>(null);
  const [refreshWarning, setRefreshWarning] = useState<string | null>(null);
  const [activeSheet, setActiveSheet] = useState<SheetId>("top");
  const {
    topRepos,
    fastestGrowingRepos,
    claudeCliRepos,
    agentRepos,
    skillsRepos,
    mcpRepos,
    lastUpdated
  } = dashboardData;
  const maxStars = topRepos[0]?.stars ?? 1;
  const maxGrowth = fastestGrowingRepos[0]?.starGrowth ?? 1;
  const maxClaudeStars = claudeCliRepos[0]?.stars ?? 1;
  const maxAgentStars = agentRepos[0]?.stars ?? 1;
  const maxSkillsStars = skillsRepos[0]?.stars ?? 1;
  const maxMcpStars = mcpRepos[0]?.stars ?? 1;
  const isTopSheet = activeSheet === "top";
  const isGrowthSheet = activeSheet === "growth";
  const isClaudeSheet = activeSheet === "claude";
  const isAgentSheet = activeSheet === "agent";
  const isSkillsSheet = activeSheet === "skills";
  const isMcpSheet = activeSheet === "mcp";
  const sheetTheme = sheetThemes[activeSheet];

  useEffect(() => {
    const storedDashboard = window.localStorage.getItem("dashboard-live-data");
    if (!storedDashboard) {
      setRefreshError(null);
      setRefreshWarning(null);
    } else {
      try {
        const parsedDashboard = JSON.parse(storedDashboard) as DashboardResponse;
        setDashboardData(parsedDashboard);
        setRefreshWarning(parsedDashboard.warning ?? null);
      } catch {
        window.localStorage.removeItem("dashboard-live-data");
      }
    }

    let isMounted = true;
    setIsRefreshing(true);
    void (async () => {
      try {
        const nextDashboardData = await requestDashboardData();
        if (!isMounted) {
          return;
        }
        setDashboardData(nextDashboardData);
        window.localStorage.setItem("dashboard-live-data", JSON.stringify(nextDashboardData));
        setRefreshError(null);
        setRefreshWarning(nextDashboardData.warning ?? null);
      } catch (error) {
        if (!isMounted) {
          return;
        }
        setRefreshError(error instanceof Error ? error.message : "Unable to refresh data.");
        setRefreshWarning(null);
      } finally {
        if (isMounted) {
          setIsRefreshing(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  async function updateLastUpdated() {
    if (isRefreshing) {
      return;
    }

    setIsRefreshing(true);
    setRefreshError(null);
    setRefreshWarning(null);

    try {
      const nextDashboardData = await requestDashboardData();
      setDashboardData(nextDashboardData);
      window.localStorage.setItem("dashboard-live-data", JSON.stringify(nextDashboardData));
      setRefreshWarning(nextDashboardData.warning ?? null);
    } catch (error) {
      setRefreshError(error instanceof Error ? error.message : "Unable to refresh data.");
    } finally {
      setIsRefreshing(false);
    }
  }

  return (
    <main className="page-shell">
      <section className="hero">
        <div>
          <h1>Top AI GitHub Repo</h1>
        </div>
        <div className="hero-stack">
          <div className="hero-card">
            <span className="hero-label">Last updated</span>
            <strong aria-live="polite">{lastUpdated}</strong>
          </div>
        </div>
      </section>

      <section className={`panel sheet-panel ${sheetTheme.themeClass}`}>
        <div className="sheet-tabs" role="tablist" aria-label="Repository sheets">
          <button
            type="button"
            role="tab"
            aria-selected={isTopSheet}
            className="sheet-tab sheet-tab-github"
            onClick={() => setActiveSheet("top")}
          >
            🏆 Top repositories
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={isGrowthSheet}
            className="sheet-tab sheet-tab-github"
            onClick={() => setActiveSheet("growth")}
          >
            📈 7-day growth
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={isClaudeSheet}
            className="sheet-tab sheet-tab-claude"
            onClick={() => setActiveSheet("claude")}
          >
            🤖 Claude CLI
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={isAgentSheet}
            className="sheet-tab sheet-tab-github"
            onClick={() => setActiveSheet("agent")}
          >
            🔧 Agent
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={isSkillsSheet}
            className="sheet-tab sheet-tab-github"
            onClick={() => setActiveSheet("skills")}
          >
            ⭐ Skills
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={isMcpSheet}
            className="sheet-tab sheet-tab-github"
            onClick={() => setActiveSheet("mcp")}
          >
            🔌 MCP
          </button>
        </div>

        <div className="sheet-header">
          <div className="sheet-header-top">
            <div className="sheet-title-block">
              <SheetThemeBadge variant={sheetTheme.icon} />
              <div>
                <h2>{sheetTheme.title}</h2>
              </div>
            </div>
            <button
              type="button"
              className="hero-button sheet-refresh-button"
              onClick={updateLastUpdated}
              disabled={isRefreshing}
              aria-busy={isRefreshing}
            >
              🔄 Refresh Data
            </button>
          </div>
          <p className="sheet-copy">{sheetTheme.copy}</p>
          {refreshWarning ? <p className="sheet-copy">{refreshWarning}</p> : null}
          {refreshError ? <p className="sheet-copy">{refreshError}</p> : null}
        </div>

        <div className="widget-zone">
          <div className="repo-grid">
            {isTopSheet &&
              topRepos.map((repo, index) => (
                <RepoWidget
                  key={repo.id}
                  repo={repo}
                  rank={index + 1}
                  accentLabel={`Rank #${index + 1}`}
                  primaryLabel="Stars"
                  primaryValue={formatNumber(repo.stars)}
                  secondaryLabel="7-day growth"
                  secondaryValue={`+${formatNumber(repo.stars - repo.stars7dAgo)}`}
                  fillPercent={Math.max(8, Math.round((repo.stars / maxStars) * 100))}
                />
              ))}

            {isGrowthSheet &&
              fastestGrowingRepos.map((repo, index) => (
                <RepoWidget
                  key={repo.id}
                  repo={repo}
                  rank={index + 1}
                  accentLabel={`Growth #${index + 1}`}
                  primaryLabel="7-day growth"
                  primaryValue={`+${formatNumber(repo.starGrowth)} stars`}
                  secondaryLabel="Current stars"
                  secondaryValue={formatNumber(repo.stars)}
                  fillPercent={Math.max(8, Math.round((repo.starGrowth / maxGrowth) * 100))}
                />
              ))}

            {isClaudeSheet &&
              claudeCliRepos.map((repo, index) => (
                <RepoWidget
                  key={repo.id}
                  repo={repo}
                  rank={index + 1}
                  accentLabel={`Claude #${index + 1}`}
                  primaryLabel="Stars"
                  primaryValue={formatNumber(repo.stars)}
                  secondaryLabel="Forks"
                  secondaryValue={formatNumber(repo.forks ?? 0)}
                  fillPercent={Math.max(8, Math.round((repo.stars / maxClaudeStars) * 100))}
                />
              ))}

            {isAgentSheet &&
              agentRepos.map((repo, index) => (
                <RepoWidget
                  key={repo.id}
                  repo={repo}
                  rank={index + 1}
                  accentLabel={`Agent #${index + 1}`}
                  primaryLabel="Stars"
                  primaryValue={formatNumber(repo.stars)}
                  secondaryLabel="Forks"
                  secondaryValue={formatNumber(repo.forks ?? 0)}
                  fillPercent={Math.max(8, Math.round((repo.stars / maxAgentStars) * 100))}
                />
              ))}

            {isSkillsSheet &&
              skillsRepos.map((repo, index) => (
                <RepoWidget
                  key={repo.id}
                  repo={repo}
                  rank={index + 1}
                  accentLabel={`Skills #${index + 1}`}
                  primaryLabel="Stars"
                  primaryValue={formatNumber(repo.stars)}
                  secondaryLabel="Forks"
                  secondaryValue={formatNumber(repo.forks ?? 0)}
                  fillPercent={Math.max(8, Math.round((repo.stars / maxSkillsStars) * 100))}
                />
              ))}

            {isMcpSheet &&
              mcpRepos.map((repo, index) => (
                <RepoWidget
                  key={repo.id}
                  repo={repo}
                  rank={index + 1}
                  accentLabel={`MCP #${index + 1}`}
                  primaryLabel="Stars"
                  primaryValue={formatNumber(repo.stars)}
                  secondaryLabel="Forks"
                  secondaryValue={formatNumber(repo.forks ?? 0)}
                  fillPercent={Math.max(8, Math.round((repo.stars / maxMcpStars) * 100))}
                />
              ))}
          </div>
        </div>
      </section>
    </main>
  );
}
