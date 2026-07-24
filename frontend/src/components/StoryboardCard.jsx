import React, { useState } from 'react';
import { Copy, Check, Maximize2, Camera, Eye, Tag } from 'lucide-react';

export default function StoryboardCard({ scene, imagePrompt, generatedImage }) {
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleCopyPrompt = () => {
    if (!imagePrompt?.prompt) return;
    navigator.clipboard.writeText(imagePrompt.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const imageUrl = generatedImage?.image_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1024&q=80';

  return (
    <>
      <div className="glass-panel" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* Image Header Container */}
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#000000' }}>
          <img
            src={imageUrl}
            alt={scene.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            loading="lazy"
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(7, 9, 14, 0.95) 0%, transparent 60%)'
          }} />

          {/* Scene Badge */}
          <div style={{
            position: 'absolute',
            top: '0.875rem',
            left: '0.875rem',
            background: 'rgba(9, 13, 22, 0.85)',
            backdropFilter: 'blur(8px)',
            padding: '0.35rem 0.75rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#60a5fa',
            border: '1px solid rgba(96, 165, 250, 0.3)'
          }}>
            Sahne {scene.scene_number || 1} • {scene.duration || '0:05'}
          </div>

          {/* Zoom Button */}
          <button
            onClick={() => setShowModal(true)}
            style={{
              position: 'absolute',
              top: '0.875rem',
              right: '0.875rem',
              background: 'rgba(9, 13, 22, 0.85)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s ease'
            }}
            title="Büyük Görseli Gör"
          >
            <Maximize2 style={{ width: '16px', height: '16px' }} />
          </button>

          {/* Scene Title overlay */}
          <div style={{ position: 'absolute', bottom: '0.875rem', left: '1rem', right: '1rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontFamily: 'var(--font-heading)', fontWeight: 700, color: '#ffffff' }}>
              {scene.title}
            </h3>
          </div>
        </div>

        {/* Card Body */}
        <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Narrative & Camera */}
          <div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '0.5rem', lineHeight: 1.5 }}>
              {scene.narrative}
            </p>
            {scene.camera_angle && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                <Camera style={{ width: '14px', height: '14px', color: '#00f0ff' }} />
                <span><strong>Kamera:</strong> {scene.camera_angle}</span>
              </div>
            )}
          </div>

          {/* Aesthetic Tags */}
          {imagePrompt?.aesthetic_tags && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {imagePrompt.aesthetic_tags.map((tag, i) => (
                <span key={i} style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '6px',
                  fontSize: '0.7rem',
                  color: 'var(--text-muted)'
                }}>
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Prompt Section */}
          <div style={{
            marginTop: 'auto',
            background: 'rgba(4, 6, 10, 0.7)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '0.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.725rem', color: '#60a5fa', fontWeight: 600, textTransform: 'uppercase' }}>
                AI Visual Prompt
              </span>
              <button
                onClick={handleCopyPrompt}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: copied ? '#34d399' : 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  fontSize: '0.725rem'
                }}
              >
                {copied ? <Check style={{ width: '13px', height: '13px' }} /> : <Copy style={{ width: '13px', height: '13px' }} />}
                {copied ? 'Kopyalandı!' : 'Kopyala'}
              </button>
            </div>
            <p style={{
              fontSize: '0.775rem',
              color: 'var(--text-dim)',
              fontFamily: 'var(--font-mono)',
              lineHeight: 1.4,
              maxHeight: '60px',
              overflowY: 'auto'
            }}>
              {imagePrompt?.prompt || scene.visual_description}
            </p>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '90vh',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: '0 0 50px rgba(0, 240, 255, 0.3)'
            }}
          >
            <img src={imageUrl} alt={scene.title} style={{ maxWidth: '100%', maxHeight: '85vh', display: 'block' }} />
            <div style={{ padding: '1rem', background: '#090D16', color: '#ffffff' }}>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem' }}>{scene.title}</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{scene.visual_description}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
