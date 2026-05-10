# ScrollShot 官网建设项目信息整理

> 用途：为 ScrollShot 官网的信息架构、页面设计、营销文案、素材准备、SEO、隐私与订阅说明提供完整项目资料。  
> 整理日期：2026-05-10  
> 信息来源：当前代码仓库、配置文件、Paywall 文案、StitchingEngine README、SwiftUI 页面与工具类实现。

## 1. 项目总览

### 1.1 产品名称

- App 名称：ScrollShot
- 会员名称：ScrollShot Pro
- 核心品类：iOS 截长图 / 长截图 / 滚动截图拼接工具
- 核心能力：通过录屏自动生成长图，或手动选择多张截图按顺序拼成长图。

### 1.2 一句话介绍

ScrollShot 是一款 iOS 长截图工具，支持一键录屏自动生成长图，也支持按用户选择顺序手动拼接多张截图，并提供主题色、微调、滚动条清理、图片/PDF 分享等完整工作流。

### 1.3 官网主价值主张建议

可作为官网首屏主标题候选：

- 一键录屏，自动长图
- 录屏后自动生成高清长截图
- 从截图到长图，ScrollShot 自动帮你拼好
- 自动拼接、手动微调、分享 PDF，一次完成

副标题候选：

- 开启系统录屏并滚动页面，ScrollShot 会自动抽帧、去重、匹配并生成一张完整长图。
- 适合聊天记录、网页、App 页面、文档和社交内容保存。所有处理优先在本机完成，照片不会上传。
- 想要更精确？手动选择图片，按选择顺序拼接，还可以进入微调页调整拼接位置。

### 1.4 目标用户

- 经常保存聊天记录、社交内容、文章、网页、交易记录、教程步骤的用户。
- 需要把长页面整理成一张图或 PDF 分享的人。
- 产品经理、设计师、开发者、运营、客服、内容创作者、学生。
- 对“截图隐私”和“本机处理”敏感的用户。
- 想减少手动截图、手动对齐、重复裁剪操作的效率型用户。

### 1.5 核心差异化

- 自动模式：通过系统录屏自动抽帧并拼接，减少手动选图。
- 手动模式：保留用户选择顺序，适合需要精确控制的场景。
- 预览版模板匹配算法：覆盖复杂场景，包括浮动 UI、动态内容、微小回滚、底部滚动条等。
- 拼接微调页：用户可以修正拼接位置，不把结果完全交给黑箱算法。
- 滚动条清理：支持自动或手动移除长图底部/边缘滚动条痕迹。
- 分享结果页：保存到相册后，可以继续分享图片、分享 PDF、查看大图、清理原图。
- 主题系统：提供多套高审美主题色，Pro 用户可使用全部主题。
- 多语言：已支持 24 种语言和 RTL 布局方向。

## 2. 当前 App 基础信息

### 2.1 Bundle 与版本

来自 `snap-long-image.xcodeproj/project.pbxproj`：

| 项目 | 值 |
| --- | --- |
| App Display Name | ScrollShot |
| App Bundle ID | `com.manifoldtech.ScrollShot` |
| Broadcast Extension Bundle ID | `com.manifoldtech.ScrollShot.BroadcastUploadExtension` |
| Marketing Version | `1.0.4` |
| Build Version | `4` |

### 2.2 App Store 与法律链接

来自 `snap-long-image/AppConfig.swift`：

| 项目 | 值 |
| --- | --- |
| App Store ID | `6760192003` |
| App Store URL | `https://apps.apple.com/app/id6760192003` |
| App Store 评分 URL | `itms-apps://itunes.apple.com/app/id6760192003?action=write-review` |
| 简体/繁体中文隐私政策 | `https://yongyuan.name/scrollshot/` |
| 英文及其他语言隐私政策 | `https://yongyuan.name/scrollshot/en/` |
| 简体/繁体中文服务条款 | `https://yongyuan.name/scrollshot/tos/` |
| 英文及其他语言服务条款 | `https://yongyuan.name/scrollshot/tos/en/` |
| ICP 备案号 | `京ICP备2026011241号-1A` |
| 备案查询 | `https://beian.miit.gov.cn` |

### 2.3 技术栈

