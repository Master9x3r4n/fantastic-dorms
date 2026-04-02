<script setup>
import { computed } from 'vue'

const props = defineProps({
	currentPage: {
		type: Number,
		required: true
	},
	totalPages: {
		type: Number,
		required: true
	}
})

const emit = defineEmits(['update:page'])

const setPage = (page) => {
	if (page >= 1 && page <= props.totalPages) {
		emit('update:page', page)
	}
}

// Dynamically calculate which pages to show (max 5 visible buttons at a time)
const displayedPages = computed(() => {
	const maxVisible = 5;
	const pages = [];

	let start = Math.max(1, props.currentPage - Math.floor(maxVisible / 2));
	let end = Math.min(props.totalPages, start + maxVisible - 1);

	// Adjust start if we're near the end
	if (end - start + 1 < maxVisible) {
		start = Math.max(1, end - maxVisible + 1);
	}

	for (let i = start; i <= end; i++) {
		pages.push(i);
	}

	return pages;
})
</script>

<template>
	<div class="flex flex-row justify-center items-center h-[37px] gap-[5px]">

		<!-- Previous Page Button -->
		<button
				class="w-[15px] h-[16.15px] flex items-center justify-center focus:outline-none hover:opacity-80 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
				@click="setPage(currentPage - 1)"
				:disabled="currentPage <= 1"
		>
			<svg width="15" height="17" viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg" class="-rotate-90">
				<path d="M7.5 0L14.8612 16.15H0.138784L7.5 0Z" fill="#355AFF"/>
			</svg>
		</button>

		<!-- Dynamic Page Numbers -->
		<button
				v-for="page in displayedPages"
				:key="page"
				@click="setPage(page)"
				class="flex flex-col justify-center items-center min-w-[28.37px] px-2 h-[37px] rounded-[10px] text-[16px] font-bold leading-[19px] transition-colors duration-200"
				:class="[
        currentPage === page
          ? 'bg-[#355AFF] text-white'
          : 'text-[#BFBFBF] hover:text-[#355AFF] hover:bg-gray-100 dark:hover:bg-slate-800'
      ]"
		>
			{{ page }}
		</button>

		<!-- Next Page Button -->
		<button
				class="w-[15px] h-[16px] flex items-center justify-center focus:outline-none hover:opacity-80 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
				@click="setPage(currentPage + 1)"
				:disabled="currentPage >= totalPages"
		>
			<svg width="15" height="17" viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg" class="rotate-90">
				<path d="M7.5 0L14.8612 16.15H0.138784L7.5 0Z" fill="#355AFF"/>
			</svg>
		</button>

	</div>
</template>

<style scoped>
button {
	font-family: 'Inter', sans-serif;
}
</style>