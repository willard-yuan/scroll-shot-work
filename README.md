# ScrollShot — Long Screenshot & Scroll Capture for iPhone

**One scroll recording. One clean long screenshot.** ScrollShot turns scrolling
content — chats, webpages, app screens, documents, and tutorials — into a single
high-quality **long screenshot** without the pain of taking, sorting, and cropping
dozens of separate captures.

Record a scroll once, and ScrollShot extracts frames, removes duplicates, matches
overlaps, and stitches everything into one full-page image you can save, inspect,
and share.

![ScrollShot — long screenshot and scroll capture for iPhone](https://scrollshot.work/scrollshot_app_prview.webp)

> 📱 **ScrollShot** is an iOS **long screenshot app** with automatic
> recording-based stitching, manual stitching, seam fine-tuning, image saving, and
> PDF sharing. A Mac version is free to try.

---

## 📥 Download ScrollShot

| Platform | Link |
| :--- | :--- |
| **iPhone / iOS** (App Store) | [Download ScrollShot on the App Store](https://apps.apple.com/us/app/scrollshot-long-screenshot/id6760192003) |
| **Mac** (free trial) | [Download ScrollShot for Mac (.dmg)](https://mac.scrollshot.work/ScrollShot.dmg) |
| **Official website** | [scrollshot.work](https://scrollshot.work/) |

Start with the **free manual stitching** workflow, then upgrade to **Pro** for
automatic recording-based stitching whenever you need it.

---

## ✨ Why ScrollShot

ScrollShot is built for real scrolling workflows. Whether you are saving a chat
thread, a long article, a product page, or a tutorial, it replaces repetitive
capture work with a clean, accurate **scroll capture** flow.

- **Record once, auto stitch** — Start a system screen recording, scroll through
  the content, and ScrollShot automatically extracts key frames, filters
  duplicates, and finds stable overlap regions to build the complete long image.
- **Fine-tune seams** — Inspect the first pass, adjust boundaries, and clean common
  scrollbar traces before saving.
- **Stitch images in order** — Pick screenshots manually and keep the exact order
  you choose; the first image becomes the top of the final long screenshot.
- **Image / PDF sharing** — Save to Photos, share the result as an image, or export
  it as a **PDF** for teammates, clients, and archives.
- **On-device processing** — Stitching runs on your device. Your photos are not
  uploaded for stitching, so private chats, transactions, and product details stay
  private.
- **Make the tool feel yours** — Multiple themes and languages, then export
  high-resolution images.

### Keywords

long screenshot · scrolling screenshot · full-page screenshot · screenshot
stitching · scroll capture · iPhone long screenshot · iOS screenshot stitching ·
stitch screenshots · PDF export · on-device privacy

---

## 🔄 How it works (3 steps)

1. **Record the scroll** — Start iOS screen recording and scroll naturally through
   the chat, webpage, or document.
2. **Auto stitch** — ScrollShot extracts frames, removes duplicates, detects
   overlaps, and builds the complete long image.
3. **Save or share** — Save to Photos, share the image, or export a PDF.

---

## 🎯 Use cases

- **Chats & support handoffs** — Keep full conversations, context, and resolution
  steps in one image instead of flipping through Photos.
- **Webpages, articles & tutorials** — Save long webpages, blog posts, product docs,
  and step-by-step tutorials as one readable long screenshot.
- **Themes, languages & sharing** — Use multiple themes and languages, then share as
  an image or PDF for personal and work contexts.

---

## 🔒 Privacy

ScrollShot is designed around an **on-device stitching** flow. Photos are used only
for selecting source images, reading image data, and saving results; they are not
uploaded for stitching. Photos permission is requested to select screenshots, read
source images, save stitched results, and clean up originals only after you confirm.

---

## 🌐 Supported languages

English, 简体中文, 繁體中文, 日本語, 한국어, Deutsch, Français, Português (Brasil),
Español, Italiano, Nederlands, Русский, Türkçe, Polski, Bahasa Indonesia, Tiếng
Việt, ไทย, हिन्दी, العربية, and more.

---

## 💎 Pricing

| | iPhone (Pro) | Mac (Free) |
| :--- | :--- | :--- |
| **Highlights** | The fastest automatic workflow | Auto-stitched scroll capture (up to 30,000px) |
| | Automatic stitching from recordings | OCR + translate to 30+ languages, in place |
| | All theme colors | 19+ native annotation tools |
| | Future advanced features | Record & edit video without leaving the app |
| **Get it** | [App Store](https://apps.apple.com/us/app/scrollshot-long-screenshot/id6760192003) | [Download .dmg](https://mac.scrollshot.work/ScrollShot.dmg) |

Exact Pro pricing, subscription, or lifetime purchase options are shown in the App
Store. You can start with free manual stitching before upgrading.

---

## ❓ FAQ

**How is ScrollShot different from system screenshots?**
System screenshots capture the current screen. ScrollShot is designed for scrolling
content, turning a recording or multiple screenshots into one long image with fine
tuning, scrollbar cleanup, and PDF sharing.

**How does automatic stitching work?**
Start a system screen recording, scroll through the content, then choose the video
in ScrollShot. The app extracts frames, removes duplicates, matches overlap regions,
and generates a long image.

**Can I export as PDF?**
Yes. After saving the result, you can share it as an image or export it as a PDF.

**Is Android supported?**
This website presents the iOS version and does not promise Android support.

---

## 🛠️ Local development (build this website)

This repository is the **ScrollShot marketing website** (built with
[Astro](https://astro.build)). The instructions below are for developers who want to
run or contribute to the site — not for installing the ScrollShot app (use the
[download links](#-download-scrollshot) above for that).

### Requirements

- **Node.js** `>=22.12.0`
- npm (or pnpm / yarn)

### Setup

```sh
# Install dependencies
npm install

# Start the local dev server at http://localhost:4321
npm run dev

# Build the production site to ./dist/ (runs Astro build + IndexNow ping)
npm run build

# Preview the production build locally
npm run preview
```

### Project structure

```text
/
├── public/            # static assets, favicons, IndexNow key
├── src
│   ├── components/    # Astro components (incl. LanguagePrompt banner)
│   ├── layouts/       # page layouts
│   ├── pages/         # routes (11+ localized homepages, blog, 404)
│   ├── data/          # i18n locales, blog content collections
│   └── styles/        # shared styles
├── scripts/           # build hooks (IndexNow ping, App Store rating)
└── package.json
```

### Notes

- The site is statically generated and deployed to **Cloudflare Pages**.
- `npm run build` triggers an automatic [IndexNow](https://www.indexnow.org/)
  submission so search engines (Bing, Yandex, Naver, Seznam) pick up new URLs fast.
- Multi-language: the site ships 11+ localized homepages with symmetric `hreflang`
  clusters and a self-hosted `x-default`.

---

## 🔗 Links

- 🌐 Official website: [scrollshot.work](https://scrollshot.work/)
- 📱 iOS App Store: [ScrollShot — Long Screenshot](https://apps.apple.com/us/app/scrollshot-long-screenshot/id6760192003)
- 💻 Mac download: [ScrollShot.dmg](https://mac.scrollshot.work/ScrollShot.dmg)
- 📝 Terms of Service: [scrollshot.work/tos](https://scrollshot.work/tos/en/)

---

<p align="center">
  <b>ScrollShot</b> — the easy way to capture, stitch, and share long screenshots
  on iPhone. <a href="https://apps.apple.com/us/app/scrollshot-long-screenshot/id6760192003">Download on the App Store</a>.
</p>
