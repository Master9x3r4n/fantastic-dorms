<script setup>
import { ref } from 'vue';
import CardRating from '@/components/rating/CardRating.vue';  

const props = defineProps({
    listing: {
        type: Object,
        default: {}
    }
})

const reviewCount = ref(null);
// do some magic

</script>

<template>
    <!-- <div class=
        "h-86 w-110 rounded-[25px] 
        p-0 shadow-2xl relative
        bg-white flex flex-col items-center dark:bg-[#111111]"
    > -->
    <div class=
        "h-86 w-110 rounded-[25px] p-0 relative
        flex flex-col items-center bg-white dark:bg-[#111111] shadow-2xl"
    >
        <!-- Photo h-40%-->
        <div class="w-full h-5/12 rounded-t-[25px] absolute left-0 right-0 top-0 bg-gradient">
        <!-- <div class="w-full h-[30%] rounded-t-[25px] absolute left-0 right-0 top-0 bg-gradient"> -->
            <img 
                v-if="listing.media[0]"
                :src="listing.media[0]"
                class="w-full h-full rounded-t-[25px]"
            >
        </div>

        <!-- Frame -->
        <!-- <div class="absolute top-[45%] w-[90%] h-[60%] flex flex-col"> -->
        <div class="absolute top-[45%] w-[90%] h-fit flex flex-col">
            <!-- Upper Container -->
            <div class="h-[50%] flex flex-col justify-between gap-4">
                <!-- Apartment Name -->
                <div>
                    <h1 class="font-bold text-[32px] leading-10 dark:text-white hover:underline">   
                        <RouterLink :to="{ name: 'listing', params: { id: listing.listingId } }">{{ listing.name }}</RouterLink>
                    </h1>
                </div>

                <!-- Apartment Description -->
                <div class="h-20 italic font-normal text-[20px] leading-6 dark:text-white overflow-hidden text-ellipsis">
                    {{ listing.description }}
                </div>
            </div>

            <!-- Lower Review Container -->
            <div class="h-[50%] flex justify-end items-end gap-6">
                <CardRating 
                :rating="4" 
                :reviewCount="reviewCount"/>
            </div>
       </div>
    </div>
</template>

<style scoped>
.bg-gradient {
    background: linear-gradient(99.9deg, #517FFF 1.35%, #312AFF 99.48%);
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}
</style>
