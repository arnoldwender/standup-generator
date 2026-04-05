/* ========================================
   Jira Board Simulation — pixel-perfect
   kanban board with draggable tickets,
   story points, sprints, and absurd labels
   ======================================== */

import { useState, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';

/* --- Ticket label definitions --- */
interface JiraLabel {
  text: string;
  bg: string;
  color: string;
}

const LABELS: JiraLabel[] = [
  { text: 'tech-debt', bg: '#e8f0fe', color: '#1a73e8' },
  { text: 'probably-fine', bg: '#fef7e0', color: '#e37400' },
  { text: 'dont-ask', bg: '#fce8e6', color: '#d93025' },
  { text: 'legacy', bg: '#e6f4ea', color: '#137333' },
  { text: 'haunted', bg: '#f3e8fd', color: '#8430ce' },
  { text: 'needs-prayer', bg: '#fce8e6', color: '#d93025' },
  { text: 'works-locally', bg: '#e8f0fe', color: '#1a73e8' },
  { text: 'blame-the-intern', bg: '#fef7e0', color: '#e37400' },
];

/* --- Ticket data --- */
interface JiraTicket {
  id: string;
  key: string;
  title: string;
  assignee: string;
  avatar: string;
  points: string;
  labels: JiraLabel[];
  priority: 'highest' | 'high' | 'medium' | 'low';
}

/* Priority icons matching Jira's style */
const PRIORITY_ICONS: Record<string, { color: string; arrow: string }> = {
  highest: { color: '#d93025', arrow: '\u2191\u2191' },
  high: { color: '#e37400', arrow: '\u2191' },
  medium: { color: '#e37400', arrow: '\u2192' },
  low: { color: '#1a73e8', arrow: '\u2193' },
};

/* Pick random items from array */
function pickRandom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/* --- Generate realistic-looking Jira tickets --- */
const TICKET_TITLES = [
  'Investigate why the thing does the thing',
  'Refactor the refactored refactor',
  'Fix bug introduced by last bug fix',
  'Update dependencies (pray nothing breaks)',
  'Add loading spinner to loading spinner',
  'Remove unused code (is it unused though?)',
  'Migrate to new framework (again)',
  'Investigate mysterious 3am cron job',
  'Fix CSS that works in Chrome but not Safari',
  'Add error handling to error handler',
  'Implement feature nobody requested',
  'Debug why tests pass locally but fail in CI',
  'Address tech debt from 2019 (still growing)',
  'Investigate memory leak (or is it a feature?)',
  'Revert revert of revert',
  'Add comments to uncommented code',
  'Fix race condition in single-threaded code',
  'Optimize query that runs once per quarter',
  'Update README (it was never accurate)',
  'Remove TODO comments older than the intern',
];

const ASSIGNEES = [
  { name: 'Alex M.', avatar: 'AM' },
  { name: 'Jordan K.', avatar: 'JK' },
  { name: 'Sam P.', avatar: 'SP' },
  { name: 'Riley T.', avatar: 'RT' },
  { name: 'Casey L.', avatar: 'CL' },
  { name: 'Unassigned', avatar: '?' },
];

function generateTickets(count: number, startId: number): JiraTicket[] {
  const shuffled = [...TICKET_TITLES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((title, i) => {
    const assignee = ASSIGNEES[Math.floor(Math.random() * ASSIGNEES.length)];
    const priorities: JiraTicket['priority'][] = ['highest', 'high', 'medium', 'low'];
    return {
      id: `ticket-${startId + i}`,
      key: `PROJ-${2840 + startId + i}`,
      title,
      assignee: assignee.name,
      avatar: assignee.avatar,
      points: '?',
      labels: pickRandom(LABELS, Math.floor(Math.random() * 2) + 1),
      priority: priorities[Math.floor(Math.random() * priorities.length)],
    };
  });
}

/* --- Column definitions --- */
type ColumnId = 'yesterday' | 'today' | 'blockers';

interface Column {
  id: ColumnId;
  title: string;
  subtitle: string;
  tickets: JiraTicket[];
  headerColor: string;
}

export default function JiraBoard() {
  const [columns, setColumns] = useState<Column[]>(() => [
    {
      id: 'yesterday',
      title: 'Yesterday',
      subtitle: 'Done (allegedly)',
      tickets: generateTickets(3, 0),
      headerColor: '#0052cc',
    },
    {
      id: 'today',
      title: 'Today',
      subtitle: 'In Progress (theoretically)',
      tickets: generateTickets(4, 10),
      headerColor: '#0065ff',
    },
    {
      id: 'blockers',
      title: 'Blockers',
      subtitle: 'Existential threats',
      tickets: generateTickets(2, 20),
      headerColor: '#de350b',
    },
  ]);

  /* Drag-and-drop handler */
  const onDragEnd = useCallback((result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    setColumns((prev) => {
      const next = prev.map((col) => ({ ...col, tickets: [...col.tickets] }));
      const sourceCol = next.find((c) => c.id === source.droppableId)!;
      const destCol = next.find((c) => c.id === destination.droppableId)!;
      const [moved] = sourceCol.tickets.splice(source.index, 1);
      destCol.tickets.splice(destination.index, 0, moved);
      return next;
    });
  }, []);

  /* Shuffle tickets for a fresh board */
  const shuffle = () => {
    setColumns((prev) =>
      prev.map((col, i) => ({
        ...col,
        tickets: generateTickets(col.id === 'blockers' ? 2 : col.id === 'yesterday' ? 3 : 4, i * 10),
      })),
    );
  };

  return (
    <div className="mb-8">
      {/* Jira-style header bar */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '8px 8px 0 0',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #dfe1e6',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Jira-style logo */}
          <div
            style={{
              width: 24,
              height: 24,
              background: 'linear-gradient(135deg, #2684ff, #0052cc)',
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            J
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#172b4d', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
              Sprint 47 — The Reckoning
            </div>
            <div style={{ fontSize: 11, color: '#5e6c84', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
              PROJ Board &middot; 9 issues &middot; 0 story points estimated
            </div>
          </div>
        </div>
        <button
          onClick={shuffle}
          style={{
            background: '#0052cc',
            color: '#fff',
            border: 'none',
            borderRadius: 3,
            padding: '6px 12px',
            fontSize: 12,
            cursor: 'pointer',
            fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: 500,
          }}
        >
          Shuffle Board
        </button>
      </div>

      {/* Board columns */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 0,
            background: '#f4f5f7',
            borderRadius: '0 0 8px 8px',
            padding: 8,
            minHeight: 320,
          }}
        >
          {columns.map((col) => (
            <div key={col.id} style={{ padding: 4 }}>
              {/* Column header */}
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  color: '#5e6c84',
                  padding: '8px 8px 6px',
                  fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>{col.title}</span>
                <span
                  style={{
                    background: '#dfe1e6',
                    borderRadius: 10,
                    padding: '1px 7px',
                    fontSize: 11,
                    fontWeight: 600,
                    color: '#5e6c84',
                  }}
                >
                  {col.tickets.length}
                </span>
              </div>

              {/* Column subtitle */}
              <div
                style={{
                  fontSize: 10,
                  color: '#97a0af',
                  padding: '0 8px 8px',
                  fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
                  fontStyle: 'italic',
                }}
              >
                {col.subtitle}
              </div>

              {/* Droppable area */}
              <Droppable droppableId={col.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{
                      minHeight: 200,
                      background: snapshot.isDraggingOver ? '#e2e4ea' : 'transparent',
                      borderRadius: 4,
                      transition: 'background 0.2s',
                      padding: 2,
                    }}
                  >
                    {col.tickets.map((ticket, index) => (
                      <Draggable key={ticket.id} draggableId={ticket.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              ...provided.draggableProps.style,
                              background: '#ffffff',
                              borderRadius: 3,
                              padding: '10px 10px 8px',
                              marginBottom: 6,
                              boxShadow: snapshot.isDragging
                                ? '0 8px 16px rgba(0,0,0,0.15)'
                                : '0 1px 2px rgba(9,30,66,0.13)',
                              border: '1px solid transparent',
                              borderLeftColor: col.id === 'blockers' ? '#de350b' : 'transparent',
                              borderLeftWidth: col.id === 'blockers' ? 3 : 1,
                              cursor: 'grab',
                              fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
                            }}
                          >
                            {/* Ticket title */}
                            <div style={{ fontSize: 13, color: '#172b4d', lineHeight: 1.4, marginBottom: 8, fontWeight: 400 }}>
                              {ticket.title}
                            </div>

                            {/* Labels */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
                              {ticket.labels.map((label, li) => (
                                <span
                                  key={li}
                                  style={{
                                    fontSize: 10,
                                    padding: '1px 6px',
                                    borderRadius: 3,
                                    background: label.bg,
                                    color: label.color,
                                    fontWeight: 600,
                                  }}
                                >
                                  {label.text}
                                </span>
                              ))}
                            </div>

                            {/* Footer: key, priority, points, assignee */}
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                fontSize: 11,
                                color: '#5e6c84',
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                {/* Priority icon */}
                                <span style={{ color: PRIORITY_ICONS[ticket.priority].color, fontWeight: 700, fontSize: 12 }}>
                                  {PRIORITY_ICONS[ticket.priority].arrow}
                                </span>
                                {/* Ticket key */}
                                <span style={{ fontWeight: 500 }}>{ticket.key}</span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                {/* Story points */}
                                <span
                                  style={{
                                    background: '#dfe1e6',
                                    borderRadius: 10,
                                    padding: '0px 6px',
                                    fontSize: 10,
                                    fontWeight: 600,
                                    color: '#5e6c84',
                                  }}
                                >
                                  {ticket.points} SP
                                </span>
                                {/* Assignee avatar */}
                                <div
                                  style={{
                                    width: 22,
                                    height: 22,
                                    borderRadius: '50%',
                                    background: ticket.assignee === 'Unassigned' ? '#dfe1e6' : '#0052cc',
                                    color: ticket.assignee === 'Unassigned' ? '#97a0af' : '#fff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 9,
                                    fontWeight: 700,
                                  }}
                                  title={ticket.assignee}
                                >
                                  {ticket.avatar}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* Jira-style footer */}
      <div
        style={{
          background: '#f4f5f7',
          borderRadius: '0 0 8px 8px',
          padding: '6px 16px',
          borderTop: '1px solid #dfe1e6',
          fontSize: 10,
          color: '#97a0af',
          fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span>Sprint ends: When morale improves</span>
        <span>Velocity: vibes-based</span>
      </div>
    </div>
  );
}
