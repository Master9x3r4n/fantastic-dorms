<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import FullReviewCard from '@/components/review-cards/FullReviewCard.vue';
import ReviewService from '../services/ReviewService.js';

const route = useRoute();

// Grab the ID from the URL parameters
const listingId = route.params.id;

const reviews = ref([]);

onMounted(() => {
	if (listingId) {
		// Fetch all reviews specific to this listing
		ReviewService.findAllFromListing(listingId)
				.then(async (res) => {
					reviews.value = res.data;

					// Wait, they don't love me like I love you...
					await nextTick();

					// If there's a hash in the URL (e.g., #12345), find that element and scroll to it
					if (route.hash) {
						// Escape the hash if it starts with a number (CSS selector requirement for ObjectIds)
						const safeHash = CSS.escape(route.hash.substring(1));
						const targetElement = document.querySelector(`#${safeHash}`);

						if (targetElement) {
							// We use setTimeout just to ensure any CSS transitions finish first
							setTimeout(() => {
								targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

								// Add a brief highlight effect to the target card
								targetElement.classList.add('ring-2', 'ring-[#355AFF]', 'rounded-xl', 'transition-all', 'duration-500');
								setTimeout(() => targetElement.classList.remove('ring-2', 'ring-[#355AFF]', 'rounded-xl'), 2000);
							}, 100);
						}
					}
				})
				.catch(err => {
					console.error(`Error retrieving reviews for listing ${listingId}: ${err.message}`);
				});
	}
});
</script>

<template>
	<div class="min-h-screen w-full bg-white dark:bg-[#121422] transition-colors duration-200 font-['Inter'] pb-12">
		<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

			<!-- Return to Listing Button  -->
			<RouterLink
					:to="{ name: 'listing', params: { id: listingId } }"
					class="inline-flex items-center text-sm text-slate-500 dark:text-slate-400 hover:text-[#355AFF]
                dark:hover:text-[#355AFF] transition-colors mb-6 border border-slate-200 dark:border-slate-700 rounded-md
                px-4 py-2 bg-white dark:bg-[#121422] shadow-sm"
			>
				<span class="material-symbols-outlined text-[18px]! mr-1">arrow_back</span>
				Return to Listing
			</RouterLink>

			<!-- Header Section -->
			<div class="w-full flex justify-between items-end mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">
				<h1 class="text-3xl font-bold text-slate-900 dark:text-white">All Reviews</h1>
				<div v-if="reviews.length > 0" class="text-slate-500 dark:text-slate-400 font-medium">
					Found {{ reviews.length }} review<template v-if="reviews.length !== 1">s</template>
				</div>
			</div>

			<!-- Reviews Container -->
			<div v-if="reviews.length > 0" class="flex flex-col gap-6">
				<template v-for="review in reviews" :key="review._id">
					<!-- ID assigned for scrolling -->
					<div :id="review._id">
						<FullReviewCard :review="review" />
					</div>
				</template>
			</div>

			<!-- Empty State -->
			<div v-else class="flex flex-col items-center justify-center py-20 text-center bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
				<span class="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600 mb-3">rate_review</span>
				<p class="text-slate-500 dark:text-slate-400 font-medium text-lg">No reviews found.</p>
				<p class="text-slate-400 text-sm mt-1">There are no reviews for this listing yet.</p>
			</div>

		</div>
	</div>
</template>

<style scoped>
.material-symbols-outlined {
	font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>