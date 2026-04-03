<script setup>
const props = defineProps({
	tags: {
		type: Array,
		required: true,
	}
})
</script>

<template>
	<div v-if="tags.length > 0" class="flex flex-wrap gap-2 mb-6">
		<span v-for="tag in tags" :key="tag" class="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md text-xs font-medium">
			{{ tag }}
		</span>
	</div>
</template>

<style scoped>

</style>