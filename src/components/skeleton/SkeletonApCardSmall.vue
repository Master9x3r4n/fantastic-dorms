<script setup>
import CardRating from '@/components/rating/CardRating.vue';  

const props = defineProps({
    cardData: {
        type: Object,
        default: {
            name: "Apartment Name",
            description: "This apartment is very nice. It has very nice rooms and is placed very nicely.",
            imageSrc: "",
            routerLink: "/listing",
            ratingData: {
                rating: 4,
                reviewCount: 32
            }
        }
    }
})

</script>

<template>
    <div class=
    "h-86 w-110 rounded-[25px] 
    p-0 shadow-2xl relative
    bg-white flex flex-col items-center dark:bg-[#111111]">
        <!-- Photo h-40%-->
        <div class="w-full h-5/12 rounded-t-[25px] absolute left-0 right-0 top-0 
        bg-gray-200 dark:bg-gray-700 animate-pulse"></div>

        <!-- Frame -->
       <div class=" absolute top-[45%] w-[90%] h-[50%] ">
            <!-- Upper Container -->
            <div class="h-[50%] flex flex-col justify-between">
                <!-- Apartment Name -->
                <div class="h-10 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>

                <!-- Apartment Description -->
                <div class="space-y-2">
                    <div class="h-5 w-full bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse my-2"></div>
                    <div class="h-5 w-4/5 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
                </div>
            </div>

            <!-- Lower Review Container TODO: fix this -->
            <div class="h-[50%] flex justify-end items-end flex-col">
                <div class="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
                <div class="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
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
