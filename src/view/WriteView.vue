<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import ToggleButton from "@/components/page-buttons/ToggleButton.vue"
import ProfileIcon from "@/components/profile/ProfileIcon.vue";
import RatingBox from "@/components/write-review-content/RatingBox.vue";
import TextEditor from "@/components/write-review-content/TextEditor.vue";
import Carousel from "@/components/carousel/Carousel.vue";
import MediaContainer from "@/components/carousel/MediaContainer.vue";
import UploadBox from "@/components/write-review-content/UploadBox.vue";

// User info props
const props = defineProps({
	user: {
		type: Object,
		default: () => ({
			name: "Elizabeth Schuyler",
			icon: "https://i.pinimg.com/1200x/ac/74/75/ac7475f4aff36679126b4128b6f0f3bc.jpg",
			reviewCount: 0,
		})
	},
	listing: {
		type: Object,
		default: () => ({
			name: "A Little Place In Harlem",
			isVerified: true,
		})
	}
})

// Previous Page button
const router = useRouter();

const goBack = () => {
	router.back();
};

// Form State
const isAnonymous = ref(false);
const reviewTitle = ref('');
const reviewContent = ref('');
const isCertified = ref(false);

// Uploaded Files
const uploadedPhotos = ref([]);
const previewUrls = ref([]);

// Ratings State
const ratings = ref({
	cleanliness: 0,
	accuracy: 0,
	communication: 0,
	location: 0
});

// Tags State
const tags = ref([]);
const currentTag = ref('');

// Computed Overall Rating
const overallRating = computed(() => {
	const values = Object.values(ratings.value);
	const sum = values.reduce((acc, val) => acc + val, 0);
	const activeCount = values.filter(val => val > 0).length;

	if (activeCount === 0) return '0.0';
	return (sum / activeCount).toFixed(1);
});

// Methods

const addTag = () => {
	const tag = currentTag.value.trim();
	if (tag && !tags.value.includes(tag)) {
		tags.value.push(tag);
	}
	currentTag.value = '';
};

const removeTag = (tagToRemove) => {
	tags.value = tags.value.filter(tag => tag !== tagToRemove);
};

const submitReview = () => {
	if (!isCertified.value) {
		alert("Please certify that your review is genuine.");
		return;
	}
	console.log("Submitting review:", {
		isAnonymous: isAnonymous.value,
		title: reviewTitle.value,
		content: reviewContent.value,
		ratings: ratings.value,
		tags: tags.value
	});
};

// Watch for any changes to the imageFiles array
watch(uploadedPhotos, (newFiles) => {
	// 1. CLEANUP: Revoke all existing URLs before creating new ones
	previewUrls.value.forEach(url => {
		// Only revoke if it's a blob URL (in case you mix local files with server URLs)
		if (typeof url === 'string' && url.startsWith('blob:')) {
			URL.revokeObjectURL(url)
		}
	})

	// 2. GENERATE: Create new URLs for the current state of the array
	previewUrls.value = newFiles.map(file => {
		if (file instanceof File) {
			return URL.createObjectURL(file)
		}
		return file // Fallback for existing server image URLs
	})
}, { deep: true }) // deep: true ensures we catch array mutations

// 3. FINAL CLEANUP: Prevent memory leaks when navigating away from this component
onBeforeUnmount(() => {
	previewUrls.value.forEach(url => {
		if (typeof url === 'string' && url.startsWith('blob:')) {
			URL.revokeObjectURL(url)
		}
	})
})
</script>

