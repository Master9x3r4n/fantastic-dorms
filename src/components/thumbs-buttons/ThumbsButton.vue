<script setup>
import { ref } from 'vue'
import Icon from '../icon/Icon.vue';

const props = defineProps({
    direction: {
        type: String,
        default: "up"
    }
})

const toggled = ref(false);

const getDirection = () => {
    return props.direction.charAt(0).toUpperCase() + props.direction.slice(1).toLowerCase();
}

const getIconName = () => {
    const toggle = toggled.value? 'Fill' : ''
    return `thumbs${getDirection()}${toggle}`
}

</script>

<template>
    <div class="flex items-center justify-center">
        <button @click="toggled = !toggled">
            <!-- <img :src="getImageUrl()" width="24px"> -->
            <Icon :name="getIconName()"/>
        </button>
    </div>
</template>