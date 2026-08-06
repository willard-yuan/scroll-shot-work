---
title: "用戶堅持要往回滑著截圖——而我用一行程式碼避開了重寫整個引擎"
description: "當用戶想在 iPhone 上往回滑（向上滑）來截一張長圖時，我的第一反應是再寫一套「向上引擎」。最後卻只用了程式碼的一行。本文拆開 ScrollShot 的反向滾動拼接設計：如何在 Messages、WhatsApp 這類 App 裡做出無縫的 iPhone 滾動截圖，如何偵測滾動方向、反轉幀序、複用現成的向下拼接管線，以及方向偵測為什麼近乎免費、為什麼用「反轉幀序」而非「加個 isReversed 旗標」，還有在信心不足時如何把決定權交回用戶。"
date: "2026-07-12"
category: "技術深潛"
author: "ScrollShot 團隊"
tags: ["iPhone 長截圖", "iPhone 滾動截圖", "iOS 長截圖", "截圖拼接演算法", "反向滾動", "滾動方向偵測", "ScrollShot 引擎", "螢幕錄影拼接"]
readingTime: "6 分鐘閱讀"
cover: "/ios_stitching_engine_reverse_scroll_framework_en.webp"
coverAlt: "ScrollShot iOS 長截圖反向模板匹配示意圖：從新幀頂部取模板，去舊幀底部搜尋偏移"
translationKey: "ios-stitching-engine-reverse-scroll"
---

# 用戶堅持要往回滑著截圖——而我用一行程式碼避開了重寫整個引擎

大多數想做 iPhone 長截圖、或在 App 裡截一張 iPhone 滾動截圖的人，都預設用戶是從上往下滑的。ScrollShot 的拼接引擎當初也是如此設計——完整故事我寫在<a href="/zh-hant/blog/ios-stitching-engine-v2/">《兩張截圖拼起來有多難？一個讓我反覆推翻重來的 iOS 長截圖拼接引擎》</a>裡：錄製 → 等距抽幀 → 逐幀模板匹配算偏移 → 找最佳縫合線 → 裁剪拼接。這套管線在從上往下的場景已經很穩了。

但真實世界總愛抬槓。用戶想截一張「微信聊天往回翻」的 iPhone 長截圖，或者存下網頁向上滾動看到的段落——也就是大家一直追問的「iPhone App 內整頁截圖」情境——錄製時手指卻是向上滑的。內容在錄影裡反向流動：開頭是頁面底部，結尾反而是更早的內容。直接丟進從上往下的引擎，會得到一張倒圖：視覺頂部是錄影結尾的老內容，底部才是開頭。

這篇要講的，是 ScrollShot 如何支援從下往上的 iOS 截長圖。重點不在演算法多深，而是一個省到極致的設計取捨。

先看一段標準的「從上往下」滾動拼接示範——後面要講的反向拼接，正是寄生在它之上：

<div class="blog-demo">
	<video src="/ScrollShot_Preview_En_0509.mp4" poster="/ScrollShot_Preview_En_0509_cover.jpg" controls playsinline preload="metadata"></video>
	<p>從上往下滾動拼接示範：錄一次、滑一次，ScrollShot 自動抽幀、比對重疊、拼出一張完整的 iPhone 長截圖。</p>
</div>

---

## 第一直覺：重寫一套「向上引擎」？

我第一次碰到這個需求時，本能反應是：既然已經有向下拼接引擎，再寫一套向上的不就好了？

我很快勸退了自己。向下引擎的核心是反向模板匹配：從新幀（img2）頂部取模板，去舊幀（img1）底部搜尋算偏移。改成向上，幾乎每一處座標都要翻轉——模板從哪取、搜尋往哪掃、偏移正負怎麼定、縫合線重疊區怎麼算……一套 3000 行的引擎，等於要再養一套平行兄弟，兩套各自帶 bug、各自要維護。更糟的是，任何一次改向下引擎，都得同步改向上引擎，否則兩邊悄悄分叉。

