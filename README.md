# 🎨 AI Creative Studio (FrameFlow AI)

> **Uçtan Uca Yapay Zeka Destekli Görsel Kampanya ve Storyboard Üretim Platformu**

AI Creative Studio, metin bazlı fikirleri (**"Siberpunk temalı kahve markası lansmanı"** gibi) tam teşekküllü bir görsel kampanyaya ve sahne sahne storyboard'a dönüştüren otonom çok ajanlı (multi-agent) bir platformdur.

---

## 🌟 Öne Çıkan Özellikler

- **🧠 Ajan Temelli İş Akışı (LangGraph)**:
  - **Idea Agent**: Kampanya konseptini, hedef kitleyi ve görsel atmosferi belirler.
  - **Storyboard Agent**: Senaryoyu mantıksal sahnelere böler ve her sahne için detaylı görsel betimlemeler yazar.
  - **Prompt Agent**: Midjourney, Flux ve DALL-E 3 uyumlu, ışık, açı ve stil parametrelerine sahip yüksek kaliteli görsel prompt'ları hazırlar.
- **⚡ Canlı Durum ve Log Akışı**: WebSocket / Server-Sent Events (SSE) ile ajanların anlık adımları frontend'e aktarılır.
- **🎨 Zengin Kullanıcı Arayüzü (React + Modern Dark Theme)**:
  - Şablon seçenekleri (Cyberpunk Coffee, Luxury Watch, Eco Tech, Futuristic Car vb.).
  - Canlı ilerleme takip paneli.
  - Sahne bazlı storyboard kartları, prompt kopyalama ve çözünürlük ayarları.
  - Kampanya özet raporu ve indirme imkanı.
- **🛠️ Hazır Çalıştırma Modu (Fallback Engine)**: API anahtarı olmadan da anında test edilebilen yüksek kaliteli simüle edilmiş yapay zeka üreticisi.

---

## 🏗️ Proje Mimarisi

```text
ai-creative-studio/
├── 📂 backend/                  # Python & LangGraph & FastAPI
│   ├── 📂 app/
│   │   ├── 📂 agents/          # LangGraph Ajanları (State, Idea, Storyboard, Prompt, Graph)
│   │   ├── 📂 services/        # LLM & Görsel Üretim Servisleri
│   │   ├── 📂 api/             # FastAPI Endpoint'leri (POST /generate, SSE streaming)
│   │   └── main.py             # Sunucu Giriş Noktası
│   ├── .env.example
│   ├── requirements.txt
│   └── Dockerfile
│
├── 📂 frontend/                 # React UI (Vite)
│   ├── 📂 src/
│   │   ├── 📂 components/      # InputForm, WorkflowProgress, StoryboardCard, ReportView
│   │   ├── 📂 services/        # API Servisi
│   │   ├── App.jsx             # Ana Uygulama
│   │   └── index.css           # Tasarım Sistemi ve Stil Tokens
│   └── package.json
└── README.md
```

---

## 🚀 Hızlı Başlangıç

### 1. Backend Kurulumu

```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
# source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env

python app/main.py
```
*Backend `http://localhost:8000` adresinde çalışacaktır. API dokümantasyonu: `http://localhost:8000/docs`*

### 2. Frontend Kurulumu

```bash
cd frontend
npm install
npm run dev
```
*Frontend `http://localhost:5173` adresinde çalışacaktır.*

---

## 🔒 Çevre Değişkenleri (.env)

Görsel ve metin üretiminde gerçek API'leri kullanmak için `backend/.env` dosyasını yapılandırabilirsiniz:

```env
OPENAI_API_KEY=your_openai_api_key
REPLICATE_API_KEY=your_replicate_api_key
GEMINI_API_KEY=your_gemini_api_key
PORT=8000
```
*API anahtarı girilmediğinde sistem otomatik olarak demo/fallback modunda çalışır.*
