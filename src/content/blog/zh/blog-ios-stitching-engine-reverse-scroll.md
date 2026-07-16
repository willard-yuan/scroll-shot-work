---
title: "用户非要往回翻着截图，我却用一行代码躲过了重写整个引擎"
description: "用户偏要往回翻着录屏截长图，我第一反应是再写一套“向上引擎”，最后却只用一行代码躲了过去。本文拆开 ScrollShot 反向滚动拼接这个省到极致的设计：先检测滚动方向、再把帧序整体反转，直接复用现成的向下拼接管线——方向检测如何近乎免费、为什么用“反转帧序”而非“加个 isReversed 标志”，以及置信度不足时如何把决定权交回用户。"
date: "2026-07-12"
category: "技术深潜"
author: "ScrollShot 团队"
tags: ["iOS 长截图", "截图拼接算法", "反向滚动", "滚动方向检测", "ScrollShot 引擎", "录屏拼接"]
readingTime: "6 分钟阅读"
cover: "/ios_stitching_engine_reverse_scroll_framework_zh.webp"
coverAlt: "ScrollShot 反向模板匹配示意图：从新帧顶部取模板，去旧帧底部搜索偏移"
translationKey: "ios-stitching-engine-reverse-scroll"
---

# 用户非要往回翻着截图，我却用一行代码躲过了重写整个引擎

做长截图拼接的人，大多默认用户是从上往下滑的。ScrollShot 的拼接引擎最初也是这样设计的，完整原理我写在了<a href="/zh/blog/blog-ios-stitching-engine-v2/">《一个让我反复推翻重来的 iOS 长截图拼接引擎》</a>里：录屏 → 等距抽帧 → 逐帧模板匹配算偏移 → 找最佳缝合线 → 裁剪拼接。这条流水线在从上往下的场景里已经足够稳。

但真实世界偏要抬杠。用户想截一张"微信聊天往回翻"的长图，或者保存一个网页向上滚动看过的部分，录屏时手指是向上滑的。内容在录屏里是反着流的——开头是页面底部，结尾反而是更早的内容。直接拿从上往下的引擎去拼，会产出一张倒图：视觉顶部是录屏结尾的老内容，底部才是开头。

这篇聊 ScrollShot 怎么支持从下往上拼接。重点不在算法多深，而是一个省到极致的设计取舍。

下面先看一段标准的"从上往下"滚动拼接演示——后面要讲的反向拼接，正是寄生在它之上：

<div class="blog-demo">
	<video src="/ScrollShot_Preview_Cn_0509.mp4" poster="/ScrollShot_Preview_Cn_0509_cover.jpg" controls playsinline preload="metadata"></video>
	<p>从上往下滚动拼接演示：录屏一次，滚动一次，ScrollShot 自动抽帧、匹配重叠、拼成完整长图。</p>
</div>

---

## 第一直觉：重写一套"向上引擎"？

我第一次碰到这个需求时，本能反应是：既然有向下拼接引擎，再写一个向上拼接引擎不就行了？

很快被自己劝退。向下引擎的核心是反向模板匹配：从新帧（img2）顶部取模板，去旧帧（img1）底部搜索算偏移。改成向上，几乎每一处坐标都要翻转——模板从哪取、搜索往哪扫、偏移正负怎么定义、缝合线重叠区怎么算……一套 3000 行的引擎，等于要再养一套平行兄弟，两套各自带 bug、各自要维护。更糟的是，任何一次改向下引擎，都得同步改向上引擎，否则两边悄悄分叉。

## 转机：反转，然后复用

真正让我停下来的，是个很朴素的观察：拼接引擎根本不关心内容"怎么流动"，它只关心相邻两帧"谁在上、谁在下"。只要把帧序列按内容的真实时间顺序排好，同一套算法就能无缝工作。从下往上录的素材，只是"顺序反了"而已。

所以 ScrollShot 的做法是：先检测滚动方向，如果是向上，就把帧序列整体反转，再喂进现成的向下管线。

```
录屏抽帧（向上滚动，内容反着流）:
  [F1 页面底] → [F2] → [F3] → … → [Fn 页面顶]
                            │
             ScrollDirectionDetector 判定: 向上
                            │
              reversedForStitching() 反转帧序
                            ▼
  [Fn 页面顶] → … → [F3] → [F2] → [F1 页面底]
                            │
              进同一套向下拼接引擎（一行不改）
                            ▼
                   正确的长图（顶 → 底）
```

下面这张框图把上面这套"反转 + 复用"的链路整体画了出来——抽帧、方向检测、帧序反转、复用向下引擎，一路到正确长图：

![从下往上滚动拼接算法原理框图](/ios_stitching_engine_reverse_scroll_framework_zh.webp)

下面看一段真正的"从下往上"录屏拼接演示——手指向上滑，ScrollShot 自动识别方向、反转帧序，最终拼出顺序正确的长图：

<div class="blog-demo">
	<video src="https://video.scrollshot.work/ios_scrollshot_scroll_from_bottom_to_up.mp4" controls playsinline preload="metadata"></video>
	<p>从下往上滚动拼接演示：手指向上滑，ScrollShot 自动识别方向、反转帧序，拼出顺序正确的长图。</p>
