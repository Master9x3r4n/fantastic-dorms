<script setup>
import ProfileIcon from './ProfileIcon.vue'

const props = defineProps({
  name: {
    type: String,
    default: 'User'
  },
  username: {
    type: String,
    default: '@username'
  },
  joinDate: {
    type: String,
    default: 'March 1st, 2026'
  },
  university: {
    type: String,
    default: 'De La Salle University - 2024'
  },
  profileImg: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div class="flex flex-row items-center gap-[20px] w-fill w-max-[1200px] h-[150px]">

    <ProfileIcon
        :src="profileImg"
        alt="Profile Picture"
        size-class="w-[150px] h-[150px]"
    />

    <div class="flex flex-col justify-center items-start gap-[20px] w-fill w-max-[600px] h-[122px]">

      <div class="flex flex-col items-start gap-[5px] w-full">
        <h1 class=" font-bold text-[32px] leading-[39px] text-black dark:text-white">
          {{ name }}
        </h1>

        <p class="text-[16px] leading-[19px] text-black dark:text-white">
          {{ username }} • <span class="italic text-gray-400">Joined {{ joinDate }}</span>
        </p>
      </div>

      <div class="flex flex-row justify-center items-center px-[20px] py-[10px] gap-[10px] bg-[#355AFF] rounded-[40px]">

				<!-- School Icon -->
				<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF">
					<path d="M838.87-271.52v-274.87L480-350.96 23.61-600 480-848.48 936.39-600v328.48h-97.52ZM480-112.09 192.09-267.48V-459L480-302.48 767.91-459v191.52L480-112.09Z"/>
				</svg>

        <span class="font-normal text-[16px] leading-[19px] text-white">
          {{ university }}
        </span>

      </div>

    </div>
  </div>
</template>