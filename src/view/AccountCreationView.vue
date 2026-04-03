<script setup>
// Define Props with Default Values
import ProfileSettings from "@/components/settings/ProfileSettings.vue";
import { ref, onMounted } from 'vue';
import { useAuthStore } from "@/auth";

// Retrieve current user data
const auth = useAuthStore();
const userInfo = ref(null);
onMounted(async () => {
    if (!auth.user) {
		await auth.fetchCurrentUser();
	}

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
const handleProfileSave = ({ formData, newImageFile }) => {
	// console.log('Saving profile data...', formData);
	if (newImageFile) {
		console.log('New image ready to be uploaded to server:', newImageFile.name);
	}
	alert("Profile saved successfully!");

	// save the stuff to backend
};
</script>

<template>
	<div class="min-h-screen flex flex-col bg-white dark:bg-[#121422] text-black dark:text-white transition-colors duration-200">
		<main class="flex-1 flex items-center justify-center p-4 md:p-10">
			<div class="w-full max-w-4xl">
				<!-- Profile Settings Section -->
				<ProfileSettings
						:userInfo="props.userInfo"
						@save="handleProfileSave"
				/>
			</div>
		</main>
	</div>
</template>

<style>
</style>