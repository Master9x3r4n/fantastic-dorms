<script setup>
import { ref, computed, onMounted } from 'vue';
import ProfileSummary from "@/components/profile/ProfileSummary.vue";
import ReviewPreview from "@/components/profile/ReviewPreview.vue";
import PageButtons from "@/components/page-buttons/PageButtons.vue";
import Divider from "@/components/divider/Divider.vue";
import BlueButton from "@/components/page-buttons/BlueButton.vue";
import ProfileService from "../services/ProfileService.js";
import ReviewService from "../services/ReviewService.js";
import ListingService from "../services/ListingService.js";
import { useAuthStore } from '@/auth';

const props = defineProps({
	id: { type: String }
});

const user = ref(null);
ProfileService.find(props.id)
		.then(res => {
			user.value = res.data;
		})
		.catch(error => {
			console.error(`Error retrieving profile: ${error.message}.`);
		});

const reviewsRaw = ref(null);
const reviews = ref([]);
ReviewService.findAllByUser(props.id)
		.then(res => {
			reviewsRaw.value = res.data;

			// For each review, pull the listing
			for (let i = 0; i < reviewsRaw.value.length; i++) {
				const review = reviewsRaw.value[i];
				ListingService.find(review.listingId)
						.then(res => {
							if (res.data) {
								reviews.value.push({
									data: review,
									listing: res.data
								})
							} else {
								console.error(`Listing ${review.listingId} could not be found for review.`);
							}
						})
						.catch(error => {
							console.error(`Error retrieving listing for review: ${error.message}.`);
						});
			}
		})
		.catch(error => {
			console.error(`Error retrieving profile: ${error.message}.`);
		});

const getOverallRating = (ratings) => {
	let overall = 0;
	for (let p in ratings) {
		overall += ratings[p];
	}
	return (overall/4).toFixed(1);
}

// Get current username
const username = ref(null);
const auth = useAuthStore();
onMounted(async () => {
	if (!auth.user) {
		await auth.fetchCurrentUser();
	}

	if (auth.user)
		username.value = auth.user.username;
})

// --- FILTER LOGIC ---
const filteredReviews = computed(() => {
	// If the current logged-in user is viewing their own profile, show all reviews
	if (username.value === props.id) {
		return reviews.value;
	}
	// Otherwise, filter out anonymous reviews
	return reviews.value.filter(review => !review.data.isAnonymous);
});

// --- PAGINATION LOGIC ---
const currentPage = ref(1);
const reviewsPerPage = 4; // Set this to smth else if needed

const totalPages = computed(() => {
	// Use filteredReviews instead of reviews
	return Math.ceil(filteredReviews.value.length / reviewsPerPage) || 1;
});

const paginatedReviews = computed(() => {
	const start = (currentPage.value - 1) * reviewsPerPage;
	const end = start + reviewsPerPage;
	// Use filteredReviews instead of reviews
	return filteredReviews.value.slice(start, end);
});

const changePage = (page) => {
	currentPage.value = page;
	// window.scrollTo({ top: 0, behavior: 'smooth' });
};
</script>

<template>
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 font-['Inter']" v-if="user">

		<!-- Top Profile Summary Card -->
		<div class="bg-white dark:bg-[#121422] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm p-6 md:p-8 mb-8 transition-colors duration-200">
			<ProfileSummary
					:name="user.name?.firstName + ' ' + user.name?.lastName"
					:username="user.username"
					:joinDate="new Date(user.joinDate).toUTCString()"
					:university="user.school?.name"
					:profileImg="user.picture"
			/>
		</div>

		<!-- Main Two-Column Layout -->
		<div class="flex flex-col lg:flex-row gap-8 items-start w-full">

			<!-- LEFT COLUMN: Biography & Details -->
			<div class="w-full lg:w-1/3 flex flex-col gap-6 bg-white dark:bg-[#121422] rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 md:p-8 transition-colors duration-200 sticky top-24">

				<!-- Bio Header -->
				<div class="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
					<h2 class="text-xl font-bold text-slate-900 dark:text-white">
						Biography
					</h2>
					<!-- Edit Button -->
					<RouterLink to="/settings" v-if="username === props.id">
						<BlueButton class="px-3 py-1.5">
							<span class="material-symbols-outlined text-[16px] text-white">edit_square</span>
							<span class="text-sm font-medium text-white">Edit</span>
						</BlueButton>
					</RouterLink>
				</div>

				<!-- Bio Text -->
				<p class="text-base leading-relaxed text-slate-700 dark:text-slate-300">
					{{ user.bio }}
				</p>

				<Divider class="opacity-50" />

				<!-- User Details List -->
				<div class="flex flex-col gap-6">

					<!-- Education Details -->
					<div class="flex items-center gap-4">
						<div class="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
							<span class="material-symbols-outlined text-[#355AFF] text-[24px]">school</span>
						</div>
						<div class="flex flex-col">
							<span class="text-sm font-medium text-slate-500 dark:text-slate-400">School</span>
							<span class="font-semibold text-slate-900 dark:text-white">
                {{ user.school?.name }}
              </span>
						</div>
					</div>

					<!-- Dorm Details -->
					<div class="flex items-center gap-4">
						<div class="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
							<span class="material-symbols-outlined text-[#355AFF] text-[24px]">apartment</span>
						</div>
						<div class="flex flex-col">
							<span class="text-sm font-medium text-slate-500 dark:text-slate-400">Home</span>
							<a class="font-semibold text-slate-900 dark:text-white hover:text-[#355AFF] dark:hover:text-[#355AFF] underline transition-colors cursor-pointer">
								{{ user.dorm?.name }}
							</a>
						</div>
					</div>

					<!-- Reviews Count Details -->
					<div class="flex items-center gap-4">
						<div class="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
							<span class="material-symbols-outlined text-[#355AFF] text-[24px]">reviews</span>
						</div>
						<div class="flex flex-col">
							<span class="text-sm font-medium text-slate-500 dark:text-slate-400">Reviews Written</span>
							<!-- Updated to use filteredReviews length -->
							<span class="font-semibold text-slate-900 dark:text-white">
                {{ filteredReviews.length }}
              </span>
						</div>
					</div>

				</div>
			</div>

			<!-- RIGHT COLUMN: Reviews List -->
			<div class="w-full lg:w-2/3 flex flex-col bg-white dark:bg-[#121422] rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 md:p-8 transition-colors duration-200">

				<h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
					Reviews
				</h2>

				<!-- Reviews Dynamic List -->
				<div v-if="filteredReviews && filteredReviews.length > 0" class="flex flex-col gap-5">
					<!-- We now iterate over paginatedReviews instead of all reviews -->
					<ReviewPreview
							v-for="review in paginatedReviews"
							:key="review.data.listingId"
							:title="review.data.content.title"
							:rating="getOverallRating(review.data.rating)"
							:review="review.data.content.body"
							:img="review.listing.media?.[0]"
							:listingId="review.data.listingId"
							:reviewId="review.data._id"
					/>
				</div>

				<!-- Empty State -->
				<div v-else class="flex flex-col items-center justify-center py-16 text-center bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
					<span class="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600 mb-3">rate_review</span>
					<p class="text-slate-500 dark:text-slate-400 font-medium">No reviews published yet.</p>
				</div>

				<!-- Dynamic Page Buttons -->
				<div class="flex justify-center items-center w-full mt-8" v-if="totalPages > 1">
					<PageButtons
							:current-page="currentPage"
							:total-pages="totalPages"
							@update:page="changePage"
					/>
				</div>
			</div>

		</div>
	</div>
</template>

<style scoped>
.material-symbols-outlined {
	font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>