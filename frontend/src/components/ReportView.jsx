import React, { useState } from 'react';
import { Download, Share2, Layers, CheckCircle, Palette, Target, Volume2, Sparkles, Layout } from 'lucide-react';

export default function ReportView({ campaignState }) {
  const [activeFormat, setActiveFormat] = useState('16:9');
  const concept = campaignState.concept || {};
  const scenes = campaignState.scenes || [];
  const generatedImages = campaignState.generated_images || [];

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(campaignState, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Campaign_Report_${concept.title?.replace(/\s+/g, '_') || 'Studio'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const palette = concept.color_palette || ['#0F172A', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B'];

  return (
    <div className="glass-panel" style={{ padding: '2.5rem', marginTop: '3rem' }}>
      {/* Header Banner */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        paddingBottom: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#60a5fa', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
            <Sparkles style={{ width: '16px', height: '16px' }} />
            Final Kampanya & Storyboard Raporu
          </div>
          <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', fontWeight: 800 }} className="gradient-text">
            {concept.title || 'AI Kampanya Raporu'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', fontStyle: 'italic', marginTop: '0.25rem' }}>
            "{concept.tagline || 'Geleceğin Görsel Deneyimi'}"
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={handleDownloadJSON} className="btn-primary">
            <Download style={{ width: '18px', height: '18px' }} />
            Raporu İndir (JSON)
          </button>
        </div>
      </div>

      {/* Campaign Strategy Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }}>
        {/* Mood & Atmosphere */}
        <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#00f0ff', marginBottom: '0.5rem', fontWeight: 600 }}>
            <Palette style={{ width: '18px', height: '18px' }} />
            Atmosfer & Mood
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
            {concept.mood || 'High-end visual aesthetic'}
          </p>
        </div>

        {/* Target Audience */}
        <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ff007a', marginBottom: '0.5rem', fontWeight: 600 }}>
            <Target style={{ width: '18px', height: '18px' }} />
            Hedef Kitle
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
            {concept.target_audience || 'Modern dijital kitle'}
          </p>
        </div>

        {/* Brand Voice */}
        <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#8b5cf6', marginBottom: '0.5rem', fontWeight: 600 }}>
            <Volume2 style={{ width: '18px', height: '18px' }} />
            Marka Tonu
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
            {concept.brand_voice || 'Bold & Visionary'}
          </p>
        </div>
      </div>

      {/* Color Palette section */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', fontWeight: 600 }}>
          Önerilen Renk Paleti
        </h4>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {palette.map((color, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(15, 23, 42, 0.8)', padding: '0.4rem 0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: color, border: '1px solid rgba(255,255,255,0.2)' }} />
              <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-main)' }}>{color}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Social Media Format Preview Switcher */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h4 style={{ fontSize: '1rem', fontFamily: 'var(--font-heading)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layout style={{ width: '18px', height: '18px', color: '#60a5fa' }} />
            Format Önizleme Mockup
          </h4>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {['16:9', '9:16', '1:1'].map((fmt) => (
              <button
                key={fmt}
                onClick={() => setActiveFormat(fmt)}
                className="btn-secondary"
                style={{
                  fontSize: '0.75rem',
                  padding: '0.35rem 0.75rem',
                  background: activeFormat === fmt ? '#3b82f6' : 'rgba(255,255,255,0.05)',
                  color: '#ffffff',
                  borderColor: activeFormat === fmt ? '#3b82f6' : 'rgba(255,255,255,0.1)'
                }}
              >
                {fmt === '16:9' ? 'Yatay Banner (16:9)' : fmt === '9:16' ? 'Hikaye / Reels (9:16)' : 'Kare Gönderi (1:1)'}
              </button>
            ))}
          </div>
        </div>

        {/* Format Render Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: activeFormat === '9:16' ? 'repeat(auto-fit, minmax(180px, 1fr))' : 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.25rem'
        }}>
          {generatedImages.map((img, i) => (
            <div key={i} className="glass-panel" style={{ overflow: 'hidden', borderRadius: '12px' }}>
              <div style={{
                position: 'relative',
                width: '100%',
                aspectRatio: activeFormat === '16:9' ? '16/9' : activeFormat === '9:16' ? '9/16' : '1/1',
                overflow: 'hidden',
                background: '#000000'
              }}>
                <img
                  src={img.image_url}
                  alt={`Preview ${i}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '0.5rem',
                  left: '0.5rem',
                  background: 'rgba(0,0,0,0.7)',
                  backdropFilter: 'blur(4px)',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.7rem',
                  color: '#ffffff'
                }}>
                  Sahne {img.scene_number || i + 1}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
