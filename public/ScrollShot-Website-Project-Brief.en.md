# ScrollShot Website Project Brief

> Purpose: This document collects the product, feature, technical, design, subscription, localization, privacy, SEO, and website-planning information needed to build a complete official website for ScrollShot.  
> Prepared on: 2026-05-10  
> Source: Current repository, configuration files, Paywall copy, StitchingEngine README, SwiftUI views, app utilities, and project settings.

## 1. Project Overview

### 1.1 Product Name

- App name: ScrollShot
- Membership name: ScrollShot Pro
- Category: iOS long screenshot / scrolling screenshot / screenshot stitching tool
- Core capability: Generate long images automatically from screen recordings, or manually stitch multiple screenshots in the order chosen by the user.

### 1.2 One-Sentence Description

ScrollShot is an iOS long screenshot tool that can turn a screen recording into a full-length image automatically, while also supporting manual screenshot stitching, fine tuning, scrollbar cleanup, image sharing, PDF sharing, themes, and multilingual UI.

### 1.3 Recommended Website Value Propositions

Possible hero headlines:

- One Tap Record, Auto Long Image
- Turn Screen Recordings Into Long Screenshots
- From Screenshots to One Clean Long Image
- Auto Stitch, Fine Tune, and Share as PDF

Possible subtitles:

- Start a system screen recording, scroll through the page, and ScrollShot will extract key frames, remove duplicates, match overlaps, and generate a clean long image.
- Perfect for saving chats, webpages, app screens, documents, and social content. Processing is designed to happen on device; photos are not uploaded for stitching.
- Need more control? Select images manually, keep the exact order you choose, and fine tune stitching positions before saving.

### 1.4 Target Users

- Users who often save chat history, social posts, articles, webpages, transactions, tutorials, and long app screens.
- People who need to turn long content into a single image or PDF for sharing.
- Product managers, designers, developers, operations teams, customer support teams, content creators, and students.
- Users who care about screenshot privacy and local processing.
- Efficiency-focused users who want to reduce manual screenshots, repeated alignment, and cropping work.

### 1.5 Core Differentiators

- Auto mode: use a system screen recording to automatically extract frames and stitch a long image.
- Manual mode: preserve the user's selection order for precise control.
- Preview template-matching algorithm: optimized for complex real-world cases such as floating UI, dynamic content, small scroll-backs, and bottom scrollbars.
- Fine-tuning page: allows users to manually correct stitching seams instead of relying entirely on a black-box result.
- Scrollbar cleanup: supports automatic or manual removal of common scrollbar traces.
- Saved result page: after saving to Photos, users can share the image, share PDF, view full size, or clean up original images.
- Theme system: multiple carefully designed color themes, with full theme access for Pro users.
- Multilingual UI: currently supports 24 language options, including RTL languages.

## 2. Current App Information

### 2.1 Bundle and Version

From `snap-long-image.xcodeproj/project.pbxproj`:

| Item | Value |
| --- | --- |
| App Display Name | ScrollShot |
| App Bundle ID | `com.manifoldtech.ScrollShot` |
| Broadcast Extension Bundle ID | `com.manifoldtech.ScrollShot.BroadcastUploadExtension` |
| Marketing Version | `1.0.4` |
| Build Version | `4` |

### 2.2 App Store and Legal Links

From `snap-long-image/AppConfig.swift`:

| Item | Value |
| --- | --- |
| App Store ID | `6760192003` |
| App Store URL, English | `https://apps.apple.com/us/app/scrollshot-long-screenshot/id6760192003` |
| App Store URL, Chinese | `https://apps.apple.com/cn/app/scrollshot-%E6%BB%9A%E5%8A%A8%E6%88%AA%E5%9B%BE-%E6%8B%BC%E6%8E%A5%E9%95%BF%E5%9B%BE/id6760192003` |
| App Store review URL | `itms-apps://itunes.apple.com/app/id6760192003?action=write-review` |
| Privacy Policy, Simplified/Traditional Chinese | `https://yongyuan.name/scrollshot/` |
| Privacy Policy, English and other languages | `https://yongyuan.name/scrollshot/en/` |
| Terms of Service, Simplified/Traditional Chinese | `https://yongyuan.name/scrollshot/tos/` |
| Terms of Service, English and other languages | `https://yongyuan.name/scrollshot/tos/en/` |
| ICP record | `京ICP备2026011241号-1A` |
| ICP lookup | `https://beian.miit.gov.cn` |

