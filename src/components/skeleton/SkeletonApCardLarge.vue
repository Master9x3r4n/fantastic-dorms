<script setup lang="ts">
import Skeleton from './Skeleton.vue';

</script>

<template>
    <!-- 3x W 0.8x H -->
    <div class=
    "h-86 w-304 rounded-[25px] 
    p-0 shadow-2xl relative
    bg-white flex flex-row items-center dark:bg-[#111111]">
        <!-- Photo h-40%-->
        <!-- <div class=
        "h-full w-5/12 rounded-l-[25px] 
        absolute left-0 bottom-0 top-0
        bg-gradient flex items-center justify-center">
            <img v-if="props.cardData.imageSrc" :src="props.cardData.imageSrc" 
            class="h-full w-full rounded-l-[25px]">
        </div> -->
        <Skeleton class="h-full w-5/12 rounded-l-[25px] absolute left-0 bottom-0 top-0" />

        <!-- Frame -->
       <div class=" absolute right-8 w-[36%] h-[80%] flex flex-col">
            <!-- Upper Container -->
            <div class="flex flex-col justify-start text-right items-end gap-6 grow">
                <!-- Apartment Name -->
                <Skeleton class="h-8 w-3/4" />
                <!-- <div>
                    <h1 class="font-bold text-[32px] leading-10 dark:text-white hover:underline">
                        <RouterLink :to="props.cardData.routerLink">{{ props.cardData.name }}</RouterLink>
                    </h1>
                </div> -->

                <!-- Apartment Description -->
                <!-- <div class="h-[60%]">
                    <p class="italic font-normal text-[20px] leading-6 dark:text-white">
                        {{ props.cardData.description }}
                    </p>
                </div> -->

                <div class="space-y-2 w-full flex flex-col justify-start items-end">
                    <Skeleton class="h-5 w-full my-1" />
                    <Skeleton class="h-5 w-4/5" />
                    <Skeleton class="h-5 w-2/5" />
                </div>
            </div>

            <!-- Flairs Container -->
            <div class="h-[20%] flex justify-end items-center gap-3 pr-1">
                <!-- Apartment Flairs -->
                <!-- <template v-for="i in ['❄️ Air Conditioning', '❤️‍🔥 Heating']">
                    <div class="bg-[#355AFF] p-2.5 rounded-4xl text-white 
                    flex items-center justify-cente h-10">
                        {{ i }}
                    </div>
                </template> -->
                <!-- <div class="bg-[#355AFF] p-2.5 rounded-[50%] text-white 
                flex items-center justify-center h-10 w-10">
                    +3
                </div> -->
                <Skeleton class="rounded-4xl h-9 w-48"/>
                <Skeleton class="rounded-4xl h-9 w-32"/>
                <Skeleton class="rounded-[50%] h-9 w-9"/>
            </div>

            <!-- Lower Review Container -->
            <div class="h-[20%] flex justify-center items-end flex-col">
                <!-- <CardRating 
                :rating="props.cardData.ratingData.rating" 
                :reviewCount="props.cardData.ratingData.reviewCount"/> -->
                <Skeleton class="h-5 w-32 my-1" />
                <Skeleton class="h-4 w-20" />
            </div>
       </div>
    </div>
</template>