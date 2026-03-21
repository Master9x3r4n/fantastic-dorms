<script setup>
import { ref } from 'vue';
import ProfileSummary from "@/components/profile/ProfileSummary.vue";
import ReviewPreview from "@/components/profile/ReviewPreview.vue";
import PageButtons from "@/components/page-buttons/PageButtons.vue";
import Divider from "@/components/divider/Divider.vue";
import BlueButton from "@/components/page-buttons/BlueButton.vue";
import ProfileService from "../services/ProfileService.js";
import ReviewService from "../services/ReviewService.js";
import ListingService from "../services/ListingService.js";

const props = defineProps({
	id: { type: String }
});

const user = ref(null);
ProfileService.get(props.id)
.then(res => {
	user.value = res.data;
})
.catch(error => {
	console.error(`Error retrieving profile: ${error.message}.`);
});

const reviewsRaw = ref(null);
const reviews = ref([]);
ReviewService.getAllByUser(props.id)
// ReviewService.getAllFromListing('the-daily-bugle')
.then(res => {
	reviewsRaw.value = res.data;
	console.log('RAW DATA:');
	console.log(reviewsRaw.value);
	console.log(reviewsRaw.value[0]);
	console.log(reviewsRaw.value.length);

	// For each review, pull the listing
	for (let i = 0; i < reviewsRaw.value.length; i++) {
		const review = reviewsRaw.value[i];
		
		console.log('REVIEW:');
		console.log(review);
		console.log(review.listingId);
		ListingService.get(review.listingId)
		.then(res => {
			if (res.data) {
				reviews.value.push({
					data: review,
					listing: res.data
				})
			} else {
				console.error(`Listing ${review.listingId} could not be found for review.`);
			}
		})
		.catch(error => {
			console.error(`Error retrieving listing for review: ${error.message}.`);
		});
	}
})
.catch(error => {
	console.error(`Error retrieving profile: ${error.message}.`);
});

const getOverallRating = (ratings) => {
    let overall = 0;
    for (let p in ratings) {
        overall += ratings[p];
        console.log(ratings[p]);
    }
    return (overall/4).toFixed(1);
}
</script>

