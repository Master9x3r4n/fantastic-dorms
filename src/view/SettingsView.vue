<script setup>
import { ref, computed } from 'vue';
import Divider from "@/components/divider/Divider.vue";

// Define Props with Default Values
const props = defineProps({
	userInfo: {
		type: Object,
		default: () => ({
			profileImg: 'https://i.pinimg.com/736x/f3/b1/f8/f3b1f8c618080a7d0af8f0dc1b7c90ae.jpg',
			name: 'Aya Oosawa',
			username: 'ayasjpg',
			school: 'De La Salle University Manila',
			home: 'Metro Haven Suites',
			bio: 'Comp sci student. Loves natural light and good coffee.'
		})
	}
});

// Local Form State (initialized from props to allow editing)
const formData = ref({ ...props.userInfo });

// Security State
const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

// Computed
const bioCharacterCount = computed(() => formData.value.bio.length);
const isBioInvalid = computed(() => bioCharacterCount.value > 200);

// Handlers
const handleProfileSave = () => {
	// Validation check for bio length
	if (isBioInvalid.value) {
		alert(`Your bio is ${bioCharacterCount.value} characters long, which exceeds the 200 character limit. Please shorten it before saving.`);
		return;
	}

	console.log('Saving profile data...', formData.value);
	alert("Profile saved successfully!");

	// save the stuff to backend
};