- iOS App：SwiftUI
- 系统录屏：ReplayKit Broadcast Upload Extension
- 视频处理：AVFoundation
- 图像处理：CoreGraphics、CoreImage、Accelerate、Vision
- 相册访问：Photos / PhotoKit
- 订阅系统：RevenueCat
- 拼接算法：本仓库内 Swift Package `StitchingEngine`
- 多语言系统：自研 `LocalizationManager` + `LocalizedStrings` 表
- 主题系统：自研 `ThemeManager`

## 3. 产品功能地图

### 3.1 自动拼接模式

入口：主页顶部 Segmented Control 中的“自动拼接 / Auto Stitch”。

核心流程：

1. 用户点击“启动系统录屏”。
2. 系统弹出录屏入口，用户开始录屏。
3. 用户滚动需要保存的页面。
4. 用户停止录屏。
5. App 通过通知或入口拿到录屏视频。
6. 用户可进入视频裁剪页，选择有效片段。
7. App 从视频中抽帧、去重、分析滚动距离。
8. 拼接引擎生成长图。
9. 用户进入拼接结果页，保存、分享、微调或清理滚动条。

自动拼接模式适合官网重点展示，因为它是 ScrollShot Pro 的核心能力。

适合展示的文案：

- 只需录屏并滚动，ScrollShot 自动生成长图。
- 不再手动截多张图，也不用反复对齐。
- 对聊天、网页、App 页面和长文内容尤其高效。

### 3.2 手动拼接模式

入口：主页顶部 Segmented Control 中的“手动拼接 / Manual Stitch”。

核心流程：

1. 用户进入“从相册选取”区域。
2. 选择相册：最近项目、屏幕截图、收藏、用户相册等。
3. 按拼接顺序选择图片。
4. 默认保留用户选择顺序；可在设置中开启“手动拼接排序模式”，按时间自动排序。
5. 选中图片会显示中心序号和空间提示：顶部、接续、底部。
6. 点击“开始拼接”。
7. 进入拼接预览页，可保存、微调、清理滚动条。

重要产品规则：

- 手动模式默认按照用户选择图片的先后顺序拼接。
- 最早出现在长图顶部的图片应该最先选择。
- 如果用户开启“手动拼接排序模式”，会按创建时间从早到晚自动排序。
- 该开关默认关闭，默认值由 `AppConfig.defaultAutoSortScreenshots = false` 控制。

适合展示的文案：

- 手动选择图片，按选择顺序拼成长图。
- 适合连续截图，也适合只有部分重叠的页面。
- 中心序号与“顶部/接续/底部”提示，帮助用户避免选错顺序。

### 3.3 最近连续截图发现

入口：手动拼接页中的“发现最近连续截图”卡片。

触发逻辑：

- App 打开后会异步分析最近连续截图。
- 只在相邻截图之间的拼接置信度达到阈值时显示建议。
- 阈值由 `AppConfig.recentScreenshotStitchConfidenceThreshold` 控制，当前为 `0.85`。
- 最近截图之间最大时间间隔由 `AppConfig.recentScreenshotMaxCreationInterval` 控制，当前为 `60` 秒。

价值：

- 用户刚刚连续截了几张图时，App 能自动发现并建议立即拼接。
- 避免用户手动逐张查找、排序、选择。

### 3.4 拼接预览页

主要功能：

- 展示拼接结果。
- 保存到相册。
- 进入微调页。
- 移除滚动条。
- 查看拼接结果。

视觉配置：

- 拼接结果图片宽度由 `AppConfig.stitchedResultImageWidthRatio` 控制，当前为 `0.86`。
- 这样可统一控制拼接预览页和微调页中图片左右距离屏幕的比例。

### 3.5 拼接微调页

主要功能：

- 对拼接缝进行人工微调。
- 支持上下边界/拼接位置调整。
- 可预览修改后的结果。

官网表达建议：

- 算法先自动拼好，细节仍可手动微调。
- 适合对聊天记录、长网页等高要求场景做最后修正。

### 3.6 保存完成页

保存成功后进入保存预览页面。

主要功能：

- 显示“已保存到相册”状态。
- 可滚动预览长图。
- 查看大图。
- 清理原图。
- 分享图片。
- 分享 PDF。
- 完成并返回。

