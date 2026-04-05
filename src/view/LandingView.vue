<script setup>
import { ref, computed } from 'vue';
import SearchBar from '@/components/header/SearchBar.vue';
import LandingCategory from '@/components/landing/LandingCategory.vue';
import ListingService from '../services/ListingService.js';

const listings = ref(null);
ListingService.findAll()
	.then(res => {
		listings.value = res.data;
	})
	.catch(error => {
		console.log(`Error retrieving listings: ${error.message}.`);
	});

const universityFilters = [
	"De La Salle University", "University of Santo Thomas",
	"University of the Philippines - Diliman", "Ateneo De Manila University"
]

const topAmenities = computed(() => {
	if (!listings.value) return [];

	const frequency = {};
	listings.value.forEach(listing => {
		(listing.amenities || []).forEach(amenity => {
			frequency[amenity] = (frequency[amenity] || 0) + 1;
		});
	});

	return Object.entries(frequency)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 8)
			.map(([amenity]) => amenity)
			.sort();
});
</script>

<template>
<div class="flex flex-col justify-around gap-8 w-full h-fit font-['Inter']">
	<!-- Hero Section -->
	<div class="w-full h-113 bg-blue-200 dark:bg-[#121422] flex justify-end">
		<div class="h-full w-[80%] bg-gradient dark:dg-gradient flex flex-col items-end text-right text-white gap-2">
			<div class="mr-12 mt-14 w-[64%]">
				<!-- Main text -->
				<div class="text-6xl leading-20">
					We find homes <span class="underline italic font-bold">fantastic</span> for you!
				</div>
				<!-- Subtext -->
				<div class=" text-2xl leading-7 mt-5">
					Find the best fitting apartments and condominiums for you, rated by 
					<span class="underline italic">students just like you!</span>
				</div>
			</div>

			<!-- Search bar -->
			<div class="flex justify-end w-full h-full relative mt-5 mr-12">
        <SearchBar type="alt"/>
			</div>		
		</div>

	</div>

	<!-- Main Section -->
	<div class="w-full h-fit flex flex-col gap-10 justify-start px-12 pb-4">
		<!-- First Category -->
		<LandingCategory :filterItems="universityFilters" :listings="listings"/>
 
		<!-- Second Category -->
		<LandingCategory :filterItems="topAmenities" :listings="listings">
			<template #text>
				Find homes of a certain type
			</template>
		</LandingCategory>
	</div>

</div>
</template>

<style scoped>

.bg-gradient {
	background: linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, #355AFF 27.7%);
}

.dg-gradient {
	background: linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, #121422 27.7%);
}

</style>


