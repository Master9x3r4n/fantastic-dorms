<script setup>
import ListingCardLarge from '@/components/apartment-cards/ListingCardLarge.vue';
import FilterDropdown from "@/components/dropdown/FilterDropdown.vue";
import {computed, onMounted, ref, watch} from 'vue';
import {useRoute} from 'vue-router';
import ListingService from '@/services/ListingService.js';
import ReviewService from '@/services/ReviewService.js';

const route = useRoute();
const searchQuery = computed(() => route.query.q || "");

const searchResults = ref([]); // This holds the "raw" search results
const activeFilters = ref({
	minRating: 0,
	amenities: []
});
const isLoading = ref(true);

const handleFilterUpdate = (newFilters) => {
	activeFilters.value = newFilters;
};

const fetchSearchResults = async () => {
	isLoading.value = true;
	try {
		// Fetch all listings from the backend
		const response = await ListingService.findAll();
		let listings = response.data;

		// Filter listings locally if there is a search query
		if (searchQuery.value) {
			const query = searchQuery.value.toLowerCase();
			listings = listings.filter(listing =>
					listing.name?.toLowerCase().includes(query) ||
					listing.address?.toLowerCase().includes(query) ||
					listing.description?.toLowerCase().includes(query)
			);
		}

		// Map listings to the format expected by ListingCardLarge
		searchResults.value = await Promise.all(listings.map(async (listing) => {

			// Calculate average rating from the rating object
			let avgRating = 0;
			if (listing.rating) {
				const validCategories = ['cleanliness', 'comfort', 'communication', 'location'];
				let sum = 0;
				let count = 0;

				for (const category of validCategories) {
					if (typeof listing.rating[category] === 'number') {
						sum += listing.rating[category];
						count++;
					}
				}
				if (count > 0) avgRating = sum / count;
			}

			// Fetch reviews for this specific listing to get the review count
			let reviewCount = 0;
			try {
				const reviewsRes = await ReviewService.findAllFromListing(listing.listingId);
				reviewCount = reviewsRes.data?.length || 0;
			} catch (err) {
				console.error(`Failed to fetch reviews for ${listing.listingId}:`, err);
			}

			return {
				name: listing.name,
				description: listing.description,
				ratingData: {
					rating: Number(avgRating.toFixed(1)),
					reviewCount: reviewCount
				},
				imageSrc: listing.media && listing.media.length > 0 ? listing.media[0] : "",
				routerLink: `/listing/${listing.listingId}`,
				amenities: listing.amenities || []
			};
		}));

	} catch (err) {
		console.error("Error fetching search results:", err.message);
	} finally {
		isLoading.value = false;
	}
};

const filteredResults = computed(() => {
	return searchResults.value.filter(listing => {
		// 1. Filter by Rating
		if (listing.ratingData.rating < activeFilters.value.minRating) return false;

		// 2. Filter by Amenities (Checks if listing has ALL selected amenities)
		if (activeFilters.value.amenities.length > 0) {
			const hasAllAmenities = activeFilters.value.amenities.every(
					amenity => (listing.amenities || []).includes(amenity)
			);
			if (!hasAllAmenities) return false;
		}

		return true; // Keep listing
	});
});

// Fetch results when the component first mounts
onMounted(() => {
	fetchSearchResults();
});

// Re-fetch if the search query in the URL changes
watch(() => route.query.q, () => {
	fetchSearchResults();
});
</script>

<template>
	<div class="min-h-screen w-full transition-colors duration-200 font-['Inter']">
		<div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

			<!-- Header Section -->
			<div class="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
				<div class="flex flex-col">
					<!-- Dynamic Title -->
					<h1 class="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
						{{ searchQuery ? 'Search Results' : 'All Properties' }}
					</h1>
					<p class="text-slate-500 dark:text-slate-400 mt-1 text-sm md:text-base">
						<template v-if="searchQuery">
							Found {{ filteredResults.length }} results for <span class="font-semibold text-[#355AFF]">"{{ searchQuery }}"</span>
						</template>
						<template v-else>
							Displaying {{ filteredResults.length }} propert{{ filteredResults.length === 1 ? 'y' : 'ies' }}
						</template>
					</p>
				</div>

				<!-- Filter Button -->
				<FilterDropdown :listings="searchResults" @update:filters="handleFilterUpdate" />
			</div>

			<!-- Loading State -->
			<div v-if="isLoading" class="flex justify-center items-center py-32">
				<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#355AFF]"></div>
			</div>

			<!-- Body Content -->
			<div v-else-if="filteredResults.length > 0" class="flex flex-col gap-6 md:gap-8">
				<template v-for="(item, index) in filteredResults" :key="index">
					<ListingCardLarge :cardData="item"/>
				</template>
			</div>

			<!-- Empty State -->
			<div v-else class="flex flex-col items-center justify-center py-20 text-center bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 mt-4">
				<span class="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 mb-4">search_off</span>
				<h2 class="text-xl font-bold text-slate-900 dark:text-white mb-2">No results found</h2>
				<p class="text-slate-500 dark:text-slate-400 max-w-md"> We couldn't find any apartments matching {{ searchQuery.length > 0 ? `"${searchQuery}"` : "your filters" }}. Try adjusting your search or using different filters.</p>
			</div>

		</div>
	</div>
</template>

<style scoped>
@reference "tailwindcss";

.material-symbols-outlined {
	font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>