<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
	direction: {
		type: String,
		default: "up" // Expects "up" or "down"
	},
	toggled: {
		type: Boolean,
		default: false
	}
})

const emit = defineEmits(['handleClick', 'updateValue']);
//const toggled = ref(false);
const score = ref(0);

const toggleButton = () => {
	emit('handleClick', props.direction);
	const add = props.toggled? ((props.direction) == "up"? 1: -1) : 0;
	score.value = add;
	emit('updateValue', score.value);
}


// Dynamically construct the material symbol name based on the direction prop
const iconName = computed(() => `thumb_${props.direction.toLowerCase()}_off_alt`);
</script>

<template>
	<div
			class="flex items-center gap-1 cursor-pointer transition-colors 
			text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
			:class="{ 'text-slate-900 dark:text-white': props.toggled }"
			@click="toggleButton"
	>
	<template v-if="props.toggled" class="text-slate-900 dark:text-white">
	</template>
    <span
				class="material-symbols-outlined text-[20px]!"
				:class="{ 'filled': props.toggled }"
		>
      {{ iconName }}
    </span>
	</div>
</template>