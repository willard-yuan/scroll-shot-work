import type { BlogLocaleCode } from './blog';

export interface SiteLanguage {
	code: BlogLocaleCode;
	label: string;
	hreflang: string;
	// Path to the flag image (served from /public). For 繁體中文 we use the
	// Hong Kong SAR (China) flag to avoid any politically sensitive choice.
	flag: string;
}

// Canonical, ordered list of every supported website language.
// The `hreflang` values MUST stay in sync with the alternate links emitted in
// <head> (shared.ts `alternates`, and blog.ts `indexAlternates` /
// `getBlogPostAlternates`). Keeping them identical is what guarantees the nav
// language switcher and the hreflang tags never point at different URLs.
export const siteLanguages: SiteLanguage[] = [
	{ code: 'en', label: 'English', hreflang: 'en', flag: '/flags/gb.png' },
	{ code: 'zh', label: '简体中文', hreflang: 'zh-CN', flag: '/flags/cn.png' },
	{ code: 'zh-hant', label: '繁體中文', hreflang: 'zh-Hant', flag: '/flags/hk.png' },
	{ code: 'ja', label: '日本語', hreflang: 'ja', flag: '/flags/jp.png' },
	{ code: 'ko', label: '한국어', hreflang: 'ko-KR', flag: '/flags/kr.png' },
	{ code: 'de', label: 'Deutsch', hreflang: 'de', flag: '/flags/de.png' },
	{ code: 'fr', label: 'Français', hreflang: 'fr', flag: '/flags/fr.png' },
	{ code: 'es', label: 'Español', hreflang: 'es', flag: '/flags/es.png' },
	{ code: 'pt-br', label: 'Português (BR)', hreflang: 'pt-BR', flag: '/flags/br.png' },
	{ code: 'it', label: 'Italiano', hreflang: 'it', flag: '/flags/it.png' },
	{ code: 'vi', label: 'Tiếng Việt', hreflang: 'vi-VN', flag: '/flags/vn.png' },
];

export interface SwitcherItem {
	code: string;
	label: string;
	href: string;
	hreflang: string;
	flag: string;
	current: boolean;
}

interface AlternateLink {
	lang: string;
	href: string;
}

// Build the language-switcher entries for the CURRENT page.
//
// `currentUrl`  – absolute URL of the page being viewed (home, blog index, or a
//                 specific blog post).
// `alternateLinks` – the exact data used to render the <head> hreflang
//                 `<link rel="alternate">` tags, so every switcher link has a
//                 matching hreflang declaration (this is what keeps hreflang valid).
//
// Only languages that actually have this page type are returned (e.g. a blog post
// that is not translated to every language lists only the translated versions),
// which prevents broken links and keeps the hreflang set accurate. `x-default`
// is naturally excluded because it has no entry in `siteLanguages`.
export const getSwitcherItems = (currentUrl: string, alternateLinks: AlternateLink[]): SwitcherItem[] => {
	const normalize = (value: string) => value.replace(/\/+$/, '');
	const current = normalize(currentUrl);
	const hrefByHreflang = new Map(alternateLinks.map((link) => [link.lang, link.href]));

	return siteLanguages
		.map((lang) => {
			const href = hrefByHreflang.get(lang.hreflang);
			if (!href) return null;
			return {
				code: lang.code,
				label: lang.label,
				href,
				hreflang: lang.hreflang,
				flag: lang.flag,
				current: normalize(href) === current,
			} satisfies SwitcherItem;
		})
		.filter((item): item is SwitcherItem => item !== null);
};
