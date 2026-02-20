# FPILOT: Neural Finance Trader

FPILOT, bireysel ve kurumsal yatırımcılar için tasarlanmış, yapay zeka destekli, kurumsal düzeyde bir algoritmik trading platformudur. Kullanıcıların doğal dil kullanarak trading stratejileri oluşturmasına, bu stratejileri geçmiş verilerle test etmesine, piyasa koşullarına göre optimize etmesine ve bu optimize edilmiş stratejileri tek tuşla canlı çalışan botlara dönüştürmesine olanak tanır. Platform, pasif bir araç olmaktan ziyade, kullanıcısını bir **sistem operatörüne** dönüştürür.

---

## 🚀 Platform Felsefesi: Uçtan Uca Entegre Zeka

FPILOT, birbirinden kopuk araçlar sunmak yerine, bir fikrin saniyeler içinde canlı bir trading operasyonuna dönüşmesini sağlayan, **kapalı döngü bir zeka sistemi** olarak tasarlanmıştır.

1.  **FİKİR (`Stratejiler`):** Aklınızdaki herhangi bir trading hipotezini doğal dille yazın. AI, saniyeler içinde bu hipotezi test edilebilir, çalışan bir Typescript stratejisine dönüştürür.

2.  **OPTİMİZASYON (`Stratejiler`):** Mevcut stratejinizin kodunu, `Tune with AI` özelliğiyle yapay zekaya analiz ettirin. AI, piyasanın mevcut rejimine göre en uygun parametreleri (RSI periyodu, stop-loss yüzdesi vb.) bulur ve kanıtlarıyla sunar.

3.  **UYGULAMA (`Stratejiler`):** AI'ın bulduğu bu "optimal" parametreleri, **"Apply Optimized Parameters"** butonuyla tek bir tıklamayla doğrudan strateji kodunuza kalıcı olarak işleyin. Teori biter, aksiyon başlar.

4.  **DOĞRULAMA (`Backtesting`):** Optimize ettiğiniz bu yeni stratejinin geçmiş performansını, kapsamlı metrikler (Net Kâr, Sharpe Oranı, Maksimum Düşüş vb.) ve görsel grafiklerle backtest motorunda doğrulayın.

5.  **AKTİVASYON (`Backtesting`):** Backtest sonuçları tatmin edici mi? **"Launch as AI Bot"** butonuyla, doğruladığınız bu stratejiyi saniyeler içinde, canlı piyasada çalışan otonom bir bota dönüştürün.

6.  **OPERASYON (`AI Botlar`):** Başlattığınız bot, artık sadece sabit bir mantıkla çalışmaz. Sinyal üretirken, hem bağlı olduğu **stratejinin güncel kodunu** hem de `Ayarlar`'da tanımladığınız **kişisel risk profilinizi** (VaR, Max Position Size) aktif olarak kullanarak size özel kararlar verir.

---

## MODULE DERİNLEMESİNE BAKIŞ

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
- **Akıllı Sinyal Üretimi:** "Aktif" durumdaki botlar, periyodik olarak AI kullanarak piyasayı analiz eder. Bu analiz, sadece genel bir mantığa değil, doğrudan botun bağlı olduğu **stratejinin koduna** ve kullanıcının **Ayarlar'da tanımladığı risk profiline** dayanır.
- **Otomatik Emir Oluşturma:** Üretilen "Al" veya "Sat" sinyalleri, anında "Son Emirler" paneline yansıyan gerçek ticaret emirlerine dönüştürülür.

### 📜 Stratejiler
Yapay zeka ile trading stratejileri oluşturma, yönetme ve optimize etme merkezi.
- **Strateji Listesi:** Kullanıcıya ait tüm stratejilerin modern bir kart görünümünde listelenmesi.
- **AI ile Oluştur:** Doğal dil (prompt) kullanarak sıfırdan, çalışan bir trading stratejisi (Typescript kodu) ve açıklaması oluşturma.
- **AI ile Ayarla (Tune & Apply):** Mevcut bir stratejinin kodunu analiz ederek ayarlanabilir parametreleri bulan, piyasa koşullarına göre bu parametreleri optimize eden ve son olarak bu yeni parametreleri tek tuşla strateji koduna kalıcı olarak işleyen yapay zeka aracı.

