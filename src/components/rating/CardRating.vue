<script setup>

const props = defineProps({
    rating: {
        type: Number,
        default: 4,
        validator(value, props) {
            return (value >= 0 && value <= 5)? value : 0
        }
    },
    reviewCount: {
        type: Number,
        default: 0
    }
})

const getstarCounts = () => {
    // If input 2.5 -> return [2, 1, 2]
    const baseCount = Math.floor(props.rating);
    const extraCount = (props.rating > baseCount)? 1 : 0;
    return [baseCount, extraCount, 5 - (baseCount + extraCount)]
}

const parseRating = () => {
    let ratingTemp = props.rating
    return ratingTemp.toFixed(1)
}

const getImageUrl = (index) => {
    return 'src/assets/rating-assets/star-'+['full', 'half', 'empty'][index]+'.svg'
}

</script>

<template>
    <!-- Flex-end container -->
    <div class="w-[85%] h-[50%] flex">
        <!-- Review Information -->
        <div class="flex flex-col h-full shrink-0 text-right justify-center p-1 dark:text-white">
            <h1 class="font-normal text-[20px] leading-5">
                {{ parseRating() }}
            </h1>
            <p class="italic font-normal text-[12px] leading-4">
                From {{ reviewCount }} reviews
            </p>
        </div>

        <!-- Review Stars -->
        <div class="flex h-full grow-4 justify-evenly items-center pt-auto pb-auto">
            <template v-for="j in 3">
                <template v-for="i in getstarCounts()[j-1]">
                    <img :src="getImageUrl(j-1)" width="36px">
                </template>
            </template>
        </div>
    </div>
</template>