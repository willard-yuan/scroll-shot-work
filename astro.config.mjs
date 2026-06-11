// @ts-check
import { defineConfig } from 'astro/config';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';

// https://astro.build/config
export default defineConfig({
	site: 'https://scrollshot.work',
	markdown: {
		remarkPlugins: [remarkMath],
		rehypePlugins: [rehypeRaw, rehypeKatex],
	},
});