<template>
	<div 
		class="flex flex-col items-start p-10 gap-10 w-full max-w-7xl min-h-214 mx-auto z-1 font-['Inter']"
		v-if="user"
	>
		<div class="w-full p-4 rounded-lg border border-solid border-slate-200 shadow-sm transition-colors duration-200 dark:border-slate-700">
			<ProfileSummary
				:name="user.name.firstName + ' ' + user.name.lastName"
				:username="user.username"
				:joinDate="new Date(user.joinDate).toUTCString()"
				:university="user.school.name"
				:profileImg="user.picture"
			/>
		</div>

		<!-- Biography and Reviews Container -->
		<div class="flex flex-row flex-wrap justify-center items-start gap-10 w-full max-w-300 min-h-146.5 mx-auto">

			<!-- Profile info column -->
			<div class="flex flex-col justify-between items-start gap-5 max-w-145 w-full p-4 rounded-lg border border-solid border-slate-200 shadow-sm transition-colors duration-200 dark:border-slate-700">

				<!-- Biography and edit container -->
				<div class="flex flex-row justify-between items-start gap-5 w-full max-w-145 h-7.25 self-stretch flex-none order-0">
					<h2 class="font-semibold text-[24px] leading-7.25 text-black dark:text-white">
						Biography
					</h2>

					<!-- Edit button-->
					<RouterLink to="/settings">
					<!-- <BlueButton @click="$emit('edit')"> -->
					<BlueButton>
						<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
							<path d="M0 11.25V14H2.75L10.8625 5.8875L8.1125 3.1375L0 11.25ZM13.0375 3.7125C13.325 3.425 13.325 2.9625 13.0375 2.675L11.325 0.9625C11.0375 0.675 10.575 0.675 10.2875 0.9625L8.9 2.35L11.65 5.1L13.0375 3.7125Z" fill="white"/>
						</svg>
						<span class="text-[16px] leading-4.75 text-white">Edit</span>
					</BlueButton>
					</RouterLink>
				</div>

				<!-- Bio text container -->
				<span class="text-[16px] leading-4.75 text-slate-900 dark:text-white">{{ user.bio }}</span>

				<!-- separator -->
				<Divider/>

				<!-- Profile details container-->
				<div class="flex flex-col items-start gap-5 w-full max-w-145 min-h-39.25 flex-none order-2 self-stretch">

					<!-- Education details -->
					<div class="flex flex-row items-center gap-5 w-full max-w-145 h-9.75 self-stretch flex-none order-0">
						<div class="w-25 font-semibold text-[20px] leading-6 text-right text-[#355AFF] flex-none">
							School
						</div>
						<div class="flex flex-col justify-center items-center w-7.5 h-7.5 flex-none order-1">
							<svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M4 10.18V14.18L11 18L18 14.18V10.18L11 14L4 10.18ZM11 0L0 6L11 12L20 7.09V14H22V6L11 0Z" fill="#355AFF"/>
							</svg>
						</div>
						<div class="flex flex-col justify-center items-start gap-1.25 h-9.75 flex-none order-2">
							<span class="font-semibold text-[16px] leading-4.75 text-black dark:text-white">
								{{ user.school.name }}
							</span>
							<span class="italic font-normal text-[12px] leading-3.75 text-[#676767]">
								Since {{ user.school.since }}
							</span>
						</div>
					</div>

					<!-- Dorm details -->
					<div class="flex flex-row items-center gap-5 w-full max-w-145 h-9.75 self-stretch flex-none order-0">
						<div class="w-25 font-semibold text-[20px] leading-6 text-right text-[#355AFF] flex-none">
							Home
						</div>
						<div class="flex flex-col justify-center items-center w-7.5 h-7.5 flex-none order-1">
							<svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M10 0L0 7V21H20V7L10 0ZM7.1875 11.0833C8.05 11.0833 8.75 11.7367 8.75 12.5417C8.75 13.3467 8.05 14 7.1875 14C6.325 14 5.625 13.3467 5.625 12.5417C5.625 11.7367 6.325 11.0833 7.1875 11.0833ZM16.25 17.5H15V15.75H5V17.5H3.75V9.33333H5V14.5833H9.375V10.5H13.75C15.125 10.5 16.25 11.55 16.25 12.8333V17.5Z" fill="#355AFF"/>
							</svg>
						</div>
						<div class="flex flex-col justify-center items-start gap-1.25 h-9.75 flex-none order-2">
							<a class="font-semibold text-[16px] leading-4.75 text-black underline dark:text-white cursor-pointer hover:text-[#355AFF] transition-colors">
								{{ user.dorm.name }}
							</a>
							<span class="italic font-normal text-[12px] leading-3.75 text-[#676767]">
								Since {{ user.dorm.since }}
							</span>
						</div>
					</div>

					<!-- Review details -->
					<div class="flex flex-row items-center gap-5 w-full max-w-145 h-9.75 self-stretch flex-none order-0">
						<div class="w-25 font-semibold text-[20px] leading-6 text-right text-[#355AFF] flex-none">
							Reviews
						</div>
						<div class="flex flex-col justify-center items-center w-7.5 h-7.5 flex-none order-1">
							<svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M8.86144 0.690965C9.1608 -0.230345 10.4642 -0.230344 10.7636 0.690967L12.3944 5.71022C12.5283 6.12224 12.9122 6.4012 13.3455 6.4012H18.623C19.5917 6.4012 19.9945 7.64082 19.2108 8.21022L14.9412 11.3123C14.5907 11.5669 14.444 12.0183 14.5779 12.4303L16.2088 17.4496C16.5081 18.3709 15.4536 19.137 14.6699 18.5676L10.4003 15.4655C10.0498 15.2109 9.5752 15.2109 9.22471 15.4655L4.95508 18.5676C4.17137 19.137 3.11689 18.3709 3.41624 17.4496L5.0471 12.4303C5.18097 12.0183 5.03431 11.5669 4.68382 11.3123L0.41419 8.21022C-0.369523 7.64082 0.0332539 6.4012 1.00198 6.4012H6.27953C6.71276 6.4012 7.09671 6.12224 7.23059 5.71022L8.86144 0.690965Z" fill="#355AFF"/>
							</svg>
						</div>
						<div class="flex flex-col justify-center items-start gap-1.25 h-9.75 flex-none order-2">
							<span class="font-semibold text-[16px] leading-4.75 text-black dark:text-white">
								{{ reviews.length }}
							</span>
							<span class="italic font-normal text-[12px] leading-3.75 text-[#676767]">
								Since {{ new Date(user.joinDate).toUTCString() }}
							</span>
						</div>
					</div>
				</div>
			</div>

			<!-- Reviews column -->
			<div class="flex flex-col justify-center items-center gap-5 max-w-145 min-h-146.5 grow order-1 w-full p-4 rounded-lg border border-solid border-slate-200 shadow-sm transition-colors duration-200 dark:border-slate-700">
				<div class="font-semibold text-[24px] leading-7.25 text-black w-full dark:text-white">
					Reviews
				</div>

				<!-- Reviews List (Dynamic) -->
				<div 
					class="flex flex-col w-full gap-5"
					v-if="reviews"
				>
					<ReviewPreview
						v-for="review in reviews"
						:key="review.data.listingId"
						:title="review.data.content.title"
						:rating="getOverallRating(review.data.rating)"
						:review="review.data.content.body"
						:img="review.listing.media[0]"
						:listingId="review.data.listingId"
					/>
				</div>

				<div class="flex justify-center items-center w-full mt-auto">
					<PageButtons />
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
</style>