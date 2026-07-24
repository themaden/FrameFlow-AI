import React, { useState } from 'react';
import { Sparkles, Sliders, Zap, Film, Coffee, Watch, Leaf, Car } from 'lucide-react';

const PRESETS = [
  {
    id: 'cyberpunk-coffee',
    title: 'Siberpunk Kahve Lansmanı',
    icon: Coffee,
    prompt: 'Neo-Tokyo atmosferinde siberpunk temalı yüksek kafeinli kahve markası lansmanı',
    style: 'Cyberpunk',
    scenes: 4
  },
  {
    id: 'luxury-watch',
    title: 'Lüks Titanyum Saat',
    icon: Watch,
    prompt: 'Uzay çağı titanyum ve safir camlı ultra lüks mekanik saat reklam filmi',
    style: 'Cinematic',
    scenes: 4
  },
  {
    id: 'eco-tech',
    title: 'Biyo-Teknolojik Şehir',
    icon: Leaf,
    prompt: 'Kendi kendine yeten biyo-mimari ve yapay zeka akıllı ağaç ekosistemi',
    style: 'Photorealistic',
    scenes: 4
  },
  {
    id: 'future-car',
    title: 'Geleceğin Elektrikli Hypercar\'ı',
    icon: Car,
    prompt: 'Gece sürüşünde neon ışıklar altında süzülen konsept elektrikli hiper otomobil',
    style: 'Futuristic',
    scenes: 4
  }
];

const STYLES = ['Cinematic', 'Cyberpunk', 'Photorealistic', 'Anime / Art', 'Minimalist Luxury', 'Retro Sci-Fi'];

export default function InputForm({ onSubmit, isLoading }) {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('Cinematic');
  const [numScenes, setNumScenes] = useState(4);

  const handleSelectPreset = (preset) => {
    setPrompt(preset.prompt);
    setStyle(preset.style);
    setNumScenes(preset.scenes);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    onSubmit({ userPrompt: prompt, style, numScenes });
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #3b82f6 0%, #00f0ff 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(0, 240, 255, 0.4)'
        }}>
          <Sparkles style={{ color: '#090D16', width: '22px', height: '22px' }} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
            Kampanya Fikrinizi Girin
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            LangGraph otonom ajanları fikrinizi analiz edip sahneleri ve görselleri oluştursun.
          </p>
        </div>
      </div>

      {/* Preset Pills */}
      <div style={{ marginBottom: '1.5rem' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, display: 'block', marginBottom: '0.6rem' }}>
          Örnek Şablonlar
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
          {PRESETS.map((p) => {
            const Icon = p.icon;
            return (
              <button
                key={p.id}
                type="button"
                className="btn-secondary"
                style={{ fontSize: '0.825rem', padding: '0.5rem 0.85rem' }}
                onClick={() => handleSelectPreset(p)}
              >
                <Icon style={{ width: '15px', height: '15px', color: '#60a5fa' }} />
                {p.title}
              </button>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Main Textarea Input */}
        <div style={{ marginBottom: '1.25rem' }}>
          <textarea
            className="glass-input"
            rows={3}
            placeholder="Örn: Siberpunk temalı bir kahve markası lansmanı. Gece yağmur altında neon tabelalar, yüksek kafeinli siber espresso..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            style={{ resize: 'vertical', minHeight: '90px' }}
            required
          />
        </div>

        {/* Options Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '1.75rem'
        }}>
          {/* Aesthetic Style Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: 500 }}>
              Görsel Stil
            </label>
            <select
              className="glass-input"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              style={{ cursor: 'pointer' }}
            >
              {STYLES.map((st) => (
                <option key={st} value={st} style={{ background: '#0f172a', color: '#ffffff' }}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Scene Count Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              <span>Sahne Sayısı</span>
              <span style={{ fontWeight: 700, color: '#60a5fa' }}>{numScenes} Sahne</span>
            </div>
            <input
              type="range"
              min="2"
              max="6"
              value={numScenes}
              onChange={(e) => setNumScenes(parseInt(e.target.value))}
              style={{
                width: '100%',
                accentColor: '#3b82f6',
                cursor: 'pointer',
                marginTop: '0.5rem'
              }}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading || !prompt.trim()}
          >
            {isLoading ? (
              <>
                <div style={{
                  width: '18px',
                  height: '18px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#ffffff',
                  borderRadius: '50%'
                }} className="animate-spin-slow" />
                Ajanlar Çalışıyor...
              </>
            ) : (
              <>
                <Zap style={{ width: '18px', height: '18px' }} />
                Kampanyayı Otonom Üret
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
