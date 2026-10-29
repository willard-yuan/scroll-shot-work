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

// Preserve the existing date for pages without a recorded content update.
// Set home locale `lastModified` or blog frontmatter `updated` when content changes;
// never use the build date, since rebuilding does not mean the content changed.
const DEFAULT_LASTMOD = '2026-05-26';
// Home is localized to 15 languages (incl. nl/ar/pl/th), but the blog is only
// localized to the original 11. Splitting the lists keeps the sitemap accurate:
// home entries get all 15 hreflang alternates, blog entries only get 11.
const homeLocaleCodes = ['en', 'zh', 'zh-hant', 'ja', 'ko', 'de', 'fr', 'es', 'pt-br', 'it', 'vi', 'nl', 'ar', 'pl', 'th'] as const;
const blogLocaleCodes = ['en', 'zh', 'zh-hant', 'ja', 'ko', 'de', 'fr', 'es', 'pt-br', 'it', 'vi'] as const;

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
	}, DEFAULT_LASTMOD);

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

const allPosts = blogLocaleCodes.flatMap((locale) => getBlogPosts(locale));

const entries: SitemapEntry[] = [
	...homeLocaleCodes.map((locale) => {
		const home = homeLocales[locale];
		return {
			loc: home.url,
			lastmod: 'lastModified' in home ? normalizeDate(home.lastModified) : DEFAULT_LASTMOD,
			alternates: home.alternateLinks,
		};
	}),
	...blogLocaleCodes.map((locale) => ({
		loc: blogLocales[locale].url,
		lastmod: latestDate(getBlogPosts(locale)),
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
