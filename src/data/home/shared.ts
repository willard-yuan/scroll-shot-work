import { appStoreRatings } from '../appStoreRating';

// Localized App Store listings. Locales without their own localized listing
// fall back to the US storefront (per product decision, 2026-11-15).
// NOTE: the numeric app id is what resolves the product; the slug is cosmetic.
const US_APP_STORE_URL = 'https://apps.apple.com/us/app/scrollshot-long-screenshots/id6760192003';

export const appStoreUrls = {
	en: US_APP_STORE_URL,
	zh: 'https://apps.apple.com/cn/app/scrollshot-%E6%BB%9A%E5%8A%A8%E9%95%BF%E6%88%AA%E5%9B%BE-%E6%8B%BC%E6%8E%A5%E9%95%BF%E5%9B%BE/id6760192003',
	'zh-hant': 'https://apps.apple.com/tw/app/scrollshot-%E6%BB%BE%E5%8B%95%E9%95%B7%E6%88%AA%E5%9C%96-%E6%8B%BC%E6%8E%A5%E9%95%B7%E5%9C%96/id6760192003',
	ja: 'https://apps.apple.com/jp/app/scrollshot-%E3%82%B9%E3%82%AF%E3%83%AD%E3%83%BC%E3%83%AB%E7%94%BB%E9%9D%A2%E9%8C%B2%E7%94%BB-%E9%95%B7%E7%94%BB%E5%83%8F%E7%B5%90%E5%90%88/id6760192003',
	ko: 'https://apps.apple.com/kr/app/scrollshot-%EC%8A%A4%ED%81%AC%EB%A1%A4-%EC%BA%A1%EC%B2%98-%EA%B8%B8%EA%B2%8C-%EC%BA%A1%EC%B2%98/id6760192003',
	fr: 'https://apps.apple.com/fr/app/scrollshot-capture-d%C3%A9cran/id6760192003',
	es: 'https://apps.apple.com/es/app/scrollshot-captura-pantalla/id6760192003',
	de: US_APP_STORE_URL,
	'pt-br': US_APP_STORE_URL,
	it: US_APP_STORE_URL,
	vi: US_APP_STORE_URL,
	nl: US_APP_STORE_URL,
	ar: US_APP_STORE_URL,
	pl: US_APP_STORE_URL,
	th: US_APP_STORE_URL,
};

export const site = {
	name: 'ScrollShot',
	url: 'https://scrollshot.work/',
	appStoreUrl: appStoreUrls.en,
};

export const zhUrl = `${site.url}zh/`;
export const zhHantUrl = `${site.url}zh-hant/`;
export const jaUrl = `${site.url}ja/`;
export const koUrl = `${site.url}ko/`;
export const deUrl = `${site.url}de/`;
export const frUrl = `${site.url}fr/`;
export const esUrl = `${site.url}es/`;
export const ptBrUrl = `${site.url}pt-br/`;
export const itUrl = `${site.url}it/`;
export const viUrl = `${site.url}vi/`;
export const nlUrl = `${site.url}nl/`;
export const arUrl = `${site.url}ar/`;
export const plUrl = `${site.url}pl/`;
export const thUrl = `${site.url}th/`;

const appIcon = '/AppIcon.appiconset/icon-ios-60x60@3x.png';

export const zhRating = appStoreRatings.zh;
export const zhRatingCountEn = zhRating.count > 0 ? `${zhRating.count.toLocaleString('en-US')} ratings` : 'China App Store';

const enWebpAssets = {
	auto: '/ai_scrolling_screenshot.webp',
	trim: '/perfect_every_stitch.webp',
	manual: '/flexible_image_stitching.webp',
	themes: '/themes_your_way.webp',
	ogImage: '/scrollshot_app_prview.webp',
};

const createLocalizedPreviewAssets = (directory: string) => ({
	auto: `/${directory}/1.webp`,
	trim: `/${directory}/2.webp`,
	manual: `/${directory}/3.webp`,
	themes: `/${directory}/4.webp`,
	ogImage: `/${directory}/5.webp`,
});

