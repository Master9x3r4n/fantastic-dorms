<script setup>
import { ref, computed } from 'vue';
import { marked } from 'marked';
import Carousel from '../carousel/Carousel.vue';
import MediaContainer from '../carousel/MediaContainer.vue';
import ProfileIcon from "@/components/profile/ProfileIcon.vue";
import ProfileService from '../../services/ProfileService.js';
import ReviewTag from "@/components/write-review-content/ReviewTag.vue";
import ThumbsContainer from '../thumbs-buttons/ThumbsContainer.vue';

const props = defineProps({ review: {} });

const profile = ref(null);
ProfileService.get(props.review.username)
		.then(res => {
			console.log('Profile:');
			console.log(res.data);
			profile.value = res.data;
		})
		.catch(error => {
			console.log(`Error retrieving profile \'${props.review.username}\': ${error.message}`)
		});

const getOverallRating = (ratings) => {
	let overall = 0;
	for (let p in ratings) {
		overall += ratings[p];
		console.log(ratings[p]);
	}
	return (overall/4).toFixed(1);
}

// 2. Create the computed property to parse the Markdown string into HTML
const parsedBody = computed(() => {
	const rawText = props.review?.content?.body || "I have stayed at this apartment for a while, and let me say, it is as the name says...";
	return marked.parse(rawText);
});
</script>

<template>
	<div class="bg-white dark:bg-[#121422] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-6 transition-colors duration-200">

		<div class="flex justify-between items-start mb-4">
			<RouterLink :to="{name: 'profile', params: {id: review.username}}" class="hover:opacity-80 transition-opacity">
				<div class="flex items-center gap-3">
					<div class="w-12 h-12 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
						<ProfileIcon :src="profile?.picture" sizeClass="w-full h-full" iconSize="text-[24px]!"></ProfileIcon>
					</div>
					<div>
						<h3 class="font-bold text-slate-900 dark:text-white">{{ profile?.name.firstName + ' ' + profile?.name.lastName || review.username }}</h3>
						<p class="text-sm text-slate-500 dark:text-slate-400 italic">- Reviews</p>
					</div>
				</div>
			</RouterLink>

			<div class="flex items-center text-[#355AFF] text-2xl font-bold">
				<span class="material-symbols-outlined text-[28px]! mr-1 filled">star</span>
				{{ getOverallRating(review.rating) }}
			</div>
		</div>

		<h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-3 wrap-break-word">
			<slot name="review-title">{{ review.content.title }}</slot>
		</h2>

		<div class="text-slate-800 dark:text-slate-300 mb-6 wrap-break-word min-h-16 editor-output">
			<slot name="review-content">
				<div v-html="parsedBody"></div>
			</slot>
		</div>

		<slot name="review-tags">
			<ReviewTag :tags="review.tags"></ReviewTag>
		</slot>

		<div v-if="review.media.length > 0" class="my-6 h-[47%] flex w-full justify-center items-center">
			<Carousel :count="4" buttonStyling="small circular" :buttonSpacing="4">
				<template #content>
					<template v-for="(url, index) in review.media" :key="index">
						<div class="flex shrink-0 snap-start pl-2 pr-2">
							<MediaContainer size="medium" :src="url" :alt="'Upload preview ' + index" class="border-2 border-dashed border-slate-400 dark:border-slate-200"/>
						</div>
					</template>
				</template>
			</Carousel>
		</div>

		<div v-if="$slots.ownerReply" class="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 rounded-xl p-4 mb-6">
			<p class="text-sm italic text-slate-500 dark:text-slate-400 mb-2">Reply from the owner</p>
			<div class="text-slate-800 dark:text-slate-300">
				<slot name="ownerReply"></slot>
			</div>
		</div>

		<div class="flex items-center gap-4 text-slate-500 dark:text-slate-400">
			<ThumbsContainer :score="review.score"/>

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
	font-size: 1.5em;
	font-weight: 700;
	margin-top: 1rem;
	margin-bottom: 0.5rem;
	line-height: 1.2;
}
.editor-output :deep(h3) {
	font-size: 1.25em;
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