<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/auth';
import Dropdown from "@/components/dropdown/Dropdown.vue";
import DarkModeSlider from "@/components/darkmode/DarkModeSlider.vue";
import ProfileIcon from "@/components/profile/ProfileIcon.vue";
import Divider from "@/components/divider/Divider.vue";

const router = useRouter();
const auth = useAuthStore();

const info = ref({
	username: '',
	picture: ''
});

const isLoggedIn = ref(false);

//Get user from session storage
onMounted(async () => {
	//const data = JSON.parse(localStorage.getItem('USER'));
	if (!auth.user) {
		await auth.fetchCurrentUser();
	}
	const data = auth.user;

	if (data) {
		isLoggedIn.value = true;
		info.value.username = data.username;
		info.value.picture = data.picture;
	} else {
		isLoggedIn.value = false;
	}
});

const logout = async () => {
	//localStorage.removeItem('USER');
	await auth.logout();
	router.push('/login')
}
</script>

<template>
	<Dropdown>
		<template #trigger>
			<slot></slot>
		</template>

		<template #content>
			<!-- Wrapper with a min-width so children don't need hardcoded widths -->
			<div class="flex flex-col gap-1.5 p-2 min-w-65">
				<!-- Profile Info -->
				<div class="flex items-center gap-3 p-2 mb-1">
					<ProfileIcon
						:src="info.picture"
						:alt="info.username"
						sizeClass="w-12 h-12 shrink-0"
					/>
					<div class="flex flex-col overflow-hidden">
						<span class="text-sm text-gray-500 dark:text-gray-400 font-medium">
							Logged in as
						</span>
						<span class="text-xl font-semibold text-[#355AFF] truncate">
							<div v-if="isLoggedIn">@{{ info.username }}</div>
							<div v-else>Guest</div>
						</span>
					</div>
				</div>

				<Divider/>

				<!-- Profile Link -->
				<RouterLink
					to="/profile"
					class="flex items-center gap-3 p-2.5 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#1E1E1E] hover:text-[#355AFF] dark:hover:text-[#355AFF] transition-all duration-200 group"
				>
					<span class="material-symbols-outlined text-xl shrink-0 opacity-80 group-hover:opacity-100">
						person
					</span>
					<span class="text-base font-medium">View profile</span>
				</RouterLink>

				<!-- Settings Link -->
				<RouterLink
					to="/settings"
					class="flex items-center gap-3 p-2.5 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#1E1E1E] hover:text-[#355AFF] dark:hover:text-[#355AFF] transition-all duration-200 group"
				>
					<span class="material-symbols-outlined text-xl shrink-0 opacity-80 group-hover:opacity-100">
						settings
					</span>
					<span class="text-base font-medium">Settings</span>
				</RouterLink>

				<Divider />

				<div class="px-2.5 py-1">
					<DarkModeSlider />
				</div>

				<Divider />

				<!-- Sign Out -->
				<a
					@click="logout"
					class="flex items-center gap-3 p-2.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200 group"
				>
					<span class="material-symbols-outlined text-xl shrink-0 opacity-80 group-hover:opacity-100">
						logout
					</span>
					<span class="text-base font-medium">Sign out</span>
				</a>
			</div>
		</template>
	</Dropdown>
</template>