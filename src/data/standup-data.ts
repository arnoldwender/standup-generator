/* ========================================
   Standup Data — All phrases organized by
   role, buzzword level, and escalation tier
   ======================================== */

export interface Mood {
  emoji: string;
  label: string;
  color: string;
}

export interface StandupResult {
  yesterday: string;
  today: string;
  blocker: string;
  mood: Mood;
}

/* --- Buzzword density levels --- */
export type BuzzwordLevel = 'honest' | 'middle-management' | 'c-suite' | 'singularity';

export const BUZZWORD_LABELS: Record<BuzzwordLevel, string> = {
  honest: 'HONEST',
  'middle-management': 'MIDDLE MANAGEMENT',
  'c-suite': 'C-SUITE',
  singularity: 'BUZZWORD SINGULARITY',
};

/* --- Role definitions --- */
export type Role =
  | 'frontend'
  | 'backend'
  | 'devops'
  | 'product-manager'
  | 'designer'
  | 'intern';

export const ROLE_LABELS: Record<Role, string> = {
  frontend: 'Frontend Dev',
  backend: 'Backend Dev',
  devops: 'DevOps',
  'product-manager': 'Product Manager',
  designer: 'Designer',
  intern: 'Intern',
};

/* --- Buzzword injections per level --- */
const BUZZWORD_PREFIXES: Record<BuzzwordLevel, string[]> = {
  honest: [],
  'middle-management': [
    'Aligned cross-functionally to',
    'Synced stakeholders on',
    'Drove alignment around',
    'Facilitated a deep-dive into',
    'Circled back to',
  ],
  'c-suite': [
    'Leveraged AI-driven synergies to',
    'Orchestrated a paradigm shift in',
    'Catalyzed next-gen innovation for',
    'Spearheaded blockchain-adjacent strategy for',
    'Evangelized holistic transformation of',
    'Disrupted legacy thinking around',
  ],
  singularity: [
    'Quantum-leveraged hyper-agile AI-blockchain synergies to paradigm-shift',
    'Web3-enabled metaverse-native thought leadership to disrupt',
    'Synergized cross-platform AI-first zero-trust architectures to transform',
    'Democratized decentralized autonomous innovation to revolutionize',
    'Operationalized multimodal generative intelligence to 10x',
    'Harnessed post-singularity neural mesh networks to transcend',
  ],
};

