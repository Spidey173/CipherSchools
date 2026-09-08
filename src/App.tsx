import React, { useState, useEffect } from 'react';
import { PROBLEMS } from './domain/problems';
import type { Problem, DesignFeedback, Attempt } from './domain/types';
import { HybridEvaluationPipeline } from './evaluators/HybridPipeline';
import { AttemptRepository } from './domain/repository';
import { ProblemList } from './components/ProblemList';
import { Workspace } from './components/Workspace';
import { FeedbackView } from './components/FeedbackView';
import { AttemptHistory } from './components/AttemptHistory';
import { Terminal, BookOpen, Code2, Sparkles, History } from 'lucide-react';
import confetti from 'canvas-confetti';

type NavTab = 'problems' | 'workspace' | 'feedback' | 'history';

export const App: React.FC = () => {
  const [selectedProblem, setSelectedProblem] = useState<Problem>(PROBLEMS[0]);
  const [code, setCode] = useState<string>(PROBLEMS[0].starterCode.code);
  const [activeTab, setActiveTab] = useState<NavTab>('problems');
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [currentFeedback, setCurrentFeedback] = useState<DesignFeedback | null>(null);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [pipeline] = useState(() => new HybridEvaluationPipeline());

  // Load attempt history on mount
  useEffect(() => {
    setAttempts(AttemptRepository.getAllAttempts());
  }, []);

  const handleSelectProblem = (problem: Problem) => {
    setSelectedProblem(problem);
    setCode(problem.starterCode.code);
    setCurrentFeedback(null);
    setActiveTab('workspace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoadStarter = () => {
    setCode(selectedProblem.starterCode.code);
  };

  const handleLoadSolution = () => {
    setCode(selectedProblem.sampleSolution.code);
  };

  const handleSubmitSolution = async () => {
    setIsEvaluating(true);
    setActiveTab('feedback');

    try {
      const feedback = await pipeline.evaluate(selectedProblem, code);
      setCurrentFeedback(feedback);

      const newAttempt: Attempt = {
        id: `att-${Date.now()}`,
        problemId: selectedProblem.id,
        problemTitle: selectedProblem.title,
        timestamp: Date.now(),
        language: 'typescript',
        solutionCode: code,
        feedback
      };

      AttemptRepository.saveAttempt(newAttempt);
      setAttempts(AttemptRepository.getAllAttempts());

      if (feedback.overallScore >= 80) {
        confetti({
          particleCount: 80,
          spread: 70,
          colors: ['#FF2D2D', '#FF5B1F', '#FF7A00', '#FFFFFF'],
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error('Evaluation failed', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleSelectAttempt = (attempt: Attempt) => {
    const prob = PROBLEMS.find(p => p.id === attempt.problemId) || selectedProblem;
    setSelectedProblem(prob);
    setCode(attempt.solutionCode);
    setCurrentFeedback(attempt.feedback);
    setActiveTab('feedback');
  };

  const handleClearHistory = () => {
    AttemptRepository.clearHistory();
    setAttempts([]);
  };

  const completedProblemIds = new Set(
    attempts.filter(a => a.feedback.overallScore >= 75).map(a => a.problemId)
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      {/* Top Header Bar */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(9, 9, 9, 0.9)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '14px 28px'
      }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
          
          {/* Logo & Brand */}
          <div
            onClick={() => setActiveTab('problems')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
          >
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #B31217, #FF2D2D 55%, #FF7A00)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(255, 45, 45, 0.45)'
            }}>
              <Terminal size={20} color="#FFFFFF" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1 style={{ fontSize: '1.15rem', fontWeight: 900, letterSpacing: '-0.03em', color: '#FFFFFF' }}>
                  LLD Practice Platform
                </h1>
                <span className="badge-ember" style={{ fontSize: '0.65rem' }}>
                  CipherSchools MVP
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Low-Level Design feedback & iteration sandbox
              </p>
            </div>
          </div>

          {/* Clean Practice Navigation */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--surface-rock)', padding: '5px 8px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)' }}>
            <button
              onClick={() => setActiveTab('problems')}
              className={activeTab === 'problems' ? 'btn-lava' : 'btn-obsidian'}
              style={{
                fontSize: '0.8rem',
                padding: '7px 16px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                background: activeTab === 'problems' ? undefined : 'transparent'
              }}
            >
              <BookOpen size={14} /> Catalog
            </button>
            <button
              onClick={() => setActiveTab('workspace')}
              className={activeTab === 'workspace' ? 'btn-lava' : 'btn-obsidian'}
              style={{
                fontSize: '0.8rem',
                padding: '7px 16px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                background: activeTab === 'workspace' ? undefined : 'transparent'
              }}
            >
              <Code2 size={14} /> Workspace: {selectedProblem.title.split(' ')[1] || 'Design'}
            </button>
            {currentFeedback && (
              <button
                onClick={() => setActiveTab('feedback')}
                className={activeTab === 'feedback' ? 'btn-lava' : 'btn-obsidian'}
                style={{
                  fontSize: '0.8rem',
                  padding: '7px 16px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  background: activeTab === 'feedback' ? undefined : 'transparent'
                }}
              >
                <Sparkles size={14} /> Feedback ({currentFeedback.overallScore})
              </button>
            )}
            <button
              onClick={() => setActiveTab('history')}
              className={activeTab === 'history' ? 'btn-lava' : 'btn-obsidian'}
              style={{
                fontSize: '0.8rem',
                padding: '7px 16px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                background: activeTab === 'history' ? undefined : 'transparent'
              }}
            >
              <History size={14} /> History ({attempts.length})
            </button>
          </nav>
        </div>
      </header>

      {/* Main Sandbox Area */}
      <main style={{ maxWidth: '1440px', width: '100%', margin: '0 auto', padding: '28px', flex: 1 }}>
        {activeTab === 'problems' && (
          <ProblemList
            problems={PROBLEMS}
            selectedProblemId={selectedProblem.id}
            onSelectProblem={handleSelectProblem}
            completedProblemIds={completedProblemIds}
          />
        )}

        {activeTab === 'workspace' && (
          <Workspace
            problem={selectedProblem}
            code={code}
            onChangeCode={setCode}
            onSubmit={handleSubmitSolution}
            isEvaluating={isEvaluating}
            onLoadStarter={handleLoadStarter}
            onLoadSolution={handleLoadSolution}
          />
        )}

        {activeTab === 'feedback' && (
          <FeedbackView
            feedback={currentFeedback}
            isEvaluating={isEvaluating}
            onRetry={() => setActiveTab('workspace')}
          />
        )}

        {activeTab === 'history' && (
          <AttemptHistory
            attempts={attempts}
            onSelectAttempt={handleSelectAttempt}
            onClearHistory={handleClearHistory}
          />
        )}
      </main>

      {/* Volcanic Divider */}
      <div style={{
        height: '2px',
        background: 'linear-gradient(90deg, transparent 0%, #B31217 30%, #FF2D2D 50%, #FF7A00 70%, transparent 100%)',
        boxShadow: '0 0 12px rgba(255, 45, 45, 0.6)'
      }} />

      {/* Footer */}
      <footer style={{
        padding: '20px 28px',
        background: '#090909',
        fontSize: '0.775rem',
        color: 'var(--text-muted)'
      }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <span>LLD Practice Platform • 2-Day Engineering Assignment for CipherSchools</span>
          <span>Hybrid Deterministic Rules + LLM Reasoning Pipeline • WCAG AA</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
