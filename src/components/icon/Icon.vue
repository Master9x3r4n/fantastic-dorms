<script setup>
    import { iconsData } from '@/assets/icons-data.js'
    import { computed } from 'vue';

    const props = defineProps({
        name: {
            type: String,
            default: ""
        }
    });

    const icons = computed(() => iconsData[props.name]);

</script>

<template>

    <template v-if="icons.isInternal">
        <img :src="icons.src" :alt="icons.alt" :width="icons.width" :height="icons.height">
    </template>
    <template v-else>
        after
    </template>
</template>