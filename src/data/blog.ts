import { appStoreUrls, homeLocales, localeAssets, site } from './home';

export type BlogLocaleCode = 'en' | 'zh' | 'zh-hant' | 'ja' | 'ko' | 'de' | 'fr' | 'es' | 'pt-br' | 'it' | 'vi';

export interface BlogFrontmatter {
	title: string;
	description: string;
	date: string;
	updated?: string;
	category: string;
	author: string;
	tags: string[];
	readingTime: string;
	cover: string;
	coverAlt: string;
	translationKey: string;
}

export interface BlogPost extends BlogFrontmatter {
	locale: BlogLocaleCode;
	slug: string;
	url: string;
	Content: any;
}

interface MarkdownModule {
	frontmatter: BlogFrontmatter;
	Content: any;
}

const blogModules = import.meta.glob<MarkdownModule>('../content/blog/*/*.md', { eager: true });

const siteUrl = (path: string) => `${site.url}${path}`;

const indexAlternates = [
	{ lang: 'en', href: siteUrl('blog/') },
	{ lang: 'zh-CN', href: siteUrl('zh/blog/') },
	{ lang: 'zh-Hant', href: siteUrl('zh-hant/blog/') },
	{ lang: 'ja', href: siteUrl('ja/blog/') },
	{ lang: 'ko-KR', href: siteUrl('ko/blog/') },
	{ lang: 'de', href: siteUrl('de/blog/') },
	{ lang: 'fr', href: siteUrl('fr/blog/') },
	{ lang: 'es', href: siteUrl('es/blog/') },
	{ lang: 'pt-BR', href: siteUrl('pt-br/blog/') },
	{ lang: 'it', href: siteUrl('it/blog/') },
	{ lang: 'vi-VN', href: siteUrl('vi/blog/') },
	{ lang: 'x-default', href: siteUrl('blog/') },
];

const blogLocaleCodes: BlogLocaleCode[] = ['en', 'zh', 'zh-hant', 'ja', 'ko', 'de', 'fr', 'es', 'pt-br', 'it', 'vi'];
const hrefLangByLocale: Record<BlogLocaleCode, string> = {
	en: 'en',
	zh: 'zh-CN',
	'zh-hant': 'zh-Hant',
	ja: 'ja',
	ko: 'ko-KR',
	de: 'de',
	fr: 'fr',
	es: 'es',
	'pt-br': 'pt-BR',
	it: 'it',
	vi: 'vi-VN',
};

const italianBlogLocale = {
	locale: 'it',
	lang: 'it',
	ogLocale: 'it_IT',
	url: siteUrl('it/blog/'),
	appStoreUrl: appStoreUrls.it,
	home: homeLocales.it,
	assets: localeAssets.it,
	alternateLinks: indexAlternates,
	meta: {
		title: 'Blog di ScrollShot - Guide agli screenshot lunghi e novità di prodotto',
		description:
			'Guide e novità di ScrollShot: trasforma registrazioni schermo e screenshot in immagini lunghe, pulite e nitide su iPhone. Scopri come salvare contenuti completi con meno fatica.',
		keywords: ['Blog di ScrollShot', 'screenshot lunghi', 'cattura con scorrimento su iPhone', 'unire screenshot'],
		imageAlt: 'Anteprima della demo di ScrollShot',
	},
	copy: {
		home: 'Home',
		kicker: 'Blog di ScrollShot',
		title: 'Blog di ScrollShot: ultime novità',
		description:
			'Guide pratiche, note di prodotto e modi più puliti per salvare contenuti con scorrimento su iPhone.',
		featured: 'Ultimo aggiornamento',
		recent: 'Articoli recenti',
		readArticle: 'Leggi l’articolo',
		backToBlog: 'Torna al blog',
		articleByline: 'Team ScrollShot',
		blogLabel: 'Blog',
		languageLabel: 'English',
		noPosts: 'Nessun articolo pubblicato al momento.',
	},
} as const;

