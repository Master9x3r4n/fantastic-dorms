<script setup>
import { ref, computed, nextTick, watch } from "vue";
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const props = defineProps({
	type: {
		type: String,
		default: "default",
	},
});

// Initialize from URL so the input is pre-filled when on search page
const searchQuery = ref(route.query.q || "");
const inputRef = ref(null);

// Style Configuration - Updated to match app design language
const styles = {
	default: {
		container: "max-w-[620px] h-9 bg-slate-100 dark:bg-[#1E1E1E] border border-slate-200 dark:border-slate-700 pr-1",
		input: "text-sm bg-transparent text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400",
		searchBtn: "bg-[#355AFF] hover:bg-[#2b4bcc] text-white h-full px-2",
		clearBtn: "p-1 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400",
	},
	alt: {
		container: "max-w-[591px] h-[54px] bg-white dark:bg-[#121422] pr-1 border border-slate-200 dark:border-slate-700",
		input: "text-lg bg-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500",
		searchBtn: "bg-[#355AFF] hover:bg-[#2b4bcc] text-white p-2 rounded-full mr-1 shadow-sm",
		clearBtn: "p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400",
	},
};

// compute which style the search bar is
const theme = computed(() => styles[props.type] || styles.default);

// clear search logic
const clearSearch = () => {
	searchQuery.value = "";
	nextTick(() => {
		inputRef.value?.focus();
		if (route.name === 'search') routeSearch();
	});
};

// route to search page
const routeSearch = () => {
	const trimmedQuery = searchQuery.value.trim();

	router.push({
		name: 'search',
		query: trimmedQuery ? { q: trimmedQuery } : {}
	});
};

// Sync input when the route query changes (e.g. navigating away and back)
watch(() => route.query.q, (newQuery) => {
	// Only update if this isn't the search page (clears on other routes)
	if (route.name !== 'search') {
		searchQuery.value = "";
	} else {
		searchQuery.value = newQuery || "";
	}
});
</script>

<template>
	<div
			:class="[
        theme.container,
        'w-full flex items-center overflow-hidden rounded-full focus-within:ring-2 focus-within:ring-[#355AFF]/30 focus-within:border-[#355AFF] transition-all shadow-sm'
      ]"
	>
		<button
				@click="routeSearch"
				v-if="props.type === 'default'"
				:class="[theme.searchBtn, 'flex items-center justify-center transition-colors']"
				aria-label="Search"
		>
			<span class="material-symbols-outlined text-[20px]">search</span>
		</button>

		<input
				ref="inputRef"
				v-model="searchQuery"
				@keydown.enter="routeSearch"
				type="text"
				placeholder="Start searching..."
				name="searchbar"
				:class="[theme.input, 'w-full h-full px-3 outline-none font-[\'Inter\']']"
		/>

		<button
				v-show="searchQuery"
				@click="clearSearch"
				:class="[theme.clearBtn, 'rounded-full flex items-center justify-center transition-colors mr-1']"
				aria-label="Clear search"
		>
			<span class="material-symbols-outlined text-[18px]">close</span>
		</button>

		<button
				@click="routeSearch"
				v-if="props.type === 'alt'"
				:class="[theme.searchBtn, 'flex items-center justify-center transition-colors']"
				aria-label="Search"
		>
			<span class="material-symbols-outlined text-[24px]">search</span>
		</button>
	</div>
</template>