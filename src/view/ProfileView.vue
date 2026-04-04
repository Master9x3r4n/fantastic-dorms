<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import ProfileSummary from "@/components/profile/ProfileSummary.vue";
import ReviewPreview from "@/components/profile/ReviewPreview.vue";
import PageButtons from "@/components/page-buttons/PageButtons.vue";
import Divider from "@/components/divider/Divider.vue";
import BlueButton from "@/components/page-buttons/BlueButton.vue";
import ProfileService from "../services/ProfileService.js";
import ReviewService from "../services/ReviewService.js";
import ListingService from "../services/ListingService.js";
import { useAuthStore } from '@/auth';

const props = defineProps({
	id: { type: String }
});

const router = useRouter();
const auth = useAuthStore();

const user = ref(null);
const reviewsRaw = ref([]);
const reviews = ref([]);
const username = ref(null);
const isLoading = ref(true);

// 1. Abstracted the fetch logic into a function so we can control WHEN it runs
const fetchProfileData = async (targetId) => {
	isLoading.value = true;
	try {
		// Fetch Profile
		const profileRes = await ProfileService.find(targetId);
		user.value = profileRes.data;

		// Fetch Reviews
		const reviewsRes = await ReviewService.findAllByUser(targetId);
		reviewsRaw.value = reviewsRes.data;

		// Fetch Listings for each review
		reviews.value = []; // Reset reviews array
		for (let i = 0; i < reviewsRaw.value.length; i++) {
			const review = reviewsRaw.value[i];
			try {
				const listingRes = await ListingService.find(review.listingId);
				if (listingRes.data) {
					reviews.value.push({
						data: review,
						listing: listingRes.data
					});
				}
			} catch (err) {
				console.error(`Listing ${review.listingId} could not be found.`);
			}
		}
	} catch (error) {
		console.error(`Error retrieving profile: ${error.message}.`);
	} finally {
		isLoading.value = false;
	}
};

onMounted(async () => {
	// 2. Ensure auth is loaded before attempting to fetch
	if (!auth.user) {
		try {
			await auth.fetchCurrentUser();
		} catch (e) {
			// Expected if completely logged out
			console.log("User is not logged in.");
		}
	}

	if (auth.user) {
		username.value = auth.user.username;
	}

	// 3. Fallback logic: If no ID in URL (e.g. `/profile`), use logged in user's ID
	const targetId = props.id || username.value;

	if (targetId) {
		await fetchProfileData(targetId);
	} else {
		// If neither exists, redirect to login because they can't view a profile page
		isLoading.value = false;
		await router.push('/login');
	}
});

// Refetch if URL parameter changes dynamically
watch(() => props.id, (newId) => {
	const targetId = newId || username.value;
	if (targetId) fetchProfileData(targetId);
});

// 4. Sturdy rating calculation to avoid NaN
const getOverallRating = (ratings) => {
	if (!ratings) return "0.0";
	const validCategories = ['cleanliness', 'comfort', 'communication', 'location'];
	let sum = 0;
	let count = 0;
	for (const category of validCategories) {
		if (typeof ratings[category] === 'number') {
			sum += ratings[category];
			count++;
		}
	}
	return count > 0 ? (sum / count).toFixed(1) : "0.0";
}

// --- FILTER LOGIC ---
const filteredReviews = computed(() => {
	const targetId = props.id || username.value;
	// If the current logged-in user is viewing their own profile, show all reviews
	if (username.value === targetId) {
		return reviews.value;
	}
	// Otherwise, filter out anonymous reviews
	return reviews.value.filter(review => !review.data.isAnonymous);
});

// --- PAGINATION LOGIC ---
const currentPage = ref(1);
const reviewsPerPage = 4; // Set this to smth else if needed

const totalPages = computed(() => {
	// Use filteredReviews instead of reviews
	return Math.ceil(filteredReviews.value.length / reviewsPerPage) || 1;
});

const paginatedReviews = computed(() => {
	const start = (currentPage.value - 1) * reviewsPerPage;
	const end = start + reviewsPerPage;
	// Use filteredReviews instead of reviews
	return filteredReviews.value.slice(start, end);
});

const changePage = (page) => {
	currentPage.value = page;
};
</script>