适合官网展示：

- 从拼接到保存、分享，一页完成。
- 图片和 PDF 两种分享方式。
- 可选清理原图，减少相册冗余。

### 3.7 大图查看页

主要功能：

- 全屏查看长图。
- 支持放大、缩小、平移。
- 横向平移会被约束，避免图片被拖出屏幕后只剩空黑区域。

适合官网表达：

- 保存前后都能细看长图细节。
- 放大检查文字、拼接缝与滚动条。

### 3.8 滚动条移除

功能入口：

- 拼接预览页的移除滚动条入口。
- 设置页中的 AI 自动移除滚动条开关。

配置：

- `AppConfig.defaultAutoScrollbarRemoval = false`
- `AppConfig.enableVerticalScrollbarRemoval = true`
- `AppConfig.enableHorizontalScrollbarRemoval = true`

说明：

- 支持右侧垂直滚动条和底部水平滚动条痕迹处理。
- 官网文案可称为“自动清理滚动条痕迹”或“滚动条清理”，避免过度承诺“任何图片都完美去除”。

## 4. 拼接算法能力

### 4.1 算法模块

核心实现位于：

- `snap-long-image/Utils/ImageStitcher.swift`
- `snap-long-image/StitchingEngine/Sources/StitchingEngine/`

Swift Package：

- 包名：`StitchingEngine`
- 要求：Swift 5.9+，iOS 15+ / macOS 12+
- 特点：零第三方依赖，只依赖 Apple Frameworks。

### 4.2 当前算法版本

设置页中支持切换：

| 算法版本 | 文案 | 说明 |
| --- | --- | --- |
| Preview | 预览版 | 当前最新算法，覆盖更多复杂场景 |
| Stable | 稳定版 | 使用已验证的稳定引擎 |

当前默认：

- `TemplateMatchingAlgorithmPreference.defaultVersion = .preview`

### 4.3 算法核心能力

来自 `StitchingEngine/README.md` 与当前实现：

- 基于 NCC（Normalized Cross-Correlation，归一化互相关）的模板匹配。
- 多模板块一致性判断。
- 金字塔搜索与多阶段 refinement。
- SAD 验证 fallback。
- 1-D profile NCC fallback。
- 动态底部区域检测。
- 最优拼接缝搜索，降低拼接痕迹。
- temporal offset prediction，利用相邻帧滚动规律提升鲁棒性。
- 能处理部分真实场景问题：
  - 浮动 UI 覆盖。
  - 动态内容。
  - 小幅回滚。
  - 底部/顶部固定栏。
  - 深色或静态大区域。

### 4.4 置信度 / 成功概率估计

已有诊断能力：

- `StitchConfidenceDiagnosticsRecorder`
- 一键诊断日志可打印相邻图片拼接置信度。
- 最近连续截图发现会基于相邻截图置信度决定是否触发。

官网表达建议：

- 可介绍为“拼接前会评估相邻截图匹配稳定性”。
- 避免直接承诺“100% 成功”。
- 可用“更可靠地识别连续截图”“减少错误拼接”表达。

### 4.5 视频抽帧与去重

自动模式中使用 `VideoProcessor`：

- 支持按时间抽帧。
- 支持按滚动距离抽帧。
- 默认抽帧 FPS：`3.0`
- 默认模式：timeBased
- 距离抽帧预设：aggressive / balanced / conservative
- 使用 AVFoundation、Accelerate、Vision 辅助分析。

设置项：

- Template Stitching Version
- Distance Extraction Level
- AI Auto Remove Scrollbar
- Manual Stitch Sort

## 5. 订阅与 Pro 权益

### 5.1 订阅系统

- 使用 RevenueCat。
- Entitlement ID：`ScrollShot Pro`
- App 启动时配置 RevenueCat API Key。
- 用户订阅状态由 `SubscriptionManager.isPro` 控制。

### 5.2 免费版与 Pro 会员

当前产品规则：

