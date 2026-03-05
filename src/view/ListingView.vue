<script setup>
import Carousel from '@/components/carousel/Carousel.vue';
import ListingInformation from '@/components/listing-content/ListingInformation.vue';
import OverallRating from '@/components/side-cards/OverallRating.vue';
import MediaContainer from '@/components/carousel/MediaContainer.vue';
import ReviewCard from '@/components/review-cards/ReviewCard.vue';
import Divider from '@/components/divider/Divider.vue';
import ReviewDropdown from "@/components/dropdown/ReviewDropdown.vue";

import { listingData } from "@/assets/temp-data/listing-temp"
import { reviewsData } from "@/assets/temp-data/reviews-temp";
import { computed } from 'vue';
import BlueButton from "@/components/page-buttons/BlueButton.vue";

const props = defineProps({
    id: {
		type: String,
		default: "1"
	}
})

const listing = computed(() => listingData[props.id]);
const reviews = computed(() => reviewsData[props.id]);

</script>

<template>
    <div class="flex justify-around gap-8 m-8 font-['Inter']">
        <!-- Main Listing -->
        <div class="flex flex-col gap-4 w-fit grow max-w-5xl">
            <!-- Media Carousel -->
            <Carousel :count="1" buttonStyling="large">
            <template #content>
                <template v-for="i in listing.mediaSrcs">
                    <MediaContainer class="flex shrink-0 snap-start" :src="i"/>
                </template>
            </template>
            </Carousel>

            <!-- Listing Information -->
            <ListingInformation :listingData="listing">
                <template #listing-name>
                    {{ listing.name }}
                </template>
                <template #listing-address>
                    {{ listing.address }}
                </template>
                <template #listing-owner>
                    {{ listing.owner }}
                </template>
                <template #description> 
                    {{ listing.description }}
                </template>
            </ListingInformation> 
        </div>

        <!-- Reviews -->
        <div class="flex flex-col gap-4 w-fit">
            <OverallRating :ratings="listing.rating"/>

            <!-- Reviews List -->
            <div class="flex flex-col gap-1">
                <div class="flex flex-row justify-between items-center gap-2">
                    <span class="font-bold text-3xl leading-10 dark:text-white">Reviews</span>
									<RouterLink to="/write">
										<BlueButton>
											<span class="material-symbols-outlined text-white text-[14px]">edit</span>
											<span class="font-normal text-[16px] leading-4.75 text-white">Write</span>
										</BlueButton>
									</RouterLink>
                </div>

                <!-- Reviews -->
                <template v-if="reviews">
                    <template v-for="i in reviews">
                        <ReviewCard :reviewData="i" :routeId="id"> 
                            <template #review-title>
                                {{ i.content.title }}
                            </template>
                            <template #review>
                                {{ i.content.description }}
                            </template>
                            <template #ownerReply v-if="i.content.reply">
                                {{ i.content.reply }}
                            </template> 
                        </ReviewCard>
                        <Divider/>
                    </template>
                </template>
                <template v-else> bruh </template>
            </div>
        </div>
    </div>
</template>