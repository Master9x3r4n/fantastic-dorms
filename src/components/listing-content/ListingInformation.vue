<script setup>
import MediaContainer from '../carousel/MediaContainer.vue';
import Divider from '../divider/Divider.vue';
import Icon from '../icon/Icon.vue';

const props = defineProps({
    listingData: {
        type: Object,
        default: {
            amenities: ['2 Bedrooms', '2 Bathrooms', '3 Dining Rooms', '10 Living Rooms'],
            contacts: ['Facebook', 'Instagram']
        }
    }
})

</script>

<template>
<div class="flex flex-col justify-around items-center gap-5 mb-2 dark:text-white">
    <!-- Apartment Header -->
    <div class="w-full flex flex-col gap-6">
        <!-- Profile -->
        <div class="flex flex-col">
            <div class="font-bold text-3xl leading-10 flex items-center">
                <slot name="listing-name">Apartment Name</slot>
            </div>
            <div class="italic flex items-center">
                <slot name="listing-address">Studio apartment - Awesome St., Barangay Big Love, Pasay City</slot>
            </div>
        </div>

        <!-- Profile -->
        <div class="flex gap-3">
            <div class="w-13 h-13 rounded-[50%] bg-amber-100 bg-gradient"></div>
            <div class="flex flex-col gap-0.5">
                <div class="font-medium text-[20px] leading-6">
                    <slot name="listing-owner">Really Cool Apartments</slot>
                </div>
                <div class="font-normal leading-5 italic text-[#355AFF] flex justify-start items-center gap-1">
                    <Icon name="verified"/> 
                    Verified
                </div>
            </div>
        </div>
    </div>

    <!-- Listing Description -->
    <template v-if="$slots.description">
        <Divider/>
        <div class="leading-5 flex center italic w-full">
            <slot name="description"></slot>
        </div>
    </template>

    <!-- Amenities -->
    <Divider/>
    <div class="flex flex-col h-fit max-h-54 w-full">
        <div class="sub-heading">Amenities</div>
        <ul class="flex flex-col flex-wrap gap-4 h-[70%]">
             <li v-for="i in props.listingData.amenities">ℹ️ {{ i }}</li>
        </ul>
    </div>

    <!-- Location -->
    <Divider/>
    <div class="w-full">
        <div class="sub-heading">Location</div>
        <MediaContainer size="wide" src="https://cdn.britannica.com/06/276306-049-A8451874/world-map.jpg"/>
    </div>

    <!-- Contact -->
    <Divider/>
    <div class="w-full">
        <div class="sub-heading">Contact</div>
        <div>
            <ul class="flex flex-col gap-4">
                <li v-for="i in props.listingData.contacts">
                    ℹ️ {{ i }}
                </li>
            </ul>
        </div>
    </div>
</div>
</template>

<style scoped>
@reference "tailwindcss";

.sub-heading {
    @apply font-semibold text-[24px] leading-8 mb-5
}

</style>