### 2.3 Technical Stack

- iOS app: SwiftUI
- System screen recording: ReplayKit Broadcast Upload Extension
- Video processing: AVFoundation
- Image processing: CoreGraphics, CoreImage, Accelerate, Vision
- Photo library access: Photos / PhotoKit
- Subscription system: RevenueCat
- Stitching algorithm: in-repository Swift Package `StitchingEngine`
- Localization system: custom `LocalizationManager` plus `LocalizedStrings` tables
- Theme system: custom `ThemeManager`

## 3. Product Feature Map

### 3.1 Auto Stitch Mode

Entry point: top segmented control on the home screen, labeled `Auto Stitch`.

Core flow:

1. The user taps `Start System Recording`.
2. iOS shows the system recording entry point.
3. The user scrolls through the content they want to save.
4. The user stops recording.
5. The app receives the recorded video through notification or an app entry point.
6. The user can enter the video trimming page and select the valid segment.
7. The app extracts frames, removes duplicates, and analyzes scrolling distance.
8. The stitching engine generates a long image.
9. The user reaches the result page, then can save, share, fine tune, or clean scrollbars.

Auto mode should be one of the main highlights of the website because it is the core productivity advantage of ScrollShot Pro.

Website copy ideas:

- Record and scroll once. ScrollShot turns it into a long image automatically.
- No need to capture dozens of screenshots or align them manually.
- Especially useful for chats, webpages, app screens, and long-form content.

### 3.2 Manual Stitch Mode

Entry point: top segmented control on the home screen, labeled `Manual Stitch`.

Core flow:

1. The user enters the `Select from Album` area.
2. The user chooses an album such as Recents, Screenshots, Favorites, or a custom album.
3. The user selects images in stitching order.
4. By default, ScrollShot preserves the user's selection order. A setting can enable automatic time-based sorting.
5. Selected images show a center badge with the order number and spatial hint: Top, Continue, Bottom.
6. The user taps `Start Stitching`.
7. The app opens the preview page, where the user can save, fine tune, or remove scrollbars.

Important product rules:

- Manual mode stitches images in the order selected by the user by default.
- The image that should appear at the top of the final long image should be selected first.
- If `Manual Stitch Sort` is enabled in Settings, screenshots are automatically sorted by creation date in ascending order.
- This switch is off by default. The default is controlled by `AppConfig.defaultAutoSortScreenshots = false`.

Website copy ideas:

- Select images manually and stitch them in your chosen order.
- Works for sequential screenshots and partially overlapping images.
- Center order badges and Top/Continue/Bottom hints help users avoid choosing the wrong order.

### 3.3 Recent Sequential Screenshot Detection

Entry point: the `Recent Sequential Screenshots Found` card in manual mode.

Trigger logic:

- When the app opens, it asynchronously analyzes recent screenshots.
- The suggestion appears only when adjacent screenshots reach the stitching confidence threshold.
- The threshold is controlled by `AppConfig.recentScreenshotStitchConfidenceThreshold`, currently `0.85`.
- The maximum creation-time interval between recent screenshots is controlled by `AppConfig.recentScreenshotMaxCreationInterval`, currently `60` seconds.

Value:

- If the user has just captured several screenshots in a row, the app can detect them and suggest immediate stitching.
- This reduces the need to manually search, sort, and select screenshots.

### 3.4 Stitching Preview Page

Main features:

- Shows the stitched result.
- Saves the image to Photos.
- Opens the fine-tuning page.
- Removes scrollbars.
- Opens the stitched image for full-size viewing.

Visual configuration:

- The stitched result width is controlled by `AppConfig.stitchedResultImageWidthRatio`, currently `0.86`.
- This keeps the left and right margins consistent across the preview and fine-tuning pages.

### 3.5 Fine-Tuning Page

Main features:

- Allows manual adjustment of stitching seams.
- Supports boundary and seam-position adjustment.
- Provides a preview of the corrected result.

Website copy ideas:

- The algorithm does the first pass; you stay in control of the final details.
- Useful for chats, long webpages, documents, and other high-accuracy scenarios.

