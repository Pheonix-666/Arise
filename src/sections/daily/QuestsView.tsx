'use client';

import React, { useState } from 'react';
import { useStore, DIFFICULTY_XP } from '@/store/useStore';
import { TaskDifficulty } from '@/types';
import {
  ListTodo,
  Plus,
  CheckCircle,
  Trash2,
  ShieldAlert,
} from 'lucide-react';

export default function QuestsView() {
  const { quests, addQuest, completeQuest, removeQuest } = useStore();

  const [filter, setFilter] = useState<'active' | 'cleared' | 'all'>('active');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDifficulty, setNewDifficulty] = useState<TaskDifficulty>('D');

  const visibleQuests = quests.filter((q) => {
    if (filter === 'active') return !q.completed;
    if (filter === 'cleared') return q.completed;
    return true;
  });

  const activeCount = quests.filter((q) => !q.completed).length;
  const clearedCount = quests.filter((q) => q.completed).length;

  const handleCreateQuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addQuest(newTitle, newDesc, newDifficulty);
    setNewTitle('');
    setNewDesc('');
    setNewDifficulty('D');
    setShowAddModal(false);
  };

  return (
    <div style={{ width: '100%' }}>
      {/* System Warning Header Banner */}
      <div className="quest-banner">
        <div style={{ padding: '8px', borderRadius: '4px', background: 'rgba(255,0,51,0.15)', color: 'var(--crimson-accent)' }}>
          <ShieldAlert size={26} />
        </div>
        <div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 800, color: 'var(--crimson-accent)', letterSpacing: '1px' }}>
            [ SYSTEM QUEST LOG // PENALTY WARNING ]
          </span>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
            Daily Quest: Preparation for Getting Stronger
          </h2>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '4px', lineHeight: 1.5 }}>
            Warning: Failure to complete daily objectives will result in automatic transfer to the Penalty Zone. Consistent execution yields permanent stat consolidation.
          </p>
        </div>
      </div>

      {/* Metrics & Filter Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '18px' }}>
        <div className="subtab-bar" style={{ marginBottom: 0 }}>
          <button
            onClick={() => setFilter('active')}
            className={`subtab-btn ${filter === 'active' ? 'active' : ''}`}
          >
            ACTIVE OBJECTIVES ({activeCount})
          </button>

          <button
            onClick={() => setFilter('cleared')}
            className={`subtab-btn ${filter === 'cleared' ? 'active' : ''}`}
          >
            CLEARED ({clearedCount})
          </button>

          <button
            onClick={() => setFilter('all')}
            className={`subtab-btn ${filter === 'all' ? 'active' : ''}`}
          >
            ALL ({quests.length})
          </button>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn-cyber-primary"
        >
          <Plus size={15} />
          INITIALIZE QUEST_
        </button>
      </div>

      {/* Quests List */}
      <div>
        {visibleQuests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', fontFamily: 'var(--font-mono)' }}>
            <ListTodo size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 12px' }} />
            <h3 style={{ color: '#fff', fontSize: '1rem' }}>NO QUESTS IN THIS CATEGORY</h3>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.75rem', marginTop: '4px' }}>
              Initialize a new daily objective or switch filters above.
            </p>
          </div>
        ) : (
          visibleQuests.map((quest) => (
            <div
              key={quest.id}
              className={`cyber-panel quest-item-card ${quest.completed ? 'cleared' : ''}`}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', flex: 1 }}>
                <span className={`rank-badge rank-${quest.difficulty}`} style={{ marginTop: '2px' }}>
                  {quest.difficulty}-RANK
                </span>

                <div>
                  <h4
                    style={{
                      fontSize: '1.05rem',
                      fontWeight: 700,
                      color: quest.completed ? 'var(--text-muted)' : '#fff',
                      textDecoration: quest.completed ? 'line-through' : 'none',
                    }}
                  >
                    {quest.title}
                  </h4>
                  {quest.description && (
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                      {quest.description}
                    </p>
                  )}
                  <span style={{ display: 'inline-block', marginTop: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--cyan-primary)', fontWeight: 800 }}>
                    REWARD: +{quest.xpReward} EXP
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {!quest.completed ? (
                  <button
                    onClick={() => completeQuest(quest.id)}
                    className="btn-cyber-primary"
                    style={{ padding: '8px 16px', fontSize: '0.75rem' }}
                  >
                    <CheckCircle size={14} />
                    CLAIM REWARD_
                  </button>
                ) : (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '3px', background: 'rgba(16,185,129,0.12)', color: 'var(--emerald-green)', border: '1px solid rgba(16,185,129,0.3)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 800 }}>
                    <CheckCircle size={14} /> CLEARED
                  </span>
                )}

                <button
                  onClick={() => removeQuest(quest.id)}
                  className="hud-icon-btn hud-icon-btn-danger"
                  style={{ padding: '8px' }}
                  title="Abandon Quest"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Quest Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="cyber-panel cyber-panel-corner modal-box" style={{ maxWidth: '480px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid var(--border-dim)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 800, color: 'var(--purple-secondary)' }}>
                [ INITIALIZE NEW SYSTEM OBJECTIVE ]
              </span>
              <button
                onClick={() => setShowAddModal(false)}
                className="hud-icon-btn"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateQuest} style={{ marginTop: '16px', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', color: 'var(--text-dim)', marginBottom: '4px' }}>
                  QUEST TITLE
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 100 Squats, Read 20 pages..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    background: 'rgba(0,0,0,0.6)',
                    border: '1px solid var(--border-dim)',
                    color: '#fff',
                    outline: 'none',
                    fontFamily: 'var(--font-mono)',
                  }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', color: 'var(--text-dim)', marginBottom: '4px' }}>
                  DESCRIPTION (OPTIONAL)
                </label>
                <textarea
                  rows={3}
                  placeholder="Specific rules, execution standards, or motivation..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    background: 'rgba(0,0,0,0.6)',
                    border: '1px solid var(--border-dim)',
                    color: '#fff',
                    outline: 'none',
                    resize: 'none',
                    fontFamily: 'var(--font-mono)',
                  }}
                />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', color: 'var(--text-dim)', marginBottom: '8px' }}>
                  DIFFICULTY RANK & EXP PAYOUT
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {(['E', 'D', 'C', 'B', 'A', 'S'] as const).map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setNewDifficulty(diff)}
                      className="hud-icon-btn"
                      style={{
                        padding: '10px 4px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        borderColor: newDifficulty === diff ? 'var(--purple-secondary)' : 'rgba(255,255,255,0.1)',
                        background: newDifficulty === diff ? 'rgba(139,92,246,0.2)' : 'rgba(0,0,0,0.4)',
                        color: newDifficulty === diff ? '#fff' : 'var(--text-dim)',
                      }}
                    >
                      <span className={`rank-badge rank-${diff}`} style={{ marginBottom: '4px' }}>
                        {diff}-RANK
                      </span>
                      <span style={{ color: 'var(--cyan-primary)', fontSize: '0.68rem', fontWeight: 700 }}>
                        +{DIFFICULTY_XP[diff]} XP
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '12px', borderTop: '1px solid var(--border-dim)' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-cyber-outline"
                >
                  CANCEL
                </button>

                <button
                  type="submit"
                  className="btn-cyber-primary"
                  style={{ background: 'var(--purple-secondary)', borderColor: 'var(--purple-secondary)', color: '#fff' }}
                >
                  DEPLOY QUEST_
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
