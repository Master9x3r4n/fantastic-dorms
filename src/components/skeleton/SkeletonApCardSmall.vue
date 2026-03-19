<script setup>
import CardRating from '@/components/rating/CardRating.vue';  
import Skeleton from './Skeleton.vue';

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
        <Skeleton class="w-full h-5/12 rounded-t-[25px] absolute left-0 right-0 top-0" />

        <!-- 
        <div class=
        "w-full h-5/12 rounded-t-[25px] 
        absolute left-0 right-0 top-0
        bg-gradient">
            <img v-if="cardData.imageSrc" :src="cardData.imageSrc" class="w-full h-full rounded-t-[25px]">
        </div> -->

        <!-- Frame -->
       <div class=" absolute top-[45%] w-[90%] h-[50%] ">
            <!-- Upper Container -->
            <div class="h-[50%] flex flex-col justify-between">
                <!-- Apartment Name -->
                <Skeleton class="h-9 w-3/4 mb-1" />

                <!-- <div>
                    <h1 class="font-bold text-[32px] leading-10 dark:text-white hover:underline">   
                        <RouterLink :to="cardData.routerLink">{{ cardData.name }}</RouterLink>
                    </h1>
                </div> -->

                <!-- Apartment Description -->
                <div class="space-y-2">
                    <Skeleton class="h-5 w-full my-1" />
                    <Skeleton class="h-5 w-4/5" />
                </div>

                <!-- <div>
                    <p class="italic font-normal text-[20px] leading-6 dark:text-white">
                        {{ cardData.description }}
                    </p>
                </div> -->
            </div>

            <!-- Lower Review Container TODO: fix this -->
            <div class="h-[50%] flex justify-end items-end flex-col">
                <Skeleton class="h-5 w-24 my-1" />
                <Skeleton class="h-4 w-12" />
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
