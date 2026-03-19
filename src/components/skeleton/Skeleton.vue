<script setup>
    
    const props = defineProps({
        w: {
            type: String,
            default: 'w-full'
        },
        h: {
            type: String,
            default: 'h-4'
        }
    });

</script>

<template>
    <div class="animate-pulse bg-gray-200 rounded"
         :class="[w, h]"></div>
</template>