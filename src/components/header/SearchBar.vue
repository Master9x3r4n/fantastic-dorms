<script setup>
import { ref, computed, nextTick } from "vue";
import { useRouter, useRoute } from 'vue-router';

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
    container: "max-w-[620px] h-9 bg-[#EAEAEA] pr-1",
    input: "text-sm bg-[#EAEAEA]",
    searchBtn: "bg-[#355AFF] hover:bg-[#2C0ED6] text-white h-full px-2",
    clearBtn: "p-1 hover:bg-[#BFBFBF] text-gray-500",
  },
  alt: {
    container: "max-w-[591px] h-[54px] bg-[#FFFFFF] pr-1",
    input: "text-lg bg-[#FFFFFF]",
    searchBtn: "bg-[#355AFF] hover:bg-[#2C0ED6] text-white p-2 rounded-full mr-1",
    clearBtn: "p-2 hover:bg-[#BFBFBF] text-gray-500",
  },
};

// compute which style the search bar is
const theme = computed(() => styles[props.type] || styles.default);

// clear search logic
const clearSearch = () => {
  searchQuery.value = "";
  nextTick(() => inputRef.value?.focus());
};

//route to search page
const routeSearch = () => { 
  router.push({
    name: 'search',
    query: { q: searchQuery.value }
  }) 

}

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
        <SearchIcon />
      </button>

      <input
          ref="inputRef"
          v-model="searchQuery"
          type="text"
          placeholder="Start searching..."
          name="searchbar"
          :class="[theme.input, 'w-full h-full px-3 outline-none text-gray-700']"
      />

      <button
          v-show="searchQuery"
          @click="clearSearch"
          :class="[theme.clearBtn, 'rounded-full flex items-center justify-center transition-colors mr-1']"
          aria-label="Clear search"
      >
        <ClearIcon />
      </button>

      <button 
          @click="routeSearch"
          v-if="props.type === 'alt'"
          :class="[theme.searchBtn, 'flex items-center justify-center transition-colors']"
          aria-label="Search"
      >
        <SearchIcon />
      </button>
    </div>
</template>

<script>
import { h } from 'vue';

const SearchIcon = () => h('svg', { xmlns: "http://www.w3.org/2000/svg", height: "24px", viewBox: "0 -960 960 960", width: "24px", fill: "currentColor" }, [
  h('path', { d: "M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" })
]);

const ClearIcon = () => h('svg', { xmlns: "http://www.w3.org/2000/svg", height: "18px", viewBox: "0 -960 960 960", width: "18px", fill: "currentColor" }, [
  h('path', { d: "m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" })
]);

export default {
  components: { SearchIcon, ClearIcon }
}
</script>