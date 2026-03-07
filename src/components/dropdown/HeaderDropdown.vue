<script setup>
import Dropdown from "@/components/dropdown/Dropdown.vue";
import DarkModeSlider from "@/components/darkmode/DarkModeSlider.vue";
import ProfileIcon from "@/components/profile/ProfileIcon.vue";

const props = defineProps({
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
})
</script>

<template>
	<Dropdown>
		<template #trigger>
			<slot></slot>
		</template>

		<template #content>
			<div class="flex flex-col justify-between items-center gap-2">

				<!-- Profile Info -->
				<div class="flex flex-row items-center w-57.75 h-14.5 gap-3.75">
					<ProfileIcon
							:src="profileImg"
							:alt="profileAlt"
							size-class="w-[58px] h-[58px]"
					/>
					<div class="flex flex-col justify-center items-start w-39.5 h-12 grow">
                <span class="text-[#676767] dark:text-gray-400 text-[16px] leading-4.75">
                  Logged in as
                </span>

						<span class="text-[#355AFF] text-[24px] leading-7.25">
                  @{{ username }}
                </span>
					</div>
				</div>

				<!-- Divider -->
				<div class="w-full h-0.5 bg-[#C5C5C5] dark:bg-[#3C4583] mx-auto my-2 transition-colors duration-200"></div>

				<!-- Profile Link -->
				<RouterLink to="/profile">
					<a class="flex flex-row items-center w-57.75 gap-2.5 p-2 -ml-2 rounded-md
            text-gray-900 dark:text-white
            hover:bg-gray-100 dark:hover:bg-[#1E1E1E] hover:text-[#355AFF] dark:hover:text-[#355AFF]
            transition-colors duration-200 cursor-pointer">
						<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M2 4H0V18C0 19.1 0.9 20 2 20H16V18H2V4ZM18 0H6C4.9 0 4 0.9 4 2V14C4 15.1 4.9 16 6 16H18C19.1 16 20 15.1 20 14V2C20 0.9 19.1 0 18 0ZM12 2C13.66 2 15 3.34 15 5C15 6.66 13.66 8 12 8C10.34 8 9 6.66 9 5C9 3.34 10.34 2 12 2ZM18 14H6V12.5C6 10.51 10 9.5 12 9.5C14 9.5 18 10.51 18 12.5V14Z"
										fill="currentColor"/>
						</svg>
						<span class="text-[20px]">View profile page</span>
					</a>
				</RouterLink>

				<!-- Settings Link -->
				<a class="flex flex-row items-center w-57.75 gap-2.5 p-2 -ml-2 rounded-md
            text-gray-900 dark:text-white
            hover:bg-gray-100 dark:hover:bg-[#1E1E1E] hover:text-[#355AFF] dark:hover:text-[#355AFF]
            transition-colors duration-200 cursor-pointer">
					<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M10 7.77778C8.77778 7.77778 7.77778 8.77778 7.77778 10C7.77778 11.2222 8.77778 12.2222 10 12.2222C11.2222 12.2222 12.2222 11.2222 12.2222 10C12.2222 8.77778 11.2222 7.77778 10 7.77778ZM17.7778 0H2.22222C0.988889 0 0 1 0 2.22222V17.7778C0 19 0.988889 20 2.22222 20H17.7778C19.0111 20 20 19 20 17.7778V2.22222C20 1 19.0111 0 17.7778 0ZM15.8333 10C15.8333 10.2556 15.8111 10.5111 15.7778 10.7556L17.4222 12.0444C17.5667 12.1667 17.6111 12.3778 17.5111 12.5444L15.9556 15.2333C15.8556 15.4 15.6556 15.4667 15.4778 15.4L13.5444 14.6222C13.1444 14.9333 12.7 15.1889 12.2333 15.3889L11.9444 17.4444C11.9111 17.6333 11.7444 17.7778 11.5556 17.7778H8.44445C8.25556 17.7778 8.08889 17.6333 8.05556 17.4556L7.76667 15.4C7.28889 15.2 6.85556 14.9444 6.45556 14.6333L4.52222 15.4111C4.34444 15.4778 4.14444 15.4111 4.04444 15.2444L2.48889 12.5556C2.38889 12.3889 2.43333 12.1778 2.57778 12.0556L4.22222 10.7666.16667 10.2556 4.16667 10C4.16667 9.74444 4.18889 9.48889 4.22222 9.24444L2.57778 7.95556C2.43333 7.83333 2.38889 7.62222 2.48889 7.45556L4.04444 4.76667C4.14444 4.6 4.34444 4.53333 4.52222 4.6L6.45556 5.37778C6.85556 5.06667 7.3 4.81111 7.76667 4.61111L8.05556 2.55556C8.08889 2.36667 8.25556 2.22222 8.44445 2.22222H11.5556C11.7444 2.22222 11.9111 2.36667 11.9444 2.54444L12.2333 4.6C12.7111 4.8 13.1444 5.05556 13.5444 5.36667L15.4778 4.58889C15.6556 4.52222 15.8556 4.58889 15.9556 4.75556L17.5111 7.44444C17.6111 7.61111 17.5667 7.82222 17.4222 7.94444L15.7778 9.23333C15.8111 9.48889 15.8333 9.74444 15.8333 10Z"
									fill="currentColor"/>
					</svg>
					<span class="text-[20px]">Settings</span>
				</a>
				
				<!-- Divider -->
				<div class="w-full h-0.5 bg-[#C5C5C5] dark:bg-[#3C4583] mx-auto my-2 transition-colors duration-200"></div>

				<div class="w-full"><DarkModeSlider/></div>

				<!-- Divider -->
				<div class="w-full h-0.5 bg-[#C5C5C5] dark:bg-[#3C4583] mx-auto my-2 transition-colors duration-200"></div>

				<!-- Sign Out -->
				<RouterLink to="/login">
				<a class="flex flex-row items-center w-57.75 gap-2.5 p-2 -ml-2 rounded-md
            text-gray-900 dark:text-white
            hover:bg-gray-100 dark:hover:bg-[#1E1E1E] hover:text-[#355AFF] dark:hover:text-[#355AFF]
            transition-colors duration-200 cursor-pointer">
					<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor">
						<path d="M206.78-100.78q-44.3 0-75.15-30.85-30.85-30.85-30.85-75.15v-546.44q0-44.3 30.85-75.15 30.85-30.85 75.15-30.85h277.74v106H206.78v546.44h277.74v106H206.78Zm425.87-152.09L559-328.39 657.61-427H355.48v-106h302.13L559-631.61l73.65-75.52L859.22-480 632.65-252.87Z"/>
					</svg>
					<span class="text-[20px]">Sign out</span>
				</a>
				</RouterLink>

			</div>
		</template>
	</Dropdown>
</template>

<style scoped>

</style>