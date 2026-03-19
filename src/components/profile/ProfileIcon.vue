<script setup>
import { ref, watch } from "vue"

const props = defineProps({
  src: {
    type: String,
    default: ""
  },
  alt: {
    type: String,
    default: "User profile"
  },
  sizeClass: {
    type: String,
    default: "w-9 h-9",
  },
	isAnonymous: {
		type: Boolean,
		default: false
	},
	iconSize: {
		type: String,
		default: ""
	}
})

const imageLoadError = ref(false)

watch(() => props.src, () => {
  imageLoadError.value = false
})
</script>

<template>
  <div
      :class="[
      props.sizeClass,
      'rounded-full overflow-hidden bg-gray-100 flex items-center justify-center shrink-0 relative'
    ]"
  >
    <img
        v-if="props.src && !imageLoadError && !isAnonymous"
        :src="props.src"
        :alt="props.alt"
        class="w-full h-full object-cover"
        @error="imageLoadError = true"
    />
		<span v-else-if="isAnonymous" class="material-symbols-outlined text-slate-400 text-sm!" :class="iconSize">person_off</span>

    <div v-else class="w-full h-full flex items-center justify-center">
      <svg
          class="w-full h-full block"
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="36" height="36" fill="#355AFF"/>
        <path d="M18 18C20.21 18 22 16.21 22 14C22 11.79 20.21 10 18 10C15.79 10 14 11.79 14 14C14 16.21 15.79 18 18 18ZM18 20C15.33 20 10 21.34 10 24V26H26V24C26 21.34 20.67 20 18 20Z" fill="white"/>
      </svg>
    </div>
  </div>
</template>