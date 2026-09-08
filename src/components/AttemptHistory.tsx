import React, { useState } from 'react';
import type { Attempt } from '../domain/types';
import { History, Clock, ChevronDown, ChevronUp, FileCode, Trash2 } from 'lucide-react';

interface AttemptHistoryProps {
  attempts: Attempt[];
  onSelectAttempt: (attempt: Attempt) => void;
  onClearHistory: () => void;
}

export const AttemptHistory: React.FC<AttemptHistoryProps> = ({
  attempts,
  onSelectAttempt,
  onClearHistory
}) => {
  const [expandedAttemptId, setExpandedAttemptId] = useState<string | null>(null);

  if (attempts.length === 0) {
    return (
      <div className="obsidian-card" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <History size={48} color="#707070" style={{ margin: '0 auto 16px' }} />
        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}>
          No practice attempts recorded yet
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '440px', margin: '0 auto' }}>
          Select a problem from the LLD Catalog, submit your domain solution, and observe your architectural score progression over time.
        </p>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#4ADE80';
    if (score >= 60) return '#FF7A00';
    return '#FF2D2D';
  };

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedAttemptId(prev => (prev === id ? null : id));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span className="badge-ember" style={{ marginBottom: '8px' }}>ITERATION LOGS</span>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.03em' }}>
            Attempt History & Progress Tracking
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Inspect iteration history, score improvements, and code evolution across submissions.
          </p>
        </div>
        <button
          onClick={onClearHistory}
          className="btn-obsidian"
          style={{ fontSize: '0.8rem', padding: '8px 16px', color: '#EF4444' }}
        >
          <Trash2 size={14} /> Clear History
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {attempts.map((attempt, index) => {
          const isExpanded = expandedAttemptId === attempt.id;
          const prevAttempt = attempts[index + 1];
          const scoreDelta = prevAttempt ? attempt.feedback.overallScore - prevAttempt.feedback.overallScore : null;

          return (
            <div
              key={attempt.id}
              className="obsidian-card"
              style={{
                padding: '20px 24px',
                borderLeft: `4px solid ${getScoreColor(attempt.feedback.overallScore)}`
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  
                  {/* Score pill */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '58px',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--surface-elevated)',
                    border: `1px solid ${getScoreColor(attempt.feedback.overallScore)}40`
                  }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 900, color: getScoreColor(attempt.feedback.overallScore) }}>
                      {attempt.feedback.overallScore}
                    </span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700 }}>SCORE</span>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF' }}>
                        {attempt.problemTitle}
                      </h4>
                      <span className="badge-dark" style={{ fontSize: '0.7rem' }}>
                        Attempt #{attempts.length - index}
                      </span>
                      {scoreDelta !== null && scoreDelta !== 0 && (
                        <span style={{
                          fontSize: '0.775rem',
                          fontWeight: 800,
                          color: scoreDelta > 0 ? '#4ADE80' : '#EF4444'
                        }}>
                          {scoreDelta > 0 ? `+${scoreDelta} pts` : `${scoreDelta} pts`}
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={13} /> {new Date(attempt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span>Verdict: <strong style={{ color: '#FFFFFF' }}>{attempt.feedback.verdict}</strong></span>
                      <span>Engine: <span style={{ textTransform: 'capitalize' }}>{attempt.feedback.evaluationSource}</span></span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    onClick={() => onSelectAttempt(attempt)}
                    className="btn-lava"
                    style={{ fontSize: '0.8rem', padding: '8px 16px' }}
                  >
                    View Feedback
                  </button>
                  <button
                    onClick={(e) => toggleExpand(attempt.id, e)}
                    className="btn-obsidian"
                    style={{ fontSize: '0.8rem', padding: '8px 14px' }}
                  >
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />} Code
                  </button>
                </div>
              </div>

              {/* Collapsible Submitted Code Snippet */}
              {isExpanded && (
                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px', fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                    <FileCode size={14} /> Submitted Solution Snapshot
                  </div>
                  <pre style={{
                    background: '#090909',
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)',
                    maxHeight: '280px',
                    overflowY: 'auto',
                    border: '1px solid var(--border-subtle)'
                  }}>
                    {attempt.solutionCode}
                  </pre>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