### 3.6 Saved Result Page

After a successful save, the user enters the saved preview page.

Main features:

- Shows the `Saved to Album` status.
- Provides a scrollable long-image preview.
- Opens full-size view.
- Cleans original source images.
- Shares the image.
- Shares as PDF.
- Finishes and returns.

Website showcase ideas:

- Stitch, save, and share from one result page.
- Share either as an image or a PDF.
- Optionally clean up original images to reduce album clutter.

### 3.7 Full-Size Image Viewer

Main features:

- Full-screen long-image viewing.
- Supports zooming and panning.
- Horizontal panning is constrained so the image cannot be dragged completely off screen, avoiding a blank black viewport.

Website copy ideas:

- Inspect every detail before or after saving.
- Zoom in to check text clarity, seams, and scrollbar cleanup.

### 3.8 Scrollbar Removal

Entry points:

- Remove scrollbar action on the preview page.
- AI Auto Remove Scrollbar switch in Settings.

Configuration:

- `AppConfig.defaultAutoScrollbarRemoval = false`
- `AppConfig.enableVerticalScrollbarRemoval = true`
- `AppConfig.enableHorizontalScrollbarRemoval = true`

Notes:

- Supports common right-side vertical scrollbar traces and bottom horizontal scrollbar traces.
- Website copy should say `clean up common scrollbar traces` rather than overpromising that every scrollbar in every image can be removed perfectly.

## 4. Stitching Algorithm Capabilities

### 4.1 Algorithm Modules

Core implementation:

- `snap-long-image/Utils/ImageStitcher.swift`
- `snap-long-image/StitchingEngine/Sources/StitchingEngine/`

Swift Package:

- Package name: `StitchingEngine`
- Requirements: Swift 5.9+, iOS 15+ / macOS 12+
- Characteristics: no third-party dependencies; relies only on Apple frameworks.

### 4.2 Current Algorithm Versions

Settings currently support:

| Algorithm Version | UI Label | Description |
| --- | --- | --- |
| Preview | Preview | Latest engine, covers more complex cases |
| Stable | Stable | Verified stable engine |

Current default:

- `TemplateMatchingAlgorithmPreference.defaultVersion = .preview`

### 4.3 Core Algorithm Capabilities

From `StitchingEngine/README.md` and the current implementation:

- NCC-based template matching, where NCC means Normalized Cross-Correlation.
- Multi-template consistency checks.
- Pyramid search and multi-stage refinement.
- SAD verification fallback.
- 1-D profile NCC fallback.
- Dynamic bottom-region detection.
- Optimal seam search to reduce visible stitching artifacts.
- Temporal offset prediction, using adjacent-frame scroll behavior to improve robustness.
- Handles several real-world issues:
  - Floating UI overlays.
  - Dynamic content.
  - Small scroll-backs.
  - Fixed top or bottom bars.
  - Dark or static large regions.

### 4.4 Confidence / Success Probability Estimation

Existing diagnostics:

- `StitchConfidenceDiagnosticsRecorder`
- The one-tap diagnostics log can print the stitching confidence between adjacent images.
- Recent sequential screenshot detection uses adjacent screenshot confidence to decide whether to show the suggestion.

Website wording:

- Good: `ScrollShot evaluates how stable the match is before stitching adjacent screenshots.`
- Good: `Better detection of sequential screenshots.`
- Avoid: `100% success rate` or `guaranteed perfect stitching`.

### 4.5 Video Frame Extraction and Deduplication

Auto mode uses `VideoProcessor`:

- Supports time-based frame extraction.
- Supports distance-based frame extraction.
- Default extraction FPS: `3.0`
- Default mode: `timeBased`
- Distance extraction presets: aggressive, balanced, conservative
- Uses AVFoundation, Accelerate, and Vision to assist analysis.

Related settings:

- Template Stitching Version
- Distance Extraction Level
- AI Auto Remove Scrollbar
- Manual Stitch Sort

## 5. Subscription and Pro Benefits

### 5.1 Subscription System

- Uses RevenueCat.
- Entitlement ID: `ScrollShot Pro`
- RevenueCat API key is configured at app launch.
- User subscription status is controlled by `SubscriptionManager.isPro`.

### 5.2 Free vs Pro

