// @ts-check
import { defineConfig } from 'astro/config';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';

// Lazy-load every in-content image (the template-rendered cover stays eager as LCP).
function rehypeLazyImages() {
	const visit = (node) => {
		if (!node || typeof node !== 'object') return;
		if (node.type === 'element' && node.tagName === 'img') {
			node.properties = node.properties || {};
			node.properties.loading = 'lazy';
		}
		if (Array.isArray(node.children)) node.children.forEach(visit);
	};
	return (tree) => visit(tree);
}

// https://astro.build/config
export default defineConfig({
	site: 'https://scrollshot.work',
	markdown: {
		remarkPlugins: [remarkMath],
		rehypePlugins: [rehypeRaw, rehypeKatex, rehypeLazyImages],
	},
});
