/**
 * Verbatim App Store reviews rendered under the persona review grid.
 *
 * Rules (deliberate, do not "improve" without asking):
 *  - `quote` is the user's original wording. Typos and spacing are preserved
 *    on purpose — rewriting them would turn a real quote into marketing copy.
 *  - Reviews are NEVER translated, in any locale. Every language version shows
 *    the exact same original text; only the surrounding UI chrome is localized.
 *    A translated quote is no longer a verbatim review.
 *  - Only locales listed here render the block. Adding a language is one key.
 *
 * `variant` selects the presentation:
 *  - `editorial`: flat, flag-left column (large centred heading, quote column,
 *    stars beneath). Both `en` and `zh-CN` use this.
 *  - `cards`: dark inset cards with country / store / provenance metadata.
 *    Kept available for an easy rollback.
 *
 * `tone` only controls quote typography — headings and subtitles already use
 * the page's own serif type on every locale:
 *  - `reference`: italic quotes (en, matching the reference design).
 *  - `site`: upright body type for CJK readability (zh-CN).
 */

export interface AppStoreReviewItem {
	/** Emoji flag, centred in a circular badge. */
	flag: string;
	/** Accessible name for the flag badge. */
	flagLabel: string;
	quote: string;
	quoteLang: string;
	/** `cards` variant only. */
	country?: string;
	store?: string;
	originalLabel?: string;
}

export interface AppStoreReviewSection {
	variant: 'editorial' | 'cards';
	/** `editorial` variant only. */
	tone?: 'reference' | 'site';
	/** `cards` variant only. */
	kicker?: string;
	title: string;
	description: string;
	ratingLabel: string;
	items: AppStoreReviewItem[];
}

const CHINA_QUOTE =
	'录屏拼接出来目前版本已经修复得很不戳啦！一直在和开发者反馈、沟通，没想到每一个反馈发问题都有被认真对待！App也在一点一点在变得更完美！ 之前拼接老是会有少一条的情况，现在已经修复好了，而且复杂背景的情况也会比其他同类的app要好很多，总之就感觉自己也参与了app的调试，很满意！五星好评，十分推荐！！！';

const JAPAN_QUOTE =
	'Super easy to use and the image quality is perfect. Love that there are zero ads. Highly recommend!';

export const appStoreReviewsByLang: Record<'en' | 'zh-CN', AppStoreReviewSection> = {
	en: {
		variant: 'editorial',
		tone: 'reference',
		title: 'Users love this app',
		description: 'Best reviews from the AppStore',
		ratingLabel: 'Five-star review',
		items: [
			{
				flag: '🇯🇵',
				flagLabel: 'Flag of Japan',
				quote: JAPAN_QUOTE,
				quoteLang: 'en',
			},
			{
				flag: '🇨🇳',
				flagLabel: 'Flag of China',
				quote: CHINA_QUOTE,
				quoteLang: 'zh-CN',
			},
		],
	},
	'zh-CN': {
		variant: 'editorial',
		tone: 'site',
		kicker: '来自 App Store',
		title: '真实用户怎么说',
		description: '以下评价摘自 App Store，保留评论原文，未作改写。',
		ratingLabel: '五星评价',
		items: [
			{
				flag: '🇯🇵',
				flagLabel: '日本国旗',
				country: '日本',
				store: 'App Store 日本区',
				quote: JAPAN_QUOTE,
				quoteLang: 'en',
				originalLabel: '评论原文 · 英文 · 未作改写',
			},
			{
				flag: '🇨🇳',
				flagLabel: '中国国旗',
				country: '中国',
				store: 'App Store 中国区',
				quote: CHINA_QUOTE,
				quoteLang: 'zh-CN',
				originalLabel: '评论原文 · 中文 · 未作改写',
			},
		],
	},
};