| 能力 | 免费用户 | Pro 用户 |
| --- | --- | --- |
| 手动拼接 | 支持 | 支持 |
| 相册选择 | 支持 | 支持 |
| 拼接预览 | 支持 | 支持 |
| 保存长图 | 支持 | 支持 |
| 部分主题色 | 前 3 个免费主题 | 全部主题 |
| 自动录屏拼接 | 需升级 | 支持 |
| 选择视频拼接 | 需升级 | 支持 |
| Pro 专属主题 | 跳转付费墙 | 支持 |

### 5.3 付费墙内容方向

来自 `Paywall.md` 与 `PaywallView.swift`：

核心价值主张：

- 告别繁琐，拥抱智能。让每一次拼接都成为享受。

功能权益：

- 智能自动拼接：开启录屏并滚动，AI 自动抽帧、去重、无缝合成。
- 无限使用：解锁全部高级功能和未来更新。
- Pro 身份：专属主题与图标，体现个人品味。

订阅包：

- Lifetime
- Annual
- Monthly

官网建议：

- Pro 价值页要重点讲“自动拼接节省时间”，主题只是增强项。
- “全部主题色”可作为 Pro 的审美权益展示。
- 自动录屏拼接应作为付费墙首要卖点。

## 6. 主题系统

### 6.1 免费主题规则

- `AppConfig.freeThemeColorCount = 3`
- 主题列表前 3 个为免费主题。
- 其余主题对非会员显示 Pro 皇冠标识，点击后进入付费墙。
- 非会员点击 Pro 主题时，付费墙会使用被点击主题作为预览主题色。

当前主题顺序来自 `AppThemeColor.allCases`。

### 6.2 主题列表

| 顺序 | Key | 中文名 | 英文名 | 主色 | 色板 |
| --- | --- | --- | --- | --- | --- |
| 1 | `orange` | 活力橙 | Vibrant Orange | `#EB5332` | `#F6CF8B`, `#EB5332`, `#65B59D`, `#FAE7C7`, `#FFFBF9` |
| 2 | `classicDark` | 极致黑 | Classic Dark | `#C0FF00` | `#0A0A0B`, `#1C1C1E`, `#2A3A34`, `#C0FF00` |
| 3 | `aquaIvory` | 白群蓝 | Aqua Ivory | `#053154` | `#83CCD2`, `#053154`, `#FFFBF0`, `#E4F5F6` |
| 4 | `scandinavianBlue` | 北欧蓝 | Nordic Blue | `#2D5F7C` | `#8FB5C9`, `#2D5F7C`, `#DE9960`, `#82B29B`, `#F7FAFC` |
| 5 | `forestSage` | 森屿绿 | Forest Sage | `#396051` | `#0A3D2E`, `#396051`, `#588372`, `#D3C59C`, `#F2EAD6` |
| 6 | `sakuraAqua` | 樱花蓝 | Sakura Aqua | `#0F7F79` | `#F8B6A8`, `#FCF5E2`, `#81D8D0`, `#0F7F79`, `#FFF9F4` |
| 7 | `limeFresh` | 嫩芽绿 | Fresh Lime | `#3C7A17` | `#BDDD22`, `#FEEEE1`, `#3C7A17`, `#E9F6B8`, `#F8FFF0` |
| 8 | `hermesOrange` | 马仕橙 | Hermes Orange | `#FF4E20` | `#FF8A00`, `#FEEEE1`, `#FF4E20`, `#FFD49A`, `#FFF7F0` |
| 9 | `lentilPurple` | 扁豆紫 | Lentil Purple | `#A762E6` | `#A762E6`, `#FFF043`, `#FCEFE8`, `#D8B2FF`, `#FCF7FF` |
| 10 | `cyanPop` | 青碧色 | Cyan Pop | `#009B72` | `#00E09E`, `#F9FF72`, `#9932CC`, `#C9F7EA`, `#FAFFF0` |
| 11 | `magentaPop` | 洋红色 | Vivid Magenta | `#FF4777` | `#FF4777`, `#8A13C5`, `#FEEF70`, `#FFD8E4`, `#FFF9E0` |
| 12 | `matchaGreen` | 抹茶绿 | Matcha Green | `#5B7A3A` | `#C5D1B4`, `#8CCB19`, `#5B7A3A`, `#F9FAF6` |
| 13 | `sakuraPink` | 樱花粉 | Sakura Pink | `#B0587A` | `#E8C5D8`, `#F3AFC4`, `#B0587A`, `#FDF8FA` |
| 14 | `lilacPurple` | 丁香紫 | Lilac Purple | `#7D6B99` | `#D7C2EA`, `#B09AD0`, `#7D6B99`, `#FAF8FC` |
| 15 | `indigoBlue` | 群青蓝 | Indigo | `#4F5FA8` | `#9AA8EA`, `#4F5FA8`, `#293A84`, `#F7F8FC` |

