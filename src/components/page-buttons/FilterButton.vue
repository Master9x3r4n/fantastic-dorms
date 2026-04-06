<script setup>
import { computed } from 'vue'

const props = defineProps({
	value: {
		type: String,
		required: true
	},
	modelValue: {
		type: Array,
		default: () => []
	}
})

const emit = defineEmits(['update:modelValue'])

const isChecked = computed(() => props.modelValue.includes(props.value))

const toggle = () => {
	const newValue = [...props.modelValue]
	const index = newValue.indexOf(props.value)

	if (index > -1) {
		newValue.splice(index, 1);
	} else {
		newValue.push(props.value);
	}

	emit('update:modelValue', newValue);
}
</script>

<template>
	<button
			type="button"
			@click="toggle"
			class="flex justify-center items-center px-5 py-2 border rounded-full whitespace-nowrap cursor-pointer transition-all duration-200 font-medium text-sm focus:outline-none select-none"
			:class="isChecked
      ? 'bg-[#355AFF] text-white border-[#355AFF] shadow-md shadow-[#355AFF]/20'
      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border-transparent hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'"
	>
		<slot>Really Cool University</slot>
	</button>
</template>

<style scoped>
@reference "tailwindcss";
</style>