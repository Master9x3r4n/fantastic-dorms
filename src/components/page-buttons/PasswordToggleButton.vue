<script setup>
const props = defineProps({
	modelValue: {
		type: Boolean,
		required: true
	}
})

const emit = defineEmits(['update:modelValue'])

const togglePassword = () => {
	emit('update:modelValue', !props.modelValue)
}
</script>

<template>
	<button
			@click="togglePassword"
			type="button"
			class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 focus:outline-none transition-colors"
			:aria-label="modelValue ? 'Hide password' : 'Show password'"
			:title="modelValue ? 'Hide password' : 'Show password'"
	>
        <span class="material-symbols-outlined text-xl select-none">
            {{ modelValue ? 'visibility' : 'visibility_off' }}
        </span>
	</button>
</template>