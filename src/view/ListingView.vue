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

const props = defineProps({
    id: {
		type: String,
		default: 1
	},
    listingDatas: {
        type: Object,
        default:{
            name: "Apartment Name",
            address: "Studio apartment - Awesome St., Barangay Big Love, Pasay City",
            description: "This apartment is very nice. It has nice rooms and is placed very nicely. It also has nice neighbors and a lot of other nice things.",
            owner: "Really Cool Apartments",
            amenities: ['2 Bedrooms', '2 Bathrooms', '3 Dining Rooms', '10 Living Rooms'],
            contacts: ['Facebook', 'Instagram'],
            rating: [
                { name: "Cleanliness", rating: 4 },
                { name: "Comfort", rating: 4 },
                { name: "Spaciousness", rating: 3 },
                { name: "Price", rating: 2 }
            ],
            imageSrc: "",
        }
    },
    reviewsDatas: {
        type: Array,
        default: [
            {
                authorData: {
                    name: "chud student 1",
                    reviewCount: 67,
                    imageSrc: "",
                    profileRoute: "/profile",
                },
                rating: 4,
                reviewTitle: "Review Name 1",
                reviewContent: "I have stayed at this apartment for a while, and let me say, it is as the name says. It's a really cool apartment and it has a lot of the amenities that a student would want from...",
                reply: "Glad to hear that you were satisfied with our space! ^_^",
                score: 67,
                reviewsRoute: "/reviews1"
            },
            {
                authorData: {
                    name: "chud student 2",
                    reviewCount: 67,
                    imageSrc: "",
                    profileRoute: "/profile",
                },
                rating: 4,
                reviewTitle: "Review Name 2",
                reviewContent: "I have stayed at this apartment for a while, and let me say, it is as the name says. It's a really cool apartment and it has a lot of the amenities that a student would want from...",
                ownerReply: "Glad to hear that you were satisfied with our space! ^_^",
                score: 52,
                reviewsRoute: "/reviews2"
            }
        ]
    }
})

const listing = computed(() => listingData[props.id]);
const reviews = computed(() => reviewsData[props.id]);

</script>

<template>
    <div class="flex justify-around gap-8 m-8 ">
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
                  <ReviewDropdown/>
                </div>

                <!-- Reviews -->
                <template v-if="reviews">
                    <template v-for="i in reviews">
                        <ReviewCard :reviewData="i"> 
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