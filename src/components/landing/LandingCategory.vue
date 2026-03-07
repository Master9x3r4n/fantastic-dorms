<script setup>
import ApartmentCardSmall from '../apartment-cards/ApartmentCardSmall.vue';
import Carousel from '../carousel/Carousel.vue';
import FilterButton from '../page-buttons/FilterButton.vue';

import {ref} from 'vue'

const props = defineProps({
    filterItems: {
        type: Array,
        default: ['De La Salle University', 'University of Coolness']
    },
    searchResults: {
        type: Array,
        default: []
    },
    cardResults: {
        type: Array,
        default: [{
            name: "Apartment Name",
            description: "This apartment is very nice. It has very nice rooms and is placed very nicely.",
            imageSrc: "",
            routerLink: "/listing",
            ratingData: {
                rating: 4,
                reviewCount: 32
            },
            imageSrc: "",
        }]
    }
})

const selectedItems = ref([])

</script>

<template>
<div class="h-fit flex flex-col w-full gap-3">
    <!-- Text -->
    <div class="italic text-[20px] leading-6 font-normal py-2 dark:text-white">
        <slot name="text">Find homes near your university</slot>
    </div>

    <!-- Filters -->
    <div class="flex items-center justify-start gap-3 overflow-x-scroll hide-scrollbar pb-2">
        <template v-for="i in props.filterItems">
            <FilterButton v-model="selectedItems" :value="i">{{ i }}</FilterButton>
        </template>
    </div>

    <!-- Carousel Container-->
    <div class="h-fit w-full flex justify-start">
        <Carousel :count="5" buttonStyling="small circular" :buttonSpacing="1">
            <template #content>
            <template v-for="i in props.cardResults">
                <div class="px-3 flex shrink-0 snap-start">
                <ApartmentCardSmall :cardData="i"/>
                </div>
            </template>
            </template>
        </Carousel>
    </div>
</div>
</template>

<style scoped>

/* hide scrollbar for webkit browsers */
.hide-scrollbar::-webkit-scrollbar {
    display: none;
}

/* hide scrollbar for others */
.hide-scrollbar {
    -ms-overflow-style: none;  
    scrollbar-width: none;  
}

</style>