Current product rules:

| Feature | Free Users | Pro Users |
| --- | --- | --- |
| Manual stitching | Supported | Supported |
| Album selection | Supported | Supported |
| Stitching preview | Supported | Supported |
| Save long image | Supported | Supported |
| Theme colors | First 3 themes | All themes |
| Auto screen-recording stitch | Requires upgrade | Supported |
| Select video to stitch | Requires upgrade | Supported |
| Pro-only themes | Opens paywall | Supported |

### 5.3 Paywall Direction

From `Paywall.md` and `PaywallView.swift`:

Core value proposition:

- Say goodbye to tedious stitching. Let every stitch feel effortless and intelligent.

Benefit pillars:

- Smart Auto Stitch: record and scroll; AI extracts frames, removes duplicates, and merges them into a long image.
- Unlimited Usage: unlock all premium features and future updates.
- Pro Identity: exclusive themes and icons that reflect personal taste.

Subscription packages:

- Lifetime
- Annual
- Monthly

Website recommendations:

- The Pro page should focus on time saved by auto stitching.
- Themes should be presented as an aesthetic Pro benefit, not the only reason to upgrade.
- Auto screen-recording stitch should be the primary paywall selling point.

## 6. Theme System

### 6.1 Free Theme Rule

- `AppConfig.freeThemeColorCount = 3`
- The first 3 themes in the theme list are free.
- Other themes show a Pro crown for non-Pro users, and tapping them opens the paywall.
- When a non-Pro user taps a Pro theme, the paywall uses that selected theme as its preview theme color.

Current theme order comes from `AppThemeColor.allCases`.

### 6.2 Theme List

| Order | Key | Chinese Name | English Name | Primary Color | Palette |
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

### 6.3 Theme Usage on the Website

- Use Vibrant Orange as the default hero theme because it is recognizable and works well for primary CTAs.
- Show real app screenshots under multiple themes to communicate that this utility app also cares about aesthetics.
- Use the full theme wall in the Pro section as a membership benefit.
- A section title such as `Pick a look that feels yours` works well for the theme showcase.

## 7. Localization and Internationalization

### 7.1 Supported Languages

Current language options:

| Code | Language |
| --- | --- |
| `system` | Follow System |
| `en` | English |
| `zh-Hans` | Simplified Chinese |
| `ja` | Japanese |
| `ko` | Korean |
| `es` | Spanish |
| `de` | German |
| `fr` | French |
| `pt-BR` | Portuguese (Brazil) |
| `zh-Hant` | Traditional Chinese |
| `ru` | Russian |
| `hi` | Hindi |
| `ar` | Arabic |
| `id` | Indonesian |
| `it` | Italian |
| `tr` | Turkish |
| `vi` | Vietnamese |
| `th` | Thai |
| `pl` | Polish |
| `nl` | Dutch |
| `cs` | Czech |
| `ur` | Urdu |
| `bn` | Bengali |
| `am` | Amharic |

### 7.2 RTL Support

- Arabic and Urdu use right-to-left layout direction.
- `LocalizationManager.layoutDirection` is injected into the SwiftUI environment.

### 7.3 Localization Quality Control

The codebase already includes validation helpers:

- `missingKeysReport()`: checks missing localization keys.
- `englishFallbackReport()`: checks whether non-English languages still show English text.
- `chineseFallbackReport()`: checks whether non-CJK languages still show Chinese text.
- Debug builds assert against missing keys and Chinese leakage.

Website recommendation:

- For the website launch, Chinese and English are enough for the first version.
- The in-app multilingual coverage can be mentioned as a product strength, but the website does not need to list all languages on the first screen.

## 8. Privacy, Permissions, and Trust Messaging

### 8.1 Permissions

| Permission | Purpose |
| --- | --- |
| Photos | Select screenshots, read images, save stitched results, and delete originals after user confirmation |
| Notifications | Remind the user to continue after screen recording ends |
| System screen recording | Capture the scrolling process for auto stitching |

### 8.2 Privacy Messaging

Existing in-app privacy messaging:

- Photos are used locally for stitching and are not uploaded.
- After photo access is enabled, users can select multiple screenshots and stitch them in order.

Website-friendly copy:

