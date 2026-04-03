<script setup>
import { computed } from 'vue';

const props = defineProps({
	// holy JS is so bad sometimes something is an array, THE OTHER TIMES IT'S AN OBJECT>????
	rating: {
		type: [Object, Array],
		default: () => ({
			cleanliness: 0,
			comfort: 0,
			communication: 0,
			location: 0
		})
	}
});

// 1. Safely extract the rating object whether it was passed as an Array or Object
const ratingData = computed(() => {
	if (Array.isArray(props.rating) && props.rating.length > 0) {
		return props.rating[0];
	}
	return props.rating || {};
});

// 2. Define exactly which categories we care about (ignoring _id, name, value, etc.)
const validCategories = ['cleanliness', 'comfort', 'communication', 'location'];

// 3. Calculate the overall rating average strictly from the 4 specific categories
const overallRating = computed(() => {
	let sum = 0;
	let count = 0;

	for (const category of validCategories) {
		// Check if the category exists in the data to avoid NaN errors
		if (ratingData.value[category] !== undefined && ratingData.value[category] !== null) {
			sum += Number(ratingData.value[category]);
			count++;
		}
	}

	if (count === 0) return "0.0";
	return (sum / count).toFixed(1);
});

// 4. Format ONLY the allowed categories into an iterable array for the template
const formattedRatings = computed(() => {
	return validCategories.map(category => {
		// Fallback to 0 if the data is missing a specific category
		const score = ratingData.value[category] !== undefined ? Number(ratingData.value[category]) : 0;

		return {
			// Capitalize the first letter (e.g., "cleanliness" -> "Cleanliness")
			name: category.charAt(0).toUpperCase() + category.slice(1),
			score: score.toFixed(1)
		};
	});
});
</script>

<template>
	<div class="bg-white dark:bg-[#121422] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-6
  w-full max-w-[420px] flex flex-col gap-5 transition-colors duration-200">

		<!-- Header Container -->
		<div class="flex items-center justify-between">
			<h3 class="font-bold text-2xl text-slate-900 dark:text-white">Overall</h3>

			<div class="flex items-center gap-2 text-[#355AFF] font-bold text-3xl">
				<span class="material-symbols-outlined text-[32px]! filled">star</span>
				<span>{{ overallRating }}</span>
			</div>
		</div>

		<!-- Divider -->
		<hr class="border-slate-200 dark:border-slate-700/60 my-1" />

		<!-- Attributes -->
		<div class="flex flex-col gap-4">
			<div
					v-for="item in formattedRatings"
					:key="item.name"
					class="flex items-center justify-between text-slate-700 dark:text-slate-300"
			>
				<!-- Attribute Name -->
				<div class="flex items-center gap-3">
					<span class="material-symbols-outlined text-[24px]! text-slate-400 dark:text-slate-500">star</span>
					<span class="text-xl font-medium">{{ item.name }}</span>
				</div>

				<!-- Rating -->
				<div class="flex items-center gap-2 font-semibold text-xl">
					<span class="material-symbols-outlined text-[24px]! text-[#355AFF] filled">star</span>
					<span class="w-10 text-right">{{ item.score }}</span>
				</div>
			</div>
		</div>

	</div>
</template>