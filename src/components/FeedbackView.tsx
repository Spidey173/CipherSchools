import React from 'react';
import type { DesignFeedback } from '../domain/types';
import { CheckCircle2, Zap, ShieldCheck, ArrowUpRight, Cpu, Flame } from 'lucide-react';

interface FeedbackViewProps {
  feedback: DesignFeedback | null;
  isEvaluating: boolean;
  onRetry: () => void;
}

export const FeedbackView: React.FC<FeedbackViewProps> = ({ feedback, isEvaluating, onRetry }) => {
  if (isEvaluating) {
    return (
      <div className="obsidian-card" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div style={{
          width: '60px',
          height: '60px',
          margin: '0 auto 24px',
          border: '3px solid rgba(255, 45, 45, 0.2)',
          borderTopColor: 'var(--molten-red)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}>
          Forging Architectural Evaluation...
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '520px', margin: '0 auto' }}>
          Executing deterministic AST scans, encapsulation analysis, and LLM semantic trade-off synthesis with volcanic precision.
        </p>
      </div>
    );
  }

  if (!feedback) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#4ADE80';
    if (score >= 60) return '#FF7A00';
    return '#FF2D2D';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Banner: Score & Engine Info */}
      <div className="obsidian-card" style={{
        padding: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '24px',
        background: 'linear-gradient(135deg, #181818 0%, #0F0F10 100%)',
        border: '1px solid var(--border-magma)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          
          {/* Radial score circle with Molten Edge */}
          <div style={{
            width: '94px',
            height: '94px',
            borderRadius: '50%',
            background: `radial-gradient(closest-side, #090909 78%, transparent 80% 100%), conic-gradient(${getScoreColor(feedback.overallScore)} ${feedback.overallScore}%, rgba(255,255,255,0.08) 0)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            boxShadow: `0 0 28px ${getScoreColor(feedback.overallScore)}40`
          }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 900, color: getScoreColor(feedback.overallScore), lineHeight: 1 }}>
              {feedback.overallScore}
            </span>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700 }}>/ 100</span>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF' }}>
                Architectural Evaluation
              </h2>
              <span className="badge-ember">
                <Flame size={12} /> {feedback.verdict}
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '640px' }}>
              {feedback.summary}
            </p>
          </div>
        </div>

        {/* Engine Origin & Retry Action */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--surface-elevated)', padding: '8px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <Cpu size={14} color="var(--molten-red)" />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Engine: <strong style={{ color: '#FFFFFF', textTransform: 'capitalize' }}>{feedback.evaluationSource}</strong> ({feedback.latencyMs}ms)
            </span>
          </div>
          <button onClick={onRetry} className="btn-lava" style={{ fontSize: '0.8rem', padding: '8px 16px' }}>
            Refine & Try Again
          </button>
        </div>
      </div>

      {/* SOLID Principles Radar Cards */}
      <div className="obsidian-card" style={{ padding: '28px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={18} color="var(--molten-red)" /> SOLID Principles Analysis
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
          {Object.entries(feedback.solidAnalysis).map(([principle, data]) => {
            const acronymMap: Record<string, string> = {
              singleResponsibility: 'SRP (Single Responsibility)',
              openClosed: 'OCP (Open / Closed)',
              liskovSubstitution: 'LSP (Liskov Substitution)',
              interfaceSegregation: 'ISP (Interface Segregation)',
              dependencyInversion: 'DIP (Dependency Inversion)'
            };

            return (
              <div
                key={principle}
                style={{
                  background: 'var(--surface-elevated)',
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.775rem', fontWeight: 700, color: '#FFFFFF' }}>
                    {acronymMap[principle] || principle}
                  </span>
                  <span style={{ fontSize: '0.825rem', fontWeight: 800, color: getScoreColor(data.score) }}>
                    {data.score}%
                  </span>
                </div>

                <div className="lava-progress-track" style={{ height: '4px' }}>
                  <div style={{ height: '100%', width: `${data.score}%`, background: getScoreColor(data.score) }} />
                </div>

                <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                  {data.comment}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Strengths & Actionable Recommendations */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
        
        {/* Strengths Card */}
        <div className="obsidian-card" style={{ padding: '28px' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#4ADE80', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={18} /> Strengths & Design Patterns
          </h4>

          {feedback.designPatternsDetected.length > 0 && (
            <div style={{ marginBottom: '16px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {feedback.designPatternsDetected.map(p => (
                <span key={p} className="badge-ember" style={{ fontSize: '0.75rem' }}>
                  <Zap size={11} /> {p}
                </span>
              ))}
            </div>
          )}

          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {feedback.strengths.map((s, i) => (
              <li key={i} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{ color: '#4ADE80', fontWeight: 'bold' }}>✓</span> {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Actionable Recommendations */}
        <div className="obsidian-card" style={{ padding: '28px' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#FF7A00', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowUpRight size={18} /> Actionable Recommendations
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {feedback.actionableImprovements.map((act, i) => (
              <li key={i} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{ color: '#FF7A00', fontWeight: 'bold' }}>•</span> {act}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Trade-off Commentary */}
      {feedback.tradeOffAnalysis && (
        <div className="obsidian-card" style={{ padding: '24px 28px', borderLeft: '4px solid var(--molten-red)' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FF2D2D', marginBottom: '8px' }}>
            Architectural Trade-Off Commentary
          </h4>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {feedback.tradeOffAnalysis}
          </p>
        </div>
      )}
    </div>
  );
};
