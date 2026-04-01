<script setup>


// Define Props with Default Values
import ProfileSettings from "@/components/settings/ProfileSettings.vue";

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

// Handlers
const handleProfileSave = ({ formData, newImageFile }) => {
	console.log('Saving profile data...', formData);
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