## 轉機：反轉，然後複用

真正讓我停下的，是個很樸素的觀察：拼接引擎根本不關心內容「怎麼流動」，它只在乎相鄰兩幀「誰在上、誰在下」。只要把幀序列按內容的真實時間序排好，同一套演算法就能無縫運作。從下往上錄的素材，只是「順序反了」而已。

所以 ScrollShot 的做法是：先偵測滾動方向；如果是向上，就把整個幀序列反轉，再餵進現成的向下管線。

```
錄製抽幀（向上滾動，內容反向流動）:
  [F1 頁面底] → [F2] → [F3] → … → [Fn 頁面頂]
                            │
             ScrollDirectionDetector 判定: 向上
                            │
              reversedForStitching() 反轉幀序
                            ▼
  [Fn 頁面頂] → … → [F3] → [F2] → [F1 頁面底]
                            │
              送入同一套向下拼接引擎（零修改）
                            ▼
                   正確的長圖（頂 → 底）
```

下面這張框圖把「反轉 + 複用」的整條鏈路畫了出來——抽幀、方向偵測、幀序反轉、複用向下引擎，一路到正確長圖：

![從下往上滾動拼接演算法原理框圖](/ios_stitching_engine_reverse_scroll_framework_en.webp)

核心程式碼就一行：

```swift
let normalizedBatch = reverseFrames ? batch.reversedForStitching() : batch
```

`reversedForStitching()` 把抽出的幀參照倒序、重新編號，其餘原封不動。反轉之後，「反向流」的內容變回「正向流」，後面那套模板匹配、NCC、縫合線邏輯一行都不用改。零新拼接程式碼。

> ⚠️ 陷阱：為什麼是「反轉幀序」而不是「在引擎裡加個 `isReversed` 旗標」？因為後者會把每一處座標系都變成「正 / 反」兩份邏輯，bug 面積直接翻倍。把變換提前到餵資料之前做，引擎永遠只面對一種世界。

## 方向偵測：唯一新增的程式碼，而且近乎免費

既然要反轉，前提是先認出用戶是向上滾的。這步若做重了，前面省的都白搭。ScrollShot 的做法很輕，巧妙到幾乎「免費」——複用現成的模板匹配引擎，只是調換參數跑兩遍。

`ScrollDirectionDetector` 從錄製中段均勻取約 7 對相鄰幀（避開開頭的錄製倒數和結尾的停止鈕），對每一對，用同一個 matcher 跑兩次：

```swift
let down = directionalScore(previous: prev, current: cur)  // prev→cur 是否「向下滾動」
let up   = directionalScore(previous: cur, current: prev)  // cur→prev 是否「向下滾動」
```

關鍵在 `directionalScore` 內部那句 `guard outcome.offset > 0`。這個引擎的反向匹配，只在「新幀頂部模板落在舊幀更靠下的位置」時才回傳正偏移。於是：

- 若真實滾動是向下，正向呼叫 `down` 命中（`offset > 0`，有效），反向呼叫 `up` 在新幀頂部找不到更靠下的舊內容，`offset ≤ 0`，判無效、記 0 分；
- 若真實滾動是向上，情況反過來：`down` 無效、`up` 有效。

方向的判據，其實是「**哪一次呼叫有效**」，而不是兩個分數對稱。我第一版文件順手寫了句「分毫不差地對稱」，被同事指著問「有效和無效怎麼會對稱」，才改過來——這是這篇裡我最想糾正的一個誤區。

拿到每一對的 `down` / `up` 分數後，單對評分本身是這樣算的：

```
score = probability×0.55 + nccBoost×0.20 + overlapRatio×0.15 + consensusBoost×0.10
score ×= sadPenalty          // 重疊區越糊，分數越打折
有效分需 ≥ 0.26
```

