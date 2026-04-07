<script setup>
import { computed } from 'vue';
import { marked } from 'marked';
import ProfileIcon from "@/components/profile/ProfileIcon.vue";
import ReviewTag from "@/components/write-review-content/ReviewTag.vue";
import Carousel from "@/components/carousel/Carousel.vue";
import MediaContainer from "@/components/carousel/MediaContainer.vue";
import ThumbsContainer from "@/components/thumbs-buttons/ThumbsContainer.vue";

const props = defineProps({
	isAnonymous: { type: Boolean, default: false },
	user: { type: Object, required: true },
	overallRating: { type: [String, Number], default: '0.0' },
	title: { type: String, default: '' },
	body: { type: String, default: '' },
	tags: { type: Array, default: () => [] },
	mediaUrls: { type: Array, default: () => [] }
});

// Reactively convert the Markdown string from the editor into visual HTML
const parsedBody = computed(() => {
	const rawText = props.body || 'Your detailed review experience will appear here as you type...';
	return marked.parse(rawText);
});
</script>

<template>
	<div class="hidden lg:block w-125 xl:w-152.5 shrink-0">
		<div class="sticky top-24">
			<h2 class="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Live Preview</h2>
			<p class="text-sm text-slate-500 dark:text-slate-400 mb-6">This is the point of view for all users within the property's page.</p>

			<div class="bg-white dark:bg-[#121422] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-6 transition-colors duration-200">

				<div class="flex justify-between items-start mb-4">
					<div class="flex items-center gap-3">
						<div class="w-12 h-12 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
							<ProfileIcon :isAnonymous="isAnonymous" :src="user.picture" alt="user img" sizeClass="w-full h-full" iconSize="text-[24px]!"></ProfileIcon>
						</div>
						<div>
							<h3 class="font-bold text-slate-900 dark:text-white">{{ isAnonymous ? 'Anonymous' : user.name.firstName + ' ' + user.name.lastName }}</h3>
							<p class="text-sm text-slate-500 dark:text-slate-400 italic">3 Reviews</p>
						</div>
					</div>
					<div class="flex items-center text-[#355AFF] text-2xl font-bold">
						<span class="material-symbols-outlined text-[28px]! mr-1 filled">star</span> {{ overallRating }}
					</div>
				</div>

				<h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-3 wrap-break-word">
					{{ title || 'Review Title Here' }}
				</h2>

				<div
						class="text-slate-800 dark:text-slate-300 mb-6 wrap-break-word min-h-16 editor-output"
						v-html="parsedBody"
				></div>

				<ReviewTag :tags="tags" />

				<div v-if="mediaUrls.length > 0" class="my-6 h-[47%] flex w-full justify-center items-center">
					<Carousel buttonStyling="small circular" :buttonSpacing="4">
						<template #content>
							<template v-for="(url, index) in mediaUrls" :key="index">
								<div class="flex shrink-0 snap-start pl-2 pr-2">
									<MediaContainer size="medium" :src="url" :alt="'Upload preview ' + index" class="border-2 border-dashed border-slate-400 dark:border-slate-200"/>
								</div>
							</template>
						</template>
					</Carousel>
				</div>

				<div class="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 rounded-xl p-4 mb-6">
					<p class="text-sm italic text-slate-500 dark:text-slate-400 mb-2">Reply from the owner</p>
					<p class="text-slate-800 dark:text-slate-300">Glad to hear that you were satisfied with our space! ^_^</p>
				</div>

				<div class="flex items-center gap-4 text-slate-500 dark:text-slate-400">
					<ThumbsContainer :score="4"/>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
/* Base formatting */
.editor-output :deep(p) {
	margin-bottom: 0.5rem;
}
.editor-output :deep(b), .editor-output :deep(strong) {
	font-weight: 700;
}
.editor-output :deep(i), .editor-output :deep(em) {
	font-style: italic;
}
.editor-output :deep(u) {
	text-decoration: underline;
}
.editor-output :deep(strike), .editor-output :deep(del) {
	text-decoration: line-through;
}

/* Lists */
.editor-output :deep(ul) {
	list-style-type: disc;
	padding-left: 1.5rem;
	margin-top: 0.25rem;
	margin-bottom: 0.25rem;
}
.editor-output :deep(ol) {
	list-style-type: decimal;
	padding-left: 1.5rem;
	margin-top: 0.25rem;
	margin-bottom: 0.25rem;
}

/* Headings */
.editor-output :deep(h2) {
	font-size: 1.25em;
	font-weight: 700;
	margin-top: 1rem;
	margin-bottom: 0.5rem;
	line-height: 1.2;
}
.editor-output :deep(h3) {
	font-size: 1.125em;
	font-weight: 600;
	margin-top: 1rem;
	margin-bottom: 0.5rem;
	line-height: 1.2;
}

/* Blockquote */
.editor-output :deep(blockquote) {
	border-left: 3px solid #cbd5e1; /* Tailwind slate-300 */
	padding-left: 1rem;
	margin-top: 0.5rem;
	margin-bottom: 0.5rem;
	font-style: italic;
	color: #64748b; /* Tailwind slate-500 */
}
.dark .editor-output :deep(blockquote) {
	border-left-color: #475569; /* Tailwind slate-600 */
	color: #94a3b8; /* Tailwind slate-400 */
}
</style>