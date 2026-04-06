<script setup>
import { computed, ref, onMounted } from 'vue';
import CardRating from '@/components/rating/CardRating.vue';
import ReviewService from '@/services/ReviewService.js';

const props = defineProps({
	listing: {
		type: Object,
		default: () => ({
			name: "Apartment Name",
			description: "A lovely apartment.",
			media: [],
			listingId: null,
			_id: null,
			amenities: [],
			rating: null,
		})
	}
});

const maxAmenities = 2;

const displayedAmenities = computed(() =>
		props.listing.amenities?.slice(0, maxAmenities) || []
);

const hiddenAmenitiesCount = computed(() =>
		Math.max(0, (props.listing.amenities?.length || 0) - maxAmenities)
);

// Dynamic Review Count State
const reviews = ref([]);

const fetchedReviewCount = computed(() => reviews.value.length);

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

const validCategories = ['cleanliness', 'comfort', 'communication', 'location'];

const overallRating = computed(() => {
	// Guard against division by 0 if there are no reviews
	if (reviews.value.length === 0) return 0;

	const sum = validCategories.reduce((acc, category) => {
		return acc + Number(aggregatedRating.value[category] ?? 0);
	}, 0);
	return Number((sum / validCategories.length).toFixed(1));
});


onMounted(async () => {
	const targetId = props.listing.listingId;

	if (targetId) {
		try {
			const res = await ReviewService.findAllFromListing(targetId);
			reviews.value = res.data;
		} catch (err) {
			console.log(`Error retrieving reviews for ${targetId}: ${err.message}`);
		}
	}
});
</script>

<template>
	<RouterLink
			:to="{ name: 'listing', params: { id: listing.listingId || listing._id } }"
			class="group flex flex-col w-full max-w-sm bg-white dark:bg-[#121422] border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
	>
		<!-- Image -->
		<div class="w-full h-56 relative bg-linear-to-br from-[#517FFF] to-[#312AFF] shrink-0 overflow-hidden">
			<img
					v-if="listing.media?.[0]"
					:src="listing.media[0]"
					class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
					alt="Apartment Thumbnail"
			/>
			<div v-else class="absolute inset-0 flex items-center justify-center text-white/50">
				<span class="material-symbols-outlined text-5xl">image</span>
			</div>
		</div>

		<!-- Content -->
		<div class="p-5 flex flex-col gap-3 flex-1">
			<!-- Name -->
			<h2 class="font-bold text-xl leading-tight text-slate-900 dark:text-white group-hover:text-[#355AFF] transition-colors line-clamp-1">
				{{ listing.name }}
			</h2>

			<!-- Description -->
			<p class="italic text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
				{{ listing.description }}
			</p>

			<!-- Amenity Flairs -->
			<div v-if="displayedAmenities.length" class="flex flex-wrap items-center gap-1.5 mt-1">
        <span
						v-for="flair in displayedAmenities"
						:key="flair"
						class="px-2.5 py-1 bg-[#355AFF]/10 text-[#355AFF] dark:bg-[#355AFF]/20 dark:text-blue-300 border border-[#355AFF]/20 rounded-full text-xs font-medium whitespace-nowrap"
				>
          {{ flair }}
        </span>
				<span
						v-if="hiddenAmenitiesCount > 0"
						class="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-full text-xs font-bold"
				>
          +{{ hiddenAmenitiesCount }}
        </span>
			</div>

			<!-- Rating -->
			<div class="pt-3 mt-auto border-t border-slate-100 dark:border-slate-800/60">
				<CardRating
						:rating="overallRating"
						:reviewCount="fetchedReviewCount"
				/>
			</div>
		</div>
	</RouterLink>
</template>

<style scoped>
@reference "tailwindcss";

.material-symbols-outlined {
	font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>