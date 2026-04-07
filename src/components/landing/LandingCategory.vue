<script setup>
import { ref, computed } from 'vue'
import ListingCardSmall from '../apartment-cards/ListingCardSmall.vue';
import Carousel from '../carousel/Carousel.vue';
import FilterButton from '../page-buttons/FilterButton.vue';

const props = defineProps({
	filterItems: {
		type: Array,
		default: () => ['De La Salle University', 'University of Santo Tomas']
	},
	listings: {
		type: Array,
		default: () => []
	}
});

// Holds the currently active filter strings
const selectedItems = ref([]);

// Dynamically filters the listings based on active FilterButtons
const filteredListings = computed(() => {
	// If no filters are selected, show everything
	if (selectedItems.value.length === 0) {
		return props.listings;
	}

	// Otherwise, check if the listing contains at least ONE of the selected filters
	return props.listings.filter(listing => {
		// Create a giant searchable string from the listing's relevant data
		const searchString = `
            ${listing.name || ''}
            ${listing.description || ''}
			${listing.owner || ''}
            ${listing.address || ''}
            ${(listing.amenities || []).join(' ')}
        `.toLowerCase();

		// Return true if ANY selected item is found in the search string
		return selectedItems.value.some(item => searchString.includes(item.toLowerCase()));
	});
});
</script>

<template>
	<div class="flex flex-col w-full gap-4 md:gap-5">

		<!-- Category Header Text -->
		<div class="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
			<slot name="text">Find homes near your university</slot>
		</div>

		<!-- Scrollable Filter Buttons -->
		<div class="flex items-center justify-start gap-3 overflow-x-auto hide-scrollbar pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
			<template v-for="item in props.filterItems" :key="item">
				<FilterButton
						v-model="selectedItems"
						:value="item"
				>
					{{ item }}
				</FilterButton>
			</template>
		</div>

		<!-- Carousel Container -->
		<div v-if="filteredListings.length > 0" class="w-full flex justify-start -mx-4 px-4 sm:mx-0 sm:px-0 pb-4">
			<Carousel buttonStyling="small circular" :buttonSpacing="2">
				<template #content>
					<template v-for="listing in filteredListings" :key="listing.listingId || listing._id">
						<!-- Responsive width: 85vw on mobile, fixed px on larger screens -->
						<div class="pr-4 shrink-0 snap-start w-[85vw] sm:w-87.5 md:w-100">
							<ListingCardSmall :listing="listing" />
						</div>
					</template>
				</template>
			</Carousel>
		</div>

		<!-- Empty State -->
		<div v-else class="flex flex-col items-center justify-center py-20 text-center bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 mt-4">
			<span class="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 mb-4">real_estate_agent</span>
			<h2 class="text-xl font-bold text-slate-900 dark:text-white mb-2">No properties found</h2>
			<p class="text-slate-500 dark:text-slate-400 max-w-md">Try selecting different filters to see more results.</p>
		</div>

	</div>
</template>

<style scoped>
/* Hide scrollbar for webkit browsers */
.hide-scrollbar::-webkit-scrollbar {
	display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.hide-scrollbar {
	-ms-overflow-style: none;  /* IE and Edge */
	scrollbar-width: none;  /* Firefox */
}
</style>