### 6.3 主题在官网中的用法建议

- 首页主视觉建议使用当前默认主题“活力橙”，因为识别度高、行动按钮强。
- 功能页可展示不同主题下的 UI 截图，强调“工具也可以有审美”。
- Pro 页面可展示完整主题色墙，作为会员权益。
- 主题列表可作为官网独立 section：“Pick a look that feels yours”。

## 7. 多语言与国际化

### 7.1 支持语言

当前支持：

| 代码 | 语言 |
| --- | --- |
| `system` | 跟随系统 |
| `en` | English |
| `zh-Hans` | 简体中文 |
| `ja` | 日本語 |
| `ko` | 한국어 |
| `es` | Español |
| `de` | Deutsch |
| `fr` | Français |
| `pt-BR` | Português (Brasil) |
| `zh-Hant` | 繁體中文 |
| `ru` | Русский |
| `hi` | हिन्दी |
| `ar` | العربية |
| `id` | Bahasa Indonesia |
| `it` | Italiano |
| `tr` | Türkçe |
| `vi` | Tiếng Việt |
| `th` | ไทย |
| `pl` | Polski |
| `nl` | Nederlands |
| `cs` | Čeština |
| `ur` | اردو |
| `bn` | বাংলা |
| `am` | አማርኛ |

### 7.2 RTL 支持

- Arabic 与 Urdu 使用 RTL 布局方向。
- `LocalizationManager.layoutDirection` 会注入 SwiftUI 环境。

### 7.3 本地化质量控制

代码中已有：

- `missingKeysReport()`：检查缺失 key。
- `englishFallbackReport()`：检查非英文语言是否泄漏英文文案。
- `chineseFallbackReport()`：检查非 CJK 语言是否泄漏中文文案。
- Debug 构建中会 assert 防止缺失 key 和中文泄漏。

官网建议：

- 官网若做多语言版本，建议首期先支持中文与英文。
- App 内已覆盖多语言，可作为官网“多语言支持”卖点，但不必在首页展开全部语言。

## 8. 隐私、权限与安全表达

### 8.1 权限使用

| 权限 | 用途 |
| --- | --- |
| 相册权限 | 选择截图、读取图片、保存拼接结果、删除原图 |
| 通知权限 | 录屏结束后提醒用户进入拼接流程 |
| 系统录屏 | 自动拼接模式中录制滚动过程 |

### 8.2 隐私表达

App 内已有隐私提示：

- 照片仅在本机用于拼接，不会上传。
- 开启相册访问后，可以选择多张截图并按顺序拼成长图。

官网可使用：

- 本机处理优先：图片与视频处理在设备上完成。
- 不上传照片：你的截图只用于本机拼接流程。
- 权限透明：相册用于选择与保存，通知用于提醒录屏完成。

注意：

- 如果未来引入云端能力，官网隐私文案需要同步更新。
- 当前不要写“绝不收集任何数据”这类过度承诺，除非隐私政策和第三方 SDK 行为完全确认。

## 9. 页面与 UI 信息

### 9.1 主要页面

| 页面 | 说明 | 官网可展示点 |
| --- | --- | --- |
| 首页 | 自动拼接 / 手动拼接入口 | 两种模式一屏切换 |
| 自动拼接页 | 录屏生成长图 | 一键录屏、自动长图 |
| 手动拼接页 | 相册预览、选择图片 | 按顺序选择、中心序号引导 |
| 视频裁剪页 | 裁剪录屏有效片段 | 去掉无关片段，精准拼接 |
| 拼接预览页 | 查看拼接结果 | 保存、微调、清理滚动条 |
| 拼接微调页 | 手动调整拼接缝 | 结果可控 |
| 保存完成页 | 保存、分享、查看大图 | 图片/PDF 分享 |
| 设置页 | 主题、语言、权限、算法设置 | 高级配置与多语言 |
| 主题选择页 | 色卡式主题选择 | 视觉审美 |
| 语言选择页 | 多语言选择 | 全球化 |
| 付费墙 | Pro 解锁 | 自动拼接和完整主题 |