const handlePasswordUpdate = () => {
	if (newPassword.value !== confirmPassword.value) {
		alert("New passwords don't match!");
		return;
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

				<!-- Profile Settings Section -->
				<div class="bg-white dark:bg-[#121422] mb-6 w-full p-4 rounded-lg border border-solid border-slate-200 shadow-sm transition-colors duration-200 dark:border-slate-700">
					<div class="p-6 md:p-8">
						<h1 class="text-2xl font-bold text-black dark:text-white">Profile Settings</h1>
						<p class="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage your public profile and personal information.</p>
					</div>
					<Divider />

					<div class="p-6 md:p-8 space-y-10">

						<!-- Profile Picture Section -->
						<div class="flex flex-col sm:flex-row items-center gap-6 pb-8">
							<div class="relative group">
								<div class="w-24 h-24 rounded-full overflow-hidden border-2 border-slate-100 dark:border-slate-800">
									<img :src="formData.profileImg" alt="Profile Picture" class="w-full h-full object-cover" />
								</div>
							</div>
							<div class="text-center sm:text-left">
								<h3 class="font-bold text-black dark:text-white text-lg">Your Profile Picture</h3>
								<p class="text-slate-500 dark:text-slate-400 text-sm mb-4">JPG, GIF or PNG. Max size 2MB</p>
								<div class="flex flex-wrap justify-center sm:justify-start gap-3">
									<button type="button" class="px-4 py-2 bg-[#355AFF] text-white text-sm font-semibold rounded-lg hover:bg-[#355AFF]/90 transition-colors">
										Upload New Photo
									</button>
									<button type="button" class="border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#121422] text-slate-900 dark:text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">										Remove
									</button>
								</div>
							</div>
						</div>

						<Divider />

						<!-- Profile Form Fields -->
						<form @submit.prevent="handleProfileSave" class="space-y-6">
							<div class="grid grid-cols-1 md:grid-cols-2 gap-6">

								<!-- Display Name -->
								<div class="space-y-2">
									<label class="text-sm font-semibold text-black dark:text-white">Display Name</label>
									<input
											v-model="formData.name"
											type="text"
											placeholder="Your name"
											class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#121422] text-black dark:text-white focus:ring-2 focus:ring-[#355AFF]/20 focus:border-[#355AFF] outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
									/>
								</div>

								<!-- Username -->
								<div class="space-y-2">
									<label class="text-sm font-semibold text-black dark:text-white">Username</label>
									<div class="relative">
										<span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-sm">@</span>
										<input
												v-model="formData.username"
												type="text"
												placeholder="username"
												class="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#121422] text-black dark:text-white focus:ring-2 focus:ring-[#355AFF]/20 focus:border-[#355AFF] outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
										/>
									</div>
								</div>

								<!-- School -->
								<div class="space-y-2">
									<label class="text-sm font-semibold text-black dark:text-white">Current School</label>
									<div class="relative">
										<span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 dark:text-slate-500 text-lg">school</span>
										<input
												v-model="formData.school"
												type="text"
												placeholder="University name"
												class="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#121422] text-black dark:text-white focus:ring-2 focus:ring-[#355AFF]/20 focus:border-[#355AFF] outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
										/>
									</div>
								</div>

								<!-- Home/Location -->
								<div class="space-y-2">
									<label class="text-sm font-semibold text-black dark:text-white">Current Home</label>
									<div class="relative">
										<span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 dark:text-slate-500 text-lg">apartment</span>
										<input
												v-model="formData.home"
												type="text"
												placeholder="Dorm or apartment name"
												class="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#121422] text-black dark:text-white focus:ring-2 focus:ring-[#355AFF]/20 focus:border-[#355AFF] outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
										/>
									</div>
								</div>
							</div>

							<!-- Bio -->
							<div class="space-y-2">
								<label class="text-sm font-semibold text-black dark:text-white">Bio</label>
								<textarea
										v-model="formData.bio"
										rows="4"
										placeholder="Tell us about yourself..."
										:class="[
                    'w-full px-4 py-3 rounded-xl border bg-white dark:bg-[#121422] text-black dark:text-white outline-none transition-all resize-none placeholder:text-slate-400 dark:placeholder:text-slate-500',
                    isBioInvalid
                      ? 'border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-500/20 focus:border-red-500'
                      : 'border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-[#355AFF]/20 focus:border-[#355AFF]'
                  ]"
								></textarea>
								<p
										:class="[
                    'text-xs text-right mt-1',
                    isBioInvalid ? 'text-red-500 font-medium' : 'text-slate-500 dark:text-slate-400'
                  ]"
								>
									{{ bioCharacterCount }} / 200 characters
								</p>
							</div>

							<!-- Action Buttons -->
							<div class="pt-6 flex justify-end gap-4 border-t border-slate-100 dark:border-slate-800">
								<button type="button" class="text-slate-500 dark:text-slate-400 px-4 py-2 text-sm font-medium hover:text-slate-900 dark:hover:text-white transition-colors">
									Cancel
								</button>
								<button type="submit" class="bg-[#355AFF] hover:bg-[#2b4bcc] text-white px-6 py-2 rounded-md text-sm font-medium transition-colors shadow-sm">
									Save Changes
								</button>
							</div>
						</form>
					</div>
				</div>

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
									<input
											v-model="currentPassword"
											type="password"
											placeholder="Enter current password"
											class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#121422] text-black dark:text-white focus:ring-2 focus:ring-[#355AFF]/20 focus:border-[#355AFF] outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
											required
									/>
								</div>

								<div class="hidden md:block"></div>

								<!-- New Password -->
								<div class="space-y-2">
									<label class="text-sm font-semibold text-black dark:text-white">New Password</label>
									<input
											v-model="newPassword"
											type="password"
											placeholder="Enter new password"
											class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#121422] text-black dark:text-white focus:ring-2 focus:ring-[#355AFF]/20 focus:border-[#355AFF] outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
											required
									/>
								</div>

								<!-- Confirm New Password -->
								<div class="space-y-2">
									<label class="text-sm font-semibold text-black dark:text-white">Confirm New Password</label>
									<input
											v-model="confirmPassword"
											type="password"
											placeholder="Confirm new password"
											class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#121422] text-black dark:text-white focus:ring-2 focus:ring-[#355AFF]/20 focus:border-[#355AFF] outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
											required
									/>
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