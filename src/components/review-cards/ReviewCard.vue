<script setup>
import { ref, computed } from 'vue';
import { marked } from 'marked';
import MediaContainer from '../carousel/MediaContainer.vue';
import ProfileIcon from "@/components/profile/ProfileIcon.vue";
import ProfileService from "../../services/ProfileService.js";
import ThumbsContainer from '../thumbs-buttons/ThumbsContainer.vue';
import OwnerReply from "@/components/side-cards/OwnerReply.vue";
import ReviewService from '@/services/ReviewService';

const props = defineProps({
	review: {
		type: Object,
		required: true
	},
	id: {
		type: String,
		default: "1"
	}
})

const profile = ref(null);
const reviewCount = ref(0);

ProfileService.find(props.review.username)
		.then(res => {
			profile.value = res.data;
		})
		.catch(error => {
			console.log(`Error occurred retrieving profile data of user ${props.review.username} for review: ${error.message}`);
		});

ReviewService.findAllByUser(review.username)
		.then(res => {
			reviewCount.value = res.data?.length || 0;
		})
		.catch(error => {
			console.log(`Error retrieving reviews for user ${review.username}: ${error.message}`);
		});

const getOverallRating = (ratings) => {
	const validCategories = ['cleanliness', 'comfort', 'communication', 'location'];
	let overall = 0;
	let count = 0;
	for (const category of validCategories) {
		if (ratings && typeof ratings[category] === 'number') {
			overall += ratings[category];
			count++;
		}
	}
	return count > 0 ? (overall / count).toFixed(1) : "0.0";
}

const parsedBody = computed(() => {
	const rawText = props.review?.content?.body || "";
	return marked.parse(rawText);
});

const getScore = () => {
	return props.review.votes.upvotes.length-props.review.votes.downvotes.length
}

const getDir = () => {
	const votes = props.review.votes;
	if (votes.upvotes.indexOf(profile.username) > -1)
		return "up"
	else if (votes.downvotes.indexOf(profile.username) > -1)
		return "down"
	else
		return "none"
}
</script>

<template>
	<div class="bg-white dark:bg-[#121422] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-6 w-full transition-colors duration-200 flex flex-col gap-3">

		<!-- Header Container -->
		<div class="flex justify-between items-start gap-4 mb-1">

			<!-- Left side: user info -->
			<div class="min-w-0 flex-1">
				<!-- Anonymous User State -->
				<div v-if="review.isAnonymous" class="flex items-center gap-3 cursor-default">
					<div class="w-12 h-12 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
						<span class="material-symbols-outlined text-slate-400 text-2xl">person_off</span>
					</div>
					<div class="min-w-0">
						<div class="font-bold text-slate-900 dark:text-white truncate">Anonymous</div>
						<div class="text-sm text-slate-500 dark:text-slate-400 italic">Reviewer</div>
					</div>
				</div>

				<!-- Known User State -->
				<RouterLink v-else-if="profile" :to="{name: 'profile', params: {id: review.username}}" class="hover:opacity-80 transition-opacity">
					<div class="flex items-center gap-3">
						<div class="w-12 h-12 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
							<ProfileIcon :src="profile.picture" sizeClass="w-full h-full" iconSize="text-[24px]!"></ProfileIcon>
						</div>
						<div class="min-w-0">
							<h3 class="font-bold text-slate-900 dark:text-white truncate">{{ profile?.name.firstName + ' ' + profile?.name.lastName }}</h3>
							<p class="text-sm text-slate-500 dark:text-slate-400 italic">{{ reviewCount }} Review{{ reviewCount === 1 ? '' : 's' }}</p>
						</div>
					</div>
				</RouterLink>

				<!-- Fallback -->
				<div v-else class="flex items-center gap-3 opacity-50 cursor-wait">
					<div class="w-12 h-12 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 flex items-center justify-center animate-pulse shrink-0"></div>
					<div>
						<div class="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-2"></div>
						<div class="h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
					</div>
				</div>
			</div>

			<!-- Rating -->
			<div class="flex items-center text-[#355AFF] text-2xl font-bold shrink-0">
				<span class="material-symbols-outlined text-[28px]! mr-1 filled">star</span>
				{{ getOverallRating(review.rating) }}
			</div>
		</div>

		<!-- Title Container -->
		<h2 class="text-2xl font-bold text-slate-900 dark:text-white truncate mt-1">
			{{ review.content.title }}
		</h2>

		<!-- Comment Container -->
		<div class="flex w-full text-slate-800 dark:text-slate-300">
			<!-- Review proper (Markdown Output) -->
			<div class="w-full editor-output pr-2 overflow-hidden" style="display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical;">
				<div v-html="parsedBody"></div>
			</div>

			<!-- Media -->
			<div class="shrink-0 ml-4 relative" v-if="review.media && review.media.length > 0">
				<!-- Dynamic Remaining Images Badge -->
				<div v-if="review.media.length > 1" class="absolute bg-white/90 backdrop-blur-sm dark:bg-[#111111]/90 flex items-center justify-center rounded-full size-7 top-1 right-1 text-[12px] font-bold shadow-sm dark:text-white z-10 border border-slate-200 dark:border-slate-700">
					+{{ review.media.length - 1 }}
				</div>
				<!-- First Image injected into MediaContainer -->
				<MediaContainer size="small" :src="review.media[0]" />
			</div>
		</div>

		<!-- Reply Container -->
		<OwnerReply
				v-if="review.content.reply"
				:replyText="review.content.reply"
				:truncate="true"
		/>

		<!-- Footer Container -->
		<div class="w-full flex justify-between items-center mt-3 pt-4 border-t border-slate-100 dark:border-slate-700/50">
			<!-- Show More -->
			<div class="font-medium text-[15px] text-[#355AFF] hover:underline hover:opacity-80 transition-all">
				<RouterLink :to="{ name: 'reviews', params: { id: review.listingId }, hash: '#' + id }">Show More</RouterLink>
			</div>

			<!-- Upvote -->
			<div class="text-slate-500 dark:text-slate-400 flex items-center gap-2">
				<ThumbsContainer :reviewId="review._id" :score="getScore()" :dir="getDir()"/>
			</div>
		</div>

	</div>
</template>

<style scoped>
/* Base Markdown formatting exactly matching FullReviewCard */
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