<script setup>
import { ref, computed, nextTick } from "vue";
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
	type: {
		type: String,
		default: "default",
	},
});

const searchQuery = ref("");
const inputRef = ref(null);

// Style Configuration
const styles = {
	default: {
		container: "max-w-[620px] h-9 bg-[#EAEAEA] dark:bg-slate-800 pr-1",
		input: "text-sm bg-transparent text-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400",
		searchBtn: "bg-[#355AFF] hover:bg-[#2C0ED6] text-white h-full px-2",
		clearBtn: "p-1 hover:bg-[#BFBFBF] dark:hover:bg-slate-700 text-gray-500 dark:text-gray-400",
	},
	alt: {
		container: "max-w-[591px] h-[54px] bg-[#FFFFFF] dark:bg-[#1E1E1E] pr-1 border border-slate-200 dark:border-slate-700",
		input: "text-lg bg-transparent text-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500",
		searchBtn: "bg-[#355AFF] hover:bg-[#2C0ED6] text-white p-2 rounded-full mr-1",
		clearBtn: "p-2 hover:bg-[#BFBFBF] dark:hover:bg-slate-700 text-gray-500 dark:text-gray-400",
	},
};

// compute which style the search bar is
const theme = computed(() => styles[props.type] || styles.default);

// clear search logic
const clearSearch = () => {
	searchQuery.value = "";
	nextTick(() => inputRef.value?.focus());
};

// route to search page
const routeSearch = () => {
	const trimmedQuery = searchQuery.value.trim();

	router.push({
		name: 'search',
		query: trimmedQuery ? { q: trimmedQuery } : {}
	});
};
</script>

<template>
	<div
			:class="[
        theme.container,
        'w-full flex items-center overflow-hidden border-gray-300 rounded-full focus-within:ring-2 focus-within:ring-[#355AFF] focus-within:border-transparent transition-all shadow-sm'
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
				:class="[theme.input, 'w-full h-full px-3 outline-none']"
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