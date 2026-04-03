<script setup>
defineProps({
	modelValue: {
		type: Boolean,
		default: false
	}
});

defineEmits(['update:modelValue']);
</script>

<template>
	<label class="relative inline-flex items-center cursor-pointer">
		<input
				type="checkbox"
				:checked="modelValue"
				@change="$emit('update:modelValue', $event.target.checked)"
				class="sr-only peer"
		/>
		<div class="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4
								peer-focus:ring-[#355AFF]/30 rounded-full peer peer-checked:after:translate-x-full
								peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5
								after:bg-white after:border-slate-300 dark:border-slate-600 after:border after:rounded-full after:h-5
								after:w-5 after:transition-all peer-checked:bg-[#355AFF]"></div>
	</label>
</template>

<style>
</style>