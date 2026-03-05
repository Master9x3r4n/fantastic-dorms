<script setup>
import Divider from '@/components/divider/Divider.vue';
import FullReviewCard from '@/components/review-cards/FullReviewCard.vue';

import { reviewsData } from '@/assets/temp-data/reviews-temp.js';
import { computed } from 'vue';
 
const props = defineProps({
    id: {
		type: String,
		default: "1"
	}
})

const reviews = computed(() => reviewsData[props.id])

</script>

<template>
<div class="flex justify-center w-full dark:bg-[#121422] dark:text-white font-['Inter']">
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
            <template v-for="(i, index) in reviews" :key="i.id || index">
            <div>
                <FullReviewCard :reviewData="i">
                    <template #review-title>{{i.content.title}}</template>
                    <template #review-content>{{i.content.description}}</template>
                    <template v-if="i.content.reply" #ownerReply>{{ i.content.reply }}</template>
                    <template #score>{{ i.score }}</template>
                </FullReviewCard>
            </div>
            <Divider v-if="index != reviews.length - 1"/>
            </template>
        </div>
    </div>
</div>
</template>