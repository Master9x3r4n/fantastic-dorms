<script setup>

const props = defineProps({
    ratings: {
        type: Array,
        default: [
            {
                name: "Cleanliness",
                rating: 4
            },
            {
                name: "Comfort",
                rating: 4
            },
            {
                name: "Spaciousness",
                rating: 3
            },
            {
                name: "Price",
                rating: 2 
            }
        ]
    }
})


const getOverallAttribute = () => {
    let sum = 0;
    for (let j =0; j < props.ratings.length; j ++) {
        sum += props.ratings[j].rating;
    }
    return (sum / props.ratings.length).toFixed(1)
}

</script>

<template>
    <div class="flex flex-col justify-center items-center 
    p-10 gap-3.75 w-105.25 h-79.25 border-3 rounded-3xl
    border-[#BFBFBF] bg-white dark:bg-[#111111] dark:border-[#111111] dark:text-white">
        <!-- Header Container -->
        <div class="h-12 w-full font-bold text-3xl leading-10 
        flex items-center justify-between">
            <!-- Overall -->
            <div>Overall</div>

            <!-- Rating -->
            <div class="flex justify-between items-center w-3/12">
                <img src="@\assets\rating-assets\star-full.svg" width="32px">
                <div>{{ getOverallAttribute() }}</div>
            </div>
        </div>

        <!-- Divider -->
        <div class="border-b-2 w-full border-[#BFBFBF]">
        </div>

        <!-- Attributes -->
        <template v-for="i in props.ratings.length">
            <div class="w-full text-2xl leading-7 flex items-center justify-between">
                <!-- Attribute Name -->
                <div class="flex gap-3">
                    <img src="@\assets\rating-assets\star-empty.svg" width="24px">
                    <div>{{ props.ratings[i-1].name }}</div>
                </div>

                <!-- Rating -->
                <div class="flex justify-between items-center w-[20%]">
                    <img src="@\assets\rating-assets\star-full.svg" width="24px">
                    <div>{{ props.ratings[i-1].rating.toFixed(1) }}</div>
                </div>
            </div>
        </template>

    </div>
</template>