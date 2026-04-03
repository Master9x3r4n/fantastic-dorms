<script setup>
import { ref, computed, watch, onBeforeUnmount, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ToggleButton from "@/components/page-buttons/ToggleButton.vue"
import ProfileIcon from "@/components/profile/ProfileIcon.vue";
import RatingBox from "@/components/write-review-content/RatingBox.vue";
import TextEditor from "@/components/write-review-content/TextEditor.vue";
import UploadBox from "@/components/write-review-content/UploadBox.vue";
import Divider from "@/components/divider/Divider.vue";
import ListingService from "../services/ListingService.js";
import ReviewService from "../services/ReviewService.js";
import LivePreview from "@/components/write-review-content/LivePreview.vue";
import { useAuthStore } from '@/auth';

const props = defineProps({
	id: { type: String, default: '' }
})
const listing = ref(null);
ListingService.find(props.id)
	.then(res => {
		listing.value = res.data;
	})
	.catch(error => {
		console.log(`Error retrieving listing: ${error.message}.`);
	});

// Get user from session storage
const user = ref(null)
const auth = useAuthStore();
onMounted(async () => {
	//const user = JSON.parse(localStorage.getItem('USER'));
	if (!auth.user) {
		await auth.fetchCurrentUser();
	}
	user.value = auth.user;
});

// Listing page
const router = useRouter();
const goBack = () => {
	router.push(`/listing/${props.id}`);
	// router.back();
};

// Form
const form = ref({
	isAnonymous: false,
	title: '',
	body: '',
	rating: {
		cleanliness: 1,
		comfort: 1,
		communication: 1,
		location: 1,
	},
	score: 1,
	media: [],
	tags: [],
	certified: false
});
const isFormValid = computed(() => {
	return form.value.title !== '' &&
		form.value.body !== '' &&
		Object.values(form.value.rating).every(value => { return value !== 0; }) &&
		form.value.certified === true;
});
const resetForm = () => {
	form.value.title = '';
	form.value.body = '';
	form.value.tags = []
	form.value.certified = false;
}

const currentTag = ref('');
const previewUrls = ref([]);
const overallRating = computed(() => {
	const values = Object.values(form.value.rating);
	const sum = values.reduce((acc, val) => acc + val, 0);
	const activeCount = values.filter(val => val > 0).length;

	if (activeCount === 0) return '0.0';
	return (sum / activeCount).toFixed(1);
});

/////// Methods ///////

const addTag = () => {
	const tag = currentTag.value.trim();
	if (tag && !form.value.tags.includes(tag)) {
		form.value.tags.push(tag);
	}
	currentTag.value = '';
};

const removeTag = (tagToRemove) => {
	tags.value = tags.value.filter(tag => tag !== tagToRemove);
};

const submitting = ref(false);
const errorMessage = ref('');
const submitReview = () => {
	errorMessage.value = '';
	
	const newReview = {
		listingId: props.id,
		username: user.value.username,
		isAnonymous: form.value.isAnonymous,
		content: {
			title: form.value.title,
			body: form.value.body,
			reply: ''
		},
		rating: {
			cleanliness: form.value.rating.cleanliness,
			comfort: form.value.rating.comfort,
			communication: form.value.rating.communication,
			location: form.value.rating.location
		},
		score: 0,
		// media: form.value.media,
		tags: form.value.tags,
		createdAt: Date.now()
	};

	// To submit images, the review object has to be collapsed into a FormData object
	// POJOs can't store images; the more you know...
	const intermediary = new FormData();
	intermediary.append('content', JSON.stringify(newReview));
	// intermediary.append('media', form.value.media);
	// for (const m in form.value.media) {
	// 	intermediary.append('media', m);
	// }
	form.value.media.forEach((file) => {
		intermediary.append('media', file);
	});

	console.log(form.value.media);
	console.log(intermediary);

	submitting.value = true;
	// ReviewService.create(newReview)
	ReviewService.create(intermediary)
	.then(res => {
		// this
		router.push(`/reviews/${newReview.listingId}#${res.data._id}`);
	})
	.catch(error => {
		console.log(`Error creating review: ${error.message}.`);
		submitting.value = false;
		errorMessage.value = `Failed to create review. Please try again later.`;
	});
};

// Watch for any changes to the imageFiles array
watch(() => form.value.media, (newFiles) => {
	// Safety check in case the array is cleared to null/undefined
	if (!newFiles) return;

	// 1. CLEANUP: Revoke all existing URLs before creating new ones
	previewUrls.value.forEach(url => {
		// Only revoke if it's a blob URL (in case you mix local files with server URLs)
		if (typeof url === 'string' && url.startsWith('blob:')) {
			URL.revokeObjectURL(url)
		}
	});

	// 2. GENERATE: Create new URLs for the current state of the array
	previewUrls.value = newFiles.map(file => {
		// Make sure the items in the array are actual File objects
		if (file instanceof File || file instanceof Blob) {
			return URL.createObjectURL(file)
		}
		return file // Fallback for existing server image URLs
	});

	console.log(form.value.media);
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
					<span class="material-symbols-outlined text-[16px]! mr-1">arrow_back</span>
					Back to listing page
				</button>

				<h1 class="text-3xl font-bold mb-2 text-slate-900 dark:text-white">Write a Review</h1>
				<p class="text-sm text-slate-500 dark:text-slate-400 mb-6">
					<!-- Yes I know we don't have community guidelines, heck we don't even have a terms and conditions -->
					In creating a review, make sure that your review does not violate our <a class="text-[#355AFF] hover:underline">Community Guidelines</a>.
				</p>

				<div v-if="listing">
					<div class="mb-6 flex items-center">
						<span class="text-sm text-slate-500 dark:text-slate-400 mr-2">You are creating a review for</span>
						<span class="flex items-center font-semibold text-slate-900 dark:text-white">
							<span v-if="listing.isVerified" class="material-symbols-outlined dark-filled text-[#355AFF] dark:text-white mr-1 text-[18px]">verified</span>
							{{ listing.name }}
						</span>
					</div>
				</div>

				<!-- Anonymous Toggle -->
				<div v-if="user" class="mb-6 bg-white dark:bg-[#121422] p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm transition-colors duration-200">
					<div class="flex items-center justify-between mb-2">
						<div>
							<h3 class="font-semibold text-slate-900 dark:text-white text-sm">Post as Anonymous</h3>
							<p class="text-xs text-slate-500 dark:text-slate-400">Your name and profile picture will not be shown in the review.</p>
						</div>
						<ToggleButton v-model="form.isAnonymous"></ToggleButton>
					</div>
					<Divider />
					<div class="flex items-center transition-colors">
						<div class="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-full mr-3 flex items-center justify-center overflow-hidden">
							<ProfileIcon :isAnonymous="form.isAnonymous" :src="user.picture" alt="user img" sizeClass="w-full h-full"></ProfileIcon>
						</div>
						<span class="text-sm text-slate-500 dark:text-slate-400">
							Post as <span class="font-medium text-slate-900 dark:text-white">{{ form.isAnonymous ? 'Anonymous' : user.name.firstName + ' ' + user.name.lastName }}</span>
						</span>
					</div>
				</div>
				
				<!-- Main Form -->
				<form @submit.prevent="submitReview" class="space-y-6">
					<!-- Title -->
					<div>
						<label class="block text-sm font-medium text-slate-900 dark:text-white mb-1" for="title">Review Title <span class="text-red-500">*</span></label>
						<input
							v-model="form.title"
							type="text"
							id="title"
							placeholder="Enter title here"
							class="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#121422] px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-[#355AFF] focus:outline-none focus:ring-1 focus:ring-[#355AFF] placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm transition-colors"
							required
						/>
						<p class="mt-1 text-xs text-slate-500 dark:text-slate-400">Make sure the title is relevant to your review.</p>
					</div>
					
					<!-- Textarea Content -->
					<TextEditor 
						v-model="form.body"
						placeholder="My experience with this place was..."
						:max-length="1000"
					/>

					<!-- Photo Upload -->
					<UploadBox v-model="form.media"/>
					
					<!-- Ratings Box -->
					<RatingBox v-model="form.rating" :overallRating="overallRating" />
					
					<!-- Tags -->
					<div>
						<label class="block text-sm font-medium text-slate-900 dark:text-white mb-1" for="tags">Tags</label>
						<p class="text-xs text-slate-500 dark:text-slate-400 mb-2">Make sure to add tags that support your review. As you type, similar tags will be suggested.</p>
						<div class="flex gap-2 mb-3">
							<div class="relative flex-1">
								<span class="absolute inset-y-0 left-0 flex items-center pl-3">
									<span class="material-symbols-outlined text-slate-400 text-[18px]!">search</span>
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
						<div v-if="form.tags.length > 0" class="flex flex-wrap gap-2 mb-2">
  						<span v-for="tag in form.tags" :key="tag" class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#355AFF]/10 text-[#355AFF] border border-[#355AFF]/20">
							<span class="leading-none">{{ tag }}</span>
							<button type="button" @click="removeTag(tag)" class="ml-1.5 flex items-center justify-center w-6 h-6 rounded-full hover:bg-[#355AFF]/20 hover:text-[#2b4bcc] transition-colors focus:outline-none">
								<span class="material-symbols-outlined text-[14px]! leading-none">close</span>
							</button>
  						</span>
						</div>
						<p class="mt-1 text-xs text-slate-500 dark:text-slate-400">Note: press enter or click Add to separate tags</p>
					</div>

					<!-- Certification -->
					<div class="flex items-start">
						<div class="flex items-center h-5">
							<input
								v-model="form.certified"
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
						<button 
							type="submit" 
							class="bg-[#355AFF] hover:bg-[#2b4bcc] text-white shadow-sm
								disabled:bg-gray-300 disabled:hover:bg-gray-200 disabled:dark:bg-gray-800 disabled:dark:hover:bg-gray-700 disabled:shadow-transparent
								px-6 py-2 rounded-md text-sm font-medium transition-colors"
							:disabled="!isFormValid || submitting"
						>
							<div v-if="!submitting">Submit</div>
							<div v-else>Submitting...</div>
						</button>
						<button 
							type="button" 
							@click="resetForm" 
							class="text-slate-500 dark:text-slate-400 px-4 py-2 text-sm font-medium hover:text-slate-900 dark:hover:text-white transition-colors"
						>
							Reset
						</button>
						<div class="text-red-500 text-sm">
							{{ errorMessage }}
						</div>
						<!-- <button type="button" class="border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#121422] text-slate-900 dark:text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">Save to Drafts</button> -->
					</div>
				</form>
			</div>

			<!-- Right Column: Live Preview (Hidden on small screens) -->
			<LivePreview
					v-if="user"
					:is-anonymous="form.isAnonymous"
					:user="user"
					:overall-rating="overallRating"
					:title="form.title"
					:body="form.body"
					:tags="form.tags"
					:media-urls="previewUrls"
			/>
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