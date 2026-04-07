<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ListingService from '../services/ListingService.js';
import ReviewService from '../services/ReviewService.js';

import Carousel from '@/components/carousel/Carousel.vue';
import ListingInformation from '@/components/listing-content/ListingInformation.vue';
import OverallRating from '@/components/side-cards/OverallRating.vue';
import MediaContainer from '@/components/carousel/MediaContainer.vue';
import ReviewCard from '@/components/review-cards/ReviewCard.vue';
import Divider from '@/components/divider/Divider.vue';
import BlueButton from "@/components/page-buttons/BlueButton.vue";

const route = useRoute();
const router = useRouter();
const listingId = route.params.id;
const listing = ref(null);
const reviews = ref([]);

// Computed property to limit the displayed reviews to a maximum of 3
const displayedReviews = computed(() => {
	return reviews.value.slice(0, 3);
});

const aggregatedRating = computed(() => {
	if (!reviews.value.length) return { cleanliness: 0, comfort: 0, communication: 0, location: 0 };

	const categories = ['cleanliness', 'comfort', 'communication', 'location'];
	const sums = { cleanliness: 0, comfort: 0, communication: 0, location: 0 };

	reviews.value.forEach(review => {
		categories.forEach(category => {
			sums[category] += Number(review.rating?.[category] ?? 0);
		});
	});

	const count = reviews.value.length;
	return Object.fromEntries(
			categories.map(cat => [cat, sums[cat] / count])
	);
});

onMounted(async () => {
	// Get listing
	ListingService.find(listingId)
	.then(res => {
		listing.value = res.data;
	})
	.catch(err => {
		if (err.status === 404) {
			return router.push('/');
		}
		console.log(`Error retrieving listing: ${err.message}`);
	});

	// Get reviews
	ReviewService.findAllFromListing(listingId)
	.then(res => {
		reviews.value = res.data;
	})
	.catch(err => {
		console.log(`Error retrieving reviews: ${err.message}`);
	});
});
</script>

<template>
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 font-['Inter']">

		<!-- Main Content -->
		<div v-if="listing" class="flex flex-col lg:flex-row gap-10 lg:gap-12 relative">

			<!-- LEFT COLUMN: Content -->
			<div class="w-full lg:w-2/3 flex flex-col gap-8">
				<!-- Media -->
				<div v-if="listing.media?.length" class="w-full h-107.5">
					<Carousel buttonStyling="large">
						<template #content>
							<div
								v-for="(mediaSrc, index) in listing.media"
								:key="index"
								class="h-full p-2"
								style="flex: 0 0 100%"
							>
								<MediaContainer :src="mediaSrc" size="full" :objectFit="'cover'" />
							</div>
						</template>
					</Carousel>
				</div>

				<ListingInformation :listing="listing" />
			</div>

			<!-- RIGHT COLUMN: Sidebar -->
			<div class="w-full lg:w-1/3 flex flex-col gap-8 lg:sticky lg:top-8 h-fit">
				<OverallRating :rating="aggregatedRating" class="w-full shadow-sm"/>

				<div class="flex flex-col gap-6">
					<div class="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700/60">
						<h2 class="font-bold text-2xl text-slate-900 dark:text-white">Reviews</h2>
						<RouterLink :to="{ name: 'write', params: { id: listingId } }">
							<BlueButton class="flex items-center gap-2 px-4 py-2">
								<span class="material-symbols-outlined text-white text-[18px]">edit_square</span>
								<span class="font-medium text-[15px] text-white">Write</span>
							</BlueButton>
						</RouterLink>
					</div>

					<!-- Reviews List -->
					<div v-if="reviews && reviews.length > 0" class="flex flex-col gap-6">
						<!-- Iterate over displayedReviews instead of reviews -->
						<div v-for="(review, index) in displayedReviews" :key="review._id">
							<ReviewCard :review="review" :id="review._id" />
							<Divider v-if="index !== displayedReviews.length - 1" class="mt-6"/>
						</div>

						<!-- Show All Reviews Button (Only appears if there are more than 3 reviews) -->
						<RouterLink
								v-if="reviews.length > 3"
								:to="{ name: 'reviews', params: { id: listingId } }"
								class="w-full mt-2"
						>
							<button class="w-full py-3 px-4 bg-white dark:bg-[#121422] border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
								Show all {{ reviews.length }} reviews
							</button>
						</RouterLink>
					</div>

					<!-- Empty State -->
					<div v-else class="flex flex-col items-center justify-center py-12 px-4 text-center bg-slate-50 dark:bg-slate-800/20 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
						<span class="material-symbols-outlined text-5xl text-slate-300 mb-2">reviews</span>
						<p class="text-slate-600 dark:text-slate-400 font-semibold">No reviews yet</p>
						<p class="text-slate-400 text-sm">Be the first to share your experience!</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>