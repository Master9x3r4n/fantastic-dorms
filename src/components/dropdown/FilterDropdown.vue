<script setup>
import { ref, watch, computed } from 'vue';
import Dropdown from '@/components/dropdown/Dropdown.vue';
import BlueButton from '@/components/page-buttons/BlueButton.vue';

const emit = defineEmits(['update:filters']);

const props = defineProps({
	listings: {
		type: Array,
		default: () => []
	},
	maxAmenities: {
		type: Number,
		default: 8
	}
});

const filters = ref({
	minRating: 0,
	amenities: []
});

// Count frequency of each amenity across current search results
const availableAmenities = computed(() => {
	const frequency = {};

	props.listings.forEach(listing => {
		(listing.amenities || []).forEach(amenity => {
			frequency[amenity] = (frequency[amenity] || 0) + 1;
		});
	});

	return Object.entries(frequency)
			.sort((a, b) => b[1] - a[1])        // sort by popularity descending
			.slice(0, props.maxAmenities)        // take top N
			.map(([amenity]) => amenity)         // return just the name
			.sort();                             // alphabetize the final list
});

watch(filters, (newFilters) => {
	emit('update:filters', { ...newFilters });
}, { deep: true });

watch(availableAmenities, (newAmenities) => {
	filters.value.amenities = filters.value.amenities.filter(
			selected => newAmenities.includes(selected)
	);
});

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

					<div v-if="availableAmenities.length > 0" class="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
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