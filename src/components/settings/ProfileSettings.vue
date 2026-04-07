<script setup>
import {ref, computed, onMounted} from 'vue';
import Divider from "@/components/divider/Divider.vue";
import ProfileIcon from "@/components/profile/ProfileIcon.vue";
import ProfileService from '@/services/ProfileService.js';

import AutocompleteInput from "@/components/settings/AutocompleteInput.vue";
import ListingService from "@/services/ListingService.js";

const props = defineProps({
	userInfo: {
		type: Object,
		required: true,
		default: () => ({
			profileImg: 'https://i.pinimg.com/736x/f3/b1/f8/f3b1f8c618080a7d0af8f0dc1b7c90ae.jpg',
			firstName: 'Aya',
			lastName: 'Oosawa',
			username: 'ayasjpg',
			school: 'De La Salle University Manila',
			home: 'Metro Haven Suites',
			bio: 'Comp sci student. Loves natural light and good coffee.'
		})
	}
});
const listingNames = ref([]);

const emit = defineEmits(['save']);

// Local Form State
const ogImageFile = ref(props.userInfo.profileImg);
const formData = ref({ ...props.userInfo });
const newImageFile = ref(null);
const fileInputRef = ref(null);

// Computed
const bioCharacterCount = computed(() => formData.value.bio?.length || 0);
const isBioInvalid = computed(() => bioCharacterCount.value > 200);

// Handlers
const triggerFileInput = () => {
	if (fileInputRef.value) {
		fileInputRef.value.click();
	}
};

const handleFileUpload = (event) => {
	const file = event.target.files[0];
	if (!file) return;

	// Validate file type
	if (!['image/jpeg', 'image/png'].includes(file.type)) {
		alert('Please upload a JPG or PNG image.');
		return;
	}

	// Validate file size (Max 2MB)
	const maxSize = 2 * 1024 * 1024; // 2MB in bytes
	if (file.size > maxSize) {
		alert('File size exceeds the 2MB limit. Please choose a smaller file.');
		return;
	}

	// Store file for backend submission
	newImageFile.value = file;

	// Create a local preview
	const reader = new FileReader();
	reader.onload = (e) => {
		formData.value.profileImg = e.target.result;
	};
	reader.readAsDataURL(file);
};

const removePhoto = () => {
	formData.value.profileImg = ogImageFile.value;
	newImageFile.value = null;
	if (fileInputRef.value) {
		fileInputRef.value.value = ''; // Reset the hidden input
	}
};

const handleProfileSave = async () => {
	// still use old username for the PK
	const oldUsername = props.userInfo.username;

	// grab new username
	const newUsername = formData.value.username;

	// grab new first name
	const newFirstName = formData.value.firstName;

	// grab new first name
	const newLastName = formData.value.lastName;

	if (newUsername.length > 20)
	{
		alert(`Your new username ${ newUsername } is more than 20 characters long. Please shorten it before saving.`);
		return;
	}

	if (newFirstName.length > 20)
	{
		alert(`Your new first name ${ newFirstName } is more than 20 characters long. Please shorten it before saving.`);
		return;
	}

	if (newLastName.length > 20)
	{
		alert(`Your new last name ${ newLastName } is more than 20 characters long. Please shorten it before saving.`);
		return;
	}

	// Validation check for bio length
	if (isBioInvalid.value) {
		alert(`Your bio is ${bioCharacterCount.value} characters long, which exceeds the 200 character limit. Please shorten it before saving.`);
		return;
	}

	// Emit the updated data to the parent component to handle the API call
	/*emit('save', {
		formData: formData.value,
		newImageFile: newImageFile.value
	});*/

	

	let usernameExists = null;

	if (oldUsername !== newUsername)
	{
		try
		{
			// checking if username input is in database
			usernameExists = await ProfileService.find(formData.value.username);
		}
		catch (error)
		{
			console.error(error);
			usernameExists = null;
		}
	}
	

	// if it's in the database
	if (usernameExists)
	{
		// alert user that what they want is taken
		alert(`Your new username ${newUsername} is already taken!`);
	}
	else
	{
		const updatedProfile = {
			username: newUsername,
			name: {
				firstName: newFirstName,
				lastName: newLastName,
			},
			school: formData.value.school,
			dorm: {
				name: formData.value.home,
				since: Date.now(),
			},
			bio: formData.value.bio,
		}

		await ProfileService.update(oldUsername, updatedProfile)
		.then(res => {
			// updating data locally
			formData.value = {
				...res.data,
				firstName: res.data.name?.firstName, // Pull from nested object
				lastName: res.data.name?.lastName,   // Pull from nested object
				home: res.data.dorm?.name
			};

			// telling parent to update
			emit('save', res.data);
		})
		.catch(error => {
			console.error(`${error}`)
		});
	}
	
};

