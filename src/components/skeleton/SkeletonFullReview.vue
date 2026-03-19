<script setup lang="ts">
import Skeleton from './Skeleton.vue';

</script>

<template>
    <!-- 1120 x 769 h-228 -->
    <div class="w-max-295 h-fit p-5 flex flex-col items-center justify-center gap-6.5 animate-pulse
    bg-white dark:bg-[#121422] dark:text-white w-full rounded-lg border border-solid border-slate-200 shadow-sm transition-colors duration-200 dark:border-slate-700">
        <!-- Header Container -->
        <div class="w-full flex justify-between items-center ">
            <div class="flex gap-3 items-center">
                <!-- Profile -->
				<!-- <ProfileIcon :src="profile.profileImgSrc" size-class="w-13 h-13"></ProfileIcon> -->
                <Skeleton class="w-13 h-13 rounded-[50%]"/>

                <!-- Name -->
                <div>
                    <!-- <div class="font-medium text-[20px] leading-6">lorem ipsum</div>
                    <div class="font-normal leading-5 italic">6 Reviews</div> -->
                    <Skeleton class="h-5 w-32 mb-1"/>
                    <Skeleton class="h-4 w-18"/>
                </div>
            </div>

            <!-- Rating -->
            <div class="flex justify-between items-center w-[8%] text-center">
                <!-- <img src="@\assets\rating-assets\star-full.svg" width="36px"> -->
                <!-- <div class="font-bold text-3xl leading-10">4.0</div> -->
                <Skeleton class="w-10 h-10 rounded-2xl"/>
                <Skeleton class="w-12 h-10 rounded-lg ml-2"/>
            </div>
        </div>

        <!-- Title Container -->
        <!-- <div class="w-full h-[8%] flex items-center font-bold leading-8 text-4xl pl-2 pr-2">
            <slot name = "review-title">Title of Review</slot>
        </div> -->
        <Skeleton class="h-8 w-64 self-start"/>

        <!-- Comment Container -->
        <div class="flex flex-col justify-center grow gap-4 w-286 m-0">
            <!-- Review Container -->
            <div class="w-[99%] text-[20px] leading-6 grow pl-3 pr-3">
                <!-- <slot name="review-content">
                    I have stayed at this apartment for a while, and let me say, it is as the name says. 
                    It's a really cool apartment and it has a lot of the amenities 
                    that a student would want from...
                </slot> -->
                <Skeleton class="h-6 w-266 rounded-lg mb-2"/>
                <Skeleton class="h-6 w-252 rounded-lg mb-2"/>
                <Skeleton class="h-6 w-232 rounded-lg mb-2"/>
            </div>

            <!-- Carousel Container -->
            <div class="mt-3 h-[47%] flex w-full justify-center items-center">
                <template v-for="i in 4">
                    <Skeleton class="w-67 h-67 rounded-2xl mx-2"/>
                </template>
            </div>

            <!-- Reply Container -->
            <Skeleton class="h-32 w-full rounded-3xl"/>
        </div>

        <!-- Footer Container -->
        <div class="w-full h-[7%] flex justify-start items-center pl-2 pr-2">
            <!-- Upvote -->
            <div class="italic font-normal text-[16px] leading-6 flex items-center justify-around gap-2">
                <Skeleton class="w-7 h-7 rounded-[40%]"/>
                <Skeleton class="w-7 h-7 rounded-[40%]"/>
                <Skeleton class="w-7 h-7 rounded-[40%]"/>
            </div>
        </div>

    </div>

</template>