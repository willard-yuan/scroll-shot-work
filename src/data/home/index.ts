import { site, localeAssets, appStoreUrls } from './shared';
import { enHomeLocale } from './locales/en';
import { zhHomeLocale } from './locales/zh';
import { zhHantHomeLocale } from './locales/zh-hant';
import { jaHomeLocale } from './locales/ja';
import { koHomeLocale } from './locales/ko';
import { deHomeLocale } from './locales/de';
import { frHomeLocale } from './locales/fr';
import { esHomeLocale } from './locales/es';
import { ptBrHomeLocale } from './locales/pt-br';
import { itHomeLocale } from './locales/it';
import { viHomeLocale } from './locales/vi';

export { appStoreUrls, site, localeAssets } from './shared';

export const homeLocales = {
	en: enHomeLocale,
	zh: zhHomeLocale,
	'zh-hant': zhHantHomeLocale,
	ja: jaHomeLocale,
	ko: koHomeLocale,
	de: deHomeLocale,
	fr: frHomeLocale,
	es: esHomeLocale,
	'pt-br': ptBrHomeLocale,
	it: itHomeLocale,
	vi: viHomeLocale,
};

export type HomeLocale = (typeof homeLocales)[keyof typeof homeLocales];

export const buildJsonLd = (page: HomeLocale) => {
	const appStoreRating = 'appStoreRating' in page ? page.appStoreRating : undefined;
	const aggregateRating =
		appStoreRating?.average && appStoreRating.count > 0
			? {
					'@type': 'AggregateRating',
					ratingValue: appStoreRating.average.toFixed(1),
					ratingCount: appStoreRating.count,
					bestRating: '5',
					worstRating: '1',
				}
			: undefined;

	return [
		{
			'@context': 'https://schema.org',
			'@type': 'WebSite',
			name: site.name,
			url: page.url,
			inLanguage: page.lang,
		},
		{
			'@context': 'https://schema.org',
			'@type': 'SoftwareApplication',
			name: site.name,
			applicationCategory: 'UtilitiesApplication',
			operatingSystem: 'iOS',
			url: page.url,
			downloadUrl: page.appStoreUrl,
			image: `${site.url}${page.assets.ogImage.slice(1)}`,
			description: page.meta.description,
			inLanguage: page.lang,
			offers: {
				'@type': 'Offer',
				price: '0',
				priceCurrency: page.lang === 'zh-CN' ? 'CNY' : 'USD',
				category: 'freemium',
			},
			...(aggregateRating ? { aggregateRating } : {}),
			featureList: page.featureCards.map((feature) => feature.title),
		},
		{
			'@context': 'https://schema.org',
			'@type': 'FAQPage',
			mainEntity: page.faqs.map(([question, answer]) => ({
				'@type': 'Question',
				name: question,
				acceptedAnswer: {
					'@type': 'Answer',
					text: answer,
				},
			})),
		},
	];
};
