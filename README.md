# ChatKit AI Asistanı - Eren Kılınç

Bu proje, [ChatKit](http://openai.github.io/chatkit-js/) tabanlı bir AI asistan uygulamasıdır. **Eren Kılınç YouTube videoları** için özel olarak eğitilmiş bir AI asistanı içerir ve YouTube temasında tasarlanmıştır. Minimal Next.js arayüzü, ChatKit web bileşeni ve kullanıma hazır oturum endpoint'i ile birlikte gelir.

Bu asistan, Eren Kılınç'ın YouTube içerikleri hakkında sorular yanıtlayabilir ve video konuları hakkında bilgi verebilir.

## Bu Projede Neler Var

- YouTube temalı Next.js uygulaması ve `<openai-chatkit>` web bileşeni
- [`app/api/create-session/route.ts`](app/api/create-session/route.ts) dosyasında oturum oluşturma API endpoint'i
- Eren Kılınç YouTube videoları için özel eğitilmiş AI asistanı
- Başlangıç komutları, yer tutucu metinler ve karşılama mesajı örnekleri

## Başlangıç

Uygulamayı yerel olarak çalıştırmak ve tercih ettiğiniz backend için yapılandırmak üzere aşağıdaki adımları takip edin.

### 1. Bağımlılıkları yükleyin

```bash
npm install
```

### 2. Ortam değişkenleri dosyasını oluşturun

Örnek dosyayı kopyalayın ve gerekli değerleri doldurun:

```bash
cp .env.example .env.local
```

### 3. ChatKit kimlik bilgilerini yapılandırın

`.env.local` dosyasını kurulumunuza uygun değişkenlerle güncelleyin.

- `OPENAI_API_KEY` — **Agent Builder ile aynı organizasyon ve proje içinde** oluşturulan API anahtarı
- `NEXT_PUBLIC_CHATKIT_WORKFLOW_ID` — [Agent Builder](https://platform.openai.com/agent-builder)'da oluşturduğunuz workflow
- (opsiyonel) `CHATKIT_API_BASE` - ChatKit API endpoint'i için özelleştirilebilir temel URL

### 4. Uygulamayı çalıştırın

```bash
npm run dev
```

`http://localhost:3000` adresini ziyaret edin ve sohbete başlayın. Workflow bağlantınızı doğrulamak için başlangıç ekranındaki komutları kullanın, ardından [`lib/config.ts`](lib/config.ts) ve [`components/ChatKitPanel.tsx`](components/ChatKitPanel.tsx) dosyalarında UI veya komut listesini özelleştirin.

### 5. Prodüksiyon için derleyin (opsiyonel)

```bash
npm run build
npm start
```

## Özelleştirme İpuçları

- [`lib/config.ts`](lib/config.ts) dosyasında başlangıç komutlarını, karşılama metnini ve yer tutucu metinleri ayarlayın.
- [`components/ChatKitPanel.tsx`](components/ChatKitPanel.tsx) içindeki tema varsayılanlarını veya olay işleyicilerini güncelleyerek ürün analitiğiniz veya depolamanızla entegre edin.

## Özel Özellikler

- **YouTube Temalı Tasarım**: Kırmızı renk şeması ve YouTube'a benzer arayüz
- **Eren Kılınç Branding**: Alt kısımda telif hakkı ve kişisel web sitesi linki
- **Eren Kılınç YouTube Videoları İçin Eğitilmiş AI**: Asistan, Eren Kılınç'ın YouTube içerikleri hakkında özel bilgiye sahiptir

## Geliştirici

**Eren Kılınç**  
- Website: [link.erenkilinc.com](https://link.erenkilinc.com)
- © 2025 Tüm hakları saklıdır

## Referanslar

- [ChatKit JavaScript Kütüphanesi](http://openai.github.io/chatkit-js/)
- [Gelişmiş Self-Hosting Örnekleri](https://github.com/openai/openai-chatkit-advanced-samples)
