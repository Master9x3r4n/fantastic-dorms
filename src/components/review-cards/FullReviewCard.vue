<script setup>
import Carousel from '../carousel/Carousel.vue';
import MediaContainer from '../carousel/MediaContainer.vue';
import ThumbsButton from '../thumbs-buttons/ThumbsButton.vue';

import { computed } from 'vue';
import { profileData } from '@/assets/temp-data/profile-temp.js';
import ProfileIcon from "@/components/profile/ProfileIcon.vue";
import ReviewTag from "@/components/write-review-content/ReviewTag.vue";

const props = defineProps({
	reviewData: {
		type: Object,
		default: () => ({
			username: "casey_c",
			content: {
				"title": "Title of Review",
				"description": "",
				"reply": ""
			},
			rating: 4,
			score: 0,
			mediaSrcs: [],
			tags: ["Fantastic", "Review"],
		}),
	}
})

const profile = computed(() => profileData[props.reviewData.username]);
</script>

<template>
	<div class="bg-white dark:bg-[#121422] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-6 transition-colors duration-200">

		<div class="flex justify-between items-start mb-4">
			<RouterLink :to="{name: 'profile', params: {id: reviewData.username}}" class="hover:opacity-80 transition-opacity">
				<div class="flex items-center gap-3">
					<div class="w-12 h-12 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
						<ProfileIcon :src="profile?.profileImgSrc" sizeClass="w-full h-full" iconSize="text-[24px]!"></ProfileIcon>
					</div>
					<div>
						<h3 class="font-bold text-slate-900 dark:text-white">{{ profile?.name || reviewData.username }}</h3>
						<p class="text-sm text-slate-500 dark:text-slate-400 italic">{{ profile?.reviewData?.reviews?.length || 0 }} Reviews</p>
					</div>
				</div>
			</RouterLink>

			<div class="flex items-center text-[#355AFF] text-2xl font-bold">
				<span class="material-symbols-outlined text-[28px]! mr-1 filled">star</span>
				{{ reviewData.rating.toFixed(1) }}
			</div>
		</div>

		<h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-3 wrap-break-word">
			<slot name="review-title">{{ reviewData.content.title }}</slot>
		</h2>

		<div class="text-slate-800 dark:text-slate-300 mb-6 wrap-break-word min-h-16 editor-output">
			<slot name="review-content">
				{{ reviewData.content.description || "I have stayed at this apartment for a while, and let me say, it is as the name says..." }}
			</slot>
		</div>

		<slot name="review-tags">
			<ReviewTag :tags="reviewData.tags"></ReviewTag>
		</slot>

		<div class="my-6 h-[47%] flex w-full justify-center items-center">
			<Carousel :count="4" buttonStyling="small circular" :buttonSpacing="4">
				<template #content>
					<template v-for="i in 10">
						<div class="flex shrink-0 snap-start pl-2 pr-2">
							<MediaContainer size="medium" class="border-2 border-dashed border-slate-400 dark:border-slate-200"/>
						</div>
					</template>
				</template>
			</Carousel>
		</div>

		<div v-if="$slots.ownerReply" class="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 rounded-xl p-4 mb-6">
			<p class="text-sm italic text-slate-500 dark:text-slate-400 mb-2">Reply from the owner</p>
			<div class="text-slate-800 dark:text-slate-300">
				<slot name="ownerReply"></slot>
			</div>
		</div>

		<div class="flex items-center gap-4 text-slate-500 dark:text-slate-400">
			<ThumbsButton direction="up"/>
			<span class="text-sm font-medium"><slot name="score">{{ reviewData.score }}</slot></span>
			<ThumbsButton direction="down"/>
		</div>

	</div>
</template>