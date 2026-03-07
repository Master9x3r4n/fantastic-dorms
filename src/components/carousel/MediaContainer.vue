<script setup>

const props = defineProps({
    src: {
        type: String,
        default: ""
    },
    alt: {
        type: String,
        default: "media"
    },
    size: {
        type: String,
        default: "large"
    }
})

</script>

<!-- 740 x 430 -->
<template>
        <div class="flex justify-center items-center rounded-3xl"
        :class="[!props.src? 'bg-gradient': '', props.size]">
            <img v-if="props.src" :src="props.src" width="740px" :alt="props.alt"
            class="rounded-3xl h-full object-cover">
        </div>
</template>



<style scoped>
@reference "tailwindcss";

.bg-gradient {
    background: linear-gradient(97.79deg, #355AFF -0.78%, #2C0ED6 100%);
}

.large {
    @apply w-185 h-107.5
}

.wide {
    @apply w-185 h-84
}

.medium {
    @apply size-67
}

.small {
    @apply size-24
}

</style>