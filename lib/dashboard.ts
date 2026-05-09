export type RepoRecord = {
  id: string;
  name: string;
  description: string;
  language: string;
  stars: number;
  forks?: number;
  stars7dAgo: number;
  topics: string[];
  url: string;
};

export type RepoSnapshotMap = Record<string, { stars: number; forks?: number }>;

const aiTopics = new Set([
  "ai",
  "artificial-intelligence",
  "machine-learning",
  "ml",
  "deep-learning",
  "llm",
  "llms",
  "generative-ai",
  "pytorch",
  "transformers",
  "nlp",
  "computer-vision",
  "agent",
  "agents"
]);

function prefixRepoIds(prefix: string, repos: RepoRecord[]) {
  return repos.map((repo) => ({
    ...repo,
    id: `${prefix}-${repo.id}`
  }));
}

const repos: RepoRecord[] = [
  {
    id: "huggingface-transformers",
    name: "huggingface/transformers",
    description: "State-of-the-art Machine Learning for Pytorch, TensorFlow, and JAX.",
    language: "Python",
    stars: 145000,
    stars7dAgo: 144100,
    topics: ["ai", "machine-learning", "nlp", "pytorch", "transformers"],
    url: "https://github.com/huggingface/transformers"
  },
  {
    id: "pytorch-pytorch",
    name: "pytorch/pytorch",
    description: "Tensors and Dynamic neural networks in Python with strong GPU acceleration.",
    language: "Python",
    stars: 93000,
    stars7dAgo: 92450,
    topics: ["ai", "machine-learning", "deep-learning", "pytorch"],
    url: "https://github.com/pytorch/pytorch"
  },
  {
    id: "run-llama-llama-index",
    name: "run-llama/llama_index",
    description: "LlamaIndex is a data framework for LLM applications.",
    language: "Python",
    stars: 38000,
    stars7dAgo: 37780,
    topics: ["ai", "llm", "llms", "agents", "generative-ai"],
    url: "https://github.com/run-llama/llama_index"
  },
  {
    id: "langchain-ai-langchain",
    name: "langchain-ai/langchain",
    description: "Building applications with LLMs through composability.",
    language: "Python",
    stars: 113000,
    stars7dAgo: 112250,
    topics: ["ai", "llm", "llms", "agents", "generative-ai"],
    url: "https://github.com/langchain-ai/langchain"
  },
  {
    id: "crewaiinc-crewai",
    name: "crewAIInc/crewAI",
    description: "Framework for orchestrating role-playing AI agents.",
    language: "Python",
    stars: 42000,
    stars7dAgo: 128,
    topics: ["ai", "agents", "llm", "generative-ai"],
    url: "https://github.com/crewAIInc/crewAI"
  },
  {
    id: "browser-use-browser-use",
    name: "browser-use/browser-use",
    description: "Make websites accessible for AI agents.",
    language: "Python",
    stars: 51000,
    stars7dAgo: 142,
    topics: ["ai", "agents", "llm", "automation"],
    url: "https://github.com/browser-use/browser-use"
  },
  {
    id: "composiohq-composio",
    name: "composiohq/composio",
    description: "Build AI agents with tooling and workflows.",
    language: "TypeScript",
    stars: 18000,
    stars7dAgo: 149,
    topics: ["ai", "agents", "llm", "automation"],
    url: "https://github.com/composiohq/composio"
  },
  {
    id: "rasbt-llm-from-scratch",
    name: "rasbt/LLMs-from-scratch",
    description: "Implement a large language model from scratch.",
    language: "Python",
    stars: 7200,
    stars7dAgo: 84,
    topics: ["ai", "llm", "machine-learning", "deep-learning"],
    url: "https://github.com/rasbt/LLMs-from-scratch"
  },
  {
    id: "vercel-nextjs",
    name: "vercel/next.js",
    description: "React framework for production.",
    language: "TypeScript",
    stars: 130000,
    stars7dAgo: 129100,
    topics: ["web", "frontend"],
    url: "https://github.com/vercel/next.js"
  }
];