<template>
	<div v-if="user" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 font-['Inter']">

		<!-- Top Profile Summary Card -->
		<div class="bg-white dark:bg-[#121422] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm p-6 md:p-8 mb-8 transition-colors duration-200">
			<ProfileSummary
					:name="user.name?.firstName + ' ' + user.name?.lastName"
					:username="user.username"
					:joinDate="new Date(user.joinDate).toUTCString()"
					:university="user.school?.name"
					:profileImg="user.picture"
			/>
		</div>

		<!-- Main Two-Column Layout -->
		<div class="flex flex-col lg:flex-row gap-8 items-start w-full">

			<!-- LEFT COLUMN: Biography & Details -->
			<div class="w-full lg:w-1/3 flex flex-col gap-6 bg-white dark:bg-[#121422] rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 md:p-8 transition-colors duration-200 sticky top-24">

				<!-- Bio Header -->
				<div class="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
					<h2 class="text-xl font-bold text-slate-900 dark:text-white">
						Biography
					</h2>
					<!-- Edit Button -->
					<RouterLink to="/settings" v-if="username === (props.id || username)">
						<BlueButton class="px-3 py-1.5">
							<span class="material-symbols-outlined text-[16px] text-white">edit_square</span>
							<span class="text-sm font-medium text-white">Edit</span>
						</BlueButton>
					</RouterLink>
				</div>

				<!-- Bio Text -->
				<p class="text-base leading-relaxed text-slate-700 dark:text-slate-300">
					{{ user.bio }}
				</p>

				<Divider class="opacity-50" />

				<!-- User Details List -->
				<div class="flex flex-col gap-6">

					<!-- Education Details -->
					<div class="flex items-center gap-4">
						<div class="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
							<span class="material-symbols-outlined text-[#355AFF] text-[24px]">school</span>
						</div>
						<div class="flex flex-col">
							<span class="text-sm font-medium text-slate-500 dark:text-slate-400">School</span>
							<span class="font-semibold text-slate-900 dark:text-white">
                {{ user.school?.name }}
              </span>
						</div>
					</div>

					<!-- Dorm Details -->
					<div class="flex items-center gap-4">
						<div class="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
							<span class="material-symbols-outlined text-[#355AFF] text-[24px]">apartment</span>
						</div>
						<div class="flex flex-col">
							<span class="text-sm font-medium text-slate-500 dark:text-slate-400">Home</span>
							<a class="font-semibold text-slate-900 dark:text-white hover:text-[#355AFF] dark:hover:text-[#355AFF] underline transition-colors cursor-pointer">
								{{ user.dorm?.name }}
							</a>
						</div>
					</div>

					<!-- Reviews Count Details -->
					<div class="flex items-center gap-4">
						<div class="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
							<span class="material-symbols-outlined text-[#355AFF] text-[24px]">reviews</span>
						</div>
						<div class="flex flex-col">
							<span class="text-sm font-medium text-slate-500 dark:text-slate-400">Reviews Written</span>
							<!-- Updated to use filteredReviews length -->
							<span class="font-semibold text-slate-900 dark:text-white">
                {{ filteredReviews.length }}
              </span>
						</div>
					</div>

				</div>
			</div>

			<!-- RIGHT COLUMN: Reviews List -->
			<div class="w-full lg:w-2/3 flex flex-col bg-white dark:bg-[#121422] rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 md:p-8 transition-colors duration-200">

				<h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
					Reviews
				</h2>

				<!-- Reviews Dynamic List -->
				<div v-if="filteredReviews && filteredReviews.length > 0" class="flex flex-col gap-5">
					<!-- We now iterate over paginatedReviews instead of all reviews -->
					<ReviewPreview
							v-for="review in paginatedReviews"
							:key="review.data.listingId"
							:title="review.data.content.title"
							:rating="getOverallRating(review.data.rating)"
							:review="review.data.content.body"
							:img="review.listing.media?.[0]"
							:listingId="review.data.listingId"
							:reviewId="review.data._id"
					/>
				</div>

				<!-- Empty State -->
				<div v-else class="flex flex-col items-center justify-center py-16 text-center bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
					<span class="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600 mb-3">rate_review</span>
					<p class="text-slate-500 dark:text-slate-400 font-medium">No reviews published yet.</p>
				</div>

				<!-- Dynamic Page Buttons -->
				<div class="flex justify-center items-center w-full mt-8" v-if="totalPages > 1">
					<PageButtons
							:current-page="currentPage"
							:total-pages="totalPages"
							@update:page="changePage"
					/>
				</div>
			</div>

		</div>
	</div>

	<!-- Fallback Error State -->
	<div v-else class="flex flex-col items-center justify-center min-h-[60vh]">
		<span class="material-symbols-outlined text-6xl text-slate-300 mb-4">error_outline</span>
		<h2 class="text-2xl font-bold text-slate-900 dark:text-white">Profile Not Found</h2>
		<p class="text-slate-500 dark:text-slate-400 mt-2">We couldn't locate this user's profile.</p>
		<RouterLink to="/">
			<BlueButton class="mt-6 px-6 py-2 text-white">Return Home</BlueButton>
		</RouterLink>
	</div>
</template>

<style scoped>
.material-symbols-outlined {
	font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>