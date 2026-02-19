<script setup>
import MediaContainer from '../carousel/MediaContainer.vue';
import ThumbsButton from '../thumbs-buttons/ThumbsButton.vue';

const props = defineProps({
    reviewData: {
        type: Object,
        default: 
        {
            reviewerProfile: {
                "name": "chud student 1",
                "username": "",
                "profileImageSrc": "",
                "count": 67
            },
            content: {
                "title": "Title of Review",
                "description": "",
                "reply": ""
            },
            rating: 4,
            score: 0,
            mediaSrcs: []
        },
    },
    routeId: {
        type: Number,
        default: 1
    }
})

</script>

<template>
    <div class="flex flex-col justify-center items-center 
    p-2 pb-4 gap-4.5 w-105.25 h-fit bg-white dark:bg-[#121422] dark:text-white">
        <!-- Header Container -->
        <div class="w-full flex justify-between items-center">
            <RouterLink :to="{name: 'profile', params: {id: reviewData.reviewerProfile.username}}">
            <div class="flex gap-3 items-center">
                <!-- Profile -->
                <div class="w-13 h-13 rounded-[50%] bg-amber-100 bg-gradient">
                    <img :src="reviewData.reviewerProfile.profileImageSrc" width="52px" class="w-13 h-13 rounded-[50%]" 
                    v-if="reviewData.reviewerProfile.profileImageSrc">
                </div>
                
                <!-- Name -->
                <div>
                    <div class="font-medium text-[20px] leading-6">{{ reviewData.reviewerProfile.name }}</div>
                    <div class="font-normal leading-5 italic">{{ reviewData.reviewerProfile.count }} Reviews</div>
                </div>
            </div>
            </RouterLink>

            <!-- Rating -->
            <div class="flex justify-between items-center w-3/12 px-2">
                <img src="@\assets\rating-assets\star-full.svg" width="28px">
                <div class="font-bold text-3xl leading-10">{{ reviewData.rating.toFixed(1) }}</div>
            </div>
        </div>

        <!-- Title Container -->
        <div class="w-full h-[14%] flex items-center font-bold leading-8 text-2xl">
            <slot name = "review-title">{{ reviewData.content.title }}</slot>
        </div>

        <!-- Comment Container -->
        <div class="h-[56%] flex flex-col">
            <!-- Review Container -->
            <div class="w-full text-[16px] leading-6 grow flex">
                <!-- Review proper -->
                <div>
                    <slot name="review">
                        I have stayed at this apartment for a while, and let me say, it is as the name says. 
                        It's a really cool apartment and it has a lot of the amenities 
                        that a student would want from...
                    </slot>
                </div>

                <!-- Media -->
                <div class="shrink-0 ml-2 relative">
                    <div class="absolute bg-white dark:bg-[#111111] p-auto pl-1 rounded-full size-6 top-16 right-2 text-[14px] dark:text-white">+3</div>
                    <MediaContainer size="small"/>
                </div>

            </div>

            <!-- CHANGE THIS TO CONDITIONAL SLOTTING -->
            <template v-if="$slots.ownerReply"> 
            <!-- Reply Container -->
            <div class="w-full h-[50%] mt-3">
                <div class="bg-[#D9D9D9] dark:bg-[#111111] h-full rounded-3xl 
                flex flex-col justify-center items-center p-5 gap-1.25">
                    <div class="italic text-left w-full text-[14px] leading-6">
                        Reply from the owner
                    </div>
                    <div class="w-full text-[16px] leading-6">
                        <slot name="ownerReply"></slot>
                    </div>
                </div>
            </div>
            </template>
        </div>

        <!-- Footer Container -->
        <div class="w-full h-[16%] flex justify-between items-center mt-1">
            <!-- Show More -->
            <div class="font-semibold underline text-[16px] leading-6">
                <RouterLink :to="'/reviews/'+routeId">Show More</RouterLink>
            </div>

            <!-- Upvote -->
            <div class="italic font-normal text-[16px] leading-6 flex items-center justify-around gap-2">
                <ThumbsButton direction="up"/>
                <div>{{ reviewData.score }}</div>
                <ThumbsButton direction="down"/>
            </div>
        </div>

    </div>
</template>

<style scoped>

.bg-gradient {
    background: linear-gradient(99.9deg, #74b2fd 1.35%, #517FFF 99.48%);
}

</style>