let claudeCliRepos: RepoRecord[] = [
  {
    id: "everything-claude-code",
    name: "affaan-m/everything-claude-code",
    description: "The agent harness performance optimization system for Claude Code and beyond.",
    language: "JavaScript",
    stars: 176392,
    forks: 27281,
    stars7dAgo: 0,
    topics: ["anthropic", "claude", "claude-code", "developer-tools", "llm", "mcp"],
    url: "https://github.com/affaan-m/everything-claude-code"
  },
  {
    id: "hermes-agent",
    name: "NousResearch/hermes-agent",
    description: "The agent that grows with you.",
    language: "Python",
    stars: 140412,
    forks: 21770,
    stars7dAgo: 0,
    topics: ["anthropic", "claude", "claude-code", "ai-agent", "llm"],
    url: "https://github.com/NousResearch/hermes-agent"
  },
  {
    id: "ui-ux-pro-max-skill",
    name: "nextlevelbuilder/ui-ux-pro-max-skill",
    description: "An AI skill that provides design intelligence for professional UI/UX work.",
    language: "Python",
    stars: 75905,
    forks: 7825,
    stars7dAgo: 0,
    topics: ["claude", "claude-code", "codex", "copilot", "cursor-ai", "ui-design"],
    url: "https://github.com/nextlevelbuilder/ui-ux-pro-max-skill"
  },
  {
    id: "claude-mem",
    name: "thedotmack/claude-mem",
    description: "A Claude Code plugin that captures sessions and injects relevant context back in.",
    language: "TypeScript",
    stars: 74005,
    forks: 6349,
    stars7dAgo: 0,
    topics: ["anthropic", "claude", "claude-code", "memory", "rag", "typescript"],
    url: "https://github.com/thedotmack/claude-mem"
  },
  {
    id: "cc-switch",
    name: "farion1231/cc-switch",
    description: "A cross-platform assistant tool for Claude Code, Codex, OpenCode and Gemini CLI.",
    language: "Rust",
    stars: 64705,
    forks: 4172,
    stars7dAgo: 0,
    topics: ["claude-code", "codex", "desktop-app", "openclaw", "rust", "tauri"],
    url: "https://github.com/farion1231/cc-switch"
  },
  {
    id: "get-shit-done",
    name: "gsd-build/get-shit-done",
    description: "A meta-prompting and spec-driven development system for Claude Code.",
    language: "JavaScript",
    stars: 61083,
    forks: 5178,
    stars7dAgo: 0,
    topics: ["claude-code", "context-engineering", "meta-prompting", "spec-driven-development"],
    url: "https://github.com/gsd-build/get-shit-done"
  },
  {
    id: "learn-claude-code",
    name: "shareAI-lab/learn-claude-code",
    description: "A nano Claude Code-like agent harness built from 0 to 1.",
    language: "TypeScript",
    stars: 59345,
    forks: 9735,
    stars7dAgo: 0,
    topics: ["agent", "claude", "claude-code", "educational", "llm", "tutorial"],
    url: "https://github.com/shareAI-lab/learn-claude-code"
  },
  {
    id: "awesome-claude-skills",
    name: "ComposioHQ/awesome-claude-skills",
    description: "A curated list of Claude skills, resources, and tools.",
    language: "Python",
    stars: 58901,
    forks: 6368,
    stars7dAgo: 0,
    topics: ["claude", "claude-code", "codex", "developer-tools", "mcp", "workflow-automation"],
    url: "https://github.com/ComposioHQ/awesome-claude-skills"
  },
  {
    id: "caveman",
    name: "JuliusBrussee/caveman",
    description: "A Claude Code skill that cuts token usage by simplifying responses.",
    language: "Python",
    stars: 56956,
    forks: 3125,
    stars7dAgo: 0,
    topics: ["anthropic", "claude", "claude-code", "prompt-engineering", "skill", "tokens"],
    url: "https://github.com/JuliusBrussee/caveman"
  },
  {
    id: "oh-my-openagent",
    name: "code-yeongyu/oh-my-openagent",
    description: "An agent harness for Claude Code, Codex, OpenCode and Gemini.",
    language: "TypeScript",
    stars: 56805,
    forks: 4624,
    stars7dAgo: 0,
    topics: ["anthropic", "claude", "claude-code", "opencode", "openai", "typescript"],
    url: "https://github.com/code-yeongyu/oh-my-openagent"
  }
];

claudeCliRepos = prefixRepoIds("claude", claudeCliRepos);