onMounted(async () => {
	try {
		const res = await ListingService.findAll();
		listingNames.value = res.data.map(l => l.name);
	} catch (err) {
		console.error('Failed to fetch listings:', err.message);
	}
});
</script>

<template>
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
					<ProfileIcon :src="formData.profileImg" alt="Profile Picture" sizeClass="w-24 h-24" />
				</div>
				<div class="text-center sm:text-left">
					<h3 class="font-bold text-black dark:text-white text-lg">Your Profile Picture</h3>
					<p class="text-slate-500 dark:text-slate-400 text-sm mb-4">JPG or PNG. Max size 2MB</p>
					<div class="flex flex-wrap justify-center sm:justify-start gap-3">

						<!-- Hidden File Input -->
						<input
								type="file"
								ref="fileInputRef"
								class="hidden"
								accept="image/jpeg, image/png"
								@change="handleFileUpload"
						/>

						<button @click="triggerFileInput" type="button" class="px-4 py-2 bg-[#355AFF] text-white text-sm font-semibold rounded-lg hover:bg-[#355AFF]/90 transition-colors">
							Upload New Photo
						</button>
						<button @click="removePhoto" type="button" class="border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#121422] text-slate-900 dark:text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
							Remove
						</button>
					</div>
				</div>
			</div>

			<Divider />

			<!-- Profile Form Fields -->
			<form @submit.prevent="handleProfileSave" class="space-y-6">

				<!-- Username -->
				
				<div class="space-y-2">
					<label class="text-sm font-semibold text-black dark:text-white">Username</label>
					<div class="relative">
						<span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-sm">@</span>
						<input
								v-model="formData.username"
								type="text"
								placeholder="username"
								class="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#121422] text-black dark:text-white focus:ring-2 focus:ring-[#355AFF] focus:border-transparent outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
						/>
					</div>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">

					<!-- First Name -->
					<div class="space-y-2">
						<label class="text-sm font-semibold text-black dark:text-white">First Name</label>
						<input
								v-model="formData.firstName"
								type="text"
								placeholder="Your name"
								class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#121422] text-black dark:text-white focus:ring-2 focus:ring-[#355AFF] focus:border-transparent outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
						/>
					</div>

					<!-- Last Name -->
					<div class="space-y-2">
						<label class="text-sm font-semibold text-black dark:text-white">Last Name</label>
						<input
								v-model="formData.lastName"
								type="text"
								placeholder="Your name"
								class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#121422] text-black dark:text-white focus:ring-2 focus:ring-[#355AFF] focus:border-transparent outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
						/>
					</div>

					<!-- School -->
					<div class="space-y-2">
						<label class="text-sm font-semibold text-black dark:text-white">Current School</label>
						<div class="relative">
							<span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 dark:text-slate-500 text-lg!">school</span>
							<input
									v-model="formData.school"
									type="text"
									placeholder="University name"
									class="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#121422] text-black dark:text-white focus:ring-2 focus:ring-[#355AFF] focus:border-transparent outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
							/>
						</div>
					</div>

					<!-- Home/Location -->
					<div class="space-y-2">
						<label class="text-sm font-semibold text-black dark:text-white">Current Home</label>
						<div class="relative">
							<span class="absolute left-4 top-3.5 material-symbols-outlined text-slate-400 dark:text-slate-500 text-lg! z-10 pointer-events-none">apartment</span>
							<AutocompleteInput
									v-model="formData.home"
									:options="listingNames"
									placeholder="Dorm or apartment name"
									class="pl-11"
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
									: 'border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-[#355AFF] focus:border-transparent'
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
</template>