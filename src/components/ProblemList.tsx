import React from 'react';
import type { Problem, Difficulty } from '../domain/types';
import { Clock, CheckCircle2, ChevronRight, Layers, Award } from 'lucide-react';

interface ProblemListProps {
  problems: Problem[];
  selectedProblemId: string;
  onSelectProblem: (problem: Problem) => void;
  completedProblemIds: Set<string>;
}

export const ProblemList: React.FC<ProblemListProps> = ({
  problems,
  selectedProblemId,
  onSelectProblem,
  completedProblemIds
}) => {
  const getBadgeClass = (diff: Difficulty) => {
    switch (diff) {
      case 'Easy': return 'badge-dark';
      case 'Medium': return 'badge-ember';
      case 'Hard': return 'badge-ember';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span className="badge-ember" style={{ marginBottom: '8px' }}>ENGINEERING SANDBOX</span>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.03em' }}>
            Low-Level Design Challenges
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Select a classic domain problem to practice and evaluate your object-oriented architecture.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--surface-rock)', padding: '8px 16px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)' }}>
          <Award size={16} color="#FF7A00" />
          <span style={{ fontSize: '0.825rem', color: '#FFFFFF', fontWeight: 700 }}>
            {completedProblemIds.size} / {problems.length} Solved
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
        {problems.map(problem => {
          const isSelected = problem.id === selectedProblemId;
          const isSolved = completedProblemIds.has(problem.id);

          return (
            <div
              key={problem.id}
              onClick={() => onSelectProblem(problem)}
              className="obsidian-card"
              style={{
                padding: '28px',
                cursor: 'pointer',
                borderColor: isSelected ? 'var(--molten-red)' : 'var(--border-subtle)',
                boxShadow: isSelected ? 'var(--shadow-magma)' : 'var(--shadow-obsidian)',
                transform: isSelected ? 'translateY(-2px)' : 'none'
              }}
            >
              {isSelected && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: 'linear-gradient(90deg, #B31217, #FF2D2D, #FF7A00)'
                }} />
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                <span className={`badge ${getBadgeClass(problem.difficulty)}`}>
                  {problem.difficulty}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {isSolved && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#4ADE80', fontSize: '0.75rem', fontWeight: 700 }}>
                      <CheckCircle2 size={14} /> Solved
                    </span>
                  )}
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    <Clock size={13} /> {problem.estimatedTimeMin}m
                  </span>
                </div>
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px', letterSpacing: '-0.02em' }}>
                {problem.title}
              </h3>

              <p style={{
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                marginBottom: '18px',
                lineHeight: 1.5,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {problem.tagline}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                {problem.tags.map(tag => (
                  <span key={tag} className="badge-dark" style={{ fontSize: '0.7rem' }}>
                    {tag}
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Layers size={13} /> {problem.expectedClasses.length} Core Entities
                </span>
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '0.825rem',
                  fontWeight: 700,
                  color: isSelected ? 'var(--molten-red)' : '#FFFFFF'
                }}>
                  {isSelected ? 'Active Sandbox' : 'Practice Challenge'} <ChevronRight size={14} />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
