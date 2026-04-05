<script setup>
import { ref, computed } from 'vue';

defineOptions({ inheritAttrs: false });

const props = defineProps({
	options: {
		type: Array,
		default: () => []
	},
	placeholder: {
		type: String,
		default: 'Search...'
	},
	modelValue: {
		type: String,
		default: ''
	}
});

const emit = defineEmits(['update:modelValue', 'select']);

const query = ref(props.modelValue);
const isOpen = ref(false);
const highlightedIndex = ref(-1);
const isInvalid = ref(false);

const isValidOption = computed(() =>
		props.options.some(o => o.toLowerCase() === query.value.toLowerCase())
);

const suggestions = computed(() => {
	if (!query.value.trim()) return [];
	return props.options
			.filter(option => option.toLowerCase().includes(query.value.toLowerCase()))
			.slice(0, 6);
});

const onInput = (e) => {
	query.value = e.target.value;
	emit('update:modelValue', query.value);
	isOpen.value = true;
	isInvalid.value = false;
	highlightedIndex.value = -1;
};

const select = (option) => {
	query.value = option;
	emit('update:modelValue', option);
	emit('select', option);
	isInvalid.value = false;
	isOpen.value = false;
};

const onBlur = () => {
	setTimeout(() => {
		isOpen.value = false;
		// Only validate if the user typed something
		if (query.value.trim() && !isValidOption.value) {
			isInvalid.value = true;
			query.value = '';
			emit('update:modelValue', '');
		}
	}, 150);
};

const onKeydown = (e) => {
	if (e.key === 'Enter') e.preventDefault(); // always block Enter from bubbling

	if (!isOpen.value || !suggestions.value.length) return;

	if (e.key === 'ArrowDown') {
		e.preventDefault();
		highlightedIndex.value = Math.min(highlightedIndex.value + 1, suggestions.value.length - 1);
	} else if (e.key === 'ArrowUp') {
		e.preventDefault();
		highlightedIndex.value = Math.max(highlightedIndex.value - 1, 0);
	} else if (e.key === 'Enter' && highlightedIndex.value >= 0) {
		select(suggestions.value[highlightedIndex.value]);
	} else if (e.key === 'Escape') {
		isOpen.value = false;
	}
};
</script>

<template>
	<div class="relative w-full text-['Inter']">
		<input
				:value="query"
				:placeholder="placeholder"
				@input="onInput"
				@keydown="onKeydown"
				@focus="isOpen = true; isInvalid = false"
				@blur="onBlur"
				type="text"
				:class="[
        'w-full px-4 py-3 rounded-xl border bg-white dark:bg-[#121422] text-black dark:text-white focus:ring-2 focus:border-transparent outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500',
        isInvalid
          ? 'border-red-400 focus:ring-red-200 dark:focus:ring-red-500/20'
          : 'border-slate-200 dark:border-slate-700 focus:ring-[#355AFF]',
        $attrs.class
      ]"
		/>

		<!-- Error message -->
		<p v-if="isInvalid" class="mt-1.5 text-xs text-red-500">
			Please select a valid option from the list.
		</p>

		<Transition name="dropdown">
			<ul
					v-if="isOpen && suggestions.length"
					class="absolute z-50 mt-1 w-full bg-white dark:bg-[#121422] border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden"
			>
				<li
						v-for="(option, index) in suggestions"
						:key="option"
						@mousedown.prevent="select(option)"
						:class="[
            'px-4 py-3 cursor-pointer text-sm transition-colors',
            index === highlightedIndex
              ? 'bg-[#355AFF] text-white'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
          ]"
				>
					{{ option }}
				</li>
			</ul>
		</Transition>
	</div>
</template>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
	transition: opacity 0.15s ease, transform 0.15s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
	opacity: 0;
	transform: translateY(-4px);
}
</style>