let agentRepos: RepoRecord[] = [
  {
    id: "everything-claude-code",
    name: "affaan-m/everything-claude-code",
    description: "The agent harness performance optimization system for Claude Code and beyond.",
    language: "JavaScript",
    stars: 176397,
    forks: 27283,
    stars7dAgo: 0,
    topics: ["ai-agents", "anthropic", "claude", "claude-code", "developer-tools", "llm", "mcp"],
    url: "https://github.com/affaan-m/everything-claude-code"
  },
  {
    id: "hermes-agent",
    name: "NousResearch/hermes-agent",
    description: "The agent that grows with you.",
    language: "Python",
    stars: 140421,
    forks: 21771,
    stars7dAgo: 0,
    topics: ["ai", "ai-agent", "ai-agents", "anthropic", "claude", "claude-code"],
    url: "https://github.com/NousResearch/hermes-agent"
  },
  {
    id: "langchain",
    name: "langchain-ai/langchain",
    description: "The agent engineering platform.",
    language: "Python",
    stars: 136234,
    forks: 22515,
    stars7dAgo: 0,
    topics: ["agents", "ai-agents", "anthropic", "framework", "langgraph", "llm"],
    url: "https://github.com/langchain-ai/langchain"
  },
  {
    id: "firecrawl",
    name: "firecrawl/firecrawl",
    description: "The API to search, scrape, and interact with the web for AI.",
    language: "TypeScript",
    stars: 117306,
    forks: 7321,
    stars7dAgo: 0,
    topics: ["ai-agents", "ai-search", "scraper", "web-scraping"],
    url: "https://github.com/firecrawl/firecrawl"
  },
  {
    id: "gemini-cli",
    name: "google-gemini/gemini-cli",
    description: "An open-source AI agent that brings Gemini into your terminal.",
    language: "TypeScript",
    stars: 103511,
    forks: 13546,
    stars7dAgo: 0,
    topics: ["ai-agents", "cli", "gemini", "mcp-client", "mcp-server"],
    url: "https://github.com/google-gemini/gemini-cli"
  },
  {
    id: "browser-use",
    name: "browser-use/browser-use",
    description: "Make websites accessible for AI agents.",
    language: "Python",
    stars: 93073,
    forks: 10538,
    stars7dAgo: 0,
    topics: ["ai-agents", "browser-automation", "llm", "playwright", "python"],
    url: "https://github.com/browser-use/browser-use"
  },
  {
    id: "ragflow",
    name: "infiniflow/ragflow",
    description: "An open-source RAG engine with agent capabilities.",
    language: "Python",
    stars: 80075,
    forks: 9130,
    stars7dAgo: 0,
    topics: ["agentic-ai", "ai-agents", "rag", "retrieval-augmented-generation"],
    url: "https://github.com/infiniflow/ragflow"
  },
  {
    id: "prompt-engineering-guide",
    name: "dair-ai/Prompt-Engineering-Guide",
    description: "Guides, papers, lessons, notebooks and resources for AI agents.",
    language: "MDX",
    stars: 74373,
    forks: 8035,
    stars7dAgo: 0,
    topics: ["agents", "ai-agents", "prompt-engineering", "rag"],
    url: "https://github.com/dair-ai/Prompt-Engineering-Guide"
  },
  {
    id: "claude-mem",
    name: "thedotmack/claude-mem",
    description: "A Claude Code plugin that captures sessions and injects context back in.",
    language: "TypeScript",
    stars: 74006,
    forks: 6349,
    stars7dAgo: 0,
    topics: ["ai-agents", "anthropic", "claude-code", "memory", "rag"],
    url: "https://github.com/thedotmack/claude-mem"
  },
  {
    id: "daytona",
    name: "daytonaio/daytona",
    description: "Secure and elastic infrastructure for running AI-generated code.",
    language: "TypeScript",
    stars: 72352,
    forks: 5540,
    stars7dAgo: 0,
    topics: ["ai-agents", "ai-runtime", "ai-sandboxes", "code-execution"],
    url: "https://github.com/daytonaio/daytona"
  }
];

agentRepos = prefixRepoIds("agent", agentRepos);