const localizedPreviewAssets = {
	zh: createLocalizedPreviewAssets('zh_scrollshot_app_store_preview'),
	'zh-hant': createLocalizedPreviewAssets('zh_han_scrollshot_app_store_preview'),
	ja: createLocalizedPreviewAssets('jp_scrollshot_app_store_preview'),
	ko: createLocalizedPreviewAssets('kr_scrollshot_app_store_preview'),
	fr: createLocalizedPreviewAssets('fr_scrollshot_app_store_preview'),
	es: createLocalizedPreviewAssets('es_scrollshot_app_store_preview'),
	'pt-br': createLocalizedPreviewAssets('br_scrollshot_app_store_preview'),
	vi: createLocalizedPreviewAssets('vn_scrollshot_app_store_preview'),
};

export const icons = {
	auto: 'M8 4.5h8a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2Z M10.5 9l4 3-4 3V9Z M8.5 17h7',
	manual: 'M8 5h10v6H8z M6 9h10v6H6z M4 13h10v6H4z M7 16h4',
	tune: 'M4 7h16 M9 5v4 M4 12h16 M15 10v4 M4 17h16 M11 15v4',
	share: 'M7 4h7l4 4v12H7z M14 4v5h5 M12 16V9 M9 12l3-3 3 3',
};

