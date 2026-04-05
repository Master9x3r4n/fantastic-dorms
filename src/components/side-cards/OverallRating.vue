<script setup>
import { computed } from 'vue';

const props = defineProps({
	rating: {
		type: Object,
		default: () => ({
			cleanliness: 0,
			comfort: 0,
			communication: 0,
			location: 0
		})
	}
});

const validCategories = ['cleanliness', 'comfort', 'communication', 'location'];

const overallRating = computed(() => {
	const sum = validCategories.reduce((acc, category) => {
		return acc + Number(props.rating?.[category] ?? 0);
	}, 0);

	return (sum / validCategories.length).toFixed(1);
});

const formattedRatings = computed(() => {
	return validCategories.map(category => ({
		name: category.charAt(0).toUpperCase() + category.slice(1),
		score: Number(props.rating?.[category] ?? 0).toFixed(1)
	}));
});
</script>

<template>
	<div class="bg-white dark:bg-[#121422] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-6
  w-full max-w-105 flex flex-col gap-5 transition-colors duration-200">

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