<script setup>
import { ref } from 'vue';
import Divider from '@/components/divider/Divider.vue';
import FullReviewCard from '@/components/review-cards/FullReviewCard.vue';
import ReviewService from '../services/ReviewService.js';

const props = defineProps({
    id: { type: String, default: null }
})

const reviews = ref([]);
if (props.id) {
    ReviewService.find(props.id)
        .then(res => {
            reviews.value.push(res.data);
        })
        .catch(err => {
            console.log(`Error retrieving review with ID ${props.id}: ${err.message}`);
        });
} else {
    ReviewService.findAll()
        .then(res => {
            reviews.value = res.data;
        })
        .catch(err => {
            console.log(`Error retrieving reviews: ${err.message}`);
        });
}
</script>

<template>
	<div class="flex justify-center w-full dark:bg-[#121422] dark:text-white font-['Inter']">
		<div class="flex flex-col justify-around gap-4 m-7 w-full max-w-300">
			<div class="w-full flex justify-between items-center px-4.5">
				<div v-if="reviews.length > 1">
					<div class="font-light text-[20px] italic leading-6">
						Found {{ reviews.length }} review<template v-if="reviews.length !== 1">s</template>...
					</div>
				</div>
			</div>

			<div class="h-fit w-full flex flex-col gap-6">
				<template v-for="(i, index) in reviews" :key="i._id || index">
					<div>
						<FullReviewCard :review="i" />
					</div>
					<Divider v-if="index !== reviews.length - 1"/>
				</template>
			</div>
		</div>
	</div>
</template>