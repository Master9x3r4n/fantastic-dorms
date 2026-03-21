<script setup>
import { ref } from 'vue';
import Divider from '@/components/divider/Divider.vue';
import FullReviewCard from '@/components/review-cards/FullReviewCard.vue';
import ReviewService from '../services/ReviewService.js';
import ReviewTag from "@/components/write-review-content/ReviewTag.vue";

const props = defineProps({
    id: { type: String, default: null }
})

const reviews = ref([]);
if (props.id) {
    ReviewService.get(props.id)
        .then(res => {
            console.log(`Review with ID ${props.id}:`);
            console.log(res.data);
            reviews.value.push(res.data);
        })
        .catch(error => {
            console.log(`Error retrieving review with ID ${props.id}: ${error.message}`);
        });
} else {
    ReviewService.getAll()
        .then(res => {
            console.log(`Reviews:`);
            console.log(res.data);
            reviews.value = res.data;
        })
        .catch(error => {
            console.log(`Error retrieving reviews: ${error.message}`);
        });
}
</script>

<template>
<div class="flex justify-center w-full dark:bg-[#121422] dark:text-white font-['Inter']">
    <div class="flex flex-col justify-around gap-4 m-7 w-fit">
        <!-- Body Header -->
        <div class="w-full flex justify-between items-center px-4.5">
            <!-- Search Result -->
            <div v-if="reviews.length > 1">
                <div class="font-light text-[20px] italic leading-6">
                    Found {{ reviews.length }} review<template v-if="reviews.length !== 1">s</template>...
                </div>
            </div>
        </div>

        <!-- Body Content -->
        <div class="h-fit w-full flex flex-col gap-6">
            <template v-for="(i, index) in reviews" :key="i.id">
            <div>
                <FullReviewCard :review="i">
                    <template #review-title>{{i.content.title}}</template>
                    <template #review-content>{{i.content.description}}</template>
                    <template #review-tags><ReviewTag :tags="i.tags"  tags=""/></template>
                    <template v-if="i.content.reply" #ownerReply>{{ i.content.reply }}</template>
                    <template #score>{{ i.score }}</template>
                </FullReviewCard>
            </div>
            <Divider v-if="index !== reviews.length - 1"/>
            </template>
        </div>
    </div>
</div>
</template>