</div>

核心代码就一行：

```swift
let normalizedBatch = reverseFrames ? batch.reversedForStitching() : batch
```

`reversedForStitching()` 把抽出来的帧引用倒序、重新编号，其余原封不动。反转之后，"反着流"的内容变回"正着流"，后面那套模板匹配、NCC、缝合线逻辑一行都不用改。零新拼接代码。

> ⚠️ 陷阱：为什么是"反转帧序"而不是"在引擎里加个 `isReversed` 标志"？因为后者会把每一处坐标系都变成"正 / 反"两份逻辑，bug 面积直接翻倍。把变换提前到喂数据之前做，引擎永远只面对一种世界。

## 方向检测：唯一新增的代码，而且近乎免费

既然要反转，前提是先认出用户是向上滚的。这步如果做重了，前面省的都白搭。ScrollShot 的做法很轻，而且巧妙到几乎"免费"——复用现成的模板匹配引擎，只是调换参数跑两遍。

`ScrollDirectionDetector` 从录屏中段均匀采样约 7 对相邻帧（避开开头的录制倒计时和结尾的停止按钮），对每一对，用同一个 matcher 跑两次：

```swift
let down = directionalScore(previous: prev, current: cur)  // prev→cur 是否"向下滚动"
let up   = directionalScore(previous: cur, current: prev)  // cur→prev 是否"向下滚动"
```

关键在于 `directionalScore` 内部那句 `guard outcome.offset > 0`。这个引擎的反向匹配，只在"新帧顶部模板落在旧帧更靠下的位置"时才返回正偏移。于是：

- 若真实滚动是向下，正向调用 `down` 命中（`offset > 0`，valid），反向调用 `up` 在新帧顶部找不到更靠下的旧内容，`offset ≤ 0`，判 invalid、记 0 分；
- 若真实滚动是向上，情况反过来：`down` 无效、`up` 有效。

方向的判据，其实是"**哪一次调用有效**"，而不是两个分数对称。我第一版文档里顺手写了句"分毫不差地对称"，被同事指着问"有效和无效怎么会对称"，才改过来——这是这篇里我最想纠正的一个误区。

拿到每一对的 `down` / `up` 分数后，单对评分本身是这么算的：

```
score = probability×0.55 + nccBoost×0.20 + overlapRatio×0.15 + consensusBoost×0.10
score ×= sadPenalty          // 重叠区越糊，分数越打折
有效分需 ≥ 0.26
```

接着投票：某对里若 `up ≥ down × 1.25`（或高出 0.08 绝对值），记一票向上；反过来记一票向下。最终判定：

- `upwardVotes ≥ downwardVotes + 2`，且
- `upwardScore ≥ downwardScore × 1.25`

才认作向上滚动。全程用 320px 上限的低清缩略图在后台线程跑，对整体耗时几乎无感知。

## 不确定就交给用户

检测不是 100% 可靠。一段几乎静止、只挪了两三像素的录屏，方向信号会很弱；贸然反转比不反转更糟。所以设了一道闸：`shouldAskForReverseConfirmation` 只在置信度 ≥ 0.72 且有效采样 ≥ 3 对时才触发，弹一个轻量确认："检测到你录的是向上滚动，是否反转拼接？"用户点反转就 `reverseFrames: true`，拿不准就按原顺序拼。引擎永远不会因为猜错方向而静默产出错图。

## 两种模式摆一起看

| | 从上往下 | 从下往上 |
|---|---|---|
| 录制手势 | 手指下滑 | 手指上滑 |
| 抽帧顺序 | 自然时间序 | 自然时间序（内容倒流）|
| 方向检测 | 不需要 | 中段采样 7 对，matcher 跑两遍 |
| 拼接引擎 | 原版 | 原版（帧序反转后复用）|
| 新增代码 | — | 仅方向检测 + 一行反转 |
| 兜底 | — | 置信度不足时弹确认 |

## 收尾

回头看，从下往上拼接在 ScrollShot 里几乎没有"自己的代码"——它完全寄生在向下引擎之上。这套"先归一化顺序，再复用同一台发动机"的思路，后来也成了我们加新拼接模式时的默认起手式：下次做横向拼接或 Z 字拼接，大概率还是先想办法把问题拧回"一维向下"，而不是另起炉灶。

---

## 延伸阅读

- <a href="/zh/blog/blog-ios-stitching-engine-v2/">两张截图拼起来有多难？一个让我反复推翻重来的 iOS 长截图拼接引擎</a>——从 1800 帧里挑 30 帧、反向模板匹配、金字塔 NCC 搜索到三层降级策略，把 ScrollShot 拼接引擎拆开给你看。
- <a href="/zh/blog/wei-shen-me-xuan-ze-scrollshot-ios-wu-feng-chang-jie-tu/">为什么选择 ScrollShot？iOS 无缝长截图的终极解决方案</a>——从产品视角看 ScrollShot 如何解决 iOS 长截图的痛点，包括录屏自动拼接、手动拼接、隐私保护和高清导出。
