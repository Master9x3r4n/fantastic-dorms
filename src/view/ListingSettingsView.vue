
<script setup>
import { ref, onMounted, toRaw } from 'vue';
import { useRouter, useRoute } from "vue-router";
import Divider from "@/components/divider/Divider.vue";
import TextEditor from '@/components/write-review-content/TextEditor.vue';
import ListingService from '@/services/ListingService';

const listing = ref({
	name: '',
	address: '',
	description: '',
	amenities: [],
	contacts: [],
	media: []
});
const MAX_MEDIA_COUNT = 5;
const router = useRouter();
const route = useRoute();
const newMedia = ref([]);
const deletedMedia = ref([]);
const mediaPreviews = ref([]);
const submitting = ref(false);
const hasError = ref(false);

const goBack = () => router.back();

// FETCH INITIAL LISTING INFORMATION
onMounted(async () => {
	ListingService.find(route.params.id)
	.then(async (res) => {
		listing.value = res.data
		// mediaPreviews.value = [...listing.value.media];
		for (const media of listing.value.media) {
			mediaPreviews.value.push({
				url: media,
				exists: true
			});
		}
	})
	.catch(err => {
		console.error("Error retrieving listing information for " + route.params.id + " error: " + err)
	})
});

// Amenities Helper Functions
const addAmenity = () => {
	if (listing.value.amenities.length < 6) {
		listing.value.amenities.push('');
	}
};

const removeAmenity = (index) => {
	listing.value.amenities.splice(index, 1);
};

// Socials Helper Functions
const addSocial = () => {
	if (listing.value.contacts.length < 6) {
		listing.value.contacts.push({ name: '', link: '' });
	}
};

const removeSocial = (index) => {
	listing.value.contacts.splice(index, 1);
};

// Media Helper Functions
const handleImageUpload = (event) => {
	const files = Array.from(event.target.files);
	const remainingSlots = MAX_MEDIA_COUNT - mediaPreviews.value.length;
	
	files.slice(0, remainingSlots).forEach(file => {
		newMedia.value.push(file);
		const reader = new FileReader();
		// reader.onload = (e) => mediaPreviews.value.push(e.target.result);
		reader.onload = (e) => mediaPreviews.value.push({
			url: e.target.result,
			exists: false
		});
		reader.readAsDataURL(file);
	});
};

const removeImage = (index) => {
	const media = mediaPreviews.value.splice(index, 1);
	if (media[0].exists) {
		listing.value.media.splice(index, 1);
		deletedMedia.value.push(media[0].url);
	} else {
		const existingMediaCount = listing.value.media.length;
		if (index >= existingMediaCount) {
			newMedia.value.splice(index - existingMediaCount, 1);
		}
	}
	console.log(deletedMedia.value);
};

const handleSave = () => {
	submitting.value = true;
	
	const data = new FormData();
	data.append('content', JSON.stringify({
		...listing.value,
		deletedMedia: deletedMedia.value
	}));
	newMedia.value.forEach((file) => {
		data.append('newMedia', file);
	})

	// TODO: ADD AN IF CHECK FOR 500+ CHARS
	ListingService.update(route.params.id, data)
	.then(res => {
		alert("Listing successfully updated!");
		goBack();
	})
	.catch(error => {
		console.error(`Error retrieving listing \'${route.params.id}\': ${error}`)
		submitting.value = true;
		hasError.value = true;
	});
};
</script>

