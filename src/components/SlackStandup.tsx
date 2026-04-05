/* ========================================
   Slack Standup Bot Mockup — realistic
   Slack channel with bot collecting
   standup responses from fake team members
   ======================================== */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* --- Fake team member data --- */
interface TeamMember {
  name: string;
  avatar: string;
  color: string;
  status: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  { name: 'Alex Chen', avatar: 'AC', color: '#e01e5a', status: 'In a meeting' },
  { name: 'Jordan Miller', avatar: 'JM', color: '#36c5f0', status: 'Coding' },
  { name: 'Sam Taylor', avatar: 'ST', color: '#2eb67d', status: 'On call' },
  { name: 'Riley Parker', avatar: 'RP', color: '#ecb22e', status: 'WFH' },
  { name: 'Casey Jones', avatar: 'CJ', color: '#e01e5a', status: 'Focusing' },
];

/* --- Confident but vague team responses --- */
const TEAM_RESPONSES = [
  {
    yesterday: 'Aligned on the Q3 deliverables with stakeholders. Synced with platform team.',
    today: 'Continuing the deep dive on the pipeline architecture refactor.',
    blockers: 'None, everything is on track.',
  },
  {
    yesterday: 'Wrapped up the POC for the new integration layer. Pushed a few PRs.',
    today: 'Going to finalize the caching strategy and document the approach.',
    blockers: 'Waiting on API keys from vendor.',
  },
  {
    yesterday: 'Pair-programmed on the auth flow. Made solid progress.',
    today: 'Will be heads-down on the migration scripts. ETA looks good.',
    blockers: 'No blockers.',
  },
  {
    yesterday: 'Investigated the performance regression. Root cause identified.',
    today: 'Implementing the fix and writing regression tests.',
    blockers: 'Need staging environment access renewed.',
  },
  {
    yesterday: 'Reviewed 12 PRs, updated sprint board, groomed backlog.',
    today: 'Finishing the technical spec for the new feature epic.',
    blockers: 'Calendar is back-to-back but managing.',
  },
  {
    yesterday: 'Shipped the hotfix for the checkout flow. Monitoring metrics.',
    today: 'Starting on the observability improvements we discussed.',
    blockers: 'All good.',
  },
  {
    yesterday: 'Had a productive brainstorm with design. Captured action items.',
    today: 'Prototyping the new dashboard components.',
    blockers: 'Figma file is still loading... since yesterday.',
  },
];

/* --- Quick response options for the user --- */
const QUICK_RESPONSES = {
  yesterday: [
    'Reviewed PRs (scrolled past them)',
    'Fixed production issue (restarted server)',
    'Attended meetings (existed in Zoom)',
    'Refactored components (renamed variables)',
    'Updated dependencies (ran npm update and prayed)',
    'Worked on the pipeline (stared at logs)',
    'Investigated a bug (googled the error)',
    'Pair programmed (watched someone code)',
  ],
  today: [
    'Continue investigating (googling)',
    'Finalize the implementation (start it)',
    'Write tests (skip tests)',
    'Address PR feedback (argue in comments)',
    'Deep dive on architecture (draw boxes)',
    'Sync with the team (Slack messages)',
    'Ship the feature (push to staging maybe)',
    'Optimize performance (add a spinner)',
  ],
  blockers: [
    'No blockers (everything is on fire)',
    'Waiting on design (they\'re waiting on us)',
    'Need access to prod (still pending from 2024)',
    'Unclear requirements (as intended)',
    'Too many meetings today',
    'The codebase',
  ],
};

/* --- Message types --- */
interface BotMessage {
  type: 'bot';
  text: string;
  timestamp: string;
}

interface UserMessage {
  type: 'user';
  text: string;
  timestamp: string;
}

interface TeamMessage {
  type: 'team';
  member: TeamMember;
  response: { yesterday: string; today: string; blockers: string };
  timestamp: string;
}

type Message = BotMessage | UserMessage | TeamMessage;

