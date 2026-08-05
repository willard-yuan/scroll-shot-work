---
title: "Mac 长截图怎么截？2026 滚动截图完全指南"
description: "macOS 没有自带的滚动截图功能。这篇 2026 完全指南讲清原因，横向对比 GoFullPage、Shottr、CleanShot X、Xnapper、screensnap 与 ScrollShot，并教你用免费的 ScrollShot for Mac 截取任意窗口的长图。"
date: "2026-08-05"
category: "使用教程"
author: "ScrollShot 团队"
tags: ["Mac 长截图", "Mac 滚动截图", "macOS 截图工具", "ScrollShot for Mac", "滚动拼接", "长图截取"]
readingTime: "10 分钟阅读"
cover: "/how-to-take-long-scrolling-screenshot-on-mac-2026/hero-long-screenshot-mac-before-after.webp"
coverAlt: "一张普通 Mac 单屏截图，旁边是同一内容用 ScrollShot 截出的 765 × 4091 像素长图"
translationKey: "how-to-take-long-scrolling-screenshot-on-mac-2026"
faq:
  - question: "用 Mac 自带的截屏（Screenshot）App 能截长图吗？"
    answer: "不能。`Cmd + Shift + 4` 和系统截屏 App 都只能截下当前屏幕显示的内容。你需要借助浏览器功能、导出 PDF，或 ScrollShot、Shottr、CleanShot X 这类第三方工具。"
  - question: "Mac 上截长图，最快的免费方法是什么？"
    answer: "只截网页：用 GoFullPage（30 秒内搞定）。网页之外的内容（Slack、PDF、各类 App）：ScrollShot for Mac 或 Shottr 都免费，且能截任意可滚动区域。"
  - question: "有没有既能截长图、又能翻译和脱敏的免费工具？"
    answer: "有——[ScrollShot for Mac](/zh/blog/wei-shen-me-xuan-ze-scrollshot-ios-wu-feng-chang-jie-tu/)。它免费，并且独一家把滚动截取与文字识别、30+ 语言翻译、19+ 标注工具、自动脱敏（邮箱/手机号/API Key/人脸）集成在同一个 App 里。"
  - question: "长截图能用于 PDF 和文档吗？"
    answer: "可以，前提是用原生滚动截取工具（ScrollShot、Shottr、CleanShot X）去截在「预览」或阅读器里打开的 PDF。系统自带的「导出为 PDF」得到的是文档，不是图片。"
  - question: "为什么我的长图出现了重复的标题栏？"
    answer: "页面里有固定不动的元素——聊天悬浮窗、导航栏、Cookie 横幅——内容滚动时它不动，于是被重复截了进去。截取前先关掉或隐藏它。"
  - question: "长截图保存成什么格式好？"
    answer: "要质量和透明背景用 PNG；文件体积优先、不需要透明用 JPG；只有需要可搜索文字时才用 PDF。"
---

# Mac 长截图怎么截？2026 滚动截图完全指南

先把我自己第一次折腾时浪费的 20 分钟省给你。

我那会儿要给对方一个开发同事发一条 4000 像素高的 Slack 对话。我按下 `Cmd + Shift + 4`，拖了个框，结果只截到一屏。剩下的聊天记录全在下方，macOS 当作没看见。**Mac 上根本就没有原生长截图功能**——`Cmd + Shift + 4` 没有，系统截屏 App 没有，「预览」也没有。如果你是冲着一个隐藏的苹果快捷键来的，我直说：它不存在。Windows 的截图工具里有，iPhone 有，安卓有。可到了 2026 年的 macOS，苹果还是没给。

好消息是：这事儿完全能解决，而且可选的方案比大多数「TOP 8 盘点」文章愿意承认的要多。这篇指南不浮于表面。我会讲清楚 *为什么* Mac 原生做不到，一个工具「滚动拼接」时到底发生了什么，以及不同工具分别适合什么场景——包括我现在天天在用的那一个：**[ScrollShot for Mac](/zh/blog/wei-shen-me-xuan-ze-scrollshot-ios-wu-feng-chang-jie-tu/)**（免费，而且是唯一一个能在同一个 App 里把整件事干完的方案）。

