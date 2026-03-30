<script setup>
const props = defineProps({
    name: { type: String },
    count: {type: Number}
})
</script>
<template>
    <div class="flex justify-between items-center mb-4">
        <h1 class="text-4xl font-bold text-gray-800 dark:text-white">{{ props.name }}</h1>
        <span class="bg-blue-100 text-blue-800 
        px-3 py-1 rounded-full text-sm font-medium">
        Total {{ props.name }}: {{ props.count }}
        </span>
    </div>
</template>