function formatTime(): string {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function SlackStandup() {
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'bot',
      text: "Good morning! It's time for your daily standup. What did you work on yesterday?",
      timestamp: formatTime(),
    },
  ]);
  const [stage, setStage] = useState<'yesterday' | 'today' | 'blockers' | 'done'>('yesterday');
  const [userResponses, setUserResponses] = useState<{ yesterday: string; today: string; blockers: string }>({
    yesterday: '',
    today: '',
    blockers: '',
  });

  /* Handle user selecting a quick response */
  const selectResponse = useCallback(
    (response: string) => {
      if (stage === 'done') return;

      const time = formatTime();

      /* Add user message */
      const userMsg: UserMessage = { type: 'user', text: response, timestamp: time };

      /* Build updated user responses */
      const updated = { ...userResponses, [stage]: response };
      setUserResponses(updated);

      /* Determine next stage and bot reply */
      let botReply: BotMessage;
      let nextStage: typeof stage;

      if (stage === 'yesterday') {
        botReply = {
          type: 'bot',
          text: 'Got it! And what are you planning to work on today?',
          timestamp: time,
        };
        nextStage = 'today';
      } else if (stage === 'today') {
        botReply = {
          type: 'bot',
          text: 'Any blockers or impediments?',
          timestamp: time,
        };
        nextStage = 'blockers';
      } else {
        /* After blockers, show team responses */
        botReply = {
          type: 'bot',
          text: "Thanks! Here's what the rest of the team reported:",
          timestamp: time,
        };
        nextStage = 'done';
      }

      /* Build final message list with team responses if done */
      const newMessages: Message[] = [userMsg, botReply];
      if (nextStage === 'done') {
        /* Add 3-4 random team member responses */
        const shuffledMembers = [...TEAM_MEMBERS].sort(() => Math.random() - 0.5);
        const shuffledResponses = [...TEAM_RESPONSES].sort(() => Math.random() - 0.5);
        const count = 3 + Math.floor(Math.random() * 2);
        for (let i = 0; i < count; i++) {
          newMessages.push({
            type: 'team',
            member: shuffledMembers[i],
            response: shuffledResponses[i],
            timestamp: time,
          });
        }
      }

      setMessages((prev) => [...prev, ...newMessages]);
      setStage(nextStage);
    },
    [stage, userResponses],
  );

  /* Reset the standup */
  const reset = () => {
    setMessages([
      {
        type: 'bot',
        text: "Good morning! It's time for your daily standup. What did you work on yesterday?",
        timestamp: formatTime(),
      },
    ]);
    setStage('yesterday');
    setUserResponses({ yesterday: '', today: '', blockers: '' });
  };

  /* Current quick response options */
  const currentOptions = stage !== 'done' ? QUICK_RESPONSES[stage] : [];

  return (
    <div className="mb-8" style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid #522653' }}>
      {/* Slack-style top bar */}
      <div
        style={{
          background: '#350d36',
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: '#e8e8e8', fontSize: 15, fontWeight: 700, fontFamily: 'Lato, -apple-system, sans-serif' }}>
            # daily-standup
          </span>
          <span style={{ color: '#b0a8b0', fontSize: 12 }}>|</span>
          <span style={{ color: '#b0a8b0', fontSize: 12, fontFamily: 'Lato, sans-serif' }}>
            {TEAM_MEMBERS.length + 1} members
          </span>
        </div>
        {stage === 'done' && (
          <button
            onClick={reset}
            style={{
              background: 'rgba(255,255,255,0.1)',
              color: '#e8e8e8',
              border: 'none',
              borderRadius: 4,
              padding: '4px 10px',
              fontSize: 11,
              cursor: 'pointer',
              fontFamily: 'Lato, sans-serif',
            }}
          >
            New Standup
          </button>
        )}
      </div>

      {/* Slack sidebar + messages layout */}
      <div style={{ display: 'flex', minHeight: 380 }}>
        {/* Sidebar */}
        <div
          style={{
            width: 180,
            background: '#3f0e40',
            padding: '12px 0',
            flexShrink: 0,
          }}
        >
          {/* Channels */}
          <div style={{ padding: '0 12px', marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#b0a8b0', marginBottom: 8, fontFamily: 'Lato, sans-serif' }}>
              Channels
            </div>
            {['general', 'daily-standup', 'random', 'dev-null', 'complaints'].map((ch) => (
              <div
                key={ch}
                style={{
                  fontSize: 13,
                  padding: '3px 8px',
                  borderRadius: 4,
                  color: ch === 'daily-standup' ? '#fff' : '#b0a8b0',
                  background: ch === 'daily-standup' ? '#1164a3' : 'transparent',
                  cursor: 'pointer',
                  fontFamily: 'Lato, sans-serif',
                  marginBottom: 1,
                }}
              >
                # {ch}
              </div>
            ))}
          </div>

          {/* Online members */}
          <div style={{ padding: '0 12px' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#b0a8b0', marginBottom: 8, fontFamily: 'Lato, sans-serif' }}>
              Direct Messages
            </div>
            {TEAM_MEMBERS.slice(0, 3).map((m) => (
              <div
                key={m.name}
                style={{
                  fontSize: 13,
                  padding: '3px 8px',
                  color: '#b0a8b0',
                  fontFamily: 'Lato, sans-serif',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  marginBottom: 1,
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#2bac76',
                    display: 'inline-block',
                  }}
                />
                {m.name.split(' ')[0]}
              </div>
            ))}
          </div>
        </div>

        {/* Message area */}
        <div style={{ flex: 1, background: '#1a1d21', display: 'flex', flexDirection: 'column' }}>
          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.2 }}
                  style={{ marginBottom: 16 }}
                >
                  {msg.type === 'bot' && (
                    <div style={{ display: 'flex', gap: 10 }}>
                      {/* Bot avatar */}
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 4,
                          background: '#4a154b',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <span style={{ fontSize: 18 }}>{'\u{1F916}'}</span>
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span style={{ fontWeight: 700, fontSize: 14, color: '#d1d2d3', fontFamily: 'Lato, sans-serif' }}>
                            StandupBot
                          </span>
                          <span
                            style={{
                              fontSize: 10,
                              padding: '1px 4px',
                              background: 'rgba(29,155,209,0.2)',
                              color: '#1d9bd1',
                              borderRadius: 3,
                              fontWeight: 600,
                            }}
                          >
                            APP
                          </span>
                          <span style={{ fontSize: 11, color: '#616061' }}>{msg.timestamp}</span>
                        </div>
                        <div style={{ fontSize: 14, color: '#d1d2d3', lineHeight: 1.5, fontFamily: 'Lato, sans-serif' }}>
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  )}

                  {msg.type === 'user' && (
                    <div style={{ display: 'flex', gap: 10 }}>
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 4,
                          background: '#2eb67d',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontSize: 13,
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        You
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span style={{ fontWeight: 700, fontSize: 14, color: '#d1d2d3', fontFamily: 'Lato, sans-serif' }}>
                            You
                          </span>
                          <span style={{ fontSize: 11, color: '#616061' }}>{msg.timestamp}</span>
                        </div>
                        <div style={{ fontSize: 14, color: '#d1d2d3', lineHeight: 1.5, fontFamily: 'Lato, sans-serif' }}>
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  )}

                  {msg.type === 'team' && (
                    <div style={{ display: 'flex', gap: 10 }}>
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 4,
                          background: msg.member.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontSize: 12,
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {msg.member.avatar}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span style={{ fontWeight: 700, fontSize: 14, color: '#d1d2d3', fontFamily: 'Lato, sans-serif' }}>
                            {msg.member.name}
                          </span>
                          <span style={{ fontSize: 11, color: '#616061' }}>{msg.timestamp}</span>
                        </div>
                        {/* Standup response formatted */}
                        <div
                          style={{
                            fontSize: 13,
                            color: '#d1d2d3',
                            lineHeight: 1.6,
                            fontFamily: 'Lato, sans-serif',
                            borderLeft: '3px solid #4a154b',
                            paddingLeft: 10,
                          }}
                        >
                          <div>
                            <strong style={{ color: '#1d9bd1' }}>Yesterday:</strong> {msg.response.yesterday}
                          </div>
                          <div>
                            <strong style={{ color: '#2eb67d' }}>Today:</strong> {msg.response.today}
                          </div>
                          <div>
                            <strong style={{ color: '#e01e5a' }}>Blockers:</strong> {msg.response.blockers}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Quick response buttons (like Slack message shortcuts) */}
          {stage !== 'done' && (
            <div
              style={{
                borderTop: '1px solid #313335',
                padding: '12px 20px',
                background: '#222529',
              }}
            >
              <div style={{ fontSize: 11, color: '#616061', marginBottom: 8, fontFamily: 'Lato, sans-serif' }}>
                {stage === 'yesterday' && 'What did you work on yesterday?'}
                {stage === 'today' && 'What will you work on today?'}
                {stage === 'blockers' && 'Any blockers?'}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {currentOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => selectResponse(option)}
                    style={{
                      background: '#1a1d21',
                      border: '1px solid #393b3d',
                      color: '#d1d2d3',
                      borderRadius: 16,
                      padding: '5px 12px',
                      fontSize: 12,
                      cursor: 'pointer',
                      fontFamily: 'Lato, sans-serif',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#2a2d31';
                      e.currentTarget.style.borderColor = '#565759';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#1a1d21';
                      e.currentTarget.style.borderColor = '#393b3d';
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