![普通截图与长图对比：一张单屏 Mac 截图，旁边是同一内容用 ScrollShot 截出的 765 × 4091 像素长图](/how-to-take-long-scrolling-screenshot-on-mac-2026/hero-long-screenshot-mac-before-after.webp)

*普通截图只能截到可视区域。ScrollShot 一次性截下完整的 765 × 4091 像素滚动区域——随后还能在同一个 App 里完成标注、文字识别、翻译和脱敏，无需切换工具。*

---

## 为什么 macOS 无法原生截取长截图

这倒不是苹果偷懒，而是屏幕本身的运作方式决定的。

当你按下 `Cmd + Shift + 4`，macOS 抓取的是当前的*帧缓冲*：此刻屏幕上物理显示内容的逐像素快照。一个可滚动的窗口（Slack、网页、PDF）只渲染了可见的那部分，屏幕之外的内容根本「不在那儿」可供截取——它是你滚动时才现画出来的，不像终端那样有个「回滚缓冲区」。所以截图工具只有两条路：

1. **向 App 索要完整内容**（只有当 App 愿意暴露时才行——浏览器可以，绝大多数 App 不行）。
2. **滚一点、截一点，反复如此，再把各段滚动拼接成一张长图**。

Mac 上每一个「长截图」工具，底层干的都是第 2 种（或仅对网页用第 1 种）。这个区别很关键，因为它解释了为什么有的工具只能在 Chrome 里用，而有的**哪里都能用**。

![可视区域与完整滚动内容对比——macOS 只截下屏幕上显示的部分，截不到屏幕之外的内容](/how-to-take-long-scrolling-screenshot-on-mac-2026/img-viewport-vs-full.webp)

---

## 三类解决方案

在推荐之前，先认清分类。它们彼此不可替代。

| 类别 | 工作原理 | 最适合 | 做不到 |
| --- | --- | --- | --- |
| **仅浏览器** （GoFullPage、Firefox 内置、DevTools、Safari Web 检查器） | 向页面索要完整 DOM/内容 | 在该浏览器里*打开的*网页 | Slack、预览里的 PDF、App 窗口、Figma 画板 |
| **原生滚动截取 App** （Shottr、CleanShot X、Xnapper、**ScrollShot**、screensnap*） | 滚动 + 拼接真实屏幕 | *任意*可滚动区域，含非浏览器 App | ——（只受工具质量限制） |
| **导出 PDF** （`Cmd + P` → 导出为 PDF） | 把排版渲染成文档 | 可搜索归档、打印 | 不是图片，无法内联粘贴 |

\* *screensnap（ScreenSnap Pro）是个例外——见下方说明。它是标注工具，不是滚动截取工具。*

---

## 快速推荐（赶时间看这里）

- **你永远只截网页** → 浏览器扩展 GoFullPage 就够，而且免费。
- **你要截 Slack、PDF、App 窗口或文档** → 需要原生 App。
- **你想要一个免费工具，能截*并且*做文字识别、翻译、标注、模糊敏感信息，甚至录视频——不花钱也不订阅** → **ScrollShot for Mac**。本篇里只有它能在原生环境免费完成整条流水线。

![三款工具对比：GoFullPage（仅网页）、CleanShot X（\$29/年）和 ScrollShot（免费、一站式）](/how-to-take-long-scrolling-screenshot-on-mac-2026/img-3up-comparison-cards.webp)

---

## 完整对比（Shottr、CleanShot X、Xnapper、screensnap、ScrollShot）

我在 macOS 15/26 上实测了几个常见选手。下面说的是它们*实际*的表现，不是营销话术。为了好看，我把它拆成两张表——一张讲每款能**截什么**，一张讲截完之后能**做什么**。

### 截取范围与能力

