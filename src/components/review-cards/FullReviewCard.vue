<script setup>
import { ref, computed, onMounted } from 'vue';
import { marked } from 'marked';
import { useAuthStore } from '@/auth';
import Carousel from '../carousel/Carousel.vue';
import MediaContainer from '../carousel/MediaContainer.vue';
import ProfileIcon from "@/components/profile/ProfileIcon.vue";
import ProfileService from '../../services/ProfileService.js';
import ReviewService from '../../services/ReviewService.js';
import ReviewTag from "@/components/write-review-content/ReviewTag.vue";
import ThumbsContainer from '../thumbs-buttons/ThumbsContainer.vue';
import OwnerReply from "@/components/side-cards/OwnerReply.vue";
import BlueButton from '../page-buttons/BlueButton.vue';
import ReplyReview from './ReplyReview.vue';
import { useRoute, useRouter } from 'vue-router'

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const user = ref(null);

const props = defineProps({
	review: {
		type: Object,
		required: true
	},
	isOwner: {
		type: Boolean,
		default: false
	}
});
const showReview = ref(false);
const profile = ref(null);
const reviewCount = ref(0);

onMounted(async () => {
	if (!auth.user)
		await auth.fetchCurrentUser();
	user.value = auth.user;
});

// only query for the profile data if the review is not anonymous
if (!props.review.isAnonymous) {
	ProfileService.find(props.review.username)
			.then(res => {
				profile.value = res.data;
			})
			.catch(error => {
				console.log(`Error retrieving profile \'${props.review.username}\': ${error.message}`)
			});
}
ReviewService.findAllByUser(props.review.username)
		.then(res => {
			reviewCount.value = res.data?.length || 0;
		})
		.catch(error => {
			console.log(`Error retrieving reviews for user '${props.review.username}': ${error.message}`);
		});

const getOverallRating = (ratings) => {
	let overall = 0;
	for (let p in ratings) {
		overall += ratings[p];
	}
	return (overall/4).toFixed(1);
}

const parsedBody = computed(() => {
	const rawText = props.review?.content?.body || "I have stayed at this apartment for a while, and let me say, it is as the name says...";
	return marked.parse(rawText);
});

const rerouteTo = (reply) => {
	props.review.content.reply = reply;
	router.push({ name: 'reviews', params: { id: route.params.id }, hash: '#' + props.review._id });
	//window.location.reload();
}

const getScore = () => {
	if (!props.review.votes) return 0;
	return (props.review.votes.upvotes?.length ?? 0) - (props.review.votes.downvotes?.length ?? 0);
};

const getDir = () => {
	const username = user.value?.username;
	if (!username || !props.review.votes) return 'none';

	if (props.review.votes.upvotes?.includes(username)) return 'up';
	if (props.review.votes.downvotes?.includes(username)) return 'down';
	return 'none';
};

const deleting = ref(false);
const deleteReview = async () => {
	if (deleting.value) return;
	deleting.value = true;
	if (window.confirm('Are you sure you want to delete this review? There\'s no going back.')) {
		try {
			await ReviewService.delete(props.review._id);
			window.location.reload();
		} catch (err) {
			// console.error('An error occurred: ' + err.message);
			window.alert('An error occurred while deleting your review. Please try again later.');
			deleting.value = false;
		}
	}
	deleting.value = false;
}
</script>

