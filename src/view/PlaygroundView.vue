<script setup>
    import ListingCardSmall from '@/components/apartment-cards/ListingCardSmall.vue';
    import ListingCardLarge from '@/components/apartment-cards/ListingCardLarge.vue';
    import Carousel from '@/components/carousel/Carousel.vue';
    import DarkModeButton from '@/components/darkmode/DarkModeButton.vue';
    import TestContainer from '@/components/test-components/TestContainer.vue';
    import TestLabel from '@/components/test-components/TestLabel.vue';
    import OverallRating from '@/components/side-cards/OverallRating.vue';
    import ReviewCard from '@/components/review-cards/ReviewCard.vue';
    import SearchBar from "@/components/header/SearchBar.vue";
    import MediaContainer from '@/components/carousel/MediaContainer.vue';
    import FullReviewCard from '@/components/review-cards/FullReviewCard.vue';
    import FilterButton from '@/components/page-buttons/FilterButton.vue';
    import ListingInformation from '@/components/listing-content/ListingInformation.vue';
    import DarkModeSlider from '@/components/darkmode/DarkModeSlider.vue';
    import SkeletonApCardSmall from '@/components/skeleton/SkeletonApCardSmall.vue';
    import SkeletonApCardLarge from '@/components/skeleton/SkeletonApCardLarge.vue';
    import SkeletonOverallRating from '@/components/skeleton/SkeletonOverallRating.vue';
    import SkeletonReviewCard from '@/components/skeleton/SkeletonReviewCard.vue';
    import SkeletonFullReview from '@/components/skeleton/SkeletonFullReview.vue';
    import Divider from '@/components/divider/Divider.vue';

    import {ref, computed} from 'vue'
    
    const items= [1, 2, 3, 4, 5]

    const ratings = [
        {
            name: "Attribute 1",
            rating: 4.0
        },
        {
            name: "Attribute 2",
            rating: 3.5
        },
        {
            name: "Attribute 3",
            rating: 2.5
        },
        {
            name: "Attribute 4",
            rating: 5
        }
    ]

    const selectedItems = ref([])

</script>

<template>
    <!-- Dark Mode Button -->
    <TestContainer dir="row">
        <TestLabel>Theme</TestLabel>
        <div class="flex gap-4">
            <DarkModeButton />
            <DarkModeSlider />
        </div>
    </TestContainer>

    <TestContainer dir ="col" class="gap-4">
        <TestLabel>Loading Components</TestLabel>
        <SkeletonApCardSmall/>
        <SkeletonApCardLarge/>
        <SkeletonOverallRating/>
        <SkeletonReviewCard/>

        <div class="w-[75%] flex flex-col">
            <SkeletonFullReview/>
        </div>
    </TestContainer>

    <!-- Search Bar -->
    <TestContainer dir="col">
        <TestLabel>Search Bar</TestLabel>
      <div class="bg-[#2C0ED6] w-full">
        <SearchBar type="alt"></SearchBar>
      </div>
        <SearchBar></SearchBar>
    </TestContainer>

    <!-- Filter Buttons -->
    <TestContainer dir="col">
        <TestLabel>Filter Buttons</TestLabel>
        <div class="flex w-full gap-2 mt-4 justify-center">
            <template v-for="i in 5">
                <FilterButton v-model="selectedItems" :value="`Really Cool University ${i}`">
                    Really Cool University {{ i }}
                </FilterButton>
            </template>
        </div>
        <div class="flex w-full gap-2 mt-4 justify-center">
            <p>{{ selectedItems }}</p>
        </div>
    </TestContainer>

    <!-- Small Card -->
    <TestContainer dir="col">
        <TestLabel>Small Card</TestLabel>
        <ListingCardSmall />
    </TestContainer>

    <!-- Large Card -->
     <TestContainer dir="col">
        <TestLabel>Large Card</TestLabel>
        <template v-for="i in 2">
            <ListingCardLarge
                :ratingData="{rating: 1.5 * (4-i), reviewCount: 69}"
                class="m-1.5">
                <template #header>Apartment {{ i }}</template>
            </ListingCardLarge>
        </template>
    </TestContainer>
    
    <!-- Carousel -->
    <TestContainer dir="col">
        <TestLabel>Carousel</TestLabel>
        <Carousel buttonStyling="small circular" :buttonSpacing="2">
            <!-- Content -->
            <template #content>
                <template v-for="i in 5">
                    <OverallRating :ratings="ratings" 
                    class="flex shrink-0 snap-start"/>
                </template>
            </template>
        </Carousel>
    </TestContainer>

    <!-- Long Carousel -->
    <TestContainer dir="col">
        <TestLabel>Carousel Length Test</TestLabel>
        <Carousel :count="2"  buttonStyling="small circular" :buttonSpacing="1">
            <!-- Content -->
            <template #content>
                <template v-for="i in items">
                    <ListingCardSmall class="flex shrink-0 snap-start"
                    :ratingData="{rating: 5 - i + 0.5, reviewCount: (i)* 6}">
                        <template #header>
                            Apartment {{ i }}
                        </template>
                    </ListingCardSmall>
                </template>
            </template>
        </Carousel>
    </TestContainer>

    <!-- Image/Video Carousel -->
    <TestContainer dir="col">
        <TestLabel>Media Carousel</TestLabel>
        <Carousel :count="1" buttonStyling="large">
            <!-- Content -->
            <template #content>
                <template v-for="i in 3">
                    <MediaContainer class="flex shrink-0 snap-start"/>
                    <MediaContainer src="src/assets/test-assets/test-media.jpeg" 
                    class="flex shrink-0 snap-start"/>
                </template>
            </template>
        </Carousel>
    </TestContainer>

    <!-- Overall Rating -->
    <TestContainer dir="col">
        <TestLabel>Overall Rating Box</TestLabel>
        <OverallRating :ratings="ratings"/>
    </TestContainer>

    
    <!-- Review Card Small -->
    <TestContainer dir="col">
        <TestLabel>Review Cards</TestLabel>
        <div class="flex justify-evenly gap-20">
            <ReviewCard>
                <template #ownerReply>
                    Glad to hear that you were satisfied with our space! ^_^
                </template>
            </ReviewCard>
            <ReviewCard />
        </div>
    </TestContainer>

    <!-- Review Card Large -->
    <TestContainer dir="col">
        <TestLabel>Full Review Card</TestLabel>
        <div class="flex flex-col justify-evenly gap-2">
        <FullReviewCard> 
            <template #ownerReply>
                Glad to hear that you were satisfied with our space! ^_^
            </template>
        </FullReviewCard>
        <FullReviewCard/> 
        </div>
    </TestContainer>

    <!-- Listing Information -->
    <TestContainer dir="col">
        <TestLabel>Listing Information</TestLabel>
        <ListingInformation>
            <template #listing-name>Hello World</template>
            <template #description>
                This apartment is very nice. It has nice rooms and is placed very nicely.
                <br><br>
                It also has nice neighbors and a lot of other nice things.
            </template>
        </ListingInformation>
    </TestContainer>
</template>
