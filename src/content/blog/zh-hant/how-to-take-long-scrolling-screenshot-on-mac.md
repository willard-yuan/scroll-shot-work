---
title: "Mac 長截圖怎麼截？2026 滾動截圖完全指南"
description: "macOS 沒有內建的滾動截圖功能。這篇 2026 指南說明原因，比較 GoFullPage、Shottr、CleanShot X、Xnapper、screensnap 與 ScrollShot，並示範如何用 ScrollShot for Mac 免費截取任何視窗。"
date: "2026-08-05"
category: "使用教學"
author: "ScrollShot 團隊"
tags: ["Mac 長截圖", "Mac 滾動截圖", "Mac 截圖工具", "ScrollShot for Mac", "macOS 截圖", "滾動拼接"]
readingTime: "10 分鐘閱讀"
cover: "/how-to-take-long-scrolling-screenshot-on-mac-2026/hero-long-screenshot-mac-before-after.webp"
coverAlt: "一般 Mac 截圖（一屏）與 ScrollShot 765 × 4091 px 滾動擷取同一內容的對比"
translationKey: "how-to-take-long-scrolling-screenshot-on-mac-2026"
faq:
  - question: "可以用 Mac 內建的截圖 App 截長截圖嗎？"
    answer: "不行。Cmd + Shift + 4 與截圖 App 只擷取可視螢幕。你需要瀏覽器功能、匯出 PDF，或第三方 App 如 ScrollShot、Shottr 或 CleanShot X。"
  - question: "在 Mac 上截長截圖，最快的免費方式是什麼？"
    answer: "僅限網頁：GoFullPage（30 秒內）。瀏覽器以外的任何內容（Slack、PDF、App）：ScrollShot for Mac 或 Shottr——兩者都免費，都能用於任何可滾動區域。"
  - question: "有免費的滾動截圖工具還能翻譯和遮罩嗎？"
    answer: "有——ScrollShot for Mac。它免費，且獨特地將滾動擷取與 OCR、30+ 語言翻譯、19+ 註解工具，以及自動遮罩個人資料/人臉整合進同一個 App。"
  - question: "滾動截圖能用於 PDF 和文件嗎？"
    answer: "可以，只要你對在預覽或閱讀器中開啟的 PDF 使用原生滾動擷取 App（ScrollShot、Shottr、CleanShot X）。內建的「儲存為 PDF」給你的是文件，不是圖片。"
  - question: "為什麼我的長截圖有重複的頁首？"
    answer: "頁面有一個固定元素（聊天氣泡、導覽列、Cookie 橫幅）在內容滾動時保持固定。擷取前先關閉或隱藏它。"
  - question: "長截圖該存成什麼格式？"
    answer: "PNG 保留品質與透明度；若檔案大小重要且不需要透明，用 JPG；僅在需要可搜尋文字時用 PDF。"
---

# Mac 長截圖怎麼截？2026 滾動截圖完全指南

先幫你省下我第一次需要時浪費的 20 分鐘。

我有一條 4,000 像素長的 Slack 對話要傳給工程師。我按下 `Cmd + Shift + 4`、拉了一個框，結果只截到……一屏。剩下的對話都在摺疊線以下，macOS 很樂意地忽略了它。Mac 上**沒有原生方式能截長截圖（滾動截圖）**——`Cmd + Shift + 4` 不行、截圖 App 不行、預覽程式也不行。如果你是想來找 Apple 的隱藏快捷鍵，我直接告訴你：不存在。Windows 的剪取工具就有；iPhone 有；Android 有；而 macOS 到了 2026 年，依然沒內建。

好消息是：這完全可以解決，而且你的選擇比多數「Top 8 清單」部落格承認的還多。這篇指南不只講表面。我會解釋 *為什麼* Mac 原生做不到、當 App「滾動拼接」時實際發生了什麼，以及哪個工具適合哪種場景——包括我現在每天在用的那一個，**[ScrollShot for Mac](/zh-hant/blog/why-choose-scrollshot-ios-long-screenshot/)**（免費，也是唯一能在單一 App 內完成整個流程的選擇）。