<template>
	<div class="bg-white dark:bg-[#121422] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-6 transition-colors duration-200 flex flex-col gap-5">

		<!-- Header Container (Profile & Rating) -->
		<div class="flex justify-between items-start">

			<!-- Anonymous User State -->
			<div v-if="review.isAnonymous" class="flex items-center gap-3 cursor-default">
				<div class="w-12 h-12 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
					<span class="material-symbols-outlined text-slate-400 text-2xl">person_off</span>
				</div>
				<div>
					<div class="font-bold text-slate-900 dark:text-white">
						Anonymous
					</div>
					<div class="text-sm text-slate-500 dark:text-slate-400 italic">Reviewer</div>
				</div>
			</div>

			<!-- Known User State -->
			<RouterLink v-else :to="{name: 'profile', params: {id: review.username}}" class="hover:opacity-80 transition-opacity">
				<div class="flex items-center gap-3">
					<div class="w-12 h-12 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
						<ProfileIcon :src="profile?.picture" sizeClass="w-full h-full" iconSize="text-[24px]!"></ProfileIcon>
					</div>
					<div>
						<div class="font-bold text-slate-900 dark:text-white">
							{{ profile?.name?.firstName ? (profile.name.firstName + ' ' + profile.name.lastName) : review.username }}
						</div>
						<div class="text-sm text-slate-500 dark:text-slate-400 italic">{{ reviewCount }} Review{{ reviewCount === 1 ? '' : 's' }}</div>
					</div>
				</div>
			</RouterLink>

			<!-- Overall Rating -->
			<div class="flex items-center text-[#355AFF] text-2xl font-bold">
				<span class="material-symbols-outlined text-[28px]! mr-1 filled">star</span>
				{{ getOverallRating(review.rating) }}
			</div>
		</div>

		<!-- Content Container -->
		<div class="flex flex-col gap-3">
			<!-- Main Title -->
			<div class="text-2xl font-bold text-slate-900 dark:text-white wrap-break-word">
				{{ review.content.title }}
			</div>

			<!-- Review Body -->
			<div class="text-slate-800 dark:text-slate-300 wrap-break-word min-h-16 editor-output">
				<div v-html="parsedBody"></div>
			</div>
		</div>

		<!-- Tags -->
		<div v-if="review.tags && review.tags.length > 0">
			<ReviewTag :tags="review.tags"></ReviewTag>
		</div>

		<!-- Media Carousel -->
		<div v-if="review.media && review.media.length > 0" class="h-[47%] flex w-full justify-center items-center">
			<Carousel buttonStyling="small circular" :buttonSpacing="4">
				<template #content>
					<template v-for="(url, index) in review.media" :key="index">
						<div class="flex shrink-0 snap-start pl-2 pr-2">
							<MediaContainer size="medium" :src="url" :alt="'Upload preview ' + index" class="border-2 border-dashed border-slate-400 dark:border-slate-200"/>
						</div>
					</template>
				</template>
			</Carousel>
		</div>

		<!-- Owner Reply Component (Hidden while editing) -->
		<OwnerReply
				v-if="review.content.reply && !showReview"
				:replyText="review.content.reply"
				:truncate="false"
		/>

		<!-- Owner Reply Field (Pre-filled with existing reply) -->
		<ReplyReview
				v-if="showReview"
				:reviewId="review._id"
				:initialReply="review.content.reply || ''"
				@closeReview="showReview = false"
				@rerouteLink="rerouteTo"
		/>

		<div class="flex w-full justify-between items-center">
			<!-- Thumbs :D -->
			<div class="flex items-center gap-3.5 text-slate-500 dark:text-slate-400 pt-1">
				<ThumbsContainer :reviewId="review._id" :score="getScore()" :dir="getDir()"/>
			</div>

			<!-- Reply Button -->
			<BlueButton
					v-if="!showReview && isOwner"
					@click="showReview = !showReview"
					class="font-medium text-[15px] text-white"
			>
				<span v-if="!review.content.reply">Add Reply</span>
				<span v-else>Edit Reply</span>
			</BlueButton>

			<!-- Delete -->
			<span v-if="auth.user?.username === review.username" class="material-symbols-outlined">
				<div class="text-red-400 dark:text-red-500 disabled:text-slate-400 disabled:dark:text-slate-600">
					<button 
						@click="deleteReview"
						class="cursor-pointer"
						:disabled="deleting"
					>
						delete
					</button>
				</div>
			</span>
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