### 📊 Analiz Motoru
Yapay zeka gücüyle piyasa öngörüleri ve alım-satım sinyalleri üretme.
- **Piyasa Rejimi Tahmini:** Seçilen bir kripto para için piyasanın "Boğa (Bull)", "Ayı (Bear)" veya "Yatay (Sideways)" rejimlerinden hangisinde olduğunu gerekçesi ve güven skoruyla birlikte tahmin etme.
- **Sinyal Üretici:** Kullanıcının belirlediği strateji tipi, risk seviyesi ve kripto paraya göre "Al (Buy)", "Sat (Sell)" veya "Tut (Hold)" sinyali üretme.

### ⏳ Backtesting & Doğrulama
Oluşturulan stratejilerin geçmiş performansını test etmek için kullanılan güçlü simülasyon aracı.
- **AI Destekli Simülasyon:** Strateji kodunu, seçilen varlık ve tarih aralığına göre çalıştırarak gerçekçi bir backtest simülasyonu yapar.
- **Kapsamlı Metrikler:** Net Kâr, Sharpe Oranı, Maksimum Düşüş (Max Drawdown), Kazanma Oranı (Win Rate) gibi kritik performans metriklerini sunar.
- **Tek Tıkla Canlıya Alma:** Başarılı bir backtest sonucundan sonra, "Launch as AI Bot" butonu ile stratejiyi anında canlı bir bota dönüştürme yeteneği.

### 🔌 Data Collection Engine
Platformun AI modellerini besleyen veri kaynaklarının yönetildiği **interaktif** kontrol merkezi.
- **Dinamik Kontrol:** Kullanıcılar, AI'ın analiz yaparken hangi veri kategorilerini (örneğin "Sosyal Medya" veya "On-Chain") kullanacağını interaktif anahtarlarla açıp kapatabilir.
- **Kapsamlı Veri Kaynakları:**
    - **Piyasa Verileri:** Borsa fiyat ve hacim akışları.
    - **Türev Piyasası Zekası:** Funding Rates, Open Interest gibi profesyonel metrikler.
    - **On-Chain Metrikler:** Glassnode, CryptoQuant gibi kaynaklardan gelen zincir üstü veriler.
    - **Makroekonomik Veriler:** FED (FRED) ve VIX gibi global ekonomik göstergeler.
    - **Duyarlılık Verileri:** Haber akışları, sosyal medya ve özel RSS beslemeleri.

### ⚙️ Ayarlar
Platformun ve kullanıcı hesabının tüm ayarlarının yönetildiği bölüm.
- **Profil Yönetimi:** Kişisel bilgilerin ve avatarın güncellenmesi.
- **Risk Yönetimi:** Kullanıcının kendi risk iştahını (Value at Risk, Max Position Size vb.) tanımlayıp kaydetmesine olanak tanıyan ve **canlı botların kararlarını doğrudan etkileyen** kişisel risk profili.
- **API Anahtarları:** Canlı trading için borsa API anahtarlarının yönetimi.
- **AI Danışmanı:** Kullanılan AI sağlayıcısını (Google, OpenAI vb.) ve modeli yapılandırma. Proaktif öneri motoru altyapısı.
- **Görünüm ve Dil:** Platformun renk paletini ve dilini (İngilizce/Türkçe) kişiselleştirme.

---

## 🛠️ Teknolojiler ve Mimari

- **Framework:** Next.js 15 (App Router)
- **Dil:** TypeScript
- **Stil:** Tailwind CSS
- **UI Bileşenleri:** ShadCN UI (Kapsamlı ve özelleştirilebilir bileşen kütüphanesi)
- **AI/Generative:** Genkit (Google AI) - Modüler ve ölçeklenebilir AI akışları için.
- **Veritabanı:** Firebase Firestore (Güvenli ve gerçek zamanlı NoSQL veritabanı)
- **Kimlik Doğrulama:** Firebase Authentication
- **Form Yönetimi:** React Hook Form & Zod (Güçlü ve tip-güvenli form doğrulama)
- **Grafikler:** Recharts
- **Uluslararasılaşma (i18n):** React Context ve JSON tabanlı özel lokalizasyon altyapısı.

---

## Projeye Başlarken

Bu proje bir Firebase Studio başlangıç projesidir. Başlamak için platformu keşfetmeye başlayın. Proje, canlı veri akışlarını simüle eden ve tüm yapay zeka özelliklerinin çalışır durumda olduğu bir yapılandırma ile gelir.
