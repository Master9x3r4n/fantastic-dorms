<script setup>

import { useRouter} from 'vue-router';

const router = useRouter(); 

const routeHome = () => { router.push('/') }

</script>

<template>
  <button class="flex items-center justify-center w-[194px] h-9" @click="routeHome">
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" height="25px" viewBox="0 -960 960 960" width="25px" fill="#355AFF">
        <path d="M280-240h40v-60h320v60h40v-160q0-33-23.5-56.5T600-480H460v140H320v-180h-40v280Zm145.5-134.5Q440-389 440-410t-14.5-35.5Q411-460 390-460t-35.5 14.5Q340-431 340-410t14.5 35.5Q369-360 390-360t35.5-14.5ZM160-120v-480l320-240 320 240v480H160Z"/>
      </svg>
    </div>
    <div class="flex items-center justify-center h-9 font-medium text-[20px] text-[#355AFF] dark:text-white whitespace-nowrap pl-1">
      Fantastic Dorms
    </div>
  </button>
</template>

<style scoped>

</style>