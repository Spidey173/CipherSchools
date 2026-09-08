import React, { useState } from 'react';
import type { Problem } from '../domain/types';
import { BookOpen, Sparkles, RefreshCw, FileCode, HelpCircle, Flame } from 'lucide-react';

interface WorkspaceProps {
  problem: Problem;
  code: string;
  onChangeCode: (code: string) => void;
  onSubmit: () => void;
  isEvaluating: boolean;
  onLoadStarter: () => void;
  onLoadSolution: () => void;
}

export const Workspace: React.FC<WorkspaceProps> = ({
  problem,
  code,
  onChangeCode,
  onSubmit,
  isEvaluating,
  onLoadStarter,
  onLoadSolution
}) => {
  const [activeTab, setActiveTab] = useState<'requirements' | 'design-questions' | 'reference'>('requirements');

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(360px, 1fr) minmax(440px, 1.4fr)', gap: '20px', height: 'calc(100vh - 180px)', minHeight: '660px' }}>
      
      {/* Left Pane: Context, Requirements, and Architectural Questions */}
      <div className="obsidian-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* Tab Headers */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', background: 'rgba(9,9,9,0.7)' }}>
          <button
            onClick={() => setActiveTab('requirements')}
            style={{
              flex: 1,
              padding: '14px',
              fontSize: '0.8rem',
              fontWeight: 600,
              background: activeTab === 'requirements' ? 'rgba(255,45,45,0.1)' : 'transparent',
              color: activeTab === 'requirements' ? '#FFFFFF' : 'var(--text-muted)',
              border: 'none',
              borderBottom: activeTab === 'requirements' ? '2px solid var(--molten-red)' : '2px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <BookOpen size={14} /> Requirements
          </button>
          <button
            onClick={() => setActiveTab('design-questions')}
            style={{
              flex: 1,
              padding: '14px',
              fontSize: '0.8rem',
              fontWeight: 600,
              background: activeTab === 'design-questions' ? 'rgba(255,45,45,0.1)' : 'transparent',
              color: activeTab === 'design-questions' ? '#FFFFFF' : 'var(--text-muted)',
              border: 'none',
              borderBottom: activeTab === 'design-questions' ? '2px solid var(--molten-red)' : '2px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <HelpCircle size={14} /> Design Questions
          </button>
          <button
            onClick={() => setActiveTab('reference')}
            style={{
              flex: 1,
              padding: '14px',
              fontSize: '0.8rem',
              fontWeight: 600,
              background: activeTab === 'reference' ? 'rgba(255,45,45,0.1)' : 'transparent',
              color: activeTab === 'reference' ? '#FFFFFF' : 'var(--text-muted)',
              border: 'none',
              borderBottom: activeTab === 'reference' ? '2px solid var(--molten-red)' : '2px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Sparkles size={14} /> Reference Guide
          </button>
        </div>

        {/* Tab Content */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1, fontSize: '0.875rem', lineHeight: 1.6 }}>
          {activeTab === 'requirements' && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <span className="badge-ember" style={{ marginBottom: '6px' }}>PROBLEM SPECIFICATION</span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}>
                  {problem.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  {problem.description}
                </p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  Functional & Non-Functional Specifications
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {problem.coreRequirements.map(req => (
                    <div
                      key={req.id}
                      style={{
                        padding: '14px',
                        background: 'var(--surface-elevated)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '0.875rem' }}>
                          {req.title}
                        </span>
                        <span className="badge-dark" style={{ fontSize: '0.65rem' }}>
                          {req.type}
                        </span>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '10px' }}>
                        {req.description}
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {req.keyEntities.map(ent => (
                          <code key={ent} style={{ fontSize: '0.7rem', padding: '2px 8px', background: 'rgba(255, 45, 45, 0.08)', color: '#FFA38F', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-magma)' }}>
                            {ent}
                          </code>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: '10px' }}>
                  Expected Domain Classes & Interfaces
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {problem.expectedClasses.map(cls => (
                    <span key={cls} className="badge-dark" style={{ color: '#FFFFFF' }}>
                      {cls}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'design-questions' && (
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '12px' }}>
                Architecture & Trade-off Questions
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '16px' }}>
                Senior engineering interviewers focus on these specific design decisions:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {problem.keyDesignQuestions.map((q, idx) => (
                  <div key={idx} style={{ padding: '16px', background: 'rgba(255,45,45,0.06)', borderLeft: '3px solid var(--molten-red)', borderRadius: '0 var(--radius-md) var(--radius-md) 0' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <span style={{ fontWeight: 800, color: 'var(--molten-red)', fontSize: '0.85rem' }}>Q{idx + 1}.</span>
                      <p style={{ color: 'var(--text-primary)', fontSize: '0.85rem' }}>{q}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reference' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#FFFFFF' }}>
                  Reference Solution Guide
                </h4>
                <button
                  onClick={onLoadSolution}
                  className="btn-obsidian"
                  style={{ fontSize: '0.75rem', padding: '6px 12px' }}
                >
                  Load to Editor
                </button>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '14px' }}>
                {problem.sampleSolution.explanation}
              </p>
              <pre style={{
                background: '#090909',
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                overflowX: 'auto',
                border: '1px solid var(--border-subtle)'
              }}>
                {problem.sampleSolution.code}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Right Pane: Code / Solution Editor & Action Toolbar */}
      <div className="obsidian-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* Editor Toolbar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 20px',
          background: 'rgba(9, 9, 9, 0.7)',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileCode size={16} color="var(--molten-red)" />
            <span style={{ fontSize: '0.825rem', fontWeight: 700, color: '#FFFFFF', fontFamily: 'var(--font-mono)' }}>
              Solution.ts
            </span>
            <span className="badge-dark" style={{ fontSize: '0.65rem' }}>TypeScript / Pseudocode</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={onLoadStarter}
              className="btn-obsidian"
              style={{ fontSize: '0.775rem', padding: '6px 12px' }}
              title="Reset to starter template"
            >
              <RefreshCw size={13} /> Reset Starter
            </button>
            <button
              onClick={onSubmit}
              disabled={isEvaluating}
              className="btn-lava"
              style={{ fontSize: '0.825rem', padding: '8px 18px', opacity: isEvaluating ? 0.7 : 1 }}
            >
              {isEvaluating ? (
                <>
                  <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} />
                  Evaluating Architecture...
                </>
              ) : (
                <>
                  <Flame size={14} /> Evaluate Solution
                </>
              )}
            </button>
          </div>
        </div>

        {/* Code Input Area */}
        <div style={{ position: 'relative', flex: 1, display: 'flex' }}>
          <textarea
            value={code}
            onChange={(e) => onChangeCode(e.target.value)}
            placeholder="// Write your Low-Level Design classes, interfaces, and methods here..."
            spellCheck={false}
            style={{
              width: '100%',
              height: '100%',
              padding: '20px',
              backgroundColor: '#090909',
              color: '#F0F0F0',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.875rem',
              lineHeight: 1.6,
              border: 'none',
              resize: 'none',
              outline: 'none',
              tabSize: 2
            }}
          />
        </div>

        {/* Footer info */}
        <div style={{
          padding: '10px 20px',
          background: 'rgba(9, 9, 9, 0.85)',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.75rem',
          color: 'var(--text-muted)'
        }}>
          <span>Lines: {code.split('\n').length} | Chars: {code.length}</span>
          <span>WCAG AA Obsidian Editor</span>
        </div>
      </div>
    </div>
  );
};
