import React, { useState } from 'react';
import InputForm from './components/InputForm';
import WorkflowProgress from './components/WorkflowProgress';
import StoryboardCard from './components/StoryboardCard';
import ReportView from './components/ReportView';
import { startCampaign, streamProgress } from './services/api';
import { Sparkles, Layers, Cpu, Zap, Github, ArrowRight } from 'lucide-react';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [taskId, setTaskId] = useState(null);
  const [status, setStatus] = useState('idle');
  const [currentStep, setCurrentStep] = useState('idle');
  const [logs, setLogs] = useState([]);
  const [campaignData, setCampaignData] = useState(null);

  const handleGenerate = async ({ userPrompt, style, numScenes }) => {
    setIsLoading(true);
    setStatus('processing');
    setCurrentStep('started');
    setLogs(['🚀 [Frontend]: Sending request to LangGraph AI Creative Studio backend...']);
    setCampaignData(null);

    try {
      const res = await startCampaign(userPrompt, style, numScenes);
      setTaskId(res.task_id);

      // Subscribe to live SSE updates
      streamProgress(
        res.task_id,
        (update) => {
          if (update.current_step) setCurrentStep(update.current_step);
          if (update.status) setStatus(update.status);
          if (update.new_logs && update.new_logs.length > 0) {
            setLogs((prev) => [...prev, ...update.new_logs]);
          }

          setCampaignData((prev) => ({
            ...prev,
            concept: update.concept || prev?.concept,
            scenes: update.scenes || prev?.scenes,
            image_prompts: update.image_prompts || prev?.image_prompts,
            generated_images: update.generated_images || prev?.generated_images
          }));

          if (update.status === 'completed' || update.status === 'failed') {
            setIsLoading(false);
          }
        },
        (err) => {
          console.error('Streaming error:', err);
          setIsLoading(false);
        }
      );
    } catch (error) {
      console.error('Failed to start campaign:', error);
      setLogs((prev) => [...prev, `❌ [Error]: ${error.message}`]);
      setIsLoading(false);
      setStatus('failed');
    }
  };

  const scenes = campaignData?.scenes || [];
  const imagePrompts = campaignData?.image_prompts || [];
  const generatedImages = campaignData?.generated_images || [];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navigation Bar */}
      <header style={{
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(7, 9, 14, 0.8)',
        backdropFilter: 'blur(16px)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '1rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #ff007a 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 12px rgba(59, 130, 246, 0.5)'
            }}>
              <Cpu style={{ color: '#ffffff', width: '20px', height: '20px' }} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)', fontWeight: 800, letterSpacing: '-0.02em' }}>
                AI Creative Studio
              </h1>
              <p style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                LangGraph Multi-Agent Orchestrator
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span className="badge-step badge-active" style={{ fontSize: '0.7rem' }}>
              <Zap style={{ width: '12px', height: '12px' }} />
              FastAPI + LangGraph
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '2.5rem 1.5rem', flex: 1, width: '100%' }}>
        {/* Hero Banner Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '9999px',
            padding: '0.35rem 1rem',
            fontSize: '0.8rem',
            color: '#60a5fa',
            marginBottom: '1rem'
          }}>
            <Sparkles style={{ width: '14px', height: '14px' }} />
            <span>Otonom Görsel Kampanya & Storyboard Üreticisi</span>
          </div>

          <h1 style={{ fontSize: '2.8rem', fontFamily: 'var(--font-heading)', fontWeight: 800, marginBottom: '0.75rem', lineHeight: 1.15 }} className="gradient-text">
            Fikirden Görsel Kampanyaya 1 Dakikada
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '720px', margin: '0 auto' }}>
            Fikir üretin, sahneleri kurgulayın, AI görsel prompt'larını optimize edin ve storyboard raporunuzu anında indirin.
          </p>
        </div>

        {/* Input Form Section */}
        <InputForm onSubmit={handleGenerate} isLoading={isLoading} />

        {/* Workflow Progress Panel */}
        {status !== 'idle' && (
          <WorkflowProgress currentStep={currentStep} logs={logs} status={status} />
        )}

        {/* Storyboard Scene Card Grid */}
        {scenes.length > 0 && (
          <div style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Layers style={{ color: '#00f0ff', width: '22px', height: '22px' }} />
                Üretilen Storyboard Sahneleri
              </h2>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                {scenes.length} Sahne Hazır
              </span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem'
            }}>
              {scenes.map((scene, index) => (
                <StoryboardCard
                  key={scene.scene_number || index}
                  scene={scene}
                  imagePrompt={imagePrompts.find((p) => p.scene_number === scene.scene_number) || imagePrompts[index]}
                  generatedImage={generatedImages.find((img) => img.scene_number === scene.scene_number) || generatedImages[index]}
                />
              ))}
            </div>
          </div>
        )}

        {/* Campaign Report View */}
        {campaignData?.concept && (
          <ReportView campaignState={campaignData} />
        )}
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(7, 9, 14, 0.95)',
        padding: '2rem 1.5rem',
        marginTop: '4rem',
        textAlign: 'center',
        color: 'var(--text-dim)',
        fontSize: '0.875rem'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            AI Creative Studio • FrameFlow AI Architecture
          </div>
          <div>
            Powered by LangGraph, FastAPI & React
          </div>
        </div>
      </footer>
    </div>
  );
}