| 工具 | 价格 | 长截图 | 超出浏览器？ |
| --- | --- | --- | --- |
| **ScrollShot for Mac** | **免费** | ✅ 借助 Apple Vision 自动拼接 | ✅ 任意可滚动区域 |
| **Shottr** | 免费（一次性 \$12 去提示） | ✅ 手动滚动 + 拼接 | ✅ |
| **CleanShot X** | \$29/年（或 \$59 一次性） | ✅ 自动或手动 | ✅ |
| **Xnapper** | \$24 一次性 | ✅ | ✅ |
| **screensnap（ScreenSnap Pro）** | \$39 一次性 | ❌ **不支持长截图** | ❌ |
| **GoFullPage** | 免费（有付费档） | ✅（仅浏览器） | ❌ 仅网页 |

### 截后编辑

| 工具 | 标注 | 文字识别 + 翻译 | 视频录制/剪辑 | 自动脱敏 |
| --- | --- | --- | --- | --- |
| **ScrollShot for Mac** | ✅ 19+ 工具 | ✅ 30+ 语言 | ✅ MP4/GIF + 裁剪 | ✅ 邮箱、手机号、API Key、人脸 |
| **Shottr** | ✅ 基础 | ⚠️ 仅文字识别，无翻译 | ❌ | ❌ |
| **CleanShot X** | ✅ 强 | ❌ | ✅（单独功能） | ⚠️ 仅手动模糊 |
| **Xnapper** | ✅ + 美化 | ❌ | ❌ | ⚠️ 自动隐私模糊 |
| **screensnap（ScreenSnap Pro）** | ✅ 15 种工具 + 背景 | ❌ | ✅ GIF | ⚠️ 仅手动模糊 |
| **GoFullPage** | ⚠️ 基础裁剪 | ❌ | ❌ | ❌ |

**关于 screensnap 的真相。** screensnap 自己的博客（《8 种方法按速度排名》）确实是一份有用的排名——但请注意它推荐用来*实际截取*的，是 GoFullPage 和 Shottr。ScreenSnap Pro 本身*截不了长图*。它是为*下一步*生的（把你别处已经截好的图做美化 + 标注 + 分享）。所以如果你的痛点是「我首先得有这张长图」，screensnap 不是截取方案，而是截后方案。相比之下，ScrollShot 在同一个免费 App 里既管截取*又*管标注/模糊/分享。

---

## 滚动拼接到底怎么工作（以及为什么容易翻车）

当 ScrollShot（或 Shottr、CleanShot X）截一张长图时，滚动拼接的流程是：

1. 截取当前可见区域。
2. 模拟一次滚动（或等你手动滚）。
3. 截取下一段区域。
4. **匹配两段之间重叠的像素**，找到接缝位置。
5. 拼接起来，然后重复，直到你停下。

这第 4 步的匹配，决定了任何滚动拼接工具的好坏。ScrollShot 的[拼接引擎](/zh/blog/blog-ios-stitching-engine-v2/)借助 Apple 的 Vision 框架做帧匹配，所以比朴素的像素差分更能扛住变速滚动和轻微布局偏移。不过有三样东西仍能让任何拼接工具翻车：

- **吸顶/固定的标题栏**在内容滚动时不动 → 出现重复的横条。（截取前先关掉聊天挂件和 Cookie 横幅。）
- **懒加载内容**滚动后才出现 → 出现空白断层。（先滚一遍到底，再从头截。）
- **固定宽度假设** → 如果你改了窗口大小，输出宽度会变。截取前先定好宽度。

![滚动拼接原理：工具通过匹配重叠区域，找到第二节该接在第一节的什么位置](/how-to-take-long-scrolling-screenshot-on-mac-2026/img-stitch-overlap.webp)

---

## 分步教程：用 ScrollShot for Mac 截长图

下面是我现在干啥都用的一套流程。

