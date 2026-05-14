import type { APIRoute } from 'astro';
import { blogLocales, getBlogPostAlternates, getBlogPosts, type BlogPost } from '../data/blog';
import { homeLocales } from '../data/home';

type AlternateLink = {
	lang: string;
	href: string;
};

type SitemapEntry = {
	loc: string;
	lastmod: string;
	alternates: AlternateLink[];
};

const SITE_LASTMOD = '2026-05-14';

const escapeXml = (value: string) =>
	value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&apos;');

const normalizeDate = (date: string) => date.slice(0, 10);

const latestDate = (posts: BlogPost[]) =>
	posts.reduce((latest, post) => {
		const candidate = normalizeDate(post.updated ?? post.date);
		return candidate > latest ? candidate : latest;
	}, SITE_LASTMOD);

const renderAlternateLinks = (alternates: AlternateLink[]) =>
	alternates
		.map(
			(link) =>
				`    <xhtml:link rel="alternate" hreflang="${escapeXml(link.lang)}" href="${escapeXml(link.href)}" />`,
		)
		.join('\n');

const renderUrl = (entry: SitemapEntry) => {
	const alternates = renderAlternateLinks(entry.alternates);

	return [
		'  <url>',
		`    <loc>${escapeXml(entry.loc)}</loc>`,
		`    <lastmod>${escapeXml(entry.lastmod)}</lastmod>`,
		alternates,
		'  </url>',
	]
		.filter(Boolean)
		.join('\n');
};

const englishPosts = getBlogPosts('en');
const chinesePosts = getBlogPosts('zh');
const blogLastmod = latestDate([...englishPosts, ...chinesePosts]);

const entries: SitemapEntry[] = [
	{
		loc: homeLocales.en.url,
		lastmod: SITE_LASTMOD,
		alternates: homeLocales.en.alternateLinks,
	},
	{
		loc: homeLocales.zh.url,
		lastmod: SITE_LASTMOD,
		alternates: homeLocales.zh.alternateLinks,
	},
	{
		loc: blogLocales.en.url,
		lastmod: blogLastmod,
		alternates: blogLocales.en.alternateLinks,
	},
	{
		loc: blogLocales.zh.url,
		lastmod: blogLastmod,
		alternates: blogLocales.zh.alternateLinks,
	},
	...englishPosts.map((post) => ({
		loc: post.url,
		lastmod: normalizeDate(post.updated ?? post.date),
		alternates: getBlogPostAlternates(post),
	})),
	...chinesePosts.map((post) => ({
		loc: post.url,
		lastmod: normalizeDate(post.updated ?? post.date),
		alternates: getBlogPostAlternates(post),
	})),
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.map(renderUrl).join('\n')}
</urlset>
`;

export const GET: APIRoute = () =>
	new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
		},
	});
