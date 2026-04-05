/* ========================================
   CLI Mode — renders standup as terminal
   output mimicking git log, complete with
   ASCII art and fake command-line UI
   ======================================== */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { StandupResult } from '../data/standup-data';

interface Props {
  result: StandupResult | null;
  onGenerate: () => void;
}

/* --- Fake git log entries --- */
const GIT_LOG_ENTRIES = [
  { hash: 'a3f7c2d', message: 'Merge branch \'fix/the-thing\' into main', author: 'You', ago: '2 hours ago' },
  { hash: 'e91b4a8', message: 'Merge pull request #847 from feature/also-the-thing', author: 'You', ago: '3 hours ago' },
  { hash: '5d2f1c7', message: 'fix: resolve issue (unclear which one)', author: 'You', ago: '4 hours ago' },
  { hash: 'b8a3e6f', message: 'Merge branch \'main\' into main (yes, really)', author: 'You', ago: '5 hours ago' },
  { hash: '2c4d9b1', message: 'chore: update dependencies (fingers crossed)', author: 'Dependabot', ago: '6 hours ago' },
  { hash: '7f1a8e3', message: 'Revert "Revert "Add feature""', author: 'You', ago: 'yesterday' },
  { hash: 'c5b2d4a', message: 'WIP: do not merge (merged anyway)', author: 'Intern', ago: 'yesterday' },
  { hash: '9e6f3c8', message: 'fix: fix the fix that fixed the bug', author: 'You', ago: '2 days ago' },
  { hash: '1a7b5d2', message: 'refactor: move code to different folder (progress)', author: 'You', ago: '2 days ago' },
  { hash: '4c8e2f6', message: 'Merge branch \'main\' of github.com into main', author: 'You', ago: '3 days ago' },
];

/* --- Terminal command outputs --- */
function getStandupCliOutput(result: StandupResult): string[] {
  return [
    '',
    '$ standup-cli generate --format=convincing --effort=minimal',
    '',
    '\x1b[36m====================================\x1b[0m',
    '\x1b[36m  STANDUP REPORT — ' + new Date().toLocaleDateString() + '\x1b[0m',
    '\x1b[36m====================================\x1b[0m',
    '',
    '\x1b[33mYesterday:\x1b[0m',
    '  ' + result.yesterday,
    '',
    '\x1b[32mToday:\x1b[0m',
    '  ' + result.today,
    '',
    '\x1b[31mBlockers:\x1b[0m',
    '  ' + result.blocker,
    '',
    '\x1b[35mMood:\x1b[0m ' + result.mood.emoji + ' ' + result.mood.label,
    '',
    '\x1b[2m---\x1b[0m',
    '\x1b[2mGenerated in 0.' + (Math.floor(Math.random() * 900) + 100) + 's | Believability: HIGH\x1b[0m',
    '\x1b[2mTip: pipe to Slack with `standup-cli generate | slack-post #daily-standup`\x1b[0m',
    '',
  ];
}

function getGitLogOutput(): string[] {
  return [
    '',
    '$ git log --oneline --author="You" -10',
    '',
    ...GIT_LOG_ENTRIES.map((e) =>
      `\x1b[33m${e.hash}\x1b[0m ${e.message} \x1b[2m(${e.author}, ${e.ago})\x1b[0m`
    ),
    '',
    '\x1b[2m// Your git log says more about your work than your standup ever will.\x1b[0m',
    '',
  ];
}

function getStatusOutput(): string[] {
  return [
    '',
    '$ standup-cli status',
    '',
    '  Standups generated today:    too many',
    '  Actual work done today:      undefined',
    '  Meetings survived:           3/7',
    '  PRs reviewed (actually):     0',
    '  PRs "reviewed" (approved):   12',
    '  Coffee consumed:             4 cups',
    '  Existential dread level:     ELEVATED',
    '  Sprint velocity:             vibes-based',
    '',
    '\x1b[2mRun `standup-cli generate` to create another excuse.\x1b[0m',
    '',
  ];
}

/* Parse ANSI-like color codes to styled spans */
function parseAnsi(text: string): JSX.Element {
  const parts: JSX.Element[] = [];
  let remaining = text;
  let key = 0;

  const COLOR_MAP: Record<string, string> = {
    '31': '#f85149',  // red
    '32': '#3fb950',  // green
    '33': '#d29922',  // yellow
    '35': '#bc8cff',  // magenta
    '36': '#00ffff',  // cyan
    '2': '#484f58',   // dim
  };

  while (remaining.length > 0) {
    const escIndex = remaining.indexOf('\x1b[');
    if (escIndex === -1) {
      parts.push(<span key={key++}>{remaining}</span>);
      break;
    }

    /* Text before escape */
    if (escIndex > 0) {
      parts.push(<span key={key++}>{remaining.slice(0, escIndex)}</span>);
    }

    /* Find the end of escape code */
    const endIndex = remaining.indexOf('m', escIndex);
    if (endIndex === -1) {
      parts.push(<span key={key++}>{remaining.slice(escIndex)}</span>);
      break;
    }

    const code = remaining.slice(escIndex + 2, endIndex);
    remaining = remaining.slice(endIndex + 1);

    /* Reset code */
    if (code === '0') continue;

    /* Find colored text until next escape or end */
    const nextEsc = remaining.indexOf('\x1b[');
    const coloredText = nextEsc === -1 ? remaining : remaining.slice(0, nextEsc);
    const color = COLOR_MAP[code] || '#e6edf3';

    parts.push(
      <span key={key++} style={{ color }}>
        {coloredText}
      </span>,
    );

    remaining = nextEsc === -1 ? '' : remaining.slice(nextEsc);
  }

  return <>{parts}</>;
}

