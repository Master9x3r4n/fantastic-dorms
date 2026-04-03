<script setup>
import SearchBar from "@/components/header/SearchBar.vue";
import Logo from "@/components/header/Logo.vue";
import ProfileIcon from "@/components/profile/ProfileIcon.vue";
import HeaderDropdown from "@/components/dropdown/HeaderDropdown.vue";
import DarkModeSlider from "@/components/darkmode/DarkModeSlider.vue";

const props = defineProps({
	search: {
		type: Boolean,
		default: true,
	},
	loggedIn:{
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
	}
});
</script>

<template>
	<header class="sticky top-0 z-50 flex h-19 w-full items-center justify-between bg-white dark:bg-slate-900 px-4 py-3 shadow-md transition-colors duration-200 font-['Inter']">
		<Logo />

		<!-- Centered Search Bar-->
		<div :class="[{'invisible': !props.search}, 'w-full flex justify-center mx-3']">
			<SearchBar />
		</div>

		<!-- Profile Dropdown -->
		<div v-if="loggedIn" class="flex items-center gap-4">
			<HeaderDropdown :profileImg="profileImg" :profileAlt="profileAlt" :username="username">
				<button class="rounded-full transition-all duration-200 hover:scale-105 hover:bg-slate-100 dark:hover:bg-slate-800">
					<ProfileIcon :src="profileImg" :alt="profileAlt" />
				</button>
			</HeaderDropdown>
		</div>
		<div v-else>
			<DarkModeSlider />
		</div>
	</header>
</template>

<style scoped>
</style>