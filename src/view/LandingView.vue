<script setup>
import { ref } from 'vue';
import SearchBar from '@/components/header/SearchBar.vue';
import LandingCategory from '@/components/landing/LandingCategory.vue';
import ListingService from '../services/ListingService.js';

// const props = defineProps({
//     searchResults: {
//         type: Array,
//         default: [
//         {
//             name: "Grand Apartment", 
//             description: "A very grand, beautiful, and luxurious apartment that features multiple rooms and doors. A must stay for the holidays.",
//             ratingData: {
//                 rating: 4.5,
//                 reviewCount: 124,
//             },
// 			routerLink: "/listing/1",
//             imageSrc: "https://youre.outof.games/media/uploads/cb/da/cbda1bb4-ee0d-4c65-989f-05a24edd22cf/daily-bugle-featured-location.jpg"
//         },
//         {
//             name: "The Baxter Suite",
//             description: "Inspired by the heroes of the Fantastic Four, this beautiful deluxe suite features 4 bedrooms and a visit from Galactus. It's Fantastic.",
//             ratingData: {
//                 rating: 4,
//                 reviewCount: 44, 
//             },
// 			routerLink: "/listing/2",
//             imageSrc: "https://static0.cbrimages.com/wordpress/wp-content/uploads/2020/09/rsz-baxter-buildingv1.jpg"
//         },
//         {
//             name: "Miro's House",
//             description: "Freshly doxxed, Miro's house is a beautiful home that features Miro.",
//             ratingData: {
//                 rating: 3.5,
//                 reviewCount: 67,
//             },
// 			routerLink: "/listing/3",
//             imageSrc: "https://static.wikitide.net/peppafanonwiki/thumb/e/ee/Peppa%27s_house_updated.webp/800px-Peppa%27s_house_updated.webp.png"
//         },
//         ]
//     }
// })

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

const homeTypes = [
	"Studio", "1 bedroom", "2 bedrooms", "Dormitory"
]

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
		<LandingCategory :filterItems="homeTypes" :listings="listings">
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