/* --- Yesterday phrases per role --- */
const YESTERDAY_BY_ROLE: Record<Role, string[]> = {
  frontend: [
    "Moved tickets from 'In Progress' to 'In Progress'",
    "Fixed a CSS bug that created 3 new CSS bugs",
    "Centered a div. It took 4 hours.",
    "Fought with z-index. z-index won.",
    "Debated tabs vs spaces for 2 hours in Slack",
    "Rewrote a component in a framework that didn't exist yesterday",
    "Made pixel-perfect changes nobody will notice",
    "Stared at the same hydration error for 6 hours",
    "Installed 47 npm packages to add a tooltip",
    "Wrote 200 lines of CSS. Deleted 199.",
  ],
  backend: [
    "Optimized a query from 3 seconds to 2.9 seconds",
    "Wrote an API endpoint nobody will call",
    "Debugged production at 3am. Again.",
    "Added logging. Now there's too much logging.",
    "Migrated a database. Broke everything. Migrated back.",
    "Wrote unit tests. All green. Nothing works in prod.",
    "Refactored a microservice into a slightly different microservice",
    "Spent 5 hours on a bug that was a missing semicolon",
    "Created a caching layer. Cache invalidation broke everything.",
    "Read 47 Stack Overflow answers for the same error",
  ],
  devops: [
    "Kubernetes pod crashed. Restarted it. It crashed again.",
    "Updated the CI/CD pipeline. It now takes 45 minutes.",
    "Rotated secrets. Broke staging. Then prod.",
    "Wrote a Terraform config. Applied it to the wrong account.",
    "Docker build succeeded locally. Failed everywhere else.",
    "Monitored dashboards. Everything was on fire.",
    "Set up auto-scaling. It auto-scaled to 0.",
    "Deployed to prod. Rolled back. Deployed again. Rolled back again.",
    "Spent 3 hours on YAML indentation",
    "The build server is sentient and hostile",
  ],
  'product-manager': [
    "Created a Jira epic with 47 subtasks",
    "Had 9 meetings. Created 3 more meetings.",
    "Updated the roadmap. Nobody looked at it.",
    "Wrote requirements. Changed them during the meeting.",
    "Prioritized everything as P0",
    "Asked engineering for an estimate. Got 'it depends'.",
    "Aligned stakeholders. They immediately unaligned.",
    "Created a Confluence page nobody will read",
    "Said 'let me check with the team' 14 times",
    "Moved the sprint goal. Again.",
  ],
  designer: [
    "Created 47 variations of a button",
    "Updated the design system. Engineering ignored it.",
    "Made a prototype. Stakeholders want the opposite.",
    "Pixel-pushed for 6 hours. Nobody noticed.",
    "Created a Figma file with 200 frames",
    "User tested with 3 people. Got 3 completely different opinions.",
    "Designed mobile-first. PM wants desktop-only.",
    "Spent 4 hours choosing a font. Went with the first one.",
    "Created a beautiful design. Dev said 'not possible'.",
    "Argued about border-radius for an hour",
  ],
  intern: [
    "Watched 6 hours of onboarding videos",
    "Set up my local environment. It doesn't work.",
    "Asked a question in Slack. Was told to check Confluence.",
    "Checked Confluence. Link was broken.",
    "Attended a meeting I wasn't supposed to be in",
    "Wrote 'Hello World'. Mentor said 'we don't do that here'.",
    "Read the codebase. Understood nothing.",
    "Fixed a typo. Created a merge conflict.",
    "Asked what the acronyms mean. Nobody knows.",
    "Tried to deploy. Don't have permissions.",
  ],
};

/* --- Today phrases per role --- */
const TODAY_BY_ROLE: Record<Role, string[]> = {
  frontend: [
    "Will move tickets. From 'In Progress' to 'In Progress'.",
    "Planning to center another div",
    "Going to install 12 more npm packages",
    "Will fight with webpack config again",
    "Planning to rewrite everything in the latest framework",
    "Going to make it responsive. Probably.",
    "Will debug that hydration error. Maybe.",
    "Planning to close those 47 browser tabs. Probably not.",
    "Going to refactor CSS nobody asked me to refactor",
    "Will say 'it works on my machine' at least twice",
  ],
  backend: [
    "Will write another endpoint nobody asked for",
    "Planning to add more microservices to the monolith",
    "Going to debug that timeout in production",
    "Will write tests. Maybe even run them.",
    "Planning to optimize a query that runs once a month",
    "Going to add error handling. Probably just console.log.",
    "Will investigate that memory leak from 2023",
    "Planning to document the API. Just kidding.",
    "Going to refactor the authentication layer. What could go wrong?",
    "Will read the same Stack Overflow answer again",
  ],
  devops: [
    "Will restart the pods. Standard Tuesday.",
    "Planning to investigate why the build takes 45 minutes",
    "Going to write more YAML. So much YAML.",
    "Will monitor the dashboards and panic quietly",
    "Planning to update Kubernetes. What could go wrong?",
    "Going to investigate that 3am alert",
    "Will set up monitoring for our monitoring",
    "Planning to migrate to a new cloud provider. Again.",
    "Going to figure out why staging and prod are different",
    "Will rotate secrets. Pray nothing breaks.",
  ],
  'product-manager': [
    "Will create more Jira tickets",
    "Planning to reschedule the meeting about the roadmap",
    "Going to ask engineering for timeline estimates",
    "Will update the sprint goal mid-sprint",
    "Planning to send a 'quick sync' calendar invite",
    "Going to add 5 more items to the backlog nobody reads",
    "Will say 'circle back' at least 4 times",
    "Planning to mark everything as high priority",
    "Going to schedule a brainstorm about the brainstorm",
    "Will align. Something. With someone. Unclear what.",
  ],
  designer: [
    "Will create 15 more button variations",
    "Planning to update the design tokens nobody uses",
    "Going to make another Figma prototype",
    "Will conduct user research with myself",
    "Planning to make it pop. And also conversational.",
    "Going to argue about whitespace in the standup",
    "Will redesign the thing I designed yesterday",
    "Planning to add more shadows. Always more shadows.",
    "Going to present 3 options. Stakeholder will pick a 4th.",
    "Will spend 2 hours on icon selection",
  ],
  intern: [
    "Will continue reading documentation",
    "Planning to ask another question in Slack",
    "Going to try to understand the architecture",
    "Will attend meetings I probably shouldn't be in",
    "Planning to fix that merge conflict from yesterday",
    "Going to set up my local environment. Again.",
    "Will try to understand what a sprint is",
    "Planning to write my first PR. Terrified.",
    "Going to shadow someone. They don't know yet.",
    "Will pretend to understand the standup",
  ],
};