<template>
	<div class="bg-white dark:bg-[#121422] text-slate-900 dark:text-white min-h-screen p-6 md:p-8 transition-colors duration-200 font-['Inter']">
		<div class="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">

			<!-- Left Column: Form -->
			<div class="flex-1 w-full max-w-2xl">
				<button class="flex items-center text-sm text-slate-500 dark:text-slate-400 hover:text-[#355AFF]
											 dark:hover:text-[#355AFF] transition-colors mb-6 border border-slate-200 dark:border-slate-700 rounded-md
											 px-3 py-1.5 bg-white dark:bg-[#121422] shadow-sm"
								@click="goBack"
				>
					<span class="material-symbols-outlined text-[16px] mr-1">arrow_back</span>
					Back to previous page
				</button>

				<h1 class="text-3xl font-bold mb-2 text-slate-900 dark:text-white">Write a Review</h1>
				<p class="text-sm text-slate-500 dark:text-slate-400 mb-6">
					<!-- Yes I know we don't have community guidelines, heck we don't even have a terms and conditions -->
					In creating a review, make sure that your review does not violate our <a class="text-[#355AFF] hover:underline">Community Guidelines</a>.
				</p>

				<div class="mb-6 flex items-center">
					<span class="text-sm text-slate-500 dark:text-slate-400 mr-2">You are creating a review for</span>
					<span class="flex items-center font-semibold text-slate-900 dark:text-white">
            <span v-if="props.listing.isVerified" class="material-symbols-outlined dark-filled text-[#355AFF] dark:text-white mr-1 text-[18px]">verified</span>
            {{ props.listing.name }}
          </span>
				</div>

				<!-- Anonymous Toggle -->
				<div class="mb-6 bg-white dark:bg-[#121422] p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm transition-colors duration-200">
					<div class="flex items-center justify-between mb-2">
						<div>
							<h3 class="font-semibold text-slate-900 dark:text-white text-sm">Post as Anonymous</h3>
							<p class="text-xs text-slate-500 dark:text-slate-400">Your name and profile picture will not be shown in the review.</p>
						</div>
						<ToggleButton v-model="isAnonymous"></ToggleButton>
					</div>
					<div class="flex items-center mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 transition-colors">
						<div class="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-full mr-3 flex items-center justify-center overflow-hidden">
							<ProfileIcon v-if="!isAnonymous" :src="props.user.icon" alt="user img" size-class="w-full h-full"></ProfileIcon>
							<span v-else class="material-symbols-outlined text-slate-400 text-sm">person_off</span>
						</div>
						<span class="text-sm text-slate-500 dark:text-slate-400">
              Post as <span class="font-medium text-slate-900 dark:text-white">{{ isAnonymous ? 'Anonymous' : props.user.name }}</span>
            </span>
					</div>
				</div>

				<!-- Main Form -->
				<form @submit.prevent="submitReview" class="space-y-6">

					<!-- Title -->
					<div>
						<label class="block text-sm font-medium text-slate-900 dark:text-white mb-1" for="title">Review Title <span class="text-red-500">*</span></label>
						<input
								v-model="reviewTitle"
								type="text"
								id="title"
								placeholder="Enter title here"
								class="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#121422] px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-[#355AFF] focus:outline-none focus:ring-1 focus:ring-[#355AFF] placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm transition-colors"
								required
						/>
						<p class="mt-1 text-xs text-slate-500 dark:text-slate-400">Make sure the title is relevant to your review.</p>
					</div>

					<!-- Ratings Box -->
					<RatingBox v-model="ratings"
										 :overallRating="overallRating"
					/>

					<!-- Tags -->
					<div>
						<label class="block text-sm font-medium text-slate-900 dark:text-white mb-1" for="tags">Tags</label>
						<p class="text-xs text-slate-500 dark:text-slate-400 mb-2">Make sure to add tags that support your review. As you type, similar tags will be suggested.</p>
						<div class="flex gap-2 mb-3">
							<div class="relative flex-1">
                <span class="absolute inset-y-0 left-0 flex items-center pl-3">
                  <span class="material-symbols-outlined text-slate-400 text-[18px]">search</span>
                </span>
								<input
										v-model="currentTag"
										@keydown.enter.prevent="addTag"
										type="text"
										id="tags"
										placeholder="Tag your review"
										class="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#121422] pl-9 pr-3 py-2 text-sm text-slate-900 dark:text-white focus:border-[#355AFF] focus:outline-none focus:ring-1 focus:ring-[#355AFF] placeholder:text-slate-400 shadow-sm transition-colors"
								/>
							</div>
							<button @click="addTag" type="button" class="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-md text-sm font-medium bg-white dark:bg-[#121422] text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
								Add Tag
							</button>
						</div>

						<!-- Added Tags Display -->
						<div v-if="tags.length > 0" class="flex flex-wrap gap-2 mb-2">
  						<span v-for="tag in tags" :key="tag" class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#355AFF]/10 text-[#355AFF] border border-[#355AFF]/20">
  						  <span class="leading-none">{{ tag }}</span>
  						  <button type="button" @click="removeTag(tag)" class="ml-1.5 flex items-center justify-center w-6 h-6 rounded-full hover:bg-[#355AFF]/20 hover:text-[#2b4bcc] transition-colors focus:outline-none">
  						    <span class="material-symbols-outlined text-[14px] leading-none">close</span>
  						  </button>
  						</span>
						</div>
						<p class="mt-1 text-xs text-slate-500 dark:text-slate-400">Note: press enter or click Add to separate tags</p>
					</div>

					<!-- Textarea Content -->
					<TextEditor v-model="reviewContent"
												placeholder="My experience with this place was..."
												:max-length="1000"
					/>

					<!-- Photo Upload -->
					<!-- NOT FUNCTIONAL YET -->
					<UploadBox v-model="uploadedPhotos"/>

					<!-- Certification -->
					<div class="flex items-start">
						<div class="flex items-center h-5">
							<input
									v-model="isCertified"
									id="certify"
									type="checkbox"
									class="w-4 h-4 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-[#121422] focus:ring-2 focus:ring-[#355AFF]/30 text-[#355AFF] accent-[#355AFF]"
							/>
						</div>
						<label class="ml-2 text-sm font-medium text-slate-900 dark:text-white" for="certify">
							I certify this review is genuine and true. <span class="text-red-500">*</span>
						</label>
					</div>

					<!-- Buttons -->
					<div class="flex flex-wrap items-center gap-3 pt-4">
						<button type="submit" class="bg-[#355AFF] hover:bg-[#2b4bcc] text-white px-6 py-2 rounded-md text-sm font-medium transition-colors shadow-sm">Submit</button>
						<button type="button" @click="() => { reviewTitle = ''; reviewContent = ''; isCertified = false; }" class="text-slate-500 dark:text-slate-400 px-4 py-2 text-sm font-medium hover:text-slate-900 dark:hover:text-white transition-colors">Reset</button>
						<button type="button" class="border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#121422] text-slate-900 dark:text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">Save to Drafts</button>
					</div>
				</form>
			</div>

			<!-- Right Column: Live Preview (Hidden on small screens) -->
			<div class="hidden lg:block w-[500px] xl:w-[610px] shrink-0">
				<div class="sticky top-24">
					<h2 class="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Live Preview</h2>
					<p class="text-sm text-slate-500 dark:text-slate-400 mb-6">This is the point of view for all users within the property's page.</p>

					<div class="bg-white dark:bg-[#121422] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-6 transition-colors duration-200">
						<div class="flex justify-between items-start mb-4">
							<div class="flex items-center gap-3">
								<div class="w-12 h-12 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
									<ProfileIcon v-if="!isAnonymous" :src="props.user.icon" alt="user img" size-class="w-full h-full"></ProfileIcon>
									<span v-else class="material-symbols-outlined text-slate-400 text-2xl">person_off</span>
								</div>
								<div>
									<h3 class="font-bold text-slate-900 dark:text-white">{{ isAnonymous ? 'Anonymous' : props.user.name }}</h3>
									<p class="text-sm text-slate-500 dark:text-slate-400 italic">3 Reviews</p>
								</div>
							</div>
							<div class="flex items-center text-[#355AFF] text-2xl font-bold">
								<span class="material-symbols-outlined text-[28px] mr-1 filled">star</span> {{ overallRating }}
							</div>
						</div>

						<h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-3 break-words">
							{{ reviewTitle || 'Review Title Here' }}
						</h2>
						<div
								class="text-slate-800 dark:text-slate-300 mb-6 break-words min-h-[4rem] editor-output"
								v-html="reviewContent || 'Your detailed review experience will appear here as you type...'"
						></div>

						<!-- Tags Preview -->
						<div v-if="tags.length > 0" class="flex flex-wrap gap-2 mb-6">
              <span v-for="tag in tags" :key="tag" class="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md text-xs font-medium">
                {{ tag }}
              </span>
						</div>

						<!-- Static Image Carousel-->
						<div v-if="uploadedPhotos.length > 0" class="my-6 h-[47%] flex w-full justify-center items-center">
							<Carousel :count="4" buttonStyling="small circular" :buttonSpacing="4">
								<template #content>
									<template v-for="(url, index) in previewUrls">
										<div class="flex shrink-0 snap-start pl-2 pr-2">
											<MediaContainer size="medium" :src="url" :alt="uploadedPhotos[index].name" class="border-2 border-dashed border-slate-400 dark:border-slate-200"/>
										</div>
									</template>
								</template>
							</Carousel>
						</div>

						<!-- Static Owner Reply -->
						<div class="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 rounded-xl p-4 mb-6">
							<p class="text-sm italic text-slate-500 dark:text-slate-400 mb-2">Reply from the owner</p>
							<p class="text-slate-800 dark:text-slate-300">Glad to hear that you were satisfied with our space! ^_^</p>
						</div>

						<div class="flex items-center gap-4 text-slate-500 dark:text-slate-400">
							<div class="flex items-center gap-1 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors">
								<span class="material-symbols-outlined text-[20px]">thumb_up_off_alt</span>
								<span class="text-sm font-medium">67</span>
							</div>
							<div class="flex items-center gap-1 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors">
								<span class="material-symbols-outlined text-[20px]">thumb_down_off_alt</span>
							</div>
						</div>
					</div>
				</div>
			</div>

		</div>
	</div>
</template>

<style scoped>

.editor-output :deep(ul) {
	list-style-type: disc;
	padding-left: 1.5rem;
	margin-top: 0.25rem;
	margin-bottom: 0.25rem;
}
.editor-output :deep(ol) {
	list-style-type: decimal;
	padding-left: 1.5rem;
	margin-top: 0.25rem;
	margin-bottom: 0.25rem;
}
.editor-output :deep(b), .editor-output :deep(strong) {
	font-weight: 700;
}
.editor-output :deep(i), .editor-output :deep(em) {
	font-style: italic;
}
.editor-output :deep(u) {
	text-decoration: underline;
}
.editor-output :deep(strike) {
	text-decoration: line-through;
}
</style>