![Before vs After：一般 Mac 截圖（一屏）與 ScrollShot 765 × 4091 px 滾動擷取同一內容的對比](/how-to-take-long-scrolling-screenshot-on-mac-2026/hero-long-screenshot-mac-before-after.webp)

*一般截圖只擷取可視視窗。ScrollShot 一次擷取整個 765 × 4091 px 的可滾動區域——隨後還能在不離開 App 的情況下註解、OCR、翻譯與遮罩。*

---

## 為什麼 macOS 無法原生截長截圖

這不是 Apple 偷懶——而是螢幕的運作方式使然。

當你按下 `Cmd + Shift + 4`，macOS 抓取的是目前的 *framebuffer*（幀緩衝區）：當下實際顯示在螢幕上的像素級快照。可滾動的視窗（Slack、網頁、PDF）只會渲染可視部分。螢幕外的內容並沒有「在那裡」可供擷取——它是你滾動時才按需繪製出來的。它不像終端機有「回滾緩衝區」。所以截圖工具只有兩條路：

1. **向 App 索取完整內容**（只有該 App 願意提供才有效——瀏覽器可以，多數 App 不行）。
2. **滾動一點、截一點、重複，再把片段滾動拼接成一張長圖。**

Mac 上每個「滾動截圖」工具底層做的都是第 2 種（或是第 1 種，但僅限網頁）。這個區別很重要，因為它解釋了為什麼有些工具只在 Chrome 裡能用，有些則*隨處*都能用。

![可視視窗 vs 完整可滾動內容——macOS 只擷取螢幕上的內容，而非摺疊線以下的內容](/how-to-take-long-scrolling-screenshot-on-mac-2026/img-viewport-vs-full.webp)

---

## 三類解決方案

在給建議前，先搞清楚類別。它們不可互換。

| 類別 | 運作方式 | 最適合 | 做不到 |
| --- | --- | --- | --- |
| **僅限瀏覽器**（GoFullPage、Firefox 內建、DevTools、Safari Web Inspector） | 向頁面索取完整 DOM/內容 | *在該瀏覽器中開啟的* 網頁 | Slack、預覽中的 PDF、App 視窗、Figma 看板 |
| **原生滾動擷取 App**（Shottr、CleanShot X、Xnapper、**ScrollShot**、screensnap*） | 滾動 + 拼接真實螢幕 | *任何* 可滾動區域，包含非瀏覽器 App | —（僅受 App 品質限制） |
| **匯出 PDF**（`Cmd + P` → 儲存為 PDF） | 將版面渲染成文件 | 可搜尋的封存、列印 | 不是圖片；無法內嵌貼上 |

\* *screensnap（ScreenSnap Pro）是個值得注意的例外——見下方註記。它是註解工具，不是滾動擷取工具。*

---

## 快速推薦（趕時間請看這段）

- **你只截網頁** → 像 GoFullPage 這類瀏覽器擴充功能就夠了，而且免費。
- **你需要截 Slack、PDF、App 視窗或文件** → 你需要原生 App。
- **你想要一個免費工具，能擷取 *並且* 做 OCR、翻譯、註解、模糊敏感資訊，甚至錄影——不必付費或訂閱** → **ScrollShot for Mac**。它是本指南中唯一以原生、免費方式涵蓋整條流程的選擇。

![三款工具比較：GoFullPage（僅限網頁）、CleanShot X（29 美元/年）、ScrollShot（免費、一體化）](/how-to-take-long-scrolling-screenshot-on-mac-2026/img-3up-comparison-cards.webp)

---

## 完整比較（Shottr、CleanShot X、Xnapper、screensnap、ScrollShot）

我在 macOS 15/26 上實測了常見的幾款。以下是它們的真實表現，不是行銷話術。為了保持可讀，我把內容拆成兩張聚焦的表格——每個工具能**擷取**什麼，以及能對**結果**做什麼。

### 擷取範圍

