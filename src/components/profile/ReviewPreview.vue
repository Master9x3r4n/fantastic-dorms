<script setup>
import { computed } from 'vue';
import { marked } from 'marked';

const props = defineProps({
	img: { type: String },
	title: { type: String },
	review: { type: String },
	rating: { type: [Number, String] }, // Accepts both to handle '5.0' safely
	listingId: { type: String },
	reviewId: { type: String }
})

// Parse the Markdown body
const parsedReview = computed(() => {
	const rawText = props.review || "";
	return marked.parse(rawText);
});
</script>

<template>
	<RouterLink
			:to="{name: 'reviews', params: {id: listingId}, hash: `#${reviewId}`}"
			class="flex flex-row justify-between items-center w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#121422] hover:shadow-md hover:border-[#355AFF]/50 dark:hover:border-[#355AFF]/50 transition-all duration-200 group cursor-pointer"
	>
		<div class="flex flex-row items-center gap-4 overflow-hidden w-full">
			<!-- Thumbnail Image -->
			<div
					class="w-20 h-16 sm:w-24 sm:h-20 rounded-xl shrink-0 bg-cover bg-center border border-slate-100 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 overflow-hidden relative"
					:style="img ? { backgroundImage: `url(${img})` } : {}"
			>
				<!-- Fallback gradient/icon if no image exists -->
				<div v-if="!img" class="absolute inset-0 bg-gradient-to-br from-[#355AFF]/20 to-[#2C0ED6]/20 flex items-center justify-center text-[#355AFF]/50">
					<span class="material-symbols-outlined text-3xl">image</span>
				</div>
			</div>

			<!-- Text Content -->
			<div class="flex flex-col justify-center items-start overflow-hidden pr-2">
				<h3 class="font-bold text-lg sm:text-xl text-slate-900 dark:text-white truncate w-full group-hover:text-[#355AFF] transition-colors">
					{{ title }}
				</h3>

				<!-- Parsed MD Preview (Flattened via CSS) -->
				<div
						class="preview-md text-sm sm:text-base text-slate-500 dark:text-slate-400 italic line-clamp-2 w-full mt-0.5"
						v-html="parsedReview"
				></div>
			</div>

		</div>

		<!-- Rating Section -->
		<div class="flex flex-row justify-center items-center gap-1.5 shrink-0 pl-2 sm:pl-4">
			<span class="material-symbols-outlined text-[#355AFF] filled text-[24px] sm:text-[28px]">star</span>
			<span class="font-bold text-xl sm:text-2xl text-slate-900 dark:text-white">
        {{ typeof rating === 'number' ? rating.toFixed(1) : rating }}
      </span>
		</div>

	</RouterLink>
</template>

<style scoped>
/* FLATTEN MARKDOWN:
  This forces all block elements (like headings and paragraphs)
  to act like normal inline text so they don't break the small preview card.
*/
.preview-md :deep(p),
.preview-md :deep(h1),
.preview-md :deep(h2),
.preview-md :deep(h3),
.preview-md :deep(ul),
.preview-md :deep(ol),
.preview-md :deep(li),
.preview-md :deep(blockquote) {
	display: inline;
	font-size: inherit;
	font-weight: inherit;
	font-style: inherit;
	margin: 0;
	padding: 0;
	color: inherit;
	border: none;
}

/* Add spaces after block elements so words don't mash together */
.preview-md :deep(p)::after,
.preview-md :deep(h1)::after,
.preview-md :deep(h2)::after,
.preview-md :deep(h3)::after,
.preview-md :deep(li)::after {
	content: " ";
}

/* Hide layout-breaking elements completely */
.preview-md :deep(br),
.preview-md :deep(hr) {
	display: none;
}

/* Preserve basic inline formatting */
.preview-md :deep(b), .preview-md :deep(strong) {
	font-weight: 600;
}
.preview-md :deep(i), .preview-md :deep(em) {
	font-style: italic;
}
.preview-md :deep(u) {
	text-decoration: underline;
}
.preview-md :deep(strike), .preview-md :deep(del) {
	text-decoration: line-through;
}

/* Material Star Solid Fill */
.material-symbols-outlined.filled {
	font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>