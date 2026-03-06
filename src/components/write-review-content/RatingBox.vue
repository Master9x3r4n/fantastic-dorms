<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
	// v-model binding for the ratings object
	// Example: { cleanliness: 5, location: 4, communication: 0 }
	modelValue: {
		type: Object,
		required: true,
		default: () => ({})
	},
	// Optional: If omitted, the component will auto-calculate the average
	overallRating: {
		type: [Number, String],
		default: null
	}
});

const emit = defineEmits(['update:modelValue']);

// Local state for tracking mouse hover interactions
const hoverRatings = ref({});

// Auto-calculates the average rating if 'overallRating prop' is not provided
const displayOverallRating = computed(() => {
	if (props.overallRating !== null && props.overallRating !== undefined) {
		return props.overallRating;
	}

	const categories = Object.keys(props.modelValue);
	if (categories.length === 0) return "0.0";

	const sum = categories.reduce((total, key) => total + (props.modelValue[key] || 0), 0);
	return (sum / categories.length).toFixed(1);
});

// Emits the updated ratings object to the parent
const setRating = (category, star) => {
	const updatedRatings = { ...props.modelValue, [category]: star };
	emit('update:modelValue', updatedRatings);
};

// Handles the local hover state for the visual star fill
const setHover = (category, star) => {
	hoverRatings.value = { ...hoverRatings.value, [category]: star };
};
</script>

<template>
	<div class="bg-white dark:bg-[#121422] border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm transition-colors duration-200">

		<!-- Header -->
		<div class="flex justify-between items-center mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">
			<h2 class="text-xl font-bold text-slate-900 dark:text-white">Overall</h2>
			<div class="flex items-center text-[#355AFF] text-xl font-bold">
				<span class="material-symbols-outlined mr-1 filled">star</span>
				{{ displayOverallRating }}
			</div>
		</div>

		<!-- Rating Categories -->
		<div class="space-y-6">
			<div v-for="(val, category) in modelValue" :key="category">

				<!-- Category Label -->
				<div class="flex items-center mb-2">
					<span class="material-symbols-outlined text-[#355AFF] mr-2 text-[20px]">settings</span>
					<span class="text-sm font-medium text-slate-900 dark:text-white mr-2 capitalize">{{ category }}</span>
					<span class="material-symbols-outlined text-slate-400 dark:text-slate-500 text-[16px] cursor-help">info</span>
				</div>

				<!-- Interactive Stars -->
				<div class="flex gap-2">
          <span
							v-for="star in 5"
							:key="star"
							@click="setRating(category, star)"
							@mouseenter="setHover(category, star)"
							@mouseleave="setHover(category, 0)"
							class="material-symbols-outlined cursor-pointer text-[28px] transition-colors filled"
							:class="(hoverRatings[category] || modelValue[category]) >= star ? 'text-[#355AFF]' : 'text-slate-200 dark:text-slate-700'"
					>
            {{ (hoverRatings[category] || modelValue[category]) >= star ? 'star' : 'star_border' }}
          </span>
				</div>

			</div>
		</div>
	</div>
</template>

<style scoped>
.material-symbols-outlined.filled{
	font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>