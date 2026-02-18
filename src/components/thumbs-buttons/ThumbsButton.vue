<script setup>
import { ref } from 'vue'

const props = defineProps({
    direction: {
        type: String,
        default: "up"
    }
})

const toggled = ref(false);

const getImageUrl = () => {
    const toggle = toggled.value? '-fill' : ''
    return `/src/assets/reply-rating-assets/thumbs-${props.direction}${toggle}.svg`
}

</script>

<template>
    <div class="flex items-center justify-center">
        <button @click="toggled = !toggled">
            <img :src="getImageUrl()" width="24px">
        </button>
    </div>
</template>