const vietnameseBlogLocale = {
	locale: 'vi',
	lang: 'vi',
	ogLocale: 'vi_VN',
	url: siteUrl('vi/blog/'),
	appStoreUrl: appStoreUrls.vi,
	home: homeLocales.vi,
	assets: localeAssets.vi,
	alternateLinks: indexAlternates,
	meta: {
		title: 'Blog ScrollShot - Hướng dẫn chụp màn hình dài và cập nhật sản phẩm',
		description:
			'Hướng dẫn và cập nhật từ ScrollShot: biến bản ghi màn hình và ảnh chụp thành ảnh dài sạch, rõ nét trên iPhone. Tìm hiểu cách lưu nội dung đầy đủ với ít thao tác hơn.',
		keywords: ['Blog ScrollShot', 'chụp màn hình dài', 'chụp cuộn trên iPhone', 'ghép ảnh chụp màn hình'],
		imageAlt: 'Ảnh xem trước demo ScrollShot',
	},
	copy: {
		home: 'Trang chủ',
		kicker: 'Blog ScrollShot',
		title: 'Blog ScrollShot: cập nhật mới nhất',
		description:
			'Các hướng dẫn thực tế, ghi chú sản phẩm và cách gọn gàng hơn để lưu nội dung cuộn trên iPhone.',
		featured: 'Cập nhật mới nhất',
		recent: 'Bài viết gần đây',
		readArticle: 'Đọc bài viết',
		backToBlog: 'Quay lại blog',
		articleByline: 'Đội ngũ ScrollShot',
		blogLabel: 'Blog',
		languageLabel: 'English',
		noPosts: 'Hiện chưa có bài viết nào.',
	},
} as const;

