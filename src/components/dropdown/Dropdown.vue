<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  width: {
    type: String,
    default: "311px"
  }
})

const isOpen = ref(false)
const dropdownRef = ref(null)

// Toggle open/close
const toggle = () => {
  isOpen.value = !isOpen.value
}

// Close if clicked outside the component
const close = (e) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    isOpen.value = false
  }
}

// Close if Escape key is pressed (Accessibility)
const handleKey = (e) => {
  if (e.key === 'Escape') {
    isOpen.value = false
  }
}

// Add/Remove listeners when component mounts/unmounts
onMounted(() => {
  document.addEventListener('click', close)
  document.addEventListener('keydown', handleKey)
})

onUnmounted(() => {
  document.removeEventListener('click', close)
  document.removeEventListener('keydown', handleKey)
})
</script>

<template>
  <div class="relative inline-block text-left" ref="dropdownRef">

    <div @click="toggle" class="cursor-pointer">
      <slot name="trigger"></slot>
    </div>

    <transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-200"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
    >
      <div
          v-show="isOpen"
          class="absolute right-0 top-full z-50 mt-2
                 h-fit w-screen
                 flex flex-col justify-center items-center p-8 gap-5
                 origin-top-right focus:outline-none rounded-[40px]
                 bg-white shadow-lg border border-gray-300
                 dark:bg-[#111111] dark:border-[#111111]"
          :style="{ maxWidth: width }"
      >
        <div class="py-1 w-full">
          <slot name="content"></slot>
        </div>
      </div>
    </transition>
  </div>
</template>