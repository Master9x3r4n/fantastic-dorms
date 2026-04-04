<script setup>
import { computed } from 'vue';
import CardRating from '@/components/rating/CardRating.vue';

const props = defineProps({
	cardData: {
		type: Object,
		default: () => ({
			name: "Apartment Name",
			description: "This apartment is very nice. It has very nice rooms and is placed very nicely.",
			imageSrc: "",
			routerLink: "/listing",
			ratingData: {
				rating: 4,
				reviewCount: 32
			},
			amenities: []
		})
	}
})

// Configure how many amenities to show before truncating
const maxAmenities = 2;

const displayedAmenities = computed(() => {
	return props.cardData.amenities?.slice(0, maxAmenities) || [];
});

const hiddenAmenitiesCount = computed(() => {
	return Math.max(0, (props.cardData.amenities?.length || 0) - maxAmenities);
});
</script>

<template>
	<!-- Entire card acts as a link. Uses a responsive flex column on mobile, row on md+ -->
	<RouterLink
			:to="props.cardData.routerLink"
			class="group flex flex-col md:flex-row w-full bg-white dark:bg-[#121422] border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
	>
		<!-- Photo Section -->
		<div class="w-full md:w-5/12 relative bg-gradient-to-br from-[#517FFF] to-[#312AFF] min-h-[240px] md:min-h-[340px] shrink-0 overflow-hidden">
			<img
					v-if="props.cardData.imageSrc"
					:src="props.cardData.imageSrc"
					class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
					alt="Apartment Thumbnail"
			>
			<!-- Fallback if no image is provided -->
			<div v-else class="absolute inset-0 flex items-center justify-center text-white/50">
				<span class="material-symbols-outlined text-6xl">image</span>
			</div>
		</div>

		<!-- Content Section -->
		<div class="w-full md:w-7/12 p-6 md:p-8 flex flex-col justify-between">

			<!-- Upper Container: Text -->
			<div class="flex flex-col gap-3">
				<!-- Apartment Name -->
				<h2 class="font-bold text-2xl md:text-3xl leading-tight text-slate-900 dark:text-white group-hover:text-[#355AFF] transition-colors line-clamp-2">
					{{ props.cardData.name }}
				</h2>

				<!-- Apartment Description -->
				<p class="italic text-base md:text-lg text-slate-600 dark:text-slate-400 line-clamp-3">
					{{ props.cardData.description }}
				</p>
			</div>

			<!-- Lower Container: Flairs & Ratings -->
			<div class="mt-8 flex flex-col gap-5">

				<!-- Flairs Container -->
				<div class="flex flex-wrap items-center gap-2">
        <span
						v-for="flair in displayedAmenities"
						:key="flair"
						class="px-3 py-1.5 bg-[#355AFF]/10 text-[#355AFF] dark:bg-[#355AFF]/20 dark:text-blue-300 border border-[#355AFF]/20 rounded-full text-sm font-medium whitespace-nowrap"
				>
          {{ flair }}
        </span>

					<!-- Dynamic Remaining Flairs Badge -->
					<span
							v-if="hiddenAmenitiesCount > 0"
							class="flex items-center justify-center px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-full text-sm font-bold"
					>
          +{{ hiddenAmenitiesCount }}
        </span>
				</div>

				<!-- Footer: Rating & Action -->
				<div class="flex items-center justify-between pt-5 border-t border-slate-100 dark:border-slate-800/60 mt-1">
					<CardRating
							:rating="props.cardData.ratingData.rating"
							:reviewCount="props.cardData.ratingData.reviewCount"
					/>

					<!-- When hover turn blue -->
					<div class="hidden sm:flex items-center gap-1 text-[#355AFF] font-medium text-sm opacity-80 group-hover:opacity-100 transition-opacity">
						View details
						<span class="material-symbols-outlined text-[18px]">arrow_forward</span>
					</div>
				</div>

			</div>
		</div>
	</RouterLink>
</template>

<style scoped>
@reference "tailwindcss";

.material-symbols-outlined {
	font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>