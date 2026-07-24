import React, { useEffect, useRef } from 'react';
import { Brain, FileText, Image as ImageIcon, Sparkles, Terminal, CheckCircle2, Loader2 } from 'lucide-react';

const STEPS = [
  { id: 'idea_generation', title: '1. Idea Agent', desc: 'Fikir ve Konsept', icon: Brain },
  { id: 'storyboard_creation', title: '2. Storyboard Agent', desc: 'Sahneler ve Akış', icon: FileText },
  { id: 'prompt_optimization', title: '3. Prompt Agent', desc: 'Görsel Promptları', icon: Sparkles },
  { id: 'image_generation', title: '4. Image Service', desc: 'Görsel Üretimi', icon: ImageIcon }
];

export default function WorkflowProgress({ currentStep, logs = [], status }) {
  const terminalEndRef = useRef(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getStepStatus = (stepId) => {
    const stepOrder = ['idea_generation', 'storyboard_creation', 'prompt_optimization', 'image_generation', 'completed'];
    const currentIndex = stepOrder.indexOf(currentStep);
    const targetIndex = stepOrder.indexOf(stepId);

    if (currentStep === 'completed') return 'completed';
    if (currentIndex === targetIndex) return 'active';
    if (currentIndex > targetIndex) return 'completed';
    return 'pending';
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles style={{ color: '#00f0ff', width: '20px', height: '20px' }} />
          LangGraph İş Akışı Canlı Takip
        </h3>
        <span className={`badge-step ${status === 'completed' ? 'badge-success' : 'badge-active'}`}>
          {status === 'completed' ? 'Tamamlandı' : 'Ajanlar Devrede'}
        </span>
      </div>

      {/* Steps Pipeline Visualizer */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        {STEPS.map((step) => {
          const Icon = step.icon;
          const st = getStepStatus(step.id);
          const isActive = st === 'active';
          const isCompleted = st === 'completed';

          return (
            <div
              key={step.id}
              style={{
                background: isActive ? 'rgba(59, 130, 246, 0.15)' : 'rgba(15, 23, 42, 0.5)',
                border: `1px solid ${isActive ? '#3b82f6' : isCompleted ? 'rgba(16, 185, 129, 0.4)' : 'rgba(255, 255, 255, 0.08)'}`,
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                boxShadow: isActive ? '0 0 15px rgba(59, 130, 246, 0.3)' : 'none',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: isCompleted ? 'rgba(16, 185, 129, 0.2)' : isActive ? '#3b82f6' : 'rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {isCompleted ? (
                  <CheckCircle2 style={{ color: '#34d399', width: '20px', height: '20px' }} />
                ) : isActive ? (
                  <Loader2 style={{ color: '#ffffff', width: '20px', height: '20px' }} className="animate-spin-slow" />
                ) : (
                  <Icon style={{ color: 'var(--text-muted)', width: '18px', height: '18px' }} />
                )}
              </div>
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: isActive ? '#ffffff' : isCompleted ? '#34d399' : 'var(--text-muted)' }}>
                  {step.title}
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Terminal Log Stream */}
      <div style={{
        background: '#04060A',
        borderRadius: 'var(--radius-md)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '1rem',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.8rem',
        maxHeight: '180px',
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-dim)', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '0.4rem' }}>
          <Terminal style={{ width: '14px', height: '14px', color: '#00f0ff' }} />
          <span>Execution Console Output</span>
        </div>
        {logs.map((log, idx) => (
          <div key={idx} style={{ color: log.includes('✅') || log.includes('✨') ? '#34d399' : log.includes('🧠') || log.includes('📝') ? '#60a5fa' : '#94a3b8', marginBottom: '0.25rem' }}>
            {log}
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>
    </div>
  );
}