### 9.2 视觉语言

当前 UI 关键词：

- 浅色背景。
- 柔和圆角。
- 主题色驱动。
- 胶囊按钮。
- 大面积留白。
- 底部上弹 sheet。
- 色卡式主题选择。
- 轻量图标，统一主题色。

官网视觉建议：

- 首屏使用真实 App 截图或高质量 mockup，避免纯抽象插画。
- 背景使用柔和浅色或主题色渐变，但不要过度复杂。
- 用“手机中滚动页面变成长图”的动效或序列图讲清楚自动模式。
- 功能卡片保持简洁，不要堆太多文案。

## 10. 官网信息架构建议

### 10.1 首页结构

建议页面顺序：

1. Hero：一键录屏，自动长图
2. 自动拼接演示：录屏、滚动、停止、生成
3. 手动拼接：按顺序选择图片，精确拼接
4. 智能算法：自动识别重叠、去重、匹配、拼接
5. 微调与滚动条清理：细节可控
6. 分享与保存：保存相册、分享图片、分享 PDF
7. 主题与多语言：好看且全球化
8. Pro：解锁自动录屏拼接与全部主题
9. 隐私承诺：本机处理，不上传照片
10. FAQ
11. 下载 CTA

### 10.2 官网导航建议

- Features
- How It Works
- Pro
- Themes
- Privacy
- FAQ
- Download

中文导航：

- 功能
- 使用方式
- Pro
- 主题
- 隐私
- 常见问题
- 下载

### 10.3 首页首屏文案候选

标题：

- 一键录屏，自动长图

副标题：

- ScrollShot 会从录屏中自动抽帧、去重并拼接成长图。聊天记录、网页、App 页面和文档内容，都能更轻松地保存与分享。

CTA：

- 在 App Store 下载
- 查看 Pro 功能

补充短句：

- 支持手动拼接、拼接微调、PDF 分享和多语言界面。

### 10.4 自动拼接功能 section

标题：

- 录屏滚动，剩下交给 ScrollShot

文案：

- 开启系统录屏后正常滚动页面，ScrollShot 会自动提取关键帧，过滤重复画面，并寻找最佳拼接位置。你不需要手动截几十张图。

展示元素：

- 4 步流程：启动录屏、滚动浏览、停止录屏、选择视频。
- 一张录屏页面 UI 截图。
- 一张生成结果截图。

### 10.5 手动拼接功能 section

标题：

- 想精确控制？按顺序手动拼接

文案：

- 从相册选择多张截图，最先选择的图片会放在长图顶部。中心序号与顶部/接续/底部提示帮助你保持正确顺序。

展示元素：

- 相册选择页面截图。
- 选中序号 overlay。
- 开始拼接按钮。

### 10.6 算法 section

标题：

- 为真实滚动场景优化的拼接算法

文案：

- ScrollShot 的拼接引擎会分析相邻图片的重叠区域、滚动偏移和拼接缝，尽量减少错位、重复和断裂。对于浮动控件、固定底栏、轻微回滚等复杂场景，也有专门的匹配策略。

可视化建议：

- 两张截图重叠区域高亮。
- 拼接缝位置示意。
- 置信度条或“匹配稳定性”动画。

### 10.7 Pro section

标题：

- ScrollShot Pro：释放自动拼接能力

文案：

- Pro 解锁自动录屏拼接、视频选择拼接和全部主题。适合经常保存长内容、需要高效率整理截图的用户。

权益点：

- 智能自动拼接
- 选择视频拼接
- 全部主题色
- 高级功能持续更新

## 11. 可用于官网的功能短句

