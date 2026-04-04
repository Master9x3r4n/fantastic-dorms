<script setup>
import { ref, watch, onMounted } from 'vue';
import Dropdown from '@/components/dropdown/Dropdown.vue';
import BlueButton from '@/components/page-buttons/BlueButton.vue';
import ListingService from '@/services/ListingService.js';

const emit = defineEmits(['update:filters']);


const filters = ref({
	minRating: 0,
	amenities: []
});

// Changed from a hardcoded array to a reactive ref
const availableAmenities = ref([]);
const isLoadingAmenities = ref(true);

// Fetch listings and extract unique amenities
onMounted(async () => {
	try {
		const response = await ListingService.findAll();
		const listings = response.data;

		const uniqueAmenities = new Set();

		// Loop through all listings and add their amenities to the Set (which prevents duplicates)
		listings.forEach(listing => {
			if (listing.amenities && Array.isArray(listing.amenities)) {
				listing.amenities.forEach(amenity => uniqueAmenities.add(amenity));
			}
		});

		// Convert Set back to an array and sort it alphabetically
		availableAmenities.value = Array.from(uniqueAmenities).sort();
	} catch (error) {
		console.error("Error fetching amenities for filters:", error.message);
	} finally {
		isLoadingAmenities.value = false;
	}
});

// Watch for changes and emit to parent (SearchView)
watch(filters, (newFilters) => {
	emit('update:filters', { ...newFilters });
}, { deep: true });

const resetFilters = () => {
	filters.value.minRating = 0;
	filters.value.amenities = [];
};
</script>

<template>
	<Dropdown>
		<template #trigger>
			<BlueButton class="shrink-0 shadow-sm px-5 py-2.5">
				<span class="material-symbols-outlined text-[20px] text-white">tune</span>
				<span class="font-semibold text-white">Filter</span>
			</BlueButton>
		</template>

		<template #content>
			<div class="w-64 flex flex-col gap-6 p-2">

				<!-- Minimum Rating Slider -->
				<div class="flex flex-col gap-2">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Minimum Rating: {{ filters.minRating }}+
          </span>
					<input
							type="range"
							min="0" max="5" step="0.5"
							v-model.number="filters.minRating"
							class="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#355AFF]"
					/>
				</div>

				<!-- Dynamic Amenities Filter -->
				<div class="flex flex-col gap-3">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Amenities
          </span>

					<div v-if="isLoadingAmenities" class="flex items-center justify-center py-4">
						<span class="w-5 h-5 border-2 border-[#355AFF]/30 border-t-[#355AFF] rounded-full animate-spin"></span>
					</div>

					<div v-else-if="availableAmenities.length > 0" class="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
						<label
								v-for="amenity in availableAmenities"
								:key="amenity"
								class="flex items-center gap-3 cursor-pointer group"
						>
							<input
									type="checkbox"
									:value="amenity"
									v-model="filters.amenities"
									class="w-4 h-4 rounded border-slate-300 accent-[#355AFF] focus:ring-[#355AFF] dark:bg-slate-800 dark:border-slate-600"
							/>
							<span class="text-sm text-slate-700 dark:text-slate-300 group-hover:text-[#355AFF] transition-colors truncate">
                {{ amenity }}
              </span>
						</label>
					</div>

					<div v-else class="text-sm text-slate-500 dark:text-slate-400 italic">
						No amenities available.
					</div>
				</div>

				<button
						@click="resetFilters"
						class="text-xs text-[#355AFF] hover:underline font-medium text-left mt-2"
				>
					Reset all filters
				</button>
			</div>
		</template>
	</Dropdown>
</template>

<style scoped>
@reference "tailwindcss";

/* Custom scrollbar for the amenities list if it gets too long */
.custom-scrollbar::-webkit-scrollbar {
	width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
	background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
	@apply bg-slate-300 dark:bg-slate-600 rounded-full;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
	@apply bg-slate-400 dark:bg-slate-500;
}
</style>