let skillsRepos: RepoRecord[] = [
  {
    id: "anthropics-skills",
    name: "anthropics/skills",
    description: "Public repository for Agent Skills.",
    language: "Python",
    stars: 130973,
    forks: 15401,
    stars7dAgo: 0,
    topics: ["agent-skills"],
    url: "https://github.com/anthropics/skills"
  },
  {
    id: "awesome-claude-skills",
    name: "ComposioHQ/awesome-claude-skills",
    description: "A curated list of awesome Claude skills, resources, and tools.",
    language: "Python",
    stars: 58901,
    forks: 6368,
    stars7dAgo: 0,
    topics: ["agent-skills", "claude-code", "developer-tools", "workflow-automation"],
    url: "https://github.com/ComposioHQ/awesome-claude-skills"
  },
  {
    id: "awesome-openclaw-skills",
    name: "VoltAgent/awesome-openclaw-skills",
    description: "An installable GitHub library of 1,400+ agentic skills.",
    language: "Python",
    stars: 48290,
    forks: 4737,
    stars7dAgo: 0,
    topics: ["agent-skills", "awesome", "openclaw", "skill-library"],
    url: "https://github.com/VoltAgent/awesome-openclaw-skills"
  },
  {
    id: "awesome-claude-code",
    name: "hesreallyhim/awesome-claude-code",
    description: "A curated list of skills, hooks, slash-commands, orchestrators and plugins.",
    language: "Python",
    stars: 43102,
    forks: 3659,
    stars7dAgo: 0,
    topics: ["agent-skills", "anthropic", "claude-code", "awesome-list"],
    url: "https://github.com/hesreallyhim/awesome-claude-code"
  },
  {
    id: "agent-skills",
    name: "addyosmani/agent-skills",
    description: "Production-grade engineering skills for AI coding agents.",
    language: "Shell",
    stars: 36993,
    forks: 4139,
    stars7dAgo: 0,
    topics: ["agent-skills", "claude-code", "cursor", "skills"],
    url: "https://github.com/addyosmani/agent-skills"
  },
  {
    id: "antigravity-awesome-skills",
    name: "sickn33/antigravity-awesome-skills",
    description: "Installable library of 1,400+ agentic skills for modern AI tools.",
    language: "Python",
    stars: 36915,
    forks: 6036,
    stars7dAgo: 0,
    topics: ["agent-skills", "antigravity", "claude-code-skills", "skill-library"],
    url: "https://github.com/sickn33/antigravity-awesome-skills"
  },
  {
    id: "open-design",
    name: "nexu-io/open-design",
    description: "Local-first open-source alternative to Claude Design.",
    language: "TypeScript",
    stars: 34934,
    forks: 3921,
    stars7dAgo: 0,
    topics: ["agent-skills", "claude-code-for-design", "design-tools", "ui-generator"],
    url: "https://github.com/nexu-io/open-design"
  },
  {
    id: "awesome-copilot",
    name: "github/awesome-copilot",
    description: "Community-contributed instructions, agents, skills and configurations for Copilot.",
    language: "Python",
    stars: 32534,
    forks: 3964,
    stars7dAgo: 0,
    topics: ["agent-skills", "github-copilot", "prompt-engineering"],
    url: "https://github.com/github/awesome-copilot"
  },
  {
    id: "googleworkspace-cli",
    name: "googleworkspace/cli",
    description: "Google Workspace CLI with AI agent skills.",
    language: "Rust",
    stars: 25970,
    forks: 1351,
    stars7dAgo: 0,
    topics: ["agent-skills", "cli", "google-workspace", "rust"],
    url: "https://github.com/googleworkspace/cli"
  },
  {
    id: "awesome-agent-skills",
    name: "VoltAgent/awesome-agent-skills",
    description: "A curated collection of 1,000+ agent skills.",
    language: "Python",
    stars: 20937,
    forks: 2212,
    stars7dAgo: 0,
    topics: ["agent-skills", "awesome", "claude-skills", "skills"],
    url: "https://github.com/VoltAgent/awesome-agent-skills"
  }
];

skillsRepos = prefixRepoIds("skills", skillsRepos);