- 一键录屏，自动生成长图。
- 手动选择图片，按选择顺序拼接。
- 自动发现最近连续截图。
- 拼接前评估相邻截图匹配稳定性。
- 保存后可继续分享图片或 PDF。
- 支持拼接微调，细节不交给黑箱。
- 自动清理滚动条痕迹。
- 多套主题色，让工具也保持审美。
- 多语言界面，适合全球用户。
- 照片仅在本机用于拼接，不上传。

## 12. FAQ 建议

### Q1：ScrollShot 和系统截图有什么区别？

系统截图只能保存当前屏幕。ScrollShot 可以把滚动页面合成为一张长图，并支持录屏自动拼接和多张图片手动拼接。

### Q2：自动拼接怎么使用？

开启系统录屏，滚动需要保存的页面，停止录屏后选择视频，ScrollShot 会自动提取画面并生成长图。

### Q3：手动拼接时图片顺序怎么决定？

默认按用户选择图片的先后顺序拼接。最先选择的图片会放在长图顶部。如果在设置中开启手动拼接排序模式，则会按创建时间从早到晚排序。

### Q4：我的照片会上传吗？

当前产品文案与权限说明强调照片仅在本机用于拼接，不会上传。官网可以这样表达，但要与隐私政策和第三方 SDK 行为保持一致。

### Q5：为什么需要相册权限？

用于选择截图、保存拼接结果，以及在用户确认后清理原图。

### Q6：为什么需要通知权限？

录屏结束后，App 可以通过通知提醒你继续拼接流程。

### Q7：是否支持 PDF？

支持。保存完成页可以分享图片，也可以分享 PDF。

### Q8：Pro 解锁什么？

Pro 解锁自动录屏拼接、选择视频拼接、全部主题色，以及后续高级功能。

## 13. 官网素材清单

建议准备以下素材：

### 13.1 必备截图

- 自动拼接首页。
- 手动拼接首页。
- 相册选择并显示序号的页面。
- 拼接预览页。
- 拼接微调页。
- 保存完成页。
- 大图查看页。
- 主题选择页。
- 语言选择页。
- 付费墙。

### 13.2 动效素材

- 录屏滚动到长图生成的 5-8 秒短视频。
- 手动选择 3 张图并出现“顶部/接续/底部”的动效。
- 拼接微调前后对比。
- 分享图片/PDF 的操作动效。

### 13.3 品牌素材

- App Icon。
- LaunchLogo。
- 主题色卡。
- App Store 下载徽章。
- iPhone mockup。

当前仓库中可关注：

- `snap-long-image/Assets.xcassets/AppIcon.appiconset`
- `snap-long-image/Assets.xcassets/LaunchLogo.imageset`
- `snap-long-image/Assets.xcassets/LaunchLogoRounded.imageset`

## 14. SEO 关键词建议

中文关键词：

- 截长图
- 长截图
- 滚动截图
- iPhone 长截图
- iOS 长截图
- 聊天记录长截图
- 网页长截图
- 图片拼接
- 截图拼接
- 录屏生成长图
- 长图生成器
- 分享 PDF

英文关键词：

- long screenshot
- scrolling screenshot
- iPhone long screenshot
- iOS scrolling screenshot
- screenshot stitch
- stitch screenshots
- screen recording to long image
- chat screenshot stitcher
- webpage long screenshot
- share screenshot as PDF

## 15. 官网合规与措辞边界

建议避免的表达：

- “100% 完美拼接”
- “任何页面都能无损拼接”
- “绝对不收集任何数据”
- “AI 全自动修复所有滚动条”
- “永久免费全部功能”
- “支持 Android”

更稳妥的表达：

- “尽量减少错位和重复”
- “为真实滚动场景优化”
- “照片仅用于本机拼接流程”
- “支持自动清理常见滚动条痕迹”
- “Pro 解锁自动拼接和全部主题”

## 16. 需要进一步确认的信息

这些信息当前不能完全从代码中确认，做官网前建议补齐：

- App Store 正式下载链接是否已经公开可访问。
- 当前上架版本是否仍为 `1.0.4`，截图中曾出现 `v1.0.9`，需要确认以 App Store Connect 为准。
- Pro 价格、试用期、地区价格展示策略。
- 官网主域名与部署路径。
- Support Email 或联系表单地址。
- 是否需要英文官网首发，还是中文/英文同时上线。
- 是否需要收集官网 analytics。
- 是否需要 Cookie/追踪声明。
- 是否需要新闻稿、Press Kit、媒体素材包。

