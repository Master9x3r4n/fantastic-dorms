<script setup>
import Skeleton from './Skeleton.vue';

</script>

<template>
    <div class="flex flex-col justify-center items-center 
    p-10 gap-3.75 w-105.25 h-79.25 border-3 rounded-3xl
    border-[#BFBFBF] bg-white dark:bg-[#111111] dark:border-[#111111] dark:text-white animate-pulse">
        <!-- Header Container -->
        <div class="h-12 w-full font-bold text-3xl leading-10 
        flex items-center justify-between">
            <!-- Overall -->
            <Skeleton class="h-10 w-32 rounded-2xl"/>

            <!-- Rating -->
            <div class="flex justify-between items-center w-3/12">
                <!-- <img src="@\assets\rating-assets\star-full.svg" width="32px"> -->
                <Skeleton class="h-8 w-8 rounded-2xl"/>
                <Skeleton class="w-11 h-7"/>
            </div>

        </div>

        <!-- Divider -->
        <div class="border-b-2 w-full border-[#BFBFBF] animate-pulse">
        </div>

        <!-- Attributes -->
        <template v-for="i in 4">
            <div class="w-full text-2xl leading-7 flex items-center justify-between">
                <!-- Attribute Name -->
                <div class="flex gap-3 items-center">
                    <!-- <img src="@\assets\rating-assets\star-empty.svg" width="24px"> -->
                    <Skeleton class="w-6 h-6 rounded-lg"/>
                    <Skeleton class="h-5 w-34"/>
                </div>

                <!-- Rating -->
                <div class="flex justify-around items-center w-[25%]">
                    <!-- <img src="@\assets\rating-assets\star-full.svg" width="24px"> -->
                    <Skeleton class="w-6 h-6 rounded-lg"/>
                    <Skeleton class="w-12 h-5"/>
                </div>
            </div>
        </template>

    </div>
</template>