export const blogLocales = {
	vi: vietnameseBlogLocale,
	it: italianBlogLocale,
	en: {
		locale: 'en',
		lang: 'en',
		ogLocale: 'en_US',
		url: siteUrl('blog/'),
		appStoreUrl: appStoreUrls.en,
		home: homeLocales.en,
		assets: localeAssets.en,
		alternateLinks: indexAlternates,
		meta: {
			title: 'ScrollShot Blog - Long Screenshot Guides and Product Updates',
			description:
				'Guides and product updates for ScrollShot: turn screen recordings and screenshots into clean long images on iPhone. Learn to capture full-page content easily.',
			keywords: ['ScrollShot blog', 'long screenshot guide', 'iPhone scrolling screenshot', 'screenshot stitching'],
			imageAlt: 'ScrollShot English video demo cover',
		},
		copy: {
			home: 'Home',
			kicker: 'ScrollShot Blog',
			title: 'ScrollShot Blog: Latest Updates',
			description:
				'Stay updated with practical long screenshot guides, product notes, and cleaner ways to preserve scrolling content on iPhone.',
			featured: 'Latest Update',
			recent: 'Recent Articles',
			readArticle: 'Read article',
			backToBlog: 'Back to Blog',
			articleByline: 'ScrollShot Team',
			blogLabel: 'Blog',
			languageLabel: '中文',
			noPosts: 'No articles published yet.',
		},
	},
	fr: {
		locale: 'fr',
		lang: 'fr',
		ogLocale: 'fr_FR',
		url: siteUrl('fr/blog/'),
		appStoreUrl: appStoreUrls.fr,
		home: homeLocales.fr,
		assets: localeAssets.fr,
		alternateLinks: indexAlternates,
		meta: {
			title: 'Blog ScrollShot - Guides de capture longue et nouveautés produit',
			description:
				'Guides et nouveautés ScrollShot : transformez vos enregistrements d’écran et captures en images longues propres sur iPhone. Apprenez à conserver les contenus qui défilent plus simplement.',
			keywords: ['Blog ScrollShot', 'capture d’écran longue', 'capture par défilement iPhone', 'assembler captures écran'],
			imageAlt: 'Aperçu de la démonstration ScrollShot',
		},
		copy: {
			home: 'Accueil',
			kicker: 'Blog ScrollShot',
			title: 'Blog ScrollShot : dernières nouveautés',
			description:
				'Guides pratiques, notes produit et méthodes plus propres pour conserver les contenus qui défilent sur iPhone.',
			featured: 'Dernier article',
			recent: 'Articles récents',
			readArticle: 'Lire l’article',
			backToBlog: 'Retour au blog',
			articleByline: 'Équipe ScrollShot',
			blogLabel: 'Blog',
			languageLabel: 'English',
			noPosts: 'Aucun article publié pour le moment.',
		},
	},
	'pt-br': {
		locale: 'pt-br',
		lang: 'pt-BR',
		ogLocale: 'pt_BR',
		url: siteUrl('pt-br/blog/'),
		appStoreUrl: appStoreUrls['pt-br'],
		home: homeLocales['pt-br'],
		assets: localeAssets['pt-br'],
		alternateLinks: indexAlternates,
		meta: {
			title: 'Blog do ScrollShot - Guias de prints longos e novidades do produto',
			description:
				'Guias e novidades do ScrollShot: transforme gravações de tela e screenshots em imagens longas, limpas e nítidas no iPhone. Aprenda a salvar conteúdos completos com menos esforço.',
			keywords: ['Blog do ScrollShot', 'print longo', 'captura por rolagem no iPhone', 'juntar screenshots'],
			imageAlt: 'Capa da demonstração do ScrollShot',
		},
		copy: {
			home: 'Início',
			kicker: 'Blog do ScrollShot',
			title: 'Blog do ScrollShot: últimas novidades',
			description:
				'Guias práticos, notas de produto e formas mais limpas de guardar conteúdos que rolam no iPhone.',
			featured: 'Última atualização',
			recent: 'Artigos recentes',
			readArticle: 'Ler artigo',
			backToBlog: 'Voltar ao blog',
			articleByline: 'Equipe ScrollShot',
			blogLabel: 'Blog',
			languageLabel: 'English',
			noPosts: 'Nenhum artigo publicado ainda.',
		},
	},
	es: {
		locale: 'es',
		lang: 'es',
		ogLocale: 'es_ES',
		url: siteUrl('es/blog/'),
		appStoreUrl: appStoreUrls.es,
		home: homeLocales.es,
		assets: localeAssets.es,
		alternateLinks: indexAlternates,
		meta: {
			title: 'Blog de ScrollShot - Guías de capturas largas y novedades del producto',
			description:
				'Guías y novedades de ScrollShot: convierte grabaciones de pantalla y screenshots en imágenes largas, limpias y nítidas en iPhone. Aprende a guardar contenido completo con menos esfuerzo.',
			keywords: ['Blog de ScrollShot', 'captura larga', 'captura con desplazamiento en iPhone', 'unir screenshots'],
			imageAlt: 'Vista previa de la demostración de ScrollShot',
		},
		copy: {
			home: 'Inicio',
			kicker: 'Blog de ScrollShot',
			title: 'Blog de ScrollShot: últimas novedades',
			description:
				'Guías prácticas, notas de producto y formas más limpias de guardar contenido con desplazamiento en iPhone.',
			featured: 'Última actualización',
			recent: 'Artículos recientes',
			readArticle: 'Leer artículo',
			backToBlog: 'Volver al blog',
			articleByline: 'Equipo de ScrollShot',
			blogLabel: 'Blog',
			languageLabel: 'English',
			noPosts: 'Todavía no hay artículos publicados.',
		},
	},
	de: {
		locale: 'de',
		lang: 'de',
		ogLocale: 'de_DE',
		url: siteUrl('de/blog/'),
		appStoreUrl: appStoreUrls.de,
		home: homeLocales.de,
		assets: localeAssets.de,
		alternateLinks: indexAlternates,
		meta: {
			title: 'ScrollShot Blog - Ratgeber zu langen Screenshots und Produktupdates',
			description:
				'Ratgeber und Produktupdates für ScrollShot: Erstelle aus Bildschirmaufnahmen und Screenshots saubere lange Bilder auf dem iPhone. Lerne, vollständige Inhalte einfacher zu speichern.',
			keywords: ['ScrollShot Blog', 'lange Screenshots', 'iPhone Scroll Screenshot', 'Screenshots zusammenfügen'],
			imageAlt: 'ScrollShot Demo-Cover',
		},
		copy: {
			home: 'Startseite',
			kicker: 'ScrollShot Blog',
			title: 'ScrollShot Blog: Neueste Beiträge',
			description:
				'Praktische Tipps, Produktnotizen und bessere Workflows, um lange Inhalte auf dem iPhone sauber zu speichern.',
			featured: 'Neuester Beitrag',
			recent: 'Aktuelle Artikel',
			readArticle: 'Artikel lesen',
			backToBlog: 'Zurück zum Blog',
			articleByline: 'ScrollShot Team',
			blogLabel: 'Blog',
			languageLabel: 'English',
			noPosts: 'Noch keine Artikel veröffentlicht.',
		},
	},
	zh: {
		locale: 'zh',
		lang: 'zh-CN',
		ogLocale: 'zh_CN',
		url: siteUrl('zh/blog/'),
		appStoreUrl: appStoreUrls.zh,
		home: homeLocales.zh,
		assets: localeAssets.zh,
		alternateLinks: indexAlternates,
		meta: {
			title: 'ScrollShot 博客 - 长截图教程与产品更新',
			description: 'ScrollShot 博客提供关于 iPhone 长截图、录屏自动拼接、手动照片拼接、隐私处理和产品更新的实用教程。学习如何更轻松地捕捉和整理高清长图内容。',
			keywords: ['ScrollShot 博客', '长截图教程', 'iPhone 滚动截图', '截图拼接'],
			imageAlt: 'ScrollShot 中文视频演示封面',
		},
		copy: {
			home: '首页',
			kicker: 'ScrollShot 博客',
			title: 'ScrollShot 博客：最新动态',
			description: '关注 iPhone 长截图教程、产品更新和更清爽的滚动内容保存方法。',
			featured: '最新文章',
			recent: '近期文章',
			readArticle: '阅读全文',
			backToBlog: '返回博客',
			articleByline: 'ScrollShot 团队',
			blogLabel: '博客',
			languageLabel: 'English',
			noPosts: '暂无文章。',
		},
	},
	'zh-hant': {
		locale: 'zh-hant',
		lang: 'zh-Hant',
		ogLocale: 'zh_TW',
		url: siteUrl('zh-hant/blog/'),
		appStoreUrl: appStoreUrls['zh-hant'],
		home: homeLocales['zh-hant'],
		assets: localeAssets['zh-hant'],
		alternateLinks: indexAlternates,
		meta: {
			title: 'ScrollShot 部落格 - 長截圖教學與產品更新',
			description: 'ScrollShot 部落格提供 iPhone 長截圖、錄影自動拼接、手動照片拼接、隱私處理與產品更新的實用教學。學習如何更輕鬆地捕捉與整理高畫質長圖內容。',
			keywords: ['ScrollShot 部落格', '長截圖教學', 'iPhone 滾動截圖', '截圖拼接'],
			imageAlt: 'ScrollShot 繁體中文影片示範封面',
		},
		copy: {
			home: '首頁',
			kicker: 'ScrollShot 部落格',
			title: 'ScrollShot 部落格：最新動態',
			description: '關注 iPhone 長截圖教學、產品更新，以及更清爽的滾動內容保存方法。',
			featured: '最新文章',
			recent: '近期文章',
			readArticle: '閱讀全文',
			backToBlog: '返回部落格',
			articleByline: 'ScrollShot 團隊',
			blogLabel: '部落格',
			languageLabel: 'English',
			noPosts: '尚無文章。',
		},
	},
	ja: {
		locale: 'ja',
		lang: 'ja',
		ogLocale: 'ja_JP',
		url: siteUrl('ja/blog/'),
		appStoreUrl: appStoreUrls.ja,
		home: homeLocales.ja,
		assets: localeAssets.ja,
		alternateLinks: indexAlternates,
		meta: {
			title: 'ScrollShotブログ - 長いスクリーンショットの使い方と製品アップデート',
			description:
				'ScrollShotブログでは、iPhoneで長いスクリーンショットを保存する方法、画面収録からの自動合成、写真の手動結合、プライバシー、製品アップデートを紹介します。',
			keywords: ['ScrollShot ブログ', '長いスクリーンショット', 'iPhone スクロールスクリーンショット', 'スクショ 結合'],
			imageAlt: 'ScrollShot デモ動画のカバー画像',
		},
		copy: {
			home: 'ホーム',
			kicker: 'ScrollShot ブログ',
			title: 'ScrollShotブログ：最新情報',
			description: 'iPhoneの長いスクリーンショット、製品アップデート、スクロール内容をきれいに残すための実践的なヒントをお届けします。',
			featured: '最新記事',
			recent: '最近の記事',
			readArticle: '記事を読む',
			backToBlog: 'ブログへ戻る',
			articleByline: 'ScrollShotチーム',
			blogLabel: 'ブログ',
			languageLabel: 'English',
			noPosts: '記事はまだ公開されていません。',
		},
	},
	ko: {
		locale: 'ko',
		lang: 'ko-KR',
		ogLocale: 'ko_KR',
		url: siteUrl('ko/blog/'),
		appStoreUrl: appStoreUrls.ko,
		home: homeLocales.ko,
		assets: localeAssets.ko,
		alternateLinks: indexAlternates,
		meta: {
			title: 'ScrollShot 블로그 - 아이폰 긴 스크린샷 가이드와 제품 소식',
			description:
				'ScrollShot 블로그에서는 한국 iPhone 사용자를 위한 긴 스크린샷 저장 방법, 화면 녹화 기반 자동 합성, 사진 수동 이어붙이기, 개인정보 보호와 제품 소식을 전합니다.',
			keywords: ['ScrollShot 블로그', '아이폰 긴 스크린샷', 'iPhone 스크롤 캡처', '스크린샷 이어붙이기', '화면 녹화 캡처'],
			imageAlt: 'ScrollShot 데모 영상 커버 이미지',
		},
		copy: {
			home: '홈',
			kicker: 'ScrollShot 블로그',
			title: 'ScrollShot 블로그: 최신 소식',
			description: '한국 iPhone 사용자를 위한 긴 스크린샷 가이드, 제품 소식, 스크롤 콘텐츠를 더 깔끔하게 저장하는 실전 팁을 전합니다.',
			featured: '최신 글',
			recent: '최근 글',
			readArticle: '글 읽기',
			backToBlog: '블로그로 돌아가기',
			articleByline: 'ScrollShot 팀',
			blogLabel: '블로그',
			languageLabel: 'English',
			noPosts: '아직 공개된 글이 없습니다.',
		},
	},
} as const;

