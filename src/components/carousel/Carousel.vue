<script setup>
import CarouselScrollButton from './CarouselScrollButton.vue';
import { ref, onMounted, onUnmounted, nextTick } from 'vue';

const props = defineProps({
	buttonSpacing: {
		type: Number,
		default: 6
	},
	buttonStyling: {
		type: String,
		default: "small circular"
	}
});

const carouselContent = ref(null);
const scrollStart = ref(true);
const scrollEnd = ref(false);

const getFirstItem = () =>
		carouselContent.value?.querySelector(':scope > * > *');

const scroll = (direction) => {
	const carousel = carouselContent.value;
	if (!carousel) return;

	const firstItem = getFirstItem();
	const scrollAmount = firstItem ? firstItem.offsetWidth : carousel.clientWidth;

	carousel.scrollBy({
		left: direction === 'left' ? -scrollAmount : scrollAmount,
		behavior: 'smooth'
	});
};

const updateScrollButtons = () => {
	const carousel = carouselContent.value;
	if (!carousel) return;

	scrollStart.value = carousel.scrollLeft <= 10;
	scrollEnd.value =
			Math.ceil(carousel.scrollLeft + carousel.clientWidth) >= carousel.scrollWidth - 10;
};

onMounted(() => {
	const carousel = carouselContent.value;
	if (!carousel) return;

	nextTick(() => updateScrollButtons());
	carousel.addEventListener('scroll', updateScrollButtons, { passive: true });
	window.addEventListener('resize', updateScrollButtons);

	// Re-check buttons whenever slot content is added or removed
	const observer = new MutationObserver(() => {
		nextTick(() => updateScrollButtons());
	});
	observer.observe(carousel, { childList: true, subtree: true });

	// Store for cleanup
	carousel._observer = observer;
});

onUnmounted(() => {
	const carousel = carouselContent.value;
	if (carousel) {
		carousel.removeEventListener('scroll', updateScrollButtons);
		carousel._observer?.disconnect();
	}
	window.removeEventListener('resize', updateScrollButtons);
});
</script>

<template>
	<div class="relative w-full h-full group/carousel">
		<div
				ref="carouselContent"
				class="overflow-x-auto overflow-y-hidden hide-scrollbar flex snap-x snap-mandatory w-full h-full scroll-smooth"
		>
			<slot name="content" />
		</div>

		<div v-show="!scrollStart"
				 class="absolute left-0 top-1/2 -translate-y-1/2 z-10 -translate-x-1/2 opacity-0 group-hover/carousel:opacity-100
				 transition-opacity duration-300">
			<CarouselScrollButton
					direction="left"
					:spacing="props.buttonSpacing"
					:adjust="props.buttonStyling"
					@click="scroll('left')"
			/>
		</div>

		<div v-show="!scrollEnd"
				 class="absolute right-0 top-1/2 -translate-y-1/2 z-10 translate-x-1/2 opacity-0 group-hover/carousel:opacity-100
				 transition-opacity duration-300">
			<CarouselScrollButton
					direction="right"
					:spacing="props.buttonSpacing"
					:adjust="props.buttonStyling"
					@click="scroll('right')"
			/>
		</div>
	</div>
</template>

<style scoped>
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar {
	-ms-overflow-style: none;
	scrollbar-width: none;
}
</style>