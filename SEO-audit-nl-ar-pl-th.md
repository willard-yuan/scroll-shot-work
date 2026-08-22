# SEO 合规审查报告 — 4 个新首页 locale (nl / ar / pl / th)

生成日期：2026-08-22
审查范围：scrollshot.work 线上已部署版本（commit `82a9024`）
审查方式：curl 抓取线上 HTML + sitemap.xml 实测，逐项核对 Google / Bing hreflang 规范

---

## ✅ 一、通过项（全部达标）

| # | 检查项 | 规范依据 | 结果 |
|---|--------|---------|------|
| 1 | **HTTP 状态** | 200，可被索引 | nl/ar/pl/th 全部 200 ✓ |
| 2 | **单一 `<html>` 根标签** | 无重复根元素 | 每页仅 1 个 `<html lang dir>` ✓（注：早期误报的第二个 `<html lang="vi">` 实为 LanguagePrompt.astro 内 JS 注释文本，非真实标签） |
| 3 | **`<html lang>` 正确** | 与页面语言一致 | nl/ar/pl/th 均正确，ar 额外 `dir="rtl"` ✓ |
| 4 | **canonical 自引用** | canonical == 当前页 URL | 4 页 canonical 均指向自身 ✓ |
| 5 | **hreflang 簇完整性** | 每页含全部 15 语言 + x-default | 实测每页 16 条 alternate（含 x-default） ✓ |
| 6 | **hreflang 互逆性** | A 页列 B，B 页也列 A | EN↔nl/ar/pl/th 双向互列 ✓；EN 页含完整 16 条簇 ✓ |
| 7 | **x-default 指向正确** | 指向默认页 `/` | `https://scrollshot.work/` ✓ |
| 8 | **title 唯一性** | 各语言独立 title，无重复 | 4 种语言 title 均不同且含关键词 ✓ |
| 9 | **meta description 唯一性** | 各语言独立描述 | 4 种语言描述均本地化、无重复 ✓ |
| 10 | **无 keywords meta** | 项目约定（Google 2009 起忽略） | 4 页 keywords_meta=0 ✓ |
| 11 | **无 noindex** | 应被索引 | 4 页无 noindex，可正常收录 ✓ |
| 12 | **JSON-LD 结构化数据** | WebSite + SoftwareApplication + FAQPage | 3 块均带 `inLanguage` 匹配页语言 ✓ |
| 13 | **og:locale / og:locale:alternate** | OG 标签与 hreflang 对齐 | `og:locale=nl_NL` + 14 条 alternate ✓ |
| 14 | **og:image 绝对路径** | 社交分享需绝对 URL | `https://scrollshot.work/scrollshot_app_prview.webp` ✓ |
| 15 | **sitemap 收录** | 新 URL 在 sitemap.xml | 4 URL 全部在列，sitemap 共 70 `<loc>` ✓ |
| 16 | **RTL 适配（ar）** | 阿拉伯语右到左排版 | `<html dir="rtl">` + 13 条 `[dir="rtl"]` 镜像 CSS 全部生效 ✓ |

---

## ⚠️ 二、需注意项（非阻断，建议优化）

### 1. 信任信号引用中国区评分（轻微信任度瑕疵）
`nl/ar/pl/th` 首页 hero 的 trustSignals 仍显示：
- `value: "4.9 / 5"`，`label: "China App Store-beoordeling"`（荷兰语页写"中国 App Store 评分"）
- `note: zhRatingCountEn`（英文版中国区评价数）

**问题**：对非中文市场用户，展示"中国 App Store 评分"作为首要信任信号略显突兀，可能降低本地可信度。
**建议**：为这 4 语言改为中性表述，例如 `label: 'App Store-beoordeling'` 或引用对应国家/地区商店评分（需有真实数据）。**优先级低**，不影响收录。

### 2. 素材与文案语言不一致（预期行为，已确认）
`featureCards[].alt`、`videoLabel`、`imageAlt` 等均写"Engelstalige demo"（英语演示），因为素材复用英文视频/图片（用户明确要求"素材使用英语"）。
**结论**：符合需求，非问题。但 OG 分享卡截图会是英文界面，本地化完整度略打折。

### 3. 博客未本地化（预期行为）
`nl/ar/pl/th` 页 footer 的"Blog"链接指向 `blog/`（即英文博客 `/blog/`）。sitemap 中 blog 仅 11 语言。
**结论**：符合"blog 不需要多语言化"的决策。hreflang 簇仅 home 页含 15 语言，blog 页仍为 11 语言，已正确拆分，无软 404 风险。

### 4. ICP 备案链接出现在非中文页 footer
`legalLinks` 含 `{ label: 'ICP-registratie', href: 'https://beian.miit.gov.cn' }`，出现在 nl/ar/pl/th 页。
**结论**：无 SEO 危害，但对外语用户意义不大。可选：仅中文页保留 ICP 链接。

---

## 🔴 三、阻断性问题

**无。** 本轮审查未发现任何会阻碍收录或触发 Google 惩罚的 SEO 缺陷。
- hreflang 无"return tag missing"风险（互逆完整）
- 无重复内容（各语言 canonical 独立 + 独立 title/description）
- 无软 404（home 15 语言、blog 11 语言 hreflang 与 sitemap 闭合一致）
- RTL 正确，无排版错乱

---

## 📋 四、上线后建议动作（运维，非代码）

1. **GSC 提交**：在 Google Search Console 重新提交 sitemap.xml，并对 4 个新 URL 单独请求索引。
2. **IndexNow（可选）**：跑 `npm run indexnow` 加速 Bing / Yandex / Naver / Seznam 收录（项目已集成 CF Pages build hook）。
3. **Yandex Webmaster**：如已验证，确认 4 新 URL 被抓取。
4. **监控**：2–4 周后查 GSC "国际定位"报告，确认 hreflang 无警告。

---

## 结论

4 个新 locale 页面 **SEO 合规，符合 Google / Bing 多语言规范，可安全上线收录**。仅需关注上述"需注意项"中的信任信号本地化（优先级低），不影响当前索引与排名。
