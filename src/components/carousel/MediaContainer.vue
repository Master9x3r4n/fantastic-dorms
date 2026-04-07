<script setup>
const props = defineProps({
	src: {
		type: String,
		default: ""
	},
	alt: {
		type: String,
		default: "media"
	},
	size: {
		type: String,
		default: "large"
	},
	objectFit: {
		type: String,
		default: "cover"
	}
})

const objectFitClass = {
	cover: 'object-cover',
	contain: 'object-contain',
	fill: 'object-fill',
}
</script>

<template>
	<div class="flex justify-center items-center rounded-3xl overflow-hidden"
			 :class="[!props.src ? 'bg-gradient' : '', props.size]">
		<a v-if="props.src" :href="props.src" target="_blank" class="contents">
			<img :src="props.src" :alt="props.alt"
					 :class="['w-full h-full', objectFitClass[props.objectFit] ?? 'object-cover']" />
		</a>
		<span v-else class="material-symbols-outlined text-white/50 text-6xl">image</span>
	</div>
</template>

<style scoped>
@reference "tailwindcss";

.bg-gradient {
	background: linear-gradient(97.79deg, #355AFF -0.78%, #2C0ED6 100%);
}

.full  { @apply w-full h-full; }
.large { @apply w-185 h-107.5; }
.wide  { @apply w-185 h-84; }
.medium { @apply size-67; }
.small  { @apply size-24; }
</style>