- On-device first: image and video processing are designed to happen on your device.
- Your screenshots are not uploaded for stitching.
- Transparent permissions: Photos are used for selecting and saving; notifications are used to remind you when a recording is ready.

Important caveat:

- If cloud features are introduced later, website privacy copy must be updated.
- Avoid broad claims such as `we collect absolutely no data` unless the privacy policy and third-party SDK behavior fully support that statement.

## 9. Screens and UI Information

### 9.1 Main Screens

| Screen | Purpose | Website Showcase Point |
| --- | --- | --- |
| Home | Auto Stitch / Manual Stitch entry | Two modes in one screen |
| Auto Stitch | Recording to long image | One-tap recording, auto long image |
| Manual Stitch | Album preview and image selection | Ordered selection with center badges |
| Video Trim | Select useful video segment | Remove irrelevant recording parts |
| Preview | Review stitched result | Save, fine tune, remove scrollbars |
| Fine Tune | Adjust stitching seams | More control over the final result |
| Saved Result | Save, share, view full size | Image/PDF sharing |
| Settings | Themes, language, permissions, algorithm settings | Advanced configuration and localization |
| Theme Picker | Palette-style theme selection | Aesthetic product identity |
| Language Picker | Multilingual selection | Global readiness |
| Paywall | Pro unlock | Auto stitch and full theme access |

### 9.2 Visual Language

Current UI keywords:

- Light background.
- Soft rounded corners.
- Theme-driven colors.
- Capsule buttons.
- Generous whitespace.
- Bottom sheets.
- Palette-style theme picker.
- Lightweight icons unified by theme color.

Website visual recommendations:

- Use real app screenshots or high-quality iPhone mockups in the hero. Avoid purely abstract illustrations.
- Use soft light backgrounds or subtle theme-color gradients, but keep the page readable.
- Explain auto mode with a short visual sequence: phone screen scrolls, then becomes one long image.
- Keep feature cards concise; do not overload them with text.

## 10. Recommended Website Information Architecture

### 10.1 Homepage Structure

Recommended section order:

1. Hero: One Tap Record, Auto Long Image
2. Auto stitch demo: Record, Scroll, Stop, Generate
3. Manual stitch: Select images in order, stitch precisely
4. Smart algorithm: overlap detection, deduplication, matching, stitching
5. Fine tuning and scrollbar cleanup
6. Save and share: Photos, image sharing, PDF sharing
7. Themes and multilingual UI
8. Pro: unlock auto stitching and all themes
9. Privacy promise: on-device processing, no photo upload for stitching
10. FAQ
11. Download CTA

### 10.2 Navigation

Recommended English navigation:

- Features
- How It Works
- Pro
- Themes
- Privacy
- FAQ
- Download

Recommended Chinese navigation:

- 功能
- 使用方式
- Pro
- 主题
- 隐私
- 常见问题
- 下载

### 10.3 Hero Copy Options

Headline:

- One Tap Record, Auto Long Image

Subtitle:

- ScrollShot extracts key frames from your screen recording, removes duplicates, and stitches them into one long image. Chats, webpages, app screens, and documents become easier to save and share.

CTA:

- Download on the App Store
- See Pro Features

Supporting line:

- Manual stitching, fine tuning, PDF sharing, themes, and multilingual UI are all built in.

### 10.4 Auto Stitch Section

Title:

- Record and scroll. ScrollShot handles the rest.

Body:

- Start a system screen recording and scroll as usual. ScrollShot extracts key frames, filters duplicate scenes, and finds the best stitching positions. No need to capture dozens of screenshots manually.

Visual elements:

- Four-step flow: Start Recording, Scroll, Stop Recording, Select Video.
- One screenshot of the recording UI.
- One screenshot of the generated long image.

### 10.5 Manual Stitch Section

Title:

- Need precise control? Stitch manually in order.

Body:

- Select multiple screenshots from your album. The first selected image becomes the top of the final long image. Center order badges and Top/Continue/Bottom hints help keep the sequence clear.

Visual elements:

- Album selection screen.
- Selected-number overlay.
- Start Stitching button.

### 10.6 Algorithm Section

Title:

- A stitching engine optimized for real scrolling.

Body:

- ScrollShot analyzes overlap regions, scroll offsets, and seam positions between adjacent images to reduce misalignment, repetition, and breaks. Floating controls, fixed bars, minor scroll-backs, and dynamic content all receive specialized matching strategies.