export type BlogLocale = (typeof blogLocales)[keyof typeof blogLocales];

const normalizePost = ([path, module]: [string, MarkdownModule]): BlogPost | null => {
	const match = path.match(/\/blog\/(en|zh|zh-hant|ja|ko|de|fr|es|pt-br|it|vi)\/([^/]+)\.md$/);

	if (!match) {
		return null;
	}

	const [, locale, filename] = match as [string, BlogLocaleCode, string];
	const slug = filename.replace(/\.md$/, '');
	const urlPath = locale === 'en' ? `blog/${slug}/` : `${locale}/blog/${slug}/`;

	return {
		...module.frontmatter,
		locale,
		slug,
		url: siteUrl(urlPath),
		Content: module.Content,
	};
};

const allPosts = Object.entries(blogModules)
	.map(normalizePost)
	.filter((post): post is BlogPost => Boolean(post))
	.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export const getBlogPosts = (locale: BlogLocaleCode) => allPosts.filter((post) => post.locale === locale);

export const getBlogPost = (locale: BlogLocaleCode, slug: string) =>
	getBlogPosts(locale).find((post) => post.slug === slug);

export const getBlogPostAlternates = (post: BlogPost) => {
	const translations = blogLocaleCodes
		.map((locale) => getBlogPosts(locale).find((candidate) => candidate.translationKey === post.translationKey))
		.filter((candidate): candidate is BlogPost => Boolean(candidate));
	const englishPost = translations.find((candidate) => candidate.locale === 'en') ?? translations[0];
	const links = [
		...translations.map((candidate) => ({
			lang: hrefLangByLocale[candidate.locale],
			href: candidate.url,
		})),
		englishPost && { lang: 'x-default', href: englishPost.url },
	].filter((link): link is { lang: string; href: string } => Boolean(link));

	return links;
};