| 工具 | 價格 | 滾動擷取 | 瀏覽器之外也能用？ |
| --- | --- | --- | --- |
| **ScrollShot for Mac** | **免費** | ✅ 透過 Apple Vision 自動拼接 | ✅ 任何可滾動區域 |
| **Shottr** | 免費（12 美元一次性去提示） | ✅ 手動滾動 + 拼接 | ✅ |
| **CleanShot X** | 29 美元/年（或 59 美元一次性） | ✅ 自動或手動 | ✅ |
| **Xnapper** | 24 美元一次性 | ✅ | ✅ |
| **screensnap（ScreenSnap Pro）** | 39 美元一次性 | ❌ **無滾動擷取** | ❌ |
| **GoFullPage** | 免費（有付費方案） | ✅（僅限瀏覽器） | ❌ 僅網頁 |

### 擷取後編輯

| 工具 | 註解 | OCR + 翻譯 | 影片錄製/編輯 | 自動遮罩個資 |
| --- | --- | --- | --- | --- |
| **ScrollShot for Mac** | ✅ 19+ 工具 | ✅ 30+ 語言 | ✅ MP4/GIF + 裁剪 | ✅ 電郵、電話、API 金鑰、人臉 |
| **Shottr** | ✅ 基本 | ⚠️ 僅 OCR，無翻譯 | ❌ | ❌ |
| **CleanShot X** | ✅ 強大 | ❌ | ✅（另購） | ⚠️ 僅手動模糊 |
| **Xnapper** | ✅ + 美化 | ❌ | ❌ | ⚠️ 自動隱私模糊 |
| **screensnap（ScreenSnap Pro）** | ✅ 15 工具 + 背景 | ❌ | ✅ GIF | ⚠️ 僅手動模糊 |
| **GoFullPage** | ⚠️ 基本裁切 | ❌ | ❌ | ❌ |

**screensnap 的現實檢視。** screensnap 自己的部落格（「8 種方法按速度排名」）確實是一份實用的排名清單——但注意它對「實際擷取」的建議是 GoFullPage 和 Shottr。ScreenSnap Pro 本身 *無法* 截長截圖。它是為*下一步*而生的（美化 + 註解 + 分享你已在別處做好的擷取）。所以如果你的問題是「我首先就需要那張長圖」，screensnap 不是擷取方案，而是擷取後的方案。相對地，ScrollShot 在同一個免費 App 內同時完成擷取 *與* 註解/模糊/分享。

---

## 「滾動拼接」實際如何運作（以及為什麼會失敗）

當 ScrollShot（或 Shottr、CleanShot）截一張長圖時，滾動拼接的流程是：

1. 擷取可視區域。
2. 模擬滾動（或等你滾動）。
3. 擷取下一個區域。
4. **比對兩幀之間重疊的像素**以找出接縫。
5. 拼接起來，然後重複直到你停止。

比對這一步，決定了任何滾動拼接流程中工具的成敗。ScrollShot 的[拼接引擎](/zh-hant/blog/ios-stitching-engine-v2/)使用 Apple 的 Vision 框架進行幀比對，這也是為什麼它比天真的像素差異法更能應對變動的滾動速度與輕微的版面偏移。不過仍有三件事會讓任何拼接器失敗：

- **固定不動的頁首/頁尾**——內容滾動時它不動 → 重複的長條。（先關掉聊天小工具與 Cookie 橫幅。）
- **懶加載內容**——滾動後才出現 → 空白缺口。（先滾動一圈，再從頂端擷取。）
- **固定寬度假設**——若你調整視窗大小，輸出寬度會變。擷取前先決定寬度。

![滾動拼接如何運作：工具比對重疊條帶，找出第 2 幀接在第 1 幀的位置](/how-to-take-long-scrolling-screenshot-on-mac-2026/img-stitch-overlap.webp)

---

## 逐步操作：用 ScrollShot for Mac 截一張長圖

這是我現在什麼都用的一套流程。

