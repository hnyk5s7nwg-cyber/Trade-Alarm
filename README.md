# Trade Alarm PWA — iPhone

Mac/Xcode gerekmez. HTTPS üzerinde yayınlandıktan sonra iPhone'da Safari ile aç → Paylaş → Ana Ekrana Ekle / Open as Web App. Ana ekran ikonundan aç. İlk açılışta **BİLDİRİMLERİ AÇ** düğmesine bas.

## Sunucu kurulumu
1. Node.js 20+ bir HTTPS host kullan (Render/Railway/Fly/VPS vb.).
2. `npm install`
3. VAPID anahtarı üret: `npx web-push generate-vapid-keys`
4. Host ortam değişkenlerine `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT` ekle.
5. `npm start`

## Ne yapıyor?
- Binance Global USDⓈ-M Futures public verisini tarar.
- LONG ve SHORT adaylarını aynı motorla değerlendirir.
- Sermayeye göre margin, kaldıraç, stop, maksimum kayıp ve TP kârını hesaplar.
- `SETUP'I İZLE` sonrası backend 7/24 kontrol eder.
- Setup koşulları geçerliyken giriş bölgesine gelirse Web Push ile `İŞLEME GİR` bildirimi yollar.
- Otomatik Binance emri açmaz.

Not: Sunucu belleğindeki alarm kayıtları sunucu yeniden başlarsa silinir. Kalıcı üretim sürümünde Redis/DB eklenmelidir.