<template>
	<div class="min-h-screen flex flex-col bg-white dark:bg-[#121422] text-black dark:text-white transition-colors duration-200">
		<main class="flex-1 flex items-center justify-center p-4 md:p-10">
			<div class="w-full max-w-4xl">
				<!-- Return button -->
				<button @click="goBack" class="flex items-center text-sm text-slate-500 dark:text-slate-400 hover:text-[#355AFF] transition-colors mb-6 border border-slate-200 dark:border-slate-700 rounded-md px-3 py-1.5 bg-white dark:bg-[#121422] shadow-sm">
					<span class="material-symbols-outlined text-[16px]! mr-1">arrow_back</span>
					Back to Listing
				</button>

				<div class="bg-white dark:bg-[#121422] mb-6 w-full rounded-lg border border-slate-200 shadow-sm dark:border-slate-700">
					<div class="p-6 md:p-8">
						<h2 class="text-2xl font-bold">Edit Listing</h2>
						<p class="text-slate-500 dark:text-slate-400 text-sm mt-1">Update your property details, amenities, and media.</p>
						<span>@{{ route.params.id }}</span>
					</div>
					<Divider />

					<!-- Listing Form -->
					<form @submit.prevent="handleSave" class="p-6 md:p-8 space-y-8">
						
						<!-- Basic Information -->
						<section class="space-y-6">
							<h3 class="text-lg font-semibold border-l-4 border-[#355AFF] pl-3">Basic Information</h3>
							<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
								<!-- Name -->
								<div class="space-y-2">
									<label class="text-sm font-semibold">Listing Name</label>
									<input v-model="listing.name" type="text" 
									placeholder="e.g. Green Residences Studio" class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#121422] text-black dark:text-white focus:ring-2 focus:ring-[#355AFF] focus:border-transparent outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500" required />
								</div>

								<!-- Location -->
								<div class="space-y-2">
									<label class="text-sm font-semibold">Location</label>
									<input v-model="listing.address" type="text" placeholder="e.g. Taft Avenue, Manila" class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#121422] text-black dark:text-white focus:ring-2 focus:ring-[#355AFF] focus:border-transparent outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500" required />
								</div>

								<!-- Description -->
								<div class="md:col-span-2 space-y-2">
									<label class="text-sm font-semibold">Description</label>
									<!-- <textarea v-model="listing.description" rows="4" placeholder="Describe the listing..." class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#121422] text-black dark:text-white focus:ring-2 focus:ring-[#355AFF] focus:border-transparent outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none"></textarea> -->
									<TextEditor 
										class="mt-2"
										v-model="listing.description"
										placeholder="Describe the listing..."
										:maxLength="500"
									/>
								</div>
							</div>
						</section>

						<Divider />

						<!-- Amenities -->
						<section class="space-y-4">
							<!-- add button -->
							<div class="flex justify-between items-center">
								<h3 class="text-lg font-semibold border-l-4 border-[#355AFF] pl-3">Amenities ({{ listing.amenities.length }}/6)</h3>
								<button type="button" @click="addAmenity" :disabled="listing.amenities.length >= 6" class="text-[#355AFF] text-sm font-medium disabled:opacity-50">
									+ Add Amenity
								</button>
							</div>
							<!-- amenity field -->
							<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div v-for="(amenity, index) in listing.amenities" :key="index" class="flex gap-2">
									<input v-model="listing.amenities[index]" type="text" placeholder="e.g. Free Wi-Fi" class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#121422] text-black dark:text-white focus:ring-2 focus:ring-[#355AFF] focus:border-transparent outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500" required />
									<button type="button" @click="removeAmenity(index)" class="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-2 rounded-lg transition-colors">
										<span class="material-symbols-outlined">delete</span>
									</button>
								</div>
							</div>
						</section>

						<Divider />

						<!-- Socials Links -->
						<section class="space-y-4">
							<!-- add button -->
							<div class="flex justify-between items-center">
								<h3 class="text-lg font-semibold border-l-4 border-[#355AFF] pl-3">Social Links ({{ listing.contacts.length }}/6)</h3>
								<button type="button" @click="addSocial" :disabled="listing.contacts.length >= 6" class="text-[#355AFF] text-sm font-medium disabled:opacity-50">
									+ Add Social
								</button>
							</div>

							<div class="space-y-4">
								<div v-for="(social, index) in listing.contacts" :key="index" class="flex flex-col md:flex-row gap-4 p-4 border border-slate-200 dark:border-slate-700 rounded-xl relative">
									<!-- name field -->
									<div class="flex-1 space-y-2">
										<label class="text-xs font-bold uppercase text-slate-400">Platform Name</label>
										<input v-model="social.name" type="text" placeholder="e.g. Facebook" class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#121422] text-black dark:text-white focus:ring-2 focus:ring-[#355AFF] focus:border-transparent outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500" required />
									</div>
									<!-- link field -->
									<div class="flex-2 space-y-2">
										<label class="text-xs font-bold uppercase text-slate-400">Link / URL</label>
										<input v-model="social.link" type="text" placeholder="https://..." class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#121422] text-black dark:text-white focus:ring-2 focus:ring-[#355AFF] focus:border-transparent outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500" />
									</div>
									<button type="button" @click="removeSocial(index)" class="self-end md:self-center text-red-500 p-2">
										<span class="material-symbols-outlined">delete</span>
									</button>
								</div>
							</div>
						</section>

						<Divider />

						<!-- Media -->
						<section class="space-y-4">
							<h3 class="text-lg font-semibold border-l-4 border-[#355AFF] pl-3">Media ({{ mediaPreviews.length }}/5)</h3>
							<div class="grid grid-cols-2 md:grid-cols-5 gap-4">
								<div v-for="(media, index) in mediaPreviews" :key="index" class="relative aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 group">
									<img :src="media.url" class="w-full h-full object-cover" />
									<button @click="removeImage(index)" type="button" class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
										<span class="material-symbols-outlined text-sm">close</span>
									</button>
								</div>
								
								<label v-if="mediaPreviews.length < 5" class="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
									<span class="material-symbols-outlined text-slate-400">add_a_photo</span>
									<span class="text-xs text-slate-400 mt-2">Upload</span>
									<input type="file" class="hidden" accept="image/*" multiple @change="handleImageUpload" />
								</label>
							</div>
						</section>

						<!-- Save / Cancel -->
						<div class="flex justify-end gap-4 pt-6">
							<button 
								type="button" 
								@click="goBack" 
								class="px-6 py-2 rounded-md text-sm font-medium border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
							>
								Cancel
							</button>
							<button 
								type="submit" 
								class="bg-[#355AFF] hover:bg-[#2b4bcc] text-white px-8 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
								:disabled="submitting"
							>
								<div v-if="!submitting">Update</div>
								<div v-else>Updating...</div>
							</button>
						</div>

						<div class="text-sm text-red-500" v-if="hasError">
							An error occurred. Please try again later.
						</div>
					</form>
				</div>
			</div>
		</main>
	</div>
</template>

<!--
	Tailwind doesn't support dark mode for this and they will not fix it :( 
	See: https://github.com/tailwindlabs/tailwindcss/discussions/2917
-->
<!-- <style scoped>
@reference "tailwindcss";
.input-field {
	@apply w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#121422] text-black dark:text-white focus:ring-2 focus:ring-[#355AFF] focus:border-transparent outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500;
}
</style> -->