/* --- Blocker escalation tiers (0-based index, wraps at length) --- */
export const BLOCKER_ESCALATION: string[] = [
  /* Tier 0 — mundane */
  "Waiting on PR review",
  "Unclear requirements (as always)",
  "The ticket lacks acceptance criteria. As usual.",
  "npm install is taking 47 minutes",
  "Waiting on a response from 3 weeks ago",

  /* Tier 1 — annoyed */
  "The previous developer's code is haunted",
  "Too many meetings about not having enough time",
  "Stakeholder alignment (nobody agrees on anything)",
  "Technical debt has achieved sentience",
  "The design is 'almost final' for the 7th time",

  /* Tier 2 — existential */
  "Blocked by existential dread",
  "My local environment is cursed by an ancient developer",
  "Monday. Just... Monday.",
  "The Jira board is a mirror of my soul: empty and broken",
  "Mercury is in retrograde and so is our deployment",

  /* Tier 3 — absurd */
  "My code achieved sentience and refuses to compile",
  "A ghost in the CI/CD pipeline keeps reverting my commits",
  "The intern accidentally deployed to production. Twice.",
  "Our tech debt just got a credit rating from Moody's",
  "The standup itself is the blocker",

  /* Tier 4 — cosmic */
  "The build server gained consciousness and filed a restraining order",
  "Our microservices formed a union and are demanding benefits",
  "The bug is quantum — it only exists when observed by QA",
  "I've been trapped in an infinite sprint loop since Q3 2024",
  "The codebase has evolved beyond human comprehension. HR sent a wellness check.",
];

/* --- Moods (base + day-specific extras) --- */
export const MOODS: Mood[] = [
  { emoji: "\u{1F610}", label: "FINE", color: "#00ff41" },
  { emoji: "\u2615", label: "CAFFEINATED", color: "#ff9900" },
  { emoji: "\u{1F972}", label: "SURVIVING", color: "#ff6600" },
  { emoji: "\u{1F480}", label: "DEAD INSIDE", color: "#ff0000" },
  { emoji: "\u{1F916}", label: "FULLY AUTOMATED", color: "#00ffff" },
  { emoji: "\u{1F9D8}", label: "DISASSOCIATING", color: "#bf80ff" },
  { emoji: "\u{1F525}", label: "EVERYTHING IS FINE", color: "#ff4444" },
  { emoji: "\u{1F634}", label: "STANDUP ZOMBIE", color: "#888888" },
];

export const MONDAY_MOODS: Mood[] = [
  { emoji: "\u{1F4A9}", label: "IT'S MONDAY", color: "#8B4513" },
  { emoji: "\u{1F62D}", label: "WEEKEND WITHDRAWAL", color: "#4444ff" },
  { emoji: "\u{1F480}", label: "SPIRITUALLY DECEASED", color: "#ff0000" },
  { emoji: "\u{1FAE0}", label: "RUNNING ON FUMES", color: "#999999" },
];

