<script setup>
import { ref } from 'vue';
import MediaContainer from '../carousel/MediaContainer.vue';
import ThumbsButton from '../thumbs-buttons/ThumbsButton.vue';
import ProfileIcon from "@/components/profile/ProfileIcon.vue";
import ProfileService from "../../services/ProfileService.js";
import ThumbsContainer from '../thumbs-buttons/ThumbsContainer.vue';

const props = defineProps({
    review: {},
    id: {
        type: String,
        default: "1"
    }
})

// console.log('PROPS.ID:');
// console.log(props.id);

const review = props.review;
const profile = ref(null);
ProfileService.find(review.username)
    .then(res => {
        profile.value = res.data;
        // console.log('Profile:');
        // console.log(profile.value);
    })
    .catch(error => {
        console.log(`Error occurred retrieving profile data of user ${review.username} for review: ${error.message}`);
    });

const getOverallRating = (ratings) => {
    let overall = 0;
    for (let p in ratings) {
        overall += ratings[p];
        // console.log(ratings[p]);
    }
    return (overall/4).toFixed(1);
}


//TODO: REVMOVE THIS, THIS ONLY EXISTS FOR THE VIDEO BUT THE FOLLOWING CODE WILL BE TRASH
const vote = ref(0);

const updateVotes = (n) => {
    vote.value = n;
}

</script>

<template>
    <div class="flex flex-col justify-center items-center 
    p-2 pb-4 gap-4.5 w-105.25 h-fit bg-white dark:bg-[#121422] dark:text-white">
        <!-- Header Container -->
        <div class="w-full flex justify-between items-center">
            <div v-if="profile">
                <RouterLink :to="{name: 'profile', params: {id: review.username}}">
                    <div class="flex gap-3 items-center">
                        <!-- Profile -->
                        <ProfileIcon :src="profile.picture" sizeClass="w-13 h-13"></ProfileIcon>

                        <!-- Name -->
                        <div>
                            <div class="font-medium text-[20px] leading-6">{{ profile?.name.firstName + ' ' + profile?.name.lastName }}</div>
                            <!-- <div class="font-normal leading-5 italic">{{ profile.reviewData.reviews.length }} Reviews</div> -->
                            <div class="font-normal leading-5 italic">- Reviews</div>
                        </div>
                    </div>
                </RouterLink>
            </div>

            <!-- Rating -->
            <div class="flex justify-between items-center w-3/12 px-2">
                <img src="@\assets\rating-assets\star-full.svg" width="28px">
                <!-- <div class="font-bold text-3xl leading-10">{{ (review.score/4).toFixed(1) }}</div> -->
                <!-- <div class="font-bold text-3xl leading-10">{{ review.score.toFixed(1) }}</div> -->
                <div class="font-bold text-3xl leading-10">{{ getOverallRating(review.rating) }}</div>
            </div>
        </div>

        <!-- Title Container -->
        <div class="w-full h-[14%] flex items-center font-bold leading-8 text-2xl">
            <slot name = "review-title">{{ review.content.title }}</slot>
        </div>

        <!-- Comment Container -->
        <div class="h-[56%] flex flex-col w-full">
            <!-- Review Container -->
            <div class="w-full text-[16px] leading-6 grow flex">
                <!-- Review proper -->
                <div class="w-full">
                    <slot name="review">
                        I have stayed at this apartment for a while, and let me say, it is as the name says. 
                        It's a really cool apartment and it has a lot of the amenities 
                        that a student would want from...
                    </slot>
                </div>

                <!-- Media -->
                <div class="shrink-0 ml-2 relative" v-if="review.media">
                    <div class="absolute bg-white dark:bg-[#111111] p-auto pl-1 rounded-full size-6 top-16 right-2 text-[14px] dark:text-white">+3</div>
                    <MediaContainer size="small"/>
                </div>
            </div>

            <template v-if="$slots.ownerReply"> 
            <!-- Reply Container -->
            <div class="w-full h-[50%] mt-3">
                <div class="bg-[#D9D9D9] dark:bg-[#111111] h-full rounded-3xl 
                flex flex-col justify-center items-center p-5 gap-1.25">
                    <div class="italic text-left w-full text-[14px] leading-6">
                        Reply from the owner
                    </div>
                    <div class="w-full text-[16px] leading-6">
                        <slot name="ownerReply"></slot>
                    </div>
                </div>
            </div>
            </template>
        </div>

        <!-- Footer Container -->
        <div class="w-full h-[16%] flex justify-between items-center mt-1">
            <!-- Show More -->
            <div class="font-semibold underline text-[16px] leading-6">
                <RouterLink :to="'/reviews/'+id" :review="review" :profile="profile" :id="id">Show More</RouterLink>
            </div>

            <!-- Upvote -->
            <div class="italic font-normal text-[16px] leading-6 flex items-center justify-around gap-2">
                <!-- <ThumbsButton direction="up" @updateValue="updateVotes"/>
                <div>{{ review.score + vote }}</div>
                <ThumbsButton direction="down" @updateValue="updateVotes"/> -->
                <ThumbsContainer :score="review.score"/>
            </div>
        </div>

    </div>
</template>

<style scoped>

.bg-gradient {
    background: linear-gradient(99.9deg, #74b2fd 1.35%, #517FFF 99.48%);
}

</style>