**1. 安装（30 秒）。**
从 [`mac.scrollshot.work/ScrollShot.dmg`](https://mac.scrollshot.work/ScrollShot.dmg) 下载，打开 DMG，拖进「应用程序」。无需账号，无需激活码。

![安装 ScrollShot：打开 DMG，把 App 拖进「应用程序」文件夹](/how-to-take-long-scrolling-screenshot-on-mac-2026/img-dmg-install.webp)

**2. 触发滚动截取。**
按下滚动截取快捷键（或从菜单栏里点选）。在可滚动区域上拖一个框——网页、Slack 面板、PDF 分栏，随便什么。

**3. 滚动。**
用触控板或鼠标滚轮滚动。ScrollShot 实时自动拼接，你能看到长图在预览里一点点变长。截够了就停。

![实时预览：ScrollShot 在你滚动时自动拼接，长图实时变长](/how-to-take-long-scrolling-screenshot-on-mac-2026/img-live-preview.webp)

**4. 一张图，已经可编辑。**
截完你不会被丢进另一个编辑器。同一个窗口就能：加箭头/序号、**对文字做识别并就地翻译成 30+ 语言**、模糊或自动脱敏邮箱/手机号/API Key/人脸，最后导出为 PNG，或存到美化过的渐变背景上。

![给长图做标注：箭头、序号、模糊、翻译——全程不用离开 App](/how-to-take-long-scrolling-screenshot-on-mac-2026/img-annotation-toolbar.webp)

**5. 分享。**
复制到剪贴板、上传到你的 S3/云盘，或导出。搞定——全程不用离开 App。

最后这点，才是我换工具的真实理由。用 Shottr，我得截完再开另一个 App 去标注；用 CleanShot X，我每年花 \$29 才换来这特权。而滚动拼接之后，ScrollShot 能在一次流程里免费完成 截取 → 编辑 → 翻译 → 脱敏 → 导出。

---

## 什么时候*不该*用滚动截取工具

老实说，看活儿下菜：

- **你要的是可搜索、可复制的文字**（法务归档、研究用 PDF） → `Cmd + P` → 导出为 PDF。一张 12000 像素高的 PNG 是搜不了的。
- **你只截某一个浏览器、而且从不出来** → GoFullPage，或 Firefox 内置的「截图 → 保存整页」更轻量。
- **你要的是像素级精确的打印排版** → 还是 PDF。

除此之外——聊天记录、文档、设置面板、你打算标注的长网页——原生滚动截取工具更胜一筹。

---

## 常见坑（及解决办法）

- **输出里出现重复的标题栏** → 固定元素所致。截取前关掉它，或换用对吸顶处理更好的工具。
- **中间少了一段** → 无限滚动 / 懒加载。先滚到底一次，再从顶部截。
- **文字发虚** → 低 DPI 截的。截取前把窗口放大（或放大显示比例）。
- **文件太大** → 一张 10000 像素高的 PNG 能有数 MB。分享前先压缩，或拆成几段便于阅读。

---

## 常见问题

**用 Mac 自带的截屏（Screenshot）App 能截长图吗？**
不能。`Cmd + Shift + 4` 和系统截屏 App 都只能截下当前屏幕显示的内容。你需要借助浏览器功能、导出 PDF，或 ScrollShot、Shottr、CleanShot X 这类第三方工具。

**Mac 上截长图，最快的免费方法是什么？**
只截网页：用 GoFullPage（30 秒内搞定）。网页之外的内容（Slack、PDF、各类 App）：ScrollShot for Mac 或 Shottr——都免费，都能截任意可滚动区域。

**有没有既能截长图、又能翻译和脱敏的免费工具？**
有——[ScrollShot for Mac](/zh/blog/wei-shen-me-xuan-ze-scrollshot-ios-wu-feng-chang-jie-tu/)。它免费，并且独一家把滚动截取与文字识别、30+ 语言翻译、19+ 标注工具、自动脱敏（邮箱/手机号/API Key/人脸）集成在同一个 App 里。

**长截图能用于 PDF 和文档吗？**
可以，前提是用原生滚动截取工具（ScrollShot、Shottr、CleanShot X）去截在「预览」或阅读器里打开的 PDF。系统自带的「导出为 PDF」得到的是文档，不是图片。

**为什么我的长图出现了重复的标题栏？**
页面里有固定不动的元素（聊天悬浮窗、导航栏、Cookie 横幅），内容滚动时它不动。截取前先关掉或隐藏它。

**长截图保存成什么格式好？**
要质量和透明背景用 PNG；文件体积优先、不需要透明用 JPG；只有需要可搜索文字时才用 PDF。