接著投票：某對裡若 `up ≥ down × 1.25`（或高出 0.08 絕對值），記一票向上；反之記一票向下。最終判定：

- `upwardVotes ≥ downwardVotes + 2`，且
- `upwardScore ≥ downwardScore × 1.25`

才認作向上滾動。全程用上限 320px 的低清縮圖在背景執行緒跑，對整體耗時幾乎無感。

## 拿不準就交給用戶

偵測不是 100% 可靠。一段幾乎靜止、只挪了兩三像素的錄影，方向訊號會很弱；貿然反轉比不反轉更糟。所以設了一道閘：`shouldAskForReverseConfirmation` 只在信心 ≥ 0.72 且有效取樣 ≥ 3 對時觸發，彈出輕量確認：「偵測到你錄的是向上滾動，是否反轉拼接？」用戶點反轉就 `reverseFrames: true`，拿不準就按原順序拼。引擎永遠不會因為猜錯方向而靜默產出錯圖。

## 兩種模式擺一起看

| | 從上往下 | 從下往上 |
|---|---|---|
| 錄製手勢 | 手指下滑 | 手指上滑 |
| 抽幀順序 | 自然時間序 | 自然時間序（內容倒流）|
| 方向偵測 | 不需要 | 中段取樣 7 對，matcher 跑兩遍 |
| 拼接引擎 | 原版 | 原版（幀序反轉後複用）|
| 新增程式碼 | — | 僅方向偵測 + 一行反轉 |
| 兜底 | — | 信心不足時彈確認 |

## 收尾

回頭看，從下往上的 iOS 長截圖在 ScrollShot 裡幾乎沒有「自己的程式碼」——它完全寄生在向下引擎之上。這套「先歸一化順序，再複用同一台引擎」的思路，後來也成了我們加新拼接模式時的預設起手式：下次做橫向拼接或 Z 字拼接，大概率還是先想辦法把問題擰回「一維向下」，而不是另起爐灶。

---

## 常見問題：在 iPhone App 裡截滾動截圖

**ScrollShot 能在 Messages、WhatsApp 這類 iPhone App 裡截長圖嗎？**
能。不論你想擷取網頁的 iPhone 長截圖，還是 Messages、WhatsApp 對話的 iPhone 滾動截圖，ScrollShot 都會錄下你的畫面並自動拼接幀。因為它是透過螢幕錄影擷取，而不是依賴系統的「整頁」按鈕，所以在任何 App 裡都能運作——也就是大家一直追問的 iPhone App 內整頁截圖情境。

**如果錄製聊天時我往上滑了怎麼辦？**
這正是本文的重點。使用者愛用的 iPhone 滾動截圖 Messages，或是 iPhone WhatsApp 粉絲往回滑擷取的截圖，都代表內容是反向流的。ScrollShot 偵測到向上滾動方向、反轉幀序，並複用同一套向下拼接引擎——所以你依然能得到正確的 iPhone 滾動截圖，而我們不必重寫任何東西。

**這跟 iOS 內建截圖有什麼不同？**
內建截圖不見得能在 App 內擷取整頁。ScrollShot 專為 iPhone 長截圖與滾動截圖情境打造：錄一次、隨你往上或往下滾，就能得到一張無縫長圖。

---

## 延伸閱讀

- <a href="/zh-hant/blog/ios-stitching-engine-v2/">兩張截圖拼起來有多難？一個讓我反覆推翻重來的 iOS 長截圖拼接引擎</a>——從 1800 幀裡挑 30 幀、反向模板匹配、金字塔 NCC 搜尋到三層降級策略，把 ScrollShot 拼接引擎拆開給你看。
- <a href="/zh-hant/blog/why-choose-scrollshot-ios-long-screenshot/">為什麼選擇 ScrollShot？iOS 無縫長截圖的完整解決方案</a>——從產品視角看 ScrollShot 如何解決 iOS 長截圖的痛點，包括錄影自動拼接、手動拼接、隱私保護與高清匯出。
