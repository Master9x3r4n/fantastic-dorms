<script setup>
import { computed } from 'vue';

const props = defineProps({
	rating: {
		type: Number,
		default: 4,
	},
	reviewCount: {
		type: Number,
		default: 0
	}
});

// Format the rating to strictly show 1 decimal place (e.g., 4.0)
const formattedRating = computed(() => {
	return Number(props.rating).toFixed(1);
});

// Determine whether a star should be full, half, or empty based on its index (1 to 5)
const getStarType = (index) => {
	if (props.rating >= index) return 'full';
	if (props.rating >= index - 0.5) return 'half';
	return 'empty';
};
</script>

<template>
	<div class="flex items-center gap-3 md:gap-4 w-fit">

		<!-- Review Information -->
		<div class="flex flex-col text-right justify-center">
            <span class="font-bold text-xl md:text-2xl leading-none text-slate-900 dark:text-white transition-colors">
                {{ formattedRating }}
            </span>
			<span class="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1 whitespace-nowrap transition-colors">
                {{ reviewCount }} reviews
            </span>
		</div>

		<!-- Review Stars -->
		<div class="flex items-center text-[#355AFF]">
            <span
								v-for="i in 5"
								:key="i"
								class="material-symbols-outlined text-[24px] md:text-[28px] select-none"
								:class="{
                    'filled': getStarType(i) !== 'empty',
                    'opacity-30': getStarType(i) === 'empty'
                }"
						>
                {{ getStarType(i) === 'half' ? 'star_half' : 'star' }}
            </span>
		</div>

	</div>
</template>