/* --- Bingo phrases --- */
export const BINGO_PHRASES = [
  "Let's take this offline",
  "Can you see my screen?",
  "You're on mute",
  "Let's circle back",
  "Moving forward...",
  "Syncing up",
  "Quick sync",
  "No blockers",
  "Same as yesterday",
  "Deep dive",
  "Low-hanging fruit",
  "Bandwidth",
  "Leverage",
  "Scalable solution",
  "Action items",
  "Pain points",
  "Touch base",
  "Pivot",
  "North star metric",
  "Sprint velocity",
  "Story points",
  "Backlog grooming",
  "Stakeholder alignment",
  "Cross-functional",
  "End of day",
  "Parking lot",
  "Level set",
  "Double-click on that",
  "Tiger team",
  "Thought leadership",
  "10x engineer",
  "Ship it",
  "Technical debt",
  "Due diligence",
  "Agile methodology",
];

/* --- Achievement definitions --- */
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first', title: 'First Standup', description: 'Generated your first fake standup', icon: "\u{1F476}" },
  { id: 'serial', title: 'Serial Faker', description: 'Generated 10 standups', icon: "\u{1F3AD}" },
  { id: 'addict', title: 'Standup Addict', description: 'Generated 25 standups', icon: "\u{1F489}" },
  { id: 'buzzmaster', title: 'Buzzword Master', description: 'Used Buzzword Singularity level', icon: "\u{1F4A1}" },
  { id: 'allroles', title: 'Identity Crisis', description: 'Used every role', icon: "\u{1F3AD}" },
  { id: 'bingo', title: 'BINGO!', description: 'Won standup bingo', icon: "\u{1F3B0}" },
  { id: 'speedrun', title: 'Speed Demon', description: 'Completed a speedrun', icon: "\u26A1" },
  { id: 'monday', title: 'Monday Survivor', description: 'Generated a standup on Monday', icon: "\u{1F62D}" },
  { id: 'friday', title: 'Friday Rebel', description: 'Tried to standup on Friday', icon: "\u{1F3C4}" },
  { id: 'hr', title: 'HR Incident', description: 'Generated 10 in a row without stopping', icon: "\u{1F6A8}" },
  { id: 'copier', title: 'Slack Infiltrator', description: 'Copied a standup to clipboard', icon: "\u{1F4CB}" },
  { id: 'shared', title: 'Gone Viral', description: 'Created a share card', icon: "\u{1F4F8}" },
];

/* --- Generator function --- */
export function generateStandup(
  role: Role,
  buzzwordLevel: BuzzwordLevel,
  generationCount: number,
): StandupResult {
  const yesterdays = YESTERDAY_BY_ROLE[role];
  const todays = TODAY_BY_ROLE[role];
  const prefixes = BUZZWORD_PREFIXES[buzzwordLevel];

  /* Pick random items */
  const yesterday = pickRandom(yesterdays);
  const today = pickRandom(todays);

  /* Escalating blockers — higher generation counts pick from later tiers */
  const tierSize = 5;
  const maxTier = Math.floor(BLOCKER_ESCALATION.length / tierSize) - 1;
  const currentTier = Math.min(Math.floor(generationCount / 3), maxTier);
  const tierStart = currentTier * tierSize;
  const tierEnd = tierStart + tierSize;
  const tierBlockers = BLOCKER_ESCALATION.slice(tierStart, tierEnd);
  const blocker = pickRandom(tierBlockers);

  /* Determine mood — Monday gets extra depressing options */
  const isMonday = new Date().getDay() === 1;
  const moodPool = isMonday ? [...MOODS, ...MONDAY_MOODS] : MOODS;
  const mood = pickRandom(moodPool);

  /* Apply buzzword prefix if above honest level */
  const addPrefix = (text: string) => {
    if (prefixes.length === 0) return text;
    return `${pickRandom(prefixes)} ${text.charAt(0).toLowerCase()}${text.slice(1)}`;
  };

  return {
    yesterday: addPrefix(yesterday),
    today: addPrefix(today),
    blocker,
    mood,
  };
}

/* --- Utility --- */
function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
