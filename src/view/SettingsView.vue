<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from "vue-router";
import Divider from "@/components/divider/Divider.vue";
import PasswordToggleButton from "@/components/page-buttons/PasswordToggleButton.vue";
import ProfileSettingsSection from "@/components/settings/ProfileSettings.vue"
import { useAuthStore } from "@/auth";
import ProfileService from '@/services/ProfileService';

// Previous Page button
const router = useRouter();

const goBack = () => {
	router.back();
};

// Security State
const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

// Show Password Toggle States
const showCurrent = ref(false);
const showNew = ref(false);
const showConfirm = ref(false);

// Retrieve current user data
const auth = useAuthStore();
const userInfo = ref(null);
onMounted(async () => {
	await auth.fetchCurrentUser();

  if (auth.user){
		userInfo.value = {
			profileImg: auth.user.picture,
			firstName: auth.user.name.firstName,
			lastName: auth.user.name.lastName,
			username: auth.user.username,
			school: auth.user.school.name,
			home: auth.user.dorm.name,
			bio: auth.user.bio
		}
	}
})

// Handlers
const handleProfileSave = async () => {
	await auth.fetchCurrentUser();
	alert("Profile saved successfully!");
	await router.push({
		name: 'profile',
		params: { id: auth.user.username }
	});
};

const handlePasswordUpdate = async () => {
	if (newPassword.value !== confirmPassword.value) {
		alert("New passwords don't match!");
		return;
	}

    const username = userInfo.value?.username;

    if (!username) {
        alert("User not found. Please log in again.");
        return;
    }

	try
	{
		await ProfileService.updatePassword(
			username,
			{
				currentPassword: currentPassword.value,
				newPassword: newPassword.value,
			}
		);

		alert("Password updated successfully!");
		currentPassword.value = '';
		newPassword.value = '';
		confirmPassword.value = '';
	}
	catch (err)
	{
		console.error(`${err}`);
		const errorMessage = err.response?.data?.message || "An error occurred";
    
		alert(errorMessage);
	}
	
	console.log('Updating password...');
	// update it in the backend
	// also we should have encryption and password salting here so update ts when we have that lol
};
</script>

<template>
	<div class="min-h-screen flex flex-col bg-white dark:bg-[#121422] text-black dark:text-white transition-colors duration-200">
		<main class="flex-1 flex items-center justify-center p-4 md:p-10">
			<div class="w-full max-w-4xl">
				<button class="flex items-center text-sm text-slate-500 dark:text-slate-400 hover:text-[#355AFF]
											 dark:hover:text-[#355AFF] transition-colors mb-6 border border-slate-200 dark:border-slate-700 rounded-md
											 px-3 py-1.5 bg-white dark:bg-[#121422] shadow-sm"
								@click="goBack"
				>
					<span class="material-symbols-outlined text-[16px]! mr-1">arrow_back</span>
					Back to previous page
				</button>

				<!--Profile Settings Section -->
				<ProfileSettingsSection
						v-if="userInfo"
						:userInfo="userInfo"
						@save="handleProfileSave"
				/>

				<!-- Account Security Section -->
				<div class="bg-white dark:bg-[#121422] mb-6 w-full p-4 rounded-lg border border-solid border-slate-200 shadow-sm transition-colors duration-200 dark:border-slate-700">
					<div class="p-6 md:p-8">
						<h2 class="text-2xl font-bold text-black dark:text-white">Account Security</h2>
						<p class="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage your account security and password.</p>
					</div>
					<Divider />
					<div class="p-6 md:p-8">
						<form @submit.prevent="handlePasswordUpdate" class="space-y-6">
							<div class="grid grid-cols-1 md:grid-cols-2 gap-6">

								<!-- Current Password -->
								<div class="space-y-2">
									<label class="text-sm font-semibold text-black dark:text-white">Current Password</label>
									<div class="relative">
										<input
												v-model="currentPassword"
												:type="showCurrent ? 'text' : 'password'"
												placeholder="Enter current password"
												class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#121422] text-black dark:text-white focus:ring-2 focus:ring-[#355AFF] focus:border-transparent outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
												required
										/>
										<PasswordToggleButton v-model="showCurrent"/>
									</div>
								</div>

								<div class="hidden md:block"></div>

								<!-- New Password -->
								<div class="space-y-2">
									<label class="text-sm font-semibold text-black dark:text-white">New Password</label>
									<div class="relative">
										<input
												v-model="newPassword"
												:type="showNew ? 'text' : 'password'"
												placeholder="Enter new password"
												class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#121422] text-black dark:text-white focus:ring-2 focus:ring-[#355AFF] focus:border-transparent outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
												required
										/>
										<PasswordToggleButton v-model="showNew"/>
									</div>
								</div>

								<!-- Confirm New Password -->
								<div class="space-y-2">
									<label class="text-sm font-semibold text-black dark:text-white">Confirm New Password</label>
									<div class="relative">
										<input
												v-model="confirmPassword"
												:type="showConfirm ? 'text' : 'password'"
												placeholder="Confirm new password"
												class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#121422] text-black dark:text-white focus:ring-2 focus:ring-[#355AFF] focus:border-transparent outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
												required
										/>
										<PasswordToggleButton v-model="showConfirm"/>
									</div>
								</div>
							</div>
							<Divider />
							<!-- Action Buttons -->
							<div class="flex justify-end gap-4 py-6 ">
								<button type="submit" class="bg-[#355AFF] hover:bg-[#2b4bcc] text-white px-6 py-2 rounded-md text-sm font-medium transition-colors shadow-sm">
									Update Password
								</button>
							</div>
						</form>
					</div>
				</div>

			</div>
		</main>
	</div>
</template>

<style>
</style>