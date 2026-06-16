import { appStoreRatings } from '../appStoreRating';

export const appStoreUrls = {
	en: 'https://apps.apple.com/us/app/scrollshot-long-screenshot/id6760192003',
	zh: 'https://apps.apple.com/cn/app/scrollshot-%E6%BB%9A%E5%8A%A8%E6%88%AA%E5%9B%BE-%E6%8B%BC%E6%8E%A5%E9%95%BF%E5%9B%BE/id6760192003',
	'zh-hant': 'https://apps.apple.com/tw/app/scrollshot-long-screenshot/id6760192003',
	ja: 'https://apps.apple.com/jp/app/scrollshot-long-screenshot/id6760192003',
	ko: 'https://apps.apple.com/kr/app/scrollshot-long-screenshot/id6760192003',
	de: 'https://apps.apple.com/de/app/scrollshot-long-screenshot/id6760192003',
	fr: 'https://apps.apple.com/fr/app/scrollshot-long-screenshot/id6760192003',
	es: 'https://apps.apple.com/es/app/scrollshot-long-screenshot/id6760192003',
	'pt-br': 'https://apps.apple.com/br/app/scrollshot-long-screenshot/id6760192003',
	it: 'https://apps.apple.com/it/app/scrollshot-long-screenshot/id6760192003',
	vi: 'https://apps.apple.com/vn/app/scrollshot-long-screenshot/id6760192003',
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
	{ lang: 'x-default', href: site.url },
];
