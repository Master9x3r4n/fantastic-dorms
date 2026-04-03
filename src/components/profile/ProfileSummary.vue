<script setup>
import ProfileIcon from '@/components/profile/ProfileIcon.vue'

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
	<!-- Made responsive: stacks on mobile, row on md+ screens -->
	<div class="flex flex-col md:flex-row items-center md:items-start gap-6 w-full">

		<!-- Profile Picture -->
		<ProfileIcon
				:src="profileImg"
				alt="Profile Picture"
				sizeClass="w-28 h-28 md:w-36 md:h-36 shrink-0 shadow-sm border-2 border-slate-100 dark:border-slate-700"
		/>

		<!-- Text Info -->
		<div class="flex flex-col justify-center items-center md:items-start gap-4 w-full md:mt-3">

			<!-- Name & Join Date -->
			<div class="flex flex-col items-center md:items-start gap-1 w-full text-center md:text-left">
				<h1 class="font-bold text-3xl md:text-4xl text-slate-900 dark:text-white tracking-tight">
					{{ name }}
				</h1>

				<p class="text-base text-slate-700 dark:text-slate-300 mt-1">
          <span class="font-semibold text-[#355AFF]">
            {{ username.startsWith('@') ? username : '@' + username }}
          </span>
					<span class="mx-2 text-slate-300 dark:text-slate-600">•</span>
					<span class="italic text-slate-500 dark:text-slate-400">Joined {{ joinDate }}</span>
				</p>
			</div>

			<!-- University Badge -->
			<div class="flex flex-row justify-center items-center px-5 py-2 gap-2 bg-[#355AFF] rounded-full shadow-sm shadow-[#355AFF]/20 mt-1">
				<span class="material-symbols-outlined text-white text-[20px]">school</span>
				<span class="font-medium text-sm md:text-base text-white">
          {{ university }}
        </span>
			</div>

		</div>
	</div>
</template>

<style scoped>
.material-symbols-outlined {
	font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>