## 17. 推荐官网文案基调

ScrollShot 的官网不适合做成夸张的工具广告，更适合“轻、准、可信、审美好”的产品气质：

- 语言简洁，强调效率和掌控感。
- 多用真实 UI 和真实长图结果。
- 不过度堆算法术语，但可以用“自动抽帧、去重、匹配、拼接”解释可信度。
- 隐私表达要清楚。
- Pro 价值要聚焦自动拼接，主题色作为审美加分项。

## 18. 官网首页示例文案草稿

### Hero

标题：

一键录屏，自动长图

副标题：

ScrollShot 会从你的录屏中自动提取关键画面，去重并拼接成一张清晰长图。聊天记录、网页、App 页面和文档内容，都能更轻松地保存与分享。

按钮：

- 在 App Store 下载
- 查看 Pro 功能

### 自动拼接

标题：

滚动一次，长图自动完成

正文：

开启系统录屏后，像平时一样滚动页面。ScrollShot 会分析录屏内容，自动找到连续画面之间的重叠关系，并生成完整长图。

### 手动拼接

标题：

需要精确控制时，手动也很顺手

正文：

从相册选择多张图片，ScrollShot 会按你的选择顺序拼接。顶部、接续、底部的序号提示，让长图顺序更清楚。

### 微调与分享

标题：

保存前还能细看、微调、清理

正文：

拼接完成后，你可以查看大图、微调拼接位置、清理滚动条，并保存到相册。需要发送给别人时，也可以直接分享图片或 PDF。

### 隐私

标题：

你的截图，只在本机处理

正文：

ScrollShot 使用相册权限来选择和保存图片，使用通知权限提醒录屏完成。照片用于本机拼接流程，不会上传。

## 19. 面向设计与开发的官网落地注意事项

- 首屏必须展示真实产品：使用 iPhone mockup + 自动拼接结果，不要只用抽象插画。
- 重点 CTA 使用当前主题主色，默认建议活力橙。
- 官网色彩可提供主题切换小彩蛋，但不要影响可读性。
- 页面中的 App 截图要覆盖中文和英文两套，便于国际化推广。
- 移动端首屏要露出 App 截图和下载按钮。
- FAQ 与隐私 section 要靠后但不能缺失。
- Pro section 的价格应由真实 App Store / RevenueCat 产品信息决定，不要写死到官网文案里。

## 20. 代码参考索引

| 信息 | 主要文件 |
| --- | --- |
| 全局配置 | `snap-long-image/AppConfig.swift` |
| App 入口 / RevenueCat | `snap-long-image/snap_long_imageApp.swift` |
| 首页 | `snap-long-image/ContentView.swift` |
| 自动拼接页 | `snap-long-image/Views/ScreenRecordingModeView.swift` |
| 手动拼接页 | `snap-long-image/Views/PhotoSelectionModeView.swift` |
| 拼接 ViewModel | `snap-long-image/ViewModels/StitcherViewModel.swift` |
| 图片拼接 | `snap-long-image/Utils/ImageStitcher.swift` |
| 拼接引擎包 | `snap-long-image/StitchingEngine/` |
| 视频处理 | `snap-long-image/Utils/VideoProcessor.swift` |
| 相册管理 | `snap-long-image/Utils/PhotoLibraryManager.swift` |
| 保存完成页 | `snap-long-image/Views/SavedResultView.swift` |
| 微调页 | `snap-long-image/Views/StitchingFineTuneView.swift` |
| 主题系统 | `snap-long-image/Utils/ThemeManager.swift` |
| 设置页 | `snap-long-image/Views/SettingsView.swift` |
| 付费墙 | `snap-long-image/Views/PaywallView.swift` |
| 多语言 | `snap-long-image/Utils/LocalizationManager.swift`, `snap-long-image/Utils/LocalizedStrings*.swift` |
| 诊断日志 | `snap-long-image/Views/DebugLogView.swift`, `snap-long-image/Utils/StitchConfidenceDiagnosticsRecorder.swift` |
| Pro 文案 | `Paywall.md` |

