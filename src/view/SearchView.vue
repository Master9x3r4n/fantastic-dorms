<script setup>
import ApartmentCardLarge from '@/components/apartment-cards/ApartmentCardLarge.vue';
import BlueButton from "@/components/page-buttons/BlueButton.vue";
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const props = defineProps({
	searchResults: {
		type: Array,
		default: () => [
			{
				name: "Grand Apartment",
				description: "A very grand, beautiful, and luxurious apartment that features multiple rooms and doors. A must stay for the holidays.",
				ratingData: {
					rating: 4.5,
					reviewCount: 124,
				},
				imageSrc: "https://youre.outof.games/media/uploads/cb/da/cbda1bb4-ee0d-4c65-989f-05a24edd22cf/daily-bugle-featured-location.jpg",
				routerLink: "/listing/1",
			},
			{
				name: "The Baxter Suite",
				description: "Inspired by the heroes of the Fantastic Four, this beautiful deluxe suite features 4 bedrooms and a visit from Galactus. It's Fantastic.",
				ratingData: {
					rating: 4,
					reviewCount: 44,
				},
				imageSrc: "https://static0.cbrimages.com/wordpress/wp-content/uploads/2020/09/rsz-baxter-buildingv1.jpg",
				routerLink: "/listing/2",
			},
			{
				name: "Miro's House",
				description: "Freshly doxxed, Miro's house is a beautiful home that features Miro.",
				ratingData: {
					rating: 3.5,
					reviewCount: 67,
				},
				imageSrc: "https://static.wikitide.net/peppafanonwiki/thumb/e/ee/Peppa%27s_house_updated.webp/800px-Peppa%27s_house_updated.webp.png",
				routerLink: "/listing/3",
			},
		]
	}
});

const route = useRoute();
// Added a fallback just in case the query is empty
const searchQuery = computed(() => route.query.q || "apartments");
</script>

<template>
	<div class="min-h-screen w-full bg-white dark:bg-[#121422] transition-colors duration-200 font-['Inter']">
		<div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

			<!-- Header Section -->
			<div class="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
				<div class="flex flex-col">
					<h1 class="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
						Search Results
					</h1>
					<p class="text-slate-500 dark:text-slate-400 mt-1 text-sm md:text-base">
						Found {{ searchResults.length }} results for <span class="font-semibold text-[#355AFF]">"{{ searchQuery }}"</span>
					</p>
				</div>

				<!-- Filter Button -->
				<BlueButton class="shrink-0 shadow-sm px-5 py-2.5">
					<span class="material-symbols-outlined text-[20px] text-white">tune</span>
					<span class="font-semibold text-white">Filter</span>
				</BlueButton>
			</div>

			<!-- Body Content -->
			<div v-if="searchResults.length > 0" class="flex flex-col gap-6 md:gap-8">
				<template v-for="(item, index) in searchResults" :key="index">
					<ApartmentCardLarge :cardData="item"/>
				</template>
			</div>

			<!-- Empty State -->
			<div v-else class="flex flex-col items-center justify-center py-20 text-center bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 mt-4">
				<span class="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 mb-4">search_off</span>
				<h2 class="text-xl font-bold text-slate-900 dark:text-white mb-2">No results found</h2>
				<p class="text-slate-500 dark:text-slate-400 max-w-md">We couldn't find any apartments matching "{{ searchQuery }}". Try adjusting your search or using different filters.</p>
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