let mcpRepos: RepoRecord[] = [
  {
    id: "n8n",
    name: "n8n-io/n8n",
    description: "Workflow automation platform with native AI capabilities.",
    language: "TypeScript",
    stars: 187210,
    forks: 57494,
    stars7dAgo: 0,
    topics: ["ai", "automation", "mcp", "mcp-client", "mcp-server"],
    url: "https://github.com/n8n-io/n8n"
  },
  {
    id: "everything-claude-code",
    name: "affaan-m/everything-claude-code",
    description: "Agent harness performance optimization for Claude Code and beyond.",
    language: "JavaScript",
    stars: 176397,
    forks: 27283,
    stars7dAgo: 0,
    topics: ["ai-agents", "claude-code", "developer-tools", "llm", "mcp"],
    url: "https://github.com/affaan-m/everything-claude-code"
  },
  {
    id: "javaguide",
    name: "Snailclimb/JavaGuide",
    description: "Java interview and back-end guide with AI application development coverage.",
    language: "Java",
    stars: 155520,
    forks: 46139,
    stars7dAgo: 0,
    topics: ["context-engineering", "java", "mcp", "skills", "system-design"],
    url: "https://github.com/Snailclimb/JavaGuide"
  },
  {
    id: "dify",
    name: "langgenius/dify",
    description: "Production-ready platform for agentic workflow development.",
    language: "TypeScript",
    stars: 140707,
    forks: 22084,
    stars7dAgo: 0,
    topics: ["agentic-workflow", "automation", "mcp", "workflow"],
    url: "https://github.com/langgenius/dify"
  },
  {
    id: "open-webui",
    name: "open-webui/open-webui",
    description: "User-friendly AI interface.",
    language: "Python",
    stars: 136282,
    forks: 19403,
    stars7dAgo: 0,
    topics: ["llm-ui", "mcp", "openai", "rag", "self-hosted"],
    url: "https://github.com/open-webui/open-webui"
  },
  {
    id: "awesome-mcp-servers",
    name: "punkpeye/awesome-mcp-servers",
    description: "A collection of MCP servers.",
    language: "Markdown",
    stars: 86538,
    forks: 9993,
    stars7dAgo: 0,
    topics: ["ai", "mcp", "mcp-servers", "awesome-list"],
    url: "https://github.com/punkpeye/awesome-mcp-servers"
  },
  {
    id: "netdata",
    name: "netdata/netdata",
    description: "AI-powered full stack observability.",
    language: "C",
    stars: 78751,
    forks: 6430,
    stars7dAgo: 0,
    topics: ["ai", "mcp", "monitoring", "observability"],
    url: "https://github.com/netdata/netdata"
  },
  {
    id: "lobehub",
    name: "lobehub/lobehub",
    description: "Space for agent teammates and multi-agent collaboration.",
    language: "TypeScript",
    stars: 76733,
    forks: 15124,
    stars7dAgo: 0,
    topics: ["agent", "mcp", "openai", "claude", "knowledge-base"],
    url: "https://github.com/lobehub/lobehub"
  },
  {
    id: "cc-switch",
    name: "farion1231/cc-switch",
    description: "Desktop assistant for Claude Code, Codex, OpenCode and Gemini CLI.",
    language: "Rust",
    stars: 64711,
    forks: 4172,
    stars7dAgo: 0,
    topics: ["claude-code", "mcp", "openclaw", "rust", "tauri"],
    url: "https://github.com/farion1231/cc-switch"
  },
  {
    id: "anything-llm",
    name: "Mintplex-Labs/anything-llm",
    description: "All-in-one AI productivity accelerator.",
    language: "JavaScript",
    stars: 59774,
    forks: 6460,
    stars7dAgo: 0,
    topics: ["ai-agents", "llm", "mcp", "rag", "vector-database"],
    url: "https://github.com/Mintplex-Labs/anything-llm"
  }
];

mcpRepos = prefixRepoIds("mcp", mcpRepos);

function isAiRepository(repo: RepoRecord) {
  return repo.topics.some((topic) => aiTopics.has(topic));
}

function computeStarGrowth(repo: RepoRecord) {
  return repo.stars - repo.stars7dAgo;
}

function applySnapshot(repo: RepoRecord, snapshots?: RepoSnapshotMap) {
  const snapshot = snapshots?.[repo.id] ?? snapshots?.[repo.name];
  if (!snapshot) {
    return repo;
  }

  return {
    ...repo,
    stars: snapshot.stars,
    forks: snapshot.forks ?? repo.forks
  };
}

function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

export function getAllDashboardRepoIdentifiers() {
  const seen = new Set<string>();
  const allRepos = [...repos, ...claudeCliRepos, ...agentRepos, ...skillsRepos, ...mcpRepos];

  return allRepos
    .filter((repo) => {
      if (seen.has(repo.name)) {
        return false;
      }
      seen.add(repo.name);
      return true;
    })
    .map((repo) => ({ id: repo.id, fullName: repo.name }));
}

export function getDashboardData(options?: { snapshots?: RepoSnapshotMap; lastUpdated?: string }) {
  const snapshots = options?.snapshots;
  const aiRepos = repos.filter(isAiRepository).map((repo) => applySnapshot(repo, snapshots));

  const topRepos = [...aiRepos].sort((a, b) => b.stars - a.stars);
  const fastestGrowingRepos = repos
    .filter(isAiRepository)
    .filter((repo) => repo.stars7dAgo < 150)
    .map((repo) => applySnapshot(repo, snapshots))
    .map((repo) => ({ ...repo, starGrowth: computeStarGrowth(repo) }))
    .sort((a, b) => b.starGrowth - a.starGrowth);

  return {
    topRepos,
    fastestGrowingRepos,
    lastUpdated: options?.lastUpdated ?? getTodayDate(),
    claudeCliRepos: claudeCliRepos.map((repo) => applySnapshot(repo, snapshots)),
    agentRepos: agentRepos.map((repo) => applySnapshot(repo, snapshots)),
    skillsRepos: skillsRepos.map((repo) => applySnapshot(repo, snapshots)),
    mcpRepos: mcpRepos.map((repo) => applySnapshot(repo, snapshots))
  };
}
