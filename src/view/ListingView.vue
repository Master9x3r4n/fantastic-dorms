<script setup>
    import { ref } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import ListingService from '../services/ListingService.js';
    import ReviewService from '../services/ReviewService.js';
    const route = useRoute();
    const router = useRouter();

    import Carousel from '@/components/carousel/Carousel.vue';
    import ListingInformation from '@/components/listing-content/ListingInformation.vue';
    import OverallRating from '@/components/side-cards/OverallRating.vue';
    import MediaContainer from '@/components/carousel/MediaContainer.vue';
    import ReviewCard from '@/components/review-cards/ReviewCard.vue';
    import Divider from '@/components/divider/Divider.vue';
    import BlueButton from "@/components/page-buttons/BlueButton.vue";

    const props = defineProps({
        id: {
            type: String,
            default: "1"
        }
    })

    const listingId = route.params.id; 
    if (!listingId) {
        throw new Error('Invalid ID');
    }

    const listing = ref(null);
    const reviews = ref(null);

    ListingService.find(listingId)
    .then(res => {
        listing.value = res.data;
    })
    .catch(err => {
        console.log(`Error retrieving listing: ${err.message}`);
    });
    ReviewService.findAllFromListing(listingId)
    .then(res => {
        reviews.value = res.data.data;
        console.log(reviews.value);
    })
    .catch(err => {
        console.log(`Error retrieving reviews: ${err.message}`);
    });
</script>

<template>
    <div class="flex justify-around gap-8 m-8 font-['Inter']">
        <!-- Main Listing -->
        <div v-if="listing">
            <div class="flex flex-col gap-4 w-fit grow max-w-5xl">
                <!-- Media Carousel -->
                <Carousel :count="1" buttonStyling="large">
                <template #content>
                    <template v-for="i in listing.media">
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
        </div>

        <!-- Reviews -->
        <div class="flex flex-col gap-4 w-fit">
            <div v-if="listing">
                <OverallRating :ratings="listing.rating"/>
            </div>

            <!-- Reviews List -->
            <div class="flex flex-col gap-1">
                <div class="flex flex-row justify-between items-center gap-2">
                    <span class="font-bold text-3xl leading-10 dark:text-white">Reviews</span>
                    <RouterLink :to="{ name: 'write', params: { id: props.id } }">
                        <BlueButton>
                            <span class="material-symbols-outlined text-white text-[14px]">edit</span>
                            <span class="font-normal text-[16px] leading-4.75 text-white">Write</span>
                        </BlueButton>
                    </RouterLink>
                </div>

                <!-- Reviews -->
                <template v-if="reviews">
                    <template v-for="i in reviews">
                        <ReviewCard :review="i" :id="i._id"> 
                            <template #review-title>
                                {{ i.content.title }}
                            </template>
                            <template #review>
                                {{ i.content.body }}
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