export default function CliMode({ result, onGenerate }: Props) {
  const [active, setActive] = useState(false);
  const [lines, setLines] = useState<string[]>([]);
  const [displayedCount, setDisplayedCount] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* Initial terminal content */
  useEffect(() => {
    if (active && lines.length === 0) {
      const initial = [
        'standup-cli v6.6.6',
        'Type "help" for available commands.',
        '',
        '$ _',
      ];
      setLines(initial);
      setDisplayedCount(initial.length);
    }
  }, [active, lines.length]);

  /* Animate new lines appearing */
  useEffect(() => {
    if (displayedCount < lines.length) {
      const timer = setTimeout(() => {
        setDisplayedCount((c) => c + 1);
      }, 30);
      return () => clearTimeout(timer);
    }
  }, [displayedCount, lines.length]);

  /* Auto-scroll terminal */
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [displayedCount]);

  /* Execute a command */
  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    let output: string[];

    switch (trimmed) {
      case 'generate':
      case 'standup-cli generate':
        onGenerate();
        if (result) {
          output = getStandupCliOutput(result);
        } else {
          output = ['', '\x1b[33mGenerating standup... Press generate in the main UI first.\x1b[0m', ''];
        }
        break;
      case 'git log':
      case 'log':
        output = getGitLogOutput();
        break;
      case 'status':
        output = getStatusOutput();
        break;
      case 'help':
        output = [
          '',
          'Available commands:',
          '',
          '  generate    Generate a convincing standup update',
          '  log         Show your git log (all merge commits)',
          '  status      Check your standup metrics',
          '  clear       Clear terminal',
          '  exit        Exit CLI mode',
          '  help        Show this help',
          '',
          '\x1b[2mPro tip: none of these commands will make you productive.\x1b[0m',
          '',
        ];
        break;
      case 'clear':
        setLines(['$ _']);
        setDisplayedCount(1);
        return;
      case 'exit':
        setActive(false);
        setLines([]);
        setDisplayedCount(0);
        return;
      default:
        output = [
          '',
          `\x1b[31mCommand not found: ${cmd}\x1b[0m`,
          '\x1b[2mTry "help" for available commands.\x1b[0m',
          '',
        ];
    }

    setLines((prev) => {
      const withoutCursor = prev.slice(0, -1);
      return [...withoutCursor, `$ ${cmd}`, ...output, '$ _'];
    });
    setDisplayedCount((c) => c); // Will animate new lines
    setInputValue('');
  };

  /* Update CLI output when result changes */
  useEffect(() => {
    if (active && result && lines.length > 4) {
      /* Auto-show the new standup */
      const output = getStandupCliOutput(result);
      setLines((prev) => {
        const withoutCursor = prev.slice(0, -1);
        return [...withoutCursor, '$ generate', ...output, '$ _'];
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  /* Handle keypress in input */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      executeCommand(inputValue);
    }
  };

  if (!active) {
    return (
      <div className="mb-6 text-center">
        <button
          onClick={() => setActive(true)}
          className="bg-transparent border border-cyan-400/15 text-cyan-400/30 font-mono text-[0.6rem] py-2 px-6 cursor-pointer tracking-[3px] hover:bg-cyan-400/[0.05] transition-all"
        >
          CLI MODE
        </button>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="mb-8"
      >
        {/* Terminal window chrome */}
        <div
          style={{
            background: '#1e1e1e',
            borderRadius: 8,
            overflow: 'hidden',
            border: '1px solid #333',
            fontFamily: '"SF Mono", "Fira Code", "Cascadia Code", monospace',
          }}
        >
          {/* Title bar */}
          <div
            style={{
              background: '#2d2d2d',
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', gap: 6 }}>
              <div
                style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f56', cursor: 'pointer' }}
                onClick={() => { setActive(false); setLines([]); setDisplayedCount(0); }}
              />
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e' }} />
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#27c93f' }} />
            </div>
            <div style={{ fontSize: 11, color: '#888', fontFamily: '-apple-system, sans-serif' }}>
              standup-cli -- zsh -- 80x24
            </div>
            <div style={{ width: 42 }} />
          </div>

          {/* Terminal content */}
          <div
            ref={terminalRef}
            style={{
              padding: '12px 16px',
              minHeight: 300,
              maxHeight: 450,
              overflowY: 'auto',
              fontSize: 13,
              lineHeight: 1.6,
              color: '#e6edf3',
              cursor: 'text',
            }}
            onClick={() => inputRef.current?.focus()}
          >
            {lines.slice(0, displayedCount).map((line, i) => {
              /* Replace cursor placeholder with input */
              if (line === '$ _' && i === displayedCount - 1) {
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: '#3fb950' }}>$ </span>
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#e6edf3',
                        fontFamily: 'inherit',
                        fontSize: 'inherit',
                        outline: 'none',
                        width: '100%',
                        padding: 0,
                        caretColor: '#00ffff',
                      }}
                      autoFocus
                    />
                  </div>
                );
              }

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.05 }}
                  style={{ minHeight: line === '' ? 16 : undefined }}
                >
                  {line.startsWith('$ ') ? (
                    <>
                      <span style={{ color: '#3fb950' }}>$ </span>
                      {parseAnsi(line.slice(2))}
                    </>
                  ) : (
                    parseAnsi(line)
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
