import { appStoreUrls, homeLocales, localeAssets, site } from './home';

export type BlogLocaleCode = 'en' | 'zh';

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
	featured?: boolean;
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
	{ lang: 'x-default', href: siteUrl('blog/') },
];

export const blogLocales = {
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
			title: 'Long screenshot guides and product updates',
			description:
				'Practical notes on stitching screen recordings, preserving long pages, and sharing clean screenshots from iPhone.',
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
			title: '长截图教程与产品更新',
			description: '记录录屏拼接、网页保存、截图整理和产品更新，让长内容保存更清爽。',
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
} as const;

export type BlogLocale = (typeof blogLocales)[keyof typeof blogLocales];

const normalizePost = ([path, module]: [string, MarkdownModule]): BlogPost | null => {
	const match = path.match(/\/blog\/(en|zh)\/([^/]+)\.md$/);

	if (!match) {
		return null;
	}

	const [, locale, filename] = match as [string, BlogLocaleCode, string];
	const slug = filename.replace(/\.md$/, '');
	const urlPath = locale === 'en' ? `blog/${slug}/` : `zh/blog/${slug}/`;

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

const otherLocale = (locale: BlogLocaleCode): BlogLocaleCode => (locale === 'en' ? 'zh' : 'en');

const getTranslatedPost = (post: BlogPost) =>
	getBlogPosts(otherLocale(post.locale)).find((candidate) => candidate.translationKey === post.translationKey);

export const getBlogPostAlternates = (post: BlogPost) => {
	const translated = getTranslatedPost(post);
	const englishPost = post.locale === 'en' ? post : translated;
	const links = [
		{ lang: post.locale === 'en' ? 'en' : 'zh-CN', href: post.url },
		translated && { lang: translated.locale === 'en' ? 'en' : 'zh-CN', href: translated.url },
		englishPost && { lang: 'x-default', href: englishPost.url },
	].filter((link): link is { lang: string; href: string } => Boolean(link));

	return links;
};

export const getBlogNavLinks = (locale: BlogLocaleCode, page: 'index' | 'post') => {
	const homePrefix = page === 'index' ? '../' : '../../';
	const blogHref = page === 'index' ? './' : '../';
	const languageHref =
		locale === 'en'
			? page === 'index'
				? '../zh/blog/'
				: '../../zh/blog/'
			: page === 'index'
				? '../../blog/'
				: '../../../blog/';
	const home = homeLocales[locale];
	const blog = blogLocales[locale];

	return [
		{ href: `${homePrefix}#features`, label: home.navLinks[0].label },
		{ href: `${homePrefix}#reviews`, label: home.navLinks[1].label },
		{ href: `${homePrefix}#pricing`, label: home.navLinks[2].label },
		{ href: `${homePrefix}#faq`, label: home.navLinks[3].label },
		{ href: blogHref, label: blog.copy.blogLabel, current: true },
		{ href: languageHref, label: blog.copy.languageLabel },
	];
};

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
