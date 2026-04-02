<script setup>
import { ref, watch } from "vue"
import ToggleButton from "@/components/page-buttons/ToggleButton.vue";

const savedPreference = localStorage.getItem('DARK_PREFERENCE');
const darkMode = ref(savedPreference !== null ? JSON.parse(savedPreference): false);

document.documentElement.classList.toggle('dark', darkMode.value);

watch(darkMode, (enabled) => {
	document.documentElement.classList.toggle('dark', enabled);
	localStorage.setItem('DARK_PREFERENCE', JSON.stringify(enabled));
})

</script>

<template>
	<div class="p-0.5 flex items-center gap-2">
		<!-- Icon Container -->
		<div class="shrink-0 border-2 border-slate-200 dark:border-slate-700 rounded-full p-1 size-8.5 flex items-center justify-center bg-white dark:bg-[#355AFF] transition-colors duration-200">
        <span class="material-symbols-outlined text-[20px]! text-slate-700 dark:text-slate-200 select-none leading-none">
            {{ darkMode ? 'dark_mode' : 'light_mode' }}
        </span>
		</div>

		<!-- Toggle Button -->
		<label class="relative flex items-center shrink-0 w-15 h-8.5 cursor-pointer">
			<ToggleButton v-model="darkMode"/>
		</label>
	</div>
</template>