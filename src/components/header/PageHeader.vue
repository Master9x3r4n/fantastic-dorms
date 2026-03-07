<script setup>
import SearchBar from "@/components/header/SearchBar.vue";
import Logo from "@/components/header/Logo.vue";
import ProfileIcon from "@/components/profile/ProfileIcon.vue";
import DarkModeSlider from "../darkmode/DarkModeSlider.vue";
import HeaderDropdown from "@/components/dropdown/HeaderDropdown.vue";

const props = defineProps({
  search: {
    type: Boolean,
    default: true,
  },
  profileImg: {
    type: String,
    default: "",
  },
  profileAlt: {
    type: String,
    default: "",
  },
  username: {
    type: String,
    default: "username",
  },
  loggedIn: {
    type: Boolean,
    default: true,
  }
});
</script>

<template>
  <header class="sticky top-0 z-50 flex h-[76px] w-full items-center bg-white dark:bg-[#111111] px-4 py-3 shadow-md justify-between transition-colors duration-200">
    <Logo />

    <!-- Centered Search Bar-->
    <div :class="[{'invisible': !props.search}, 'w-full flex justify-center']">
      <SearchBar />
    </div>

    <!-- Auth Buttons OR Profile Dropdown -->
    <div class="flex items-center gap-4">

      <!-- LOGGED OUT STATE -->
      <div v-if="!props.loggedIn" class="flex items-center gap-3">
        <!-- Dark Mode Toggle -->
        <div class="mr-2"><DarkModeSlider /></div>

        <!-- Log In  -->
        <!-- <button class="px-2 py-2.5 w-[75px] rounded-lg font-semibold text-sm text-gray-700 bg-gray-100 dark:bg-[#121212] dark:text-white hover:bg-gray-200 dark:hover:bg-[#1E1E1E] transition-all duration-200">
          Log in
        </button> -->

        <!-- Sign Up  -->
        <!-- <button class="px-2 py-2.5 w-[75px] rounded-lg font-semibold text-sm text-white bg-[#355AFF] hover:bg-[#2C0ED6] hover:scale-105 shadow-md shadow-[#355AFF]/20 transition-all duration-200">
          Sign up
        </button> -->
      </div>

      <!-- LOGGED IN STATE -->
      <HeaderDropdown v-else :profileImg="profileImg" :profileAlt="profileAlt" :username="username">
				<button class="rounded-full transition-all duration-200 hover:scale-105 hover:bg-accent">
					<ProfileIcon :src="profileImg" :alt="profileAlt" />
				</button>
			</HeaderDropdown>
    </div>
  </header>
</template>

<style scoped>

</style>