export const getBlogNavLinks = (locale: BlogLocaleCode, page: 'index' | 'post') => {
	const homePrefix = page === 'index' ? '../' : '../../';
	const blogHref = page === 'index' ? './' : '../';
	const home = homeLocales[locale];
	const blog = blogLocales[locale];

	return [
		{ href: `${homePrefix}#features`, label: home.navLinks[0].label },
		{ href: `${homePrefix}#reviews`, label: home.navLinks[1].label },
		{ href: `${homePrefix}#pricing`, label: home.navLinks[2].label },
		{ href: `${homePrefix}#faq`, label: home.navLinks[3].label },
		{ href: blogHref, label: blog.copy.blogLabel, current: true },
	];
};

export const getBlogLanguageLinks = (locale: BlogLocaleCode) =>
	[
		locale !== 'en' && { label: 'English', href: blogLocales.en.url },
		locale !== 'zh' && { label: '简体中文', href: blogLocales.zh.url },
		locale !== 'zh-hant' && { label: '繁體中文', href: blogLocales['zh-hant'].url },
		locale !== 'ja' && { label: '日本語', href: blogLocales.ja.url },
		locale !== 'ko' && { label: '한국어', href: blogLocales.ko.url },
		locale !== 'de' && { label: 'Deutsch', href: blogLocales.de.url },
		locale !== 'fr' && { label: 'Français', href: blogLocales.fr.url },
		locale !== 'es' && { label: 'Español', href: blogLocales.es.url },
		locale !== 'pt-br' && { label: 'Português (BR)', href: blogLocales['pt-br'].url },
		locale !== 'it' && { label: 'Italiano', href: blogLocales.it.url },
		locale !== 'vi' && { label: 'Tiếng Việt', href: blogLocales.vi.url },
	].filter((link): link is { label: string; href: string } => Boolean(link));