export const localeAssets = {
	en: {
		auto: enWebpAssets.auto,
		trim: enWebpAssets.trim,
		manual: enWebpAssets.manual,
		themes: enWebpAssets.themes,
		video: '/ScrollShot_Preview_En_0509.mp4',
		videoCover: '/ScrollShot_Preview_En_0509_cover.jpg',
		appIcon,
		ogImage: enWebpAssets.ogImage,
	},
	zh: {
		auto: localizedPreviewAssets.zh.auto,
		trim: localizedPreviewAssets.zh.trim,
		manual: localizedPreviewAssets.zh.manual,
		themes: localizedPreviewAssets.zh.themes,
		video: '/ScrollShot_Preview_Cn_0509.mp4',
		videoCover: '/ScrollShot_Preview_Cn_0509_cover.jpg',
		appIcon,
		ogImage: localizedPreviewAssets.zh.ogImage,
	},
	'zh-hant': {
		auto: localizedPreviewAssets['zh-hant'].auto,
		trim: localizedPreviewAssets['zh-hant'].trim,
		manual: localizedPreviewAssets['zh-hant'].manual,
		themes: localizedPreviewAssets['zh-hant'].themes,
		video: '/ScrollShot_Preview_Cn_0509.mp4',
		videoCover: '/ScrollShot_Preview_Cn_0509_cover.jpg',
		appIcon,
		ogImage: localizedPreviewAssets['zh-hant'].ogImage,
	},
	ja: {
		auto: localizedPreviewAssets.ja.auto,
		trim: localizedPreviewAssets.ja.trim,
		manual: localizedPreviewAssets.ja.manual,
		themes: localizedPreviewAssets.ja.themes,
		video: '/ScrollShot_Preview_En_0509.mp4',
		videoCover: '/ScrollShot_Preview_En_0509_cover.jpg',
		appIcon,
		ogImage: localizedPreviewAssets.ja.ogImage,
	},
	ko: {
		auto: localizedPreviewAssets.ko.auto,
		trim: localizedPreviewAssets.ko.trim,
		manual: localizedPreviewAssets.ko.manual,
		themes: localizedPreviewAssets.ko.themes,
		video: '/ScrollShot_Preview_En_0509.mp4',
		videoCover: '/ScrollShot_Preview_En_0509_cover.jpg',
		appIcon,
		ogImage: localizedPreviewAssets.ko.ogImage,
	},
	de: {
		auto: enWebpAssets.auto,
		trim: enWebpAssets.trim,
		manual: enWebpAssets.manual,
		themes: enWebpAssets.themes,
		video: '/ScrollShot_Preview_En_0509.mp4',
		videoCover: '/ScrollShot_Preview_En_0509_cover.jpg',
		appIcon,
		ogImage: enWebpAssets.ogImage,
	},
	fr: {
		auto: localizedPreviewAssets.fr.auto,
		trim: localizedPreviewAssets.fr.trim,
		manual: localizedPreviewAssets.fr.manual,
		themes: localizedPreviewAssets.fr.themes,
		video: '/ScrollShot_Preview_En_0509.mp4',
		videoCover: '/ScrollShot_Preview_En_0509_cover.jpg',
		appIcon,
		ogImage: localizedPreviewAssets.fr.ogImage,
	},
	es: {
		auto: localizedPreviewAssets.es.auto,
		trim: localizedPreviewAssets.es.trim,
		manual: localizedPreviewAssets.es.manual,
		themes: localizedPreviewAssets.es.themes,
		video: '/ScrollShot_Preview_En_0509.mp4',
		videoCover: '/ScrollShot_Preview_En_0509_cover.jpg',
		appIcon,
		ogImage: localizedPreviewAssets.es.ogImage,
	},
	'pt-br': {
		auto: localizedPreviewAssets['pt-br'].auto,
		trim: localizedPreviewAssets['pt-br'].trim,
		manual: localizedPreviewAssets['pt-br'].manual,
		themes: localizedPreviewAssets['pt-br'].themes,
		video: '/ScrollShot_Preview_En_0509.mp4',
		videoCover: '/ScrollShot_Preview_En_0509_cover.jpg',
		appIcon,
		ogImage: localizedPreviewAssets['pt-br'].ogImage,
	},
	it: {
		auto: enWebpAssets.auto,
		trim: enWebpAssets.trim,
		manual: enWebpAssets.manual,
		themes: enWebpAssets.themes,
		video: '/ScrollShot_Preview_En_0509.mp4',
		videoCover: '/ScrollShot_Preview_En_0509_cover.jpg',
		appIcon,
		ogImage: enWebpAssets.ogImage,
	},
	vi: {
		auto: localizedPreviewAssets.vi.auto,
		trim: localizedPreviewAssets.vi.trim,
		manual: localizedPreviewAssets.vi.manual,
		themes: localizedPreviewAssets.vi.themes,
		video: '/ScrollShot_Preview_En_0509.mp4',
		videoCover: '/ScrollShot_Preview_En_0509_cover.jpg',
		appIcon,
		ogImage: localizedPreviewAssets.vi.ogImage,
	},
	// New locales (nl/ar/pl/th): copy is localized, but visual assets stay
	// English per product decision — reuse the English webp previews + video.
	nl: {
		auto: enWebpAssets.auto,
		trim: enWebpAssets.trim,
		manual: enWebpAssets.manual,
		themes: enWebpAssets.themes,
		video: '/ScrollShot_Preview_En_0509.mp4',
		videoCover: '/ScrollShot_Preview_En_0509_cover.jpg',
		appIcon,
		ogImage: enWebpAssets.ogImage,
	},
	ar: {
		auto: enWebpAssets.auto,
		trim: enWebpAssets.trim,
		manual: enWebpAssets.manual,
		themes: enWebpAssets.themes,
		video: '/ScrollShot_Preview_En_0509.mp4',
		videoCover: '/ScrollShot_Preview_En_0509_cover.jpg',
		appIcon,
		ogImage: enWebpAssets.ogImage,
	},
	pl: {
		auto: enWebpAssets.auto,
		trim: enWebpAssets.trim,
		manual: enWebpAssets.manual,
		themes: enWebpAssets.themes,
		video: '/ScrollShot_Preview_En_0509.mp4',
		videoCover: '/ScrollShot_Preview_En_0509_cover.jpg',
		appIcon,
		ogImage: enWebpAssets.ogImage,
	},
	th: {
		auto: enWebpAssets.auto,
		trim: enWebpAssets.trim,
		manual: enWebpAssets.manual,
		themes: enWebpAssets.themes,
		video: '/ScrollShot_Preview_En_0509.mp4',
		videoCover: '/ScrollShot_Preview_En_0509_cover.jpg',
		appIcon,
		ogImage: enWebpAssets.ogImage,
	},
};

export const alternates = [
	{ lang: 'en', href: site.url },
	{ lang: 'zh-CN', href: zhUrl },
	{ lang: 'zh-Hant', href: zhHantUrl },
	{ lang: 'ja', href: jaUrl },
	{ lang: 'ko-KR', href: koUrl },
	{ lang: 'de', href: deUrl },
	{ lang: 'fr', href: frUrl },
	{ lang: 'es', href: esUrl },
	{ lang: 'pt-BR', href: ptBrUrl },
	{ lang: 'it', href: itUrl },
	{ lang: 'vi-VN', href: viUrl },
	{ lang: 'nl', href: nlUrl },
	{ lang: 'ar', href: arUrl },
	{ lang: 'pl', href: plUrl },
	{ lang: 'th', href: thUrl },
	{ lang: 'x-default', href: site.url },
];
