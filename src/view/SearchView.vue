<script setup>
import ApartmentCardLarge from '@/components/apartment-cards/ApartmentCardLarge.vue';

import { useRoute } from 'vue-router';
import {computed} from 'vue';

const props = defineProps({
    searchResults: {
        type: Array,
        default: [
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
})

const route = useRoute();
const searchQuery = computed(() => route.query.q);

</script>

<template>
<div class="flex justify-center w-full font-['Inter']">
    <div class="flex flex-col justify-around gap-8 m-7 w-fit">
        <!-- Body Header -->
        <div class="w-full flex justify-between items-center px-2">
            <!-- Search Result -->
            <div class="font-light text-[20px] italic leading-6 dark:text-white">Found {{ searchResults.length }} results for “{{ searchQuery }}”</div>

            <!-- Filter Button -->
            <div class="flex justify-center items-center py-1 px-3.75 border-2 rounded-[40px]
            leading-5 text-[#355AFF] border-[#355AFF]">
                ⏬ Filter
            </div>
        </div>

        <!-- Body Content -->
        <div class="h-fit w-full flex flex-col gap-8">
            <template v-for="i in searchResults">
            <div>
            <ApartmentCardLarge :cardData="i"/>
            </div>
            </template>
        </div>
    </div>
</div>
</template>