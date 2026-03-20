<script setup>
import { ref } from 'vue';
import Carousel from '../carousel/Carousel.vue';
import MediaContainer from '../carousel/MediaContainer.vue';
import ThumbsButton from '../thumbs-buttons/ThumbsButton.vue';
import ProfileIcon from "@/components/profile/ProfileIcon.vue";
import ProfileService from '../../services/ProfileService.js';

const props = defineProps({ review: {} });

const profile = ref(null);
ProfileService.get(props.review.username)
    .then(res => {
        console.log('Profile:');
        console.log(res.data);
        profile.value = res.data;
    })
    .catch(error => {
        console.log(`Error retrieving profile \'${props.review.username}\': ${error.message}`)
    });

</script>

<template>
    <!-- 1120 x 769 h-228 -->
    <div class="w-max-295 h-fit p-10 flex flex-col items-center justify-center gap-6.5
    bg-white dark:bg-[#121422] dark:text-white w-full rounded-lg border border-solid border-slate-200 shadow-sm transition-colors duration-200 dark:border-slate-700">
        <!-- Header Container -->
        <div class="w-full flex justify-between items-center ">
            <RouterLink :to="{name: 'profile', params: {id: review.username}}">
            <div v-if="profile">
                <div class="flex gap-3 items-center">
                    <!-- Profile -->
                    <ProfileIcon :src="profile.picture" size-class="w-13 h-13"></ProfileIcon>

                    <!-- Name -->
                    <div>
                        <div class="font-medium text-[20px] leading-6">{{ profile.name.firstName }} {{ profile.name.lastName }}</div>
                        <!-- <div class="font-normal leading-5 italic">{{ profile.reviewData.reviews.length }} Reviews</div> -->
                        <div class="font-normal leading-5 italic">(-) Reviews</div>
                    </div>
                </div>
            </div>
            </RouterLink>

            <!-- Rating -->
            <div class="flex justify-between items-center w-[8%] text-center">
                <img src="@\assets\rating-assets\star-full.svg" width="36px">
                <!-- <div class="font-bold text-3xl leading-10">{{ (review.score/4).toFixed(1) }}</div> -->
                <div class="font-bold text-3xl leading-10">{{ review.score.toFixed(1) }}</div>
            </div>
        </div>

        <!-- Title Container -->
        <div class="w-full h-[8%] flex items-center font-bold leading-8 text-4xl pl-2 pr-2">
            <slot name = "review-title">Title of Review</slot>
        </div>

        <!-- Comment Container -->
        <div class="flex flex-col justify-center grow gap-4 w-286 m-0">
            <!-- Review Container -->
            <div class="w-[99%] text-[20px] leading-6 grow pl-3 pr-3">
                <slot name="review-content">
                    I have stayed at this apartment for a while, and let me say, it is as the name says. 
                    It's a really cool apartment and it has a lot of the amenities 
                    that a student would want from...
                </slot>
            </div>

            <!-- Carousel Container -->
            <div class="mt-3 h-[47%] flex w-full justify-center items-center">
                <Carousel :count="4" buttonStyling="large" :buttonSpacing="4">
                <template #content>
                    <template v-for="i in 10">
                        <div class="flex shrink-0 snap-start pl-2 pr-2">
                            <MediaContainer size="medium"/>
                        </div>
                    </template>
                </template>
                </Carousel>
            </div>

            <!-- Reply Container -->
            <div v-if="$slots.ownerReply && $slots.ownerReply !== ''" class="w-full h-[23%] mt-3 pl-2 pr-2">
                <div class="bg-[#D9D9D9] dark:bg-[#111111] h-full rounded-3xl
                flex flex-col justify-start items-center p-5.5 gap-1.25">
                    <div class="italic text-left w-full text-[14px] leading-6">
                        Reply from the owner
                    </div>
                    <div class="w-full text-[16px] leading-6">
                        <slot name="ownerReply"></slot>
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer Container -->
        <div class="w-full h-[7%] flex justify-start items-center pl-2 pr-2">
            <!-- Upvote -->
            <div class="italic font-normal text-[16px] leading-6 flex items-center justify-around gap-2">
                <ThumbsButton direction="up"/>
                <div><slot name="score">0</slot></div>
                <ThumbsButton direction="down"/>
            </div>
        </div>

    </div>

</template>