<script setup>
import Skeleton from '../skeleton/Skeleton.vue';

</script>

<template>
    <div class="flex flex-col justify-center items-center 
    p-2 pb-4 gap-4.5 w-105.25 h-fit bg-white dark:bg-[#121422] dark:text-white">
        <!-- Header Container -->
        <div class="w-full flex justify-between items-center">
            <div class="flex gap-3 items-center">
                <!-- Profile -->
				<!-- <ProfileIcon :src="profile.profileImgSrc" size-class="w-13 h-13"></ProfileIcon> -->
                <Skeleton class="h-13 w-13 rounded-[50%]"/>
                
                <!-- Name -->
                <div>
                    <!-- <div class="font-medium text-[20px] leading-6">{{ profile.name }}</div>
                    <div class="font-normal leading-5 italic">{{ profile.reviewData.reviews.length }} Reviews</div> -->
                    <Skeleton class="h-5 w-32 mb-1"/>
                    <Skeleton class="h-4 w-18"/>
                </div>
            </div>

            <!-- Rating -->
            <div class="flex justify-between items-center w-3/12 px-2">
                <!-- <img src="@\assets\rating-assets\star-full.svg" width="28px"> -->
                <Skeleton class="w-8 h-8 rounded-2xl"/>
                <!-- <div class="font-bold text-3xl leading-10">{{ reviewData.rating.toFixed(1) }}</div> -->
                <Skeleton class="w-12 h-10 rounded-lg ml-2"/>
            </div>
        </div>

        <!-- Title Container -->
        <!-- <div class="w-full h-[14%] flex items-center font-bold leading-8 text-2xl">
             <slot name = "review-title">{{ reviewData.content.title }}</slot>
        </div> -->
        <Skeleton class="h-7 w-36 self-start"/>

        <!-- Comment Container -->
        <div class="h-[56%] flex flex-col">
            <!-- Review Container -->
            <div class="w-100 text-[16px] leading-6 grow flex flex-col justify-start">
                <!-- Review proper -->
                <Skeleton class="h-6 w-86 rounded-lg mb-1"/>
                <Skeleton class="h-6 w-72 rounded-lg mb-1"/>
                <Skeleton class="h-6 w-52 rounded-lg mb-1"/>
            </div>

            <!-- Reply Container -->
            <div class="w-full h-[50%] mt-3">
                <!-- <div class="bg-[#D9D9D9] dark:bg-[#111111] h-full rounded-3xl 
                flex flex-col justify-center items-center p-5 gap-1.25">
                    <div class="italic text-left w-full text-[14px] leading-6">
                        Reply from the owner
                    </div>
                    <div class="w-full text-[16px] leading-6">
                        <slot name="ownerReply"></slot>
                    </div>
                </div> -->
                <Skeleton class="h-24 w-100 rounded-3xl"/>
            </div>
        </div>

        <!-- Footer Container -->
        <div class="w-full h-[16%] flex justify-between items-center mt-1">
            <!-- Show More -->
            <Skeleton class="w-18 h-6 rounded-lg"/>

            <!-- Upvote -->
            <div class="italic font-normal text-[16px] leading-6 flex items-center justify-around gap-1.5">
                <Skeleton class="w-6 h-6 rounded-[40%]"/>
                <Skeleton class="w-6 h-6 rounded-[40%]"/>
                <Skeleton class="w-6 h-6 rounded-[40%]"/>
            </div>
        </div>

    </div>
</template>

<style scoped>

.bg-gradient {
    background: linear-gradient(99.9deg, #74b2fd 1.35%, #517FFF 99.48%);
}

</style>