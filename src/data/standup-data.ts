export const YESTERDAY = [
  "Moved tickets from 'In Progress' to 'In Progress'",
  "Attended meeting about the meeting we'll have next week",
  "Synced with the team about syncing with the team",
  "Reviewed PR that was already merged",
  "Updated Jira. Jira ignored it.",
  "Stared at the same bug for 8 hours",
  "Googled the same Stack Overflow answer as last Tuesday",
  "Wrote code. Deleted code. Wrote same code again.",
  "Had 7 meetings. Did 0 things.",
  "Refactored something nobody asked to refactor",
  "Read Slack messages. Did not respond.",
  "Opened 47 tabs. Closed 0.",
  "Pretended to understand the architecture diagram",
  "Said 'let's take this offline' 4 times",
  "Moved ticket back to 'In Progress' from 'Done'",
];

export const TODAY = [
  "Will move tickets. From 'In Progress' to 'In Progress'.",
  "Planned to fix the bug I created yesterday",
  "Going to attend the meeting about the previous meeting",
  "Will review that PR again. Still already merged.",
  "Planning to update Jira. Jira will ignore it.",
  "Going to Google the same answer again",
  "Will open 47 new tabs",
  "Planning to understand what I'm supposed to be doing",
  "Going to write the same code I deleted yesterday",
  "Will attend all the syncs. Accomplish nothing.",
  "Planning to ask for clarification on requirements from 2023",
  "Going to refactor something that definitely doesn't need it",
  "Will say 'circle back' at least 3 times",
  "Planning to update my local environment. Again.",
  "Going to close those 47 tabs. Probably not.",
];

export const BLOCKERS = [
  "Existence",
  "Monday",
  "The previous developer",
  "Unclear requirements (as always)",
  "My local environment is haunted",
  "Waiting on a response from 3 weeks ago",
  "Too many meetings about not having enough time",
  "The ticket lacks acceptance criteria. As usual.",
  "Mercury is in retrograde",
  "npm install is taking 47 minutes",
  "The design is 'almost final'",
  "Stakeholder alignment (nobody agrees on anything)",
  "Technical debt from 2019",
  "I don't know what I'm doing and nobody does",
  "None — I am a machine. A broken machine.",
];

export interface Mood {
  emoji: string;
  label: string;
  color: string;
}

export const MOODS: Mood[] = [
  { emoji: "\u{1F610}", label: "FINE", color: "#00ff41" },
  { emoji: "\u2615", label: "CAFFEINATED", color: "#ff9900" },
  { emoji: "\u{1F972}", label: "SURVIVING", color: "#ff6600" },
  { emoji: "\u{1F480}", label: "DEAD INSIDE", color: "#ff0000" },
  { emoji: "\u{1F916}", label: "FULLY AUTOMATED", color: "#00ffff" },
];

export interface StandupResult {
  yesterday: string;
  today: string;
  blocker: string;
  mood: Mood;
}
