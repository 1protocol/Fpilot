# FPILOT: Neural Finance Trader

FPILOT, bireysel ve kurumsal yatırımcılar için tasarlanmış, yapay zeka destekli, kurumsal düzeyde bir algoritmik trading platformudur. Kullanıcıların doğal dil kullanarak trading stratejileri oluşturmasına, bu stratejileri geçmiş verilerle test etmesine (backtesting), piyasa koşullarına göre optimize etmesine ve canlı piyasa verilerini izlemesine olanak tanır.

## Core Features

### 📈 Dashboard
Kullanıcıların tüm trading aktivitelerini ve piyasa durumunu tek bir yerden izleyebildiği merkezi kontrol paneli.
- **Portfolio Performance:** Canlı portföy değeri grafiği.
- **Live Market Data:** Entegre borsalardan (Binance, Bybit, Coinbase vb.) gelen gerçek zamanlı piyasa verileri.
- **Risk Metrics:** Kişiselleştirilmiş risk metriklerinin (VaR, CVaR, Max Drawdown) anlık takibi.
- **Recent Orders:** Gerçekleştirilen son emirlerin canlı durumu (Filled, Working, Canceled).
- **AI Market Sentiment:** Seçilen kripto para için sosyal medya ve haber kaynaklarından derlenen yapay zeka destekli piyasa duyarlılık özeti.
- **System Health:** Veri akışı, API bağlantısı gibi tüm sistem bileşenlerinin anlık sağlık durumu.

### 🤖 Strategies
Yapay zeka ile trading stratejileri oluşturma, yönetme ve optimize etme merkezi.
- **Strategy List:** Kullanıcıya ait tüm stratejilerin modern bir kart görünümünde listelenmesi.
- **Generate with AI:** Doğal dil (prompt) kullanarak sıfırdan, çalışan bir trading stratejisi (Typescript kodu) ve açıklaması oluşturma.
- **Tune with AI:** Mevcut bir stratejinin kodunu analiz ederek ayarlanabilir parametreleri (RSI periyodu, stop-loss yüzdesi vb.) otomatik olarak bulan ve piyasa koşullarına göre bu parametreleri optimize eden yapay zeka aracı.

### 📊 Analytics Engine
Yapay zeka gücüyle piyasa öngörüleri ve alım-satım sinyalleri üretme.
- **Market Regime Prediction:** Seçilen bir kripto para için piyasanın "Boğa (Bull)", "Ayı (Bear)" veya "Yatay (Sideways)" rejimlerinden hangisinde olduğunu gerekçesi ve güven skoruyla birlikte tahmin etme.
- **Signal Generator:** Kullanıcının belirlediği strateji tipi, risk seviyesi ve kripto paraya göre "Al (Buy)", "Sat (Sell)" veya "Tut (Hold)" sinyali üretme.

### ⏳ Backtesting & Validation
Oluşturulan stratejilerin geçmiş performansını test etmek için kullanılan güçlü simülasyon aracı.
- **AI-Powered Simulation:** Strateji kodunu, seçilen varlık ve tarih aralığına göre çalıştırarak gerçekçi bir backtest simülasyonu yapar.
- **Comprehensive Metrics:** Net Kâr, Sharpe Oranı, Maksimum Düşüş (Max Drawdown), Kazanma Oranı (Win Rate) gibi kritik performans metriklerini sunar.
- **Visual Feedback:** Simülasyon sonuçlarını bir özkaynak eğrisi grafiği (Equity Curve) ve detaylı bir işlem günlüğü (Trade Log) ile görselleştirir.

### ⚙️ Settings
Platformun ve kullanıcı hesabının tüm ayarlarının yönetildiği bölüm.
- **Profile Management:** Kullanıcı adı ve e-posta gibi kişisel bilgilerin güncellenmesi.
- **Risk Management:** Kullanıcının kendi risk iştahını (Value at Risk, Max Position Size vb.) tanımlayıp kaydetmesine olanak tanıyan kişisel risk profili yönetimi. Bu profil, AI'nin üreteceği sinyalleri etkiler.
- **API Keys:** Canlı trading için borsa API anahtarlarının yönetimi.
- **Notifications & Appearance:** Bildirim ve tema ayarları.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** ShadCN UI
- **AI/Generative:** Genkit (Google AI)
- **Database:** Firebase Firestore
- **Authentication:** Firebase Authentication
- **Form Management:** React Hook Form & Zod
- **Charting:** Recharts

## Getting Started

Bu proje bir Firebase Studio başlangıç projesidir. Başlamak için `src/app/page.tsx` dosyasına göz atın ve platformu keşfetmeye başlayın. Proje, canlı veri akışlarını simüle eden ve tüm yapay zeka özelliklerinin çalışır durumda olduğu bir yapılandırma ile gelir.
