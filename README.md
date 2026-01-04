# FPILOT: Neural Finance Trader

FPILOT, bireysel ve kurumsal yatırımcılar için tasarlanmış, yapay zeka destekli, kurumsal düzeyde bir algoritmik trading platformudur. Kullanıcıların doğal dil kullanarak trading stratejileri oluşturmasına, bu stratejileri geçmiş verilerle test etmesine (backtesting), piyasa koşullarına göre optimize etmesine ve canlı piyasa verilerini izlemesine olanak tanır.

## Temel Özellikler

### 📈 Dashboard
Kullanıcıların tüm trading aktivitelerini ve piyasa durumunu tek bir yerden izleyebildiği merkezi kontrol paneli.
- **Portföy Performansı:** Canlı portföy değeri grafiği.
- **Canlı Piyasa Verileri:** Entegre borsalardan (Binance, Bybit, Coinbase vb.) gelen gerçek zamanlı piyasa verileri.
- **Risk Metrikleri:** Kişiselleştirilmiş risk metriklerinin (VaR, CVaR, Max Drawdown) anlık takibi.
- **Son Emirler:** AI Bot'lar tarafından oluşturulan emirlerin canlı durumu (`Working`, `Filled`, `Canceled`).
- **AI Piyasa Duyarlılığı:** Seçilen kripto para için sosyal medya ve haber kaynaklarından derlenen yapay zeka destekli piyasa duyarlılık özeti.
- **Sistem Sağlığı:** Veri akışı, API bağlantısı gibi tüm sistem bileşenlerinin anlık sağlık durumu.

### 🤖 AI Botlar
Canlı trading botlarını yönetme merkezi. 
- **Bot Yönetimi:** Mevcut stratejilerden AI botları oluşturun, başlatın, duraklatın ve silin.
- **Canlı Sinyal Üretimi:** "Aktif" durumdaki botlar, periyodik olarak AI kullanarak piyasayı analiz eder ve "Al/Sat/Tut" sinyalleri üretir.
- **Otomatik Emir Oluşturma:** Üretilen "Al" veya "Sat" sinyalleri, anında "Son Emirler" paneline yansıyan gerçek ticaret emirlerine dönüştürülür.

### 📜 Stratejiler
Yapay zeka ile trading stratejileri oluşturma, yönetme ve optimize etme merkezi.
- **Strateji Listesi:** Kullanıcıya ait tüm stratejilerin modern bir kart görünümünde listelenmesi.
- **AI ile Oluştur:** Doğal dil (prompt) kullanarak sıfırdan, çalışan bir trading stratejisi (Typescript kodu) ve açıklaması oluşturma.
- **AI ile Ayarla (Tune):** Mevcut bir stratejinin kodunu analiz ederek ayarlanabilir parametreleri (RSI periyodu, stop-loss yüzdesi vb.) otomatik olarak bulan ve piyasa koşullarına göre bu parametreleri optimize eden yapay zeka aracı.

### 📊 Analiz Motoru
Yapay zeka gücüyle piyasa öngörüleri ve alım-satım sinyalleri üretme.
- **Piyasa Rejimi Tahmini:** Seçilen bir kripto para için piyasanın "Boğa (Bull)", "Ayı (Bear)" veya "Yatay (Sideways)" rejimlerinden hangisinde olduğunu gerekçesi ve güven skoruyla birlikte tahmin etme.
- **Sinyal Üretici:** Kullanıcının belirlediği strateji tipi, risk seviyesi ve kripto paraya göre "Al (Buy)", "Sat (Sell)" veya "Tut (Hold)" sinyali üretme.

### ⏳ Backtesting & Doğrulama
Oluşturulan stratejilerin geçmiş performansını test etmek için kullanılan güçlü simülasyon aracı.
- **AI Destekli Simülasyon:** Strateji kodunu, seçilen varlık ve tarih aralığına göre çalıştırarak gerçekçi bir backtest simülasyonu yapar.
- **Kapsamlı Metrikler:** Net Kâr, Sharpe Oranı, Maksimum Düşüş (Max Drawdown), Kazanma Oranı (Win Rate) gibi kritik performans metriklerini sunar.
- **Görsel Geri Bildirim:** Simülasyon sonuçlarını bir özkaynak eğrisi grafiği (Equity Curve) ve detaylı bir işlem günlüğü (Trade Log) ile görselleştirir.

### ⚙️ Ayarlar
Platformun ve kullanıcı hesabının tüm ayarlarının yönetildiği bölüm.
- **Profil Yönetimi:** Kullanıcı adı ve avatar URL'i gibi kişisel bilgilerin güncellenmesi.
- **Risk Yönetimi:** Kullanıcının kendi risk iştahını (Value at Risk, Max Position Size vb.) tanımlayıp kaydetmesine olanak tanıyan kişisel risk profili yönetimi.
- **API Anahtarları:** Canlı trading için borsa API anahtarlarının yönetimi.
- **AI Yönetimi:** Kullanılan AI sağlayıcısını (Google, OpenAI vb.) ve ilgili dil modelini dinamik seçim kutularıyla yapılandırma.
- **Görünüm:** Ana ve vurgu renklerini canlı olarak değiştirerek platformun görünümünü kişiselleştirme.

## Teknolojiler ve Mimari

- **Framework:** Next.js 15 (App Router)
- **Dil:** TypeScript
- **Stil:** Tailwind CSS
- **UI Bileşenleri:** ShadCN UI (Kapsamlı ve özelleştirilebilir bileşen kütüphanesi)
- **AI/Generative:** Genkit (Google AI) - Modüler ve ölçeklenebilir AI akışları için.
- **Veritabanı:** Firebase Firestore (Güvenli ve gerçek zamanlı NoSQL veritabanı)
- **Kimlik Doğrulama:** Firebase Authentication
- **Form Yönetimi:** React Hook Form & Zod (Güçlü ve tip-güvenli form doğrulama)
- **Grafikler:** Recharts

## Projeye Başlarken

Bu proje bir Firebase Studio başlangıç projesidir. Başlamak için `src/app/page.tsx` dosyasına göz atın ve platformu keşfetmeye başlayın. Proje, canlı veri akışlarını simüle eden ve tüm yapay zeka özelliklerinin çalışır durumda olduğu bir yapılandırma ile gelir.