Visualization ideas:

- Highlight the overlap area between two screenshots.
- Show the seam position.
- Show a confidence bar or match-stability animation.

### 10.7 Pro Section

Title:

- ScrollShot Pro unlocks the fastest workflow.

Body:

- Pro unlocks auto screen-recording stitch, video-based stitching, and all themes. It is built for people who frequently save long content and want a faster, cleaner screenshot workflow.

Benefit bullets:

- Smart Auto Stitch
- Select Video to Stitch
- All Theme Colors
- Advanced features and future updates

## 11. Short Feature Lines for the Website

- Record once. Get one long image.
- Select images manually and stitch them in your chosen order.
- Automatically detect recent sequential screenshots.
- Estimate matching stability before stitching adjacent screenshots.
- Share saved results as an image or PDF.
- Fine tune seams before saving.
- Clean up common scrollbar traces.
- Multiple themes for a utility app that still feels beautiful.
- Multilingual UI for global users.
- Photos are used for local stitching and are not uploaded for the stitching process.

## 12. Recommended FAQ

### Q1: How is ScrollShot different from the built-in screenshot tool?

The built-in screenshot tool captures the current screen. ScrollShot can merge scrolling content into one long image, with both auto stitching from screen recordings and manual stitching from multiple screenshots.

### Q2: How does auto stitching work?

Start a system screen recording, scroll through the content you want to save, stop recording, then select the video. ScrollShot extracts frames and generates a long image.

### Q3: How is image order decided in manual stitching?

By default, images are stitched in the order you select them. The first selected image becomes the top of the final long image. If `Manual Stitch Sort` is enabled in Settings, screenshots are sorted by creation date in ascending order.

### Q4: Are my photos uploaded?

The current product copy and permission messaging state that photos are used locally for stitching and are not uploaded. Website wording should remain consistent with the privacy policy and third-party SDK behavior.

### Q5: Why does ScrollShot need photo access?

Photo access is used to select screenshots, save stitched results, and clean up original images after user confirmation.

### Q6: Why does ScrollShot need notification access?

After recording ends, notifications can remind you to continue the stitching workflow.

### Q7: Can I share as PDF?

Yes. The saved result page supports sharing as an image or as a PDF.

### Q8: What does Pro unlock?

Pro unlocks auto screen-recording stitch, select-video stitch, all theme colors, and future advanced features.

## 13. Website Asset Checklist

### 13.1 Required Screenshots

- Auto Stitch home screen.
- Manual Stitch home screen.
- Album selection with numbered selection badges.
- Stitching preview page.
- Fine-tuning page.
- Saved result page.
- Full-size image viewer.
- Theme picker.
- Language picker.
- Paywall.

### 13.2 Motion Assets

- 5-8 second clip showing recording and scrolling turning into a long image.
- Manual selection of three images with Top/Continue/Bottom badges.
- Before/after of fine tuning.
- Share image/PDF interaction.

### 13.3 Brand Assets

- App Icon.
- LaunchLogo.
- Theme palettes.
- App Store download badge.
- iPhone mockups.

Potential asset paths:

- `snap-long-image/Assets.xcassets/AppIcon.appiconset`
- `snap-long-image/Assets.xcassets/LaunchLogo.imageset`
- `snap-long-image/Assets.xcassets/LaunchLogoRounded.imageset`

## 14. SEO Keyword Suggestions

Chinese keywords:

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

English keywords:

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

## 15. Compliance and Copy Boundaries

Avoid claims such as:

- `100% perfect stitching`
- `Lossless stitching for every page`
- `We collect absolutely no data`
- `AI automatically fixes every scrollbar`
- `All features are free forever`
- `Supports Android`

Safer wording:

- `Reduce misalignment and repeated content`
- `Optimized for real scrolling scenarios`
- `Photos are used for local stitching`
- `Clean up common scrollbar traces`
- `Pro unlocks auto stitching and all themes`

## 16. Information to Confirm Before Website Launch

The following items cannot be fully confirmed from the current repository:

