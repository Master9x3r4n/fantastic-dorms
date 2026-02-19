<script setup>
import Divider from '@/components/divider/Divider.vue';
import FullReviewCard from '@/components/review-cards/FullReviewCard.vue';

import { reviewsData } from '@/assets/temp-data/reviews-temp.js';
import { computed } from 'vue';
 
const props = defineProps({
    id: {
		type: String,
		default: 1
	},
    reviewsy: {
        type: Array,
        default:[
        {
            content:{
                title: "Absolute Cinema",
                description: "Never have I ever found an apartment that makes me go \"ABSOLUTE CINEMA\"",
                reply: "Glad to hear that you were satisfied with our space! ^_^",
            },
            rating: 5.0,
            score: 123,
            reviewerProfile: {
                name: "MetaGuelTheta",
                count: 5
            },
        }, 
        {
            content:{
                title: "Laughter is the Best Medicine",
                description: "AHAHAHHHAHAHAHAHHAHAHAHAHAHHAHAHAHAHAHAHAHA",
                reply: "",
            },
            rating: 3.5,
            score: 64,
            reviewerProfile: {
                name: "Sofialoccocus",
                count: 42
            },
        }, 
        {
            content:{
                title: "Best for playing Gesnsh*t",
                description: "Skibi toilet go kys (keep yourself safe)",
                reply: "Lmao get rekt",
            },
            rating: 1.5,
            score: -69,
            reviewerProfile: {
                name: "Sussana Mogus",
                count: 12
            },
        }, 
        ]
    }
})

const reviews = computed(() => reviewsData[props.id])

</script>

<template>
<div class="flex justify-center w-full dark:bg-[#121422] dark:text-white">
    <div class="flex flex-col justify-around gap-4 m-7 w-fit">
        <!-- Body Header -->
        <div class="w-full flex justify-between items-center px-4.5">
            <!-- Search Result -->
            <div class="font-light text-[20px] italic leading-6">
                Found {{ reviews.length }} review<template v-if="reviews.length != 1">s</template>...
            </div>
        </div>

        <!-- Body Content -->
        <div class="h-fit w-full flex flex-col gap-6">
            <template v-for="(i, index) in reviews">
            <div>
                <FullReviewCard :rating="i.rating" :reviewer="i.reviewerProfile">
                    <template #review-title>{{i.content.title}}</template>
                    <template #review-content>{{i.content.description}}</template>
                    <template v-if="i.content.reply" #ownerReply>{{ i.content.reply }}</template>
                    <template #score>{{ i.score }}</template>
                </FullReviewCard>
            </div>
            <Divider v-if="index != reviews.length -1"/>
            </template>
        </div>
    </div>
</div>
</template>