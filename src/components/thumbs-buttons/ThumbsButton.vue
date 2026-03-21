<script setup>
import { ref, computed } from 'vue'
// Astaghfirullah stephen stop leaving stuff to be fixed in the future
const props = defineProps({
	direction: {
		type: String,
		default: "up" // Expects "up" or "down"
	}
})

const toggled = ref(false);

// Dynamically construct the material symbol name based on the direction prop
const iconName = computed(() => `thumb_${props.direction.toLowerCase()}_off_alt`);
</script>

<template>
	<div
			class="flex items-center gap-1 cursor-pointer transition-colors 
			text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
			:class="{ 'text-slate-900 dark:text-white': toggled }"
			@click="toggled = !toggled"
	>
	<template v-if="toggled" class="text-slate-900 dark:text-white">
	</template>
    <span
				class="material-symbols-outlined text-[20px]!"
				:class="{ 'filled': toggled }"
		>
      {{ iconName }}
    </span>
	</div>
</template>

<style scoped>
@reference "tailwindcss";
</style>