- Whether the App Store public download link is live and accessible.
- Whether the currently live App Store version is still `1.0.4`; some screenshots show `v1.0.9`, so App Store Connect should be the source of truth.
- Pro prices, trial policy, and regional pricing display strategy.
- Official website domain and deployment path.
- Support email or contact form address.
- Whether the website should launch in English first, Chinese first, or both.
- Whether website analytics are needed.
- Whether a cookie/tracking disclosure is needed.
- Whether a press kit or media asset pack is needed.

## 17. Recommended Website Tone

ScrollShot should not feel like a loud utility ad. It should feel light, precise, trustworthy, and aesthetically refined:

- Use simple language that emphasizes efficiency and control.
- Use real UI and real long-image results.
- Do not overload visitors with algorithm jargon, but explain credibility with terms like frame extraction, deduplication, matching, and stitching.
- Make privacy messaging clear and calm.
- Present Pro mainly as a faster workflow. Themes should feel like a beautiful bonus.

## 18. Draft Homepage Copy

### Hero

Headline:

One Tap Record, Auto Long Image

Subtitle:

ScrollShot extracts key frames from your screen recording, removes duplicates, and stitches them into one clear long image. Chats, webpages, app screens, and documents become easier to save and share.

Buttons:

- Download on the App Store
- See Pro Features

### Auto Stitch

Title:

Scroll once. The long image builds itself.

Body:

Start a system screen recording and scroll like normal. ScrollShot analyzes the recording, finds the overlap between continuous scenes, and generates a complete long image.

### Manual Stitch

Title:

Manual when precision matters.

Body:

Select multiple images from your album, and ScrollShot stitches them in your selection order. Top, Continue, and Bottom badges make the final sequence easier to understand.

### Fine Tune and Share

Title:

Review, fine tune, clean up, and share.

Body:

After stitching, you can inspect the full image, fine tune seams, clean scrollbars, and save to Photos. When you need to send it out, share as an image or PDF.

### Privacy

Title:

Your screenshots stay on your device.

Body:

ScrollShot uses photo access to select and save images, and notification access to remind you when recording is ready. Photos are used for the local stitching workflow and are not uploaded for stitching.

## 19. Website Implementation Notes for Design and Development

- The hero must show the real product: use an iPhone mockup plus an auto-stitch result, not only abstract artwork.
- Use the current theme primary color for the main CTA. Vibrant Orange is recommended as the default.
- A small interactive theme switcher can be a nice detail, but it must not hurt readability.
- Website screenshots should include both Chinese and English versions for international promotion.
- On mobile, the first viewport should show both product imagery and the download CTA.
- FAQ and privacy sections should appear later on the page, but should not be omitted.
- Pro prices should come from real App Store / RevenueCat product data, not hardcoded marketing copy.

## 20. Code Reference Index

| Information | Main Files |
| --- | --- |
| Global configuration | `snap-long-image/AppConfig.swift` |
| App entry / RevenueCat | `snap-long-image/snap_long_imageApp.swift` |
| Home | `snap-long-image/ContentView.swift` |
| Auto Stitch screen | `snap-long-image/Views/ScreenRecordingModeView.swift` |
| Manual Stitch screen | `snap-long-image/Views/PhotoSelectionModeView.swift` |
| Stitching ViewModel | `snap-long-image/ViewModels/StitcherViewModel.swift` |
| Image stitching | `snap-long-image/Utils/ImageStitcher.swift` |
| Stitching engine package | `snap-long-image/StitchingEngine/` |
| Video processing | `snap-long-image/Utils/VideoProcessor.swift` |
| Photo management | `snap-long-image/Utils/PhotoLibraryManager.swift` |
| Saved result page | `snap-long-image/Views/SavedResultView.swift` |
| Fine-tuning page | `snap-long-image/Views/StitchingFineTuneView.swift` |
| Theme system | `snap-long-image/Utils/ThemeManager.swift` |
| Settings page | `snap-long-image/Views/SettingsView.swift` |
| Paywall | `snap-long-image/Views/PaywallView.swift` |
| Localization | `snap-long-image/Utils/LocalizationManager.swift`, `snap-long-image/Utils/LocalizedStrings*.swift` |
| Diagnostics | `snap-long-image/Views/DebugLogView.swift`, `snap-long-image/Utils/StitchConfidenceDiagnosticsRecorder.swift` |
| Pro copy | `Paywall.md` |
