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

const SITE_LASTMOD = '2026-05-22';
const localeCodes = ['en', 'zh', 'zh-hant', 'ja', 'ko', 'de', 'fr'] as const;

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

const allPosts = localeCodes.flatMap((locale) => getBlogPosts(locale));
const blogLastmod = latestDate(allPosts);

const entries: SitemapEntry[] = [
	...localeCodes.map((locale) => ({
		loc: homeLocales[locale].url,
		lastmod: SITE_LASTMOD,
		alternates: homeLocales[locale].alternateLinks,
	})),
	...localeCodes.map((locale) => ({
		loc: blogLocales[locale].url,
		lastmod: blogLastmod,
		alternates: blogLocales[locale].alternateLinks,
	})),
	...allPosts.map((post) => ({
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