export const getBlogHomeHref = (_locale: BlogLocaleCode, page: 'index' | 'post') =>
	page === 'index' ? '../' : '../../';

export const buildBlogIndexJsonLd = (page: BlogLocale, posts: BlogPost[]) => [
	{
		'@context': 'https://schema.org',
		'@type': 'Blog',
		name: page.meta.title,
		description: page.meta.description,
		url: page.url,
		inLanguage: page.lang,
	},
	{
		'@context': 'https://schema.org',
		'@type': 'ItemList',
		itemListElement: posts.map((post, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			url: post.url,
			name: post.title,
		})),
	},
];

export const buildBlogPostJsonLd = (post: BlogPost, page: BlogLocale) => ({
	'@context': 'https://schema.org',
	'@type': 'BlogPosting',
	headline: post.title,
	description: post.description,
	datePublished: post.date,
	dateModified: post.updated ?? post.date,
	author: {
		'@type': 'Organization',
		name: post.author || page.copy.articleByline,
	},
	publisher: {
		'@type': 'Organization',
		name: site.name,
		logo: {
			'@type': 'ImageObject',
			url: `${site.url}${page.assets.appIcon.slice(1)}`,
		},
	},
	image: `${site.url}${post.cover.slice(1)}`,
	mainEntityOfPage: post.url,
	inLanguage: page.lang,
});