**1. 安裝（30 秒）。**  
從 [`mac.scrollshot.work/ScrollShot.dmg`](https://mac.scrollshot.work/ScrollShot.dmg) 下載，打開 DMG，拖進「應用程式」。無帳號、無授權金鑰。

![安裝 ScrollShot：打開 DMG，將 App 拖進應用程式](/how-to-take-long-scrolling-screenshot-on-mac-2026/img-dmg-install.webp)

**2. 觸發滾動擷取。**  
按下滾動擷取快捷鍵（或從選單列選取）。在可滾動區域周圍拉一個框——網頁、Slack 窗格、PDF 欄位，隨便哪個。

**3. 滾動。**  
用觸控板或滑鼠滾輪滾動。ScrollShot 即時自動拼接；你可以在預覽中看著長圖長大。擷取完所有內容後停止。

![即時預覽：ScrollShot 邊滾動邊自動拼接，你能看著長圖長大](/how-to-take-long-scrolling-screenshot-on-mac-2026/img-live-preview.webp)

**4. 一張圖，已可直接編輯。**  
完成時，你不會被丟進另一個編輯器。同一個視窗讓你能：加箭頭/編號、**OCR 文字並就地翻譯成 30+ 語言**、模糊或自動遮罩電郵/電話/API 金鑰/人臉，再匯出成 PNG 或存到美化過的漸層背景。

![註解完成的長圖：箭頭、編號、模糊與翻譯——不離開 App](/how-to-take-long-scrolling-screenshot-on-mac-2026/img-annotation-toolbar.webp)

**5. 分享。**  
複製到剪貼簿、上傳到你的 S3/雲端，或匯出。完成——不離開 App。

最後這點是我換工具真正的原因。用 Shottr 時，我擷取完還要開另一個 App 來註解。用 CleanShot X，我得每年付 29 美元才享有這項特權。而經過滾動拼接擷取後，ScrollShot 在一次流程內免費完成 擷取 → 編輯 → 翻譯 → 遮罩 → 匯出。

---

## 什麼時候 *不該* 用滾動擷取 App

誠實面對需求：

- **你需要可搜尋、可複製的文字**（法律封存、研究 PDF）→ `Cmd + P` → 儲存為 PDF。一張 12,000 像素高的 PNG 無法搜尋。
- **你只在一個瀏覽器裡截圖**且從不出其右 → GoFullPage 或 Firefox 內建的「擷取螢幕 → 儲存整頁」更輕量。
- **你需要像素級精準的印刷版面** → 還是 PDF。

其他一切——聊天對話、文件、設定面板、你會註解的長網頁——原生滾動 App 勝出。

---

## 常見坑（與解法）

- **輸出出現重複頁首** → 固定元素。擷取前先關掉它，或用一個固定元素處理良好的工具。
- **中間段落遺失** → 無限滾動 / 懶加載。先滾到底一次，再從頂端擷取。
- **文字模糊** → 以低 DPI 擷取。擷取前把視窗放大（或放大畫面）。
- **檔案超大** → 一張 10,000 像素高的 PNG 可能好幾 MB。分享前先壓縮，或拆成數段以利閱讀。

---

## 常見問題

**可以用 Mac 內建的截圖 App 截長截圖嗎？**  
不行。`Cmd + Shift + 4` 與截圖 App 只擷取可視螢幕。你需要瀏覽器功能、匯出 PDF，或第三方 App 如 ScrollShot、Shottr 或 CleanShot X。

**在 Mac 上截長截圖，最快的免費方式是什麼？**  
僅限網頁：GoFullPage（30 秒內）。瀏覽器以外的任何內容（Slack、PDF、App）：ScrollShot for Mac 或 Shottr——兩者都免費，都能用於任何可滾動區域。

**有免費的滾動截圖工具還能翻譯和遮罩嗎？**  
有——[ScrollShot for Mac](/zh-hant/blog/why-choose-scrollshot-ios-long-screenshot/)。它免費，且獨特地將滾動擷取與 OCR、30+ 語言翻譯、19+ 註解工具，以及自動遮罩個人資料/人臉整合進同一個 App。

**滾動截圖能用於 PDF 和文件嗎？**  
可以，只要你對在預覽或閱讀器中開啟的 PDF 使用原生滾動擷取 App（ScrollShot、Shottr、CleanShot X）。內建的「儲存為 PDF」給你的是文件，不是圖片。

**為什麼我的長截圖有重複的頁首？**  
頁面有一個固定元素（聊天氣泡、導覽列、Cookie 橫幅）在內容滾動時保持固定。擷取前先關閉或隱藏它。

**長截圖該存成什麼格式？**  
PNG 保留品質與透明度；若檔案大小重要且不需要透明，用 JPG；僅在需要可搜尋文字時用 PDF。
