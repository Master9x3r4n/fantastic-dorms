<script setup>
const props = defineProps({
	direction: {
		type: String,
		default: "left"
	},
	spacing: {
		type: Number,
		default: 5
	},
	adjust: {
		type: String,
		default: "small"
	}
})
</script>

<template>
	<button
			class="border-none rounded-full flex justify-center items-center font-bold p-0 text-white shadow-lg relative cursor-pointer"
			:style="{ [direction === 'left' ? 'marginLeft' : 'marginRight']: `${spacing * 0.25}rem` }"
			:class="props.adjust"
	>
		<span class="material-symbols-outlined block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-md select-none">
			{{ direction === 'left' ? 'chevron_left' : 'chevron_right' }}
		</span>
	</button>
</template>

<style scoped>
@reference "tailwindcss";

.circular {
	@apply bg-blue-500 hover:bg-blue-600 transition-colors;
}

.small {
	width: 28px;
	height: 28px;
	@apply text-xl;
}

.large {
	width: 48px;
	height: 48px;
	@apply text-3xl;
}
</style>