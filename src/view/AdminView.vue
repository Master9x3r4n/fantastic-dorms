<script setup>
import ProfileService from "../services/ProfileService.js";
import ReviewService from "../services/ReviewService.js";
import ListingService from "../services/ListingService.js";
import { useAuthStore } from '@/auth';

import { ref, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import Divider from "@/components/divider/Divider.vue";
import EditButtons from "@/components/admin/EditButtons.vue";
import SummaryHeader from "@/components/admin/SummaryHeader.vue";
import FormInput from "@/components/admin/FormInput.vue";
const router = useRouter();

const listings = ref([]);
const profiles = ref([]);
const selectedListing = ref("");
const selectedProfile = ref("");

// GET USER ADMIN STATUS
const userInfo = ref('');
const auth = useAuthStore();
onMounted(async () => {
	if (!auth.user) {
		await auth.fetchCurrentUser();
	}
	const data = auth.user;
	if (data)
		userInfo.value = data;
})

// FETCH INITIAL DATA FROM DB
onMounted(async () => {
	try {
		/****** GET LISTINGS ******/
		const [listingsRes] = await Promise.all([
			ListingService.findAll()
		]);
		listings.value = listingsRes.data;
		
		/***** GET PROFILES *****/
		const [profilesRes] = await Promise.all([
			ProfileService.findAll()
		]);
		profiles.value = profilesRes.data;

	} catch (err) {
		console.error(`Error loading data: ${err.message}`);
	}
});

//INITIALIZE FORM DATA
const defaultListing = {
	listingId: 'default-residence',
	owner: 'Default owner',
	name: 'Default residence',
	description: 'Default description',
	address: 'Default address',
	amenities: [],
	contacts: []
};

const defaultProfile = {
	username: 'default_user',
	name: {
		firstName: 'Firstname',
		lastName: 'McLastname'
	},
	bio: 'Default bio',
	school: {
		name: 'Default school',
		since: ''
	},
	dorm:  {
		name: 'Default dorm',
		since: ''
	}
};

// const profileForm = reactive(JSON.parse(JSON.stringify(defaultProfile)));
// const listingForm = reactive(JSON.parse(JSON.stringify(defaultListing)));
const profileForm = reactive(defaultProfile);
const listingForm = reactive(defaultListing);
const profileFormRef = ref(null);
const listingFormRef = ref(null);

//LISTING HELPER FUNCTIONS
const selectListing = async (id) => {
	try {
		/****** GET LISTING ID ******/
		const [listingRes] = await Promise.all([
			ListingService.find(id)
		]);
		selectedListing.value = listingRes.data;
		listingForm = selectedListing.value;
	} catch (err) {
		console.error(`Error loading data: ${err.message}`);
	}
}

const unselectListing = () => {
	selectedListing.value = "";
	resetListingForm();
}

const addListing = async () => {
	// Validate if required field is present
	if (listingForm.listingId)
	{
		// Confirm processing
		if (window.confirm(`Are you sure you want to add new listing \'${listingForm.listingId}\'?`))
		{
			try {
				const data = new FormData();
				data.append('content', JSON.stringify(listingForm));
				data.append('newMedia', []);
				const newListing = await ListingService.create(data);
				
				if (window.confirm(`Added listing \'${newListing.data.listingId}\'. Go to page?`)) {
					router.push(`/listing/${newListing.data.listingId}`);
				}

				resetListingForm();
			} catch (err) {
				// console.error(`[ADMIN] An error occurred while creating Listing: ${err.message}`);
				window.alert(`[ADMIN] An error occurred while creating Listing: ${err.message}`);
			}
		}
	}
	else
	{
		window.alert("Please input a valid \'listingId\'.");
	}
}

const updateListing = async () => {
	if (window.confirm(`Are you sure you want to update listing \'${selectedListing.value.listingId}\'?'`))
	{
		try {
			const data = new FormData();
			data.append('content', JSON.stringify({
				...listingForm,
				media: [],
				deletedMedia: []
			}));

			data.append('newMedia', []);
			const updatedListing = await ListingService.update(selectedListing.value.listingId, data);
			
			if (window.confirm(`Updated listing \'${selectedListing.value.listingId}\'. Go to page?`)) {
				router.push(`/listing/${selectedListing.value.listingId}`);
			}
		} catch (err) {
			// console.error(`[ADMIN] An error occurred while updating Listing \'${selectedListing.value.listingId}\': ${err.message}`);
			window.alert(`[ADMIN] An error occurred while updating Listing \'${selectedListing.value.listingId}\': ${err.message}`);
		}

		resetListingForm();
	}
}

const deleteListing = () => {
	if (window.confirm(`Are you sure you want to DELETE listing \'${selectedListing.value.listingId}\'?`))
	{
		try {
			const deletedListing = ListingService.delete(selectedListing.value.listingId);
			window.alert(`Updated listing \'${selectedListing.value.listingId}\'. Bye bye.`);
			window.location.reload();
		} catch (err) {
			window.alert(`[ADMIN] An error occurred while deleting Listing \'${selectedListing.value.listingId}\': ${err.message}`);
		}
		
		unselectListing();
	}
}

const submitListingForm = async () => {
	
};

const triggerSubmitListingForm = () => {
	listingFormRef.value.requestSubmit()
}

const resetListingForm = () => {
	Object.assign(listingForm, JSON.parse(JSON.stringify(defaultListing)))
}

//PROFILE HELPER FUNCTIONS
const selectProfile = async (id) => {
	resetProfileForm();
	try {
		/****** GET PROFILE ID ******/
		const [profileRes] = await Promise.all([
			ProfileService.find(id),
		]);
		selectedProfile.value = profileRes.data;

	} catch (err) {
		console.error(`Error loading data: ${err.message}`);
	}
}

const unselectProfile = () => {
	selectedProfile.value = ""
	resetProfileForm();
}

const addProfile = () => {
	// Validate if required field is present
	if (profileForm.username)
	{
		// Confirm processing
		if (window.confirm(`QUERY: Are you sure you want to add profile ${profileForm.username}?`))
		{
			// Create default values
			profileForm.name.firstName = profileForm.name.firstName ? profileForm.name.firstName: "Firstname";
			profileForm.name.lastName = profileForm.name.lastName ? profileForm.name.lastName: "McLastname";

			// Alert
			console.log("Added profile: " + profileForm.username);
			window.alert("Added profile: " + profileForm.username);
		}
		else
		{
			console.log("Adding profile cancelled");
			window.alert("Adding profile cancelled");
		}

		//reset forms
		resetProfileForm();
	}
	else
	{
		window.alert("Fill in required field: Username");
	}
}

const updateProfile = () => {
	if (window.confirm(`WARNING: Are you sure you want to update profile ${selectedProfile.value.username}?`))
	{
		const sp = selectedProfile.value;
		
		//Update non-empty fields
		sp.name.firstName = profileForm.name.firstName ? profileForm.name.firstName : sp.name.firstName;
		sp.name.lastName = profileForm.name.lastName ? profileForm.name.lastName : sp.name.lastName;
		sp.bio = profileForm.bio ? profileForm.bio : sp.bio;
		sp.school.name = profileForm.school.name ? profileForm.school.name : sp.school.name;
		sp.school.since = profileForm.school.since ? profileForm.school.since : sp.school.since;
		sp.dorm.name = profileForm.dorm.name ? profileForm.dorm.name : sp.dorm.name;
		sp.dorm.since = profileForm.dorm.since ? profileForm.dorm.since : sp.dorm.since;

		//Alert
		console.log(`Updating profile: ${selectedProfile.value.username}`);
		window.alert(`Updating profile: ${selectedProfile.value.username}`);
	}
	else
	{
		console.log("Updating cancelled");
		window.alert("Updating cancelled");
	}

	//reset forms
	resetProfileForm();
}

const deleteProfile = () => {
	if (window.confirm(`WARNING: Are you sure you want to delete profile ${selectedProfile.value.username}?`))
	{
		console.log("Deleting profile: " + selectedProfile.value.username);
		window.alert("Deleting profile: " + selectedProfile.value.username);
		unselectProfile();
	}
	else
	{
		console.log("Deleting cancelled");
		window.alert("Deleting cancelled");
	}
}

const submitProfileForm = () => {
	console.log('Submitted Profile Form: ' + profileForm)
}

const triggerSubmitProfileForm = () => {
	profileFormRef.value.requestSubmit()
}

const resetProfileForm = () => {
	Object.assign(profileForm, JSON.parse(JSON.stringify(defaultProfile)));
}

</script>

<template>
<div v-if="!userInfo.isAdmin" class="dark: text-white">
	unauthorized access {{ userInfo }}
</div>
<div v-else>
	<div class="min-h-screen  p-8">
		<div class="max-w-6xl mx-auto">
			<!-- LISTINGS -->
			<div class="mb-6">
				<!-- SUMMARY -->
				<SummaryHeader name="Listings" :count="listings.length"/>
				
				<!-- LISTINGS TABLE -->
				<div class="bg-white rounded-lg shadow-md overflow-hidden overflow-y-scroll max-h-86">
				<table class="min-w-full divide-y divide-gray-200">
					<!-- HEAD -->
					<thead class="bg-gray-100 ">
						<tr><th v-for="i in ['listing_Id', 'name', 'owner']"
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							{{ i }}
						</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
						</tr>
					</thead>
					<!-- ROWS -->
					<tbody class="bg-gray-50 divide-y divide-gray-200">
						<tr v-for="l in listings" :key="l._id" class="hover:bg-gray-50 transition">
							<td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{{ l.listingId }}</td>
							<td class="px-6 py-4 whitespace-nowrap text-gray-600">{{ l.name }}</td>
							<td class="px-6 py-4 text-gray-500 truncate max-w-xs">{{ l.owner }}</td>
							<td class="px-6 py-4 whitespace-nowrap text-right">
								<button 
								@click="selectListing(l.listingId)"
								class="bg-blue-500 hover:bg-blue-400 text-white px-3 py-1 rounded text-sm font-semibold transition"
								>
								Select
								</button>
							</td>
						</tr>
					</tbody>
				</table>
				</div>

				<!-- EDIT PANEL -->
				<div class="my-4 dark:text-gray-200">
					<div v-if="selectedListing">
						<p class="font-bold border-b text-2xl pb-2 mb-1">Update Listing</p>
						<p><span class="font-semibold">Listing Name: </span>{{ selectedListing.listingId }}</p>
						<p><span class="font-semibold">Listing Name: </span>{{ selectedListing.name }}</p>
						<p><span class="font-semibold">Owner: </span>{{ selectedListing.owner }}</p>
						<p><span class="font-semibold">Address: </span>{{ selectedListing.address }}</p>
						<p><span class="font-semibold">Description: </span>{{ selectedListing.description }}</p>
						<p><span class="font-semibold">Amenities: </span>{{ selectedListing.amenities }}</p>
						<p><span class="font-semibold">Contacts: </span>{{ selectedListing.contacts }}</p>
						<p><span class="font-semibold">_id: </span>{{ selectedListing._id }}</p>   
					</div>
					<div v-else>
						<p class="font-bold text-2xl pb-2 mb-1">Add New Listing</p>
					</div>

					<!-- Input forms for add/edit -->
					<div class="border-t pt-2 mt-2">
					<form class="flex w-full"
					ref = "listingFormRef"
					@submit.prevent="submitListingForm">
						<!-- Left pane -->
						<div class="w-full">
							<!-- Listing Id -->
							<FormInput formLabel="Listing Id*"
							v-model="listingForm.listingId"/>
							<!-- <FormInput formLabel="Listing Id*"
							v-if="!selectedListing"
							v-model="listingForm.listingId"/> -->
							
							<!-- Listing name -->
							<FormInput formLabel="Listing Name"
							v-model="listingForm.name"/>

							<!-- Owner -->
							<FormInput formLabel="Owner"
							v-model="listingForm.owner"/>
						</div>
						
						<!-- Right pane -->
						<div class="w-full">
							<!-- Address -->
							<FormInput formLabel="Address"
							v-model="listingForm.address"
							formType="textarea"/>
							
							<!-- Description -->
							<FormInput formLabel="Description"
							v-model="listingForm.description"
							formType="textarea"/>
						</div>
					</form>
					</div>

					<!-- Form Buttons -->
					<EditButtons
					:add-mode="!selectedListing"
					@submit="triggerSubmitListingForm"
					@add="addListing()"
					@update="updateListing()"
					@unselect="unselectListing()"
					@delete="deleteListing()"
					/>
				</div>
			</div>

			<!-- ---------------------------------------------------------------------------------------------- -->
			<Divider/>

			<!-- PROFILES -->
			<div class="mt-6">
				<!-- SUMMARY -->
				<SummaryHeader name="Profiles" :count="profiles.length"/>
				
				<!-- LISTINGS TABLE -->
				<div class="bg-white rounded-lg shadow-md overflow-hidden overflow-y-scroll max-h-86">
				<table class="min-w-full divide-y divide-gray-200">
					<!-- HEAD -->
					<thead class="bg-gray-100 ">
						<tr><th v-for="i in ['username', 'name', 'join date', 'is admin']"
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							{{ i }}
						</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
						</tr>
					</thead>
					<!-- ROWS -->
					<tbody class="bg-gray-50 divide-y divide-gray-200">
						<tr v-for="p in profiles" :key="p._id" class="hover:bg-gray-50 transition">
							<td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{{ p.username }}</td>
							<td class="px-6 py-4 whitespace-nowrap text-gray-600">{{ p.name.lastName }}, {{ p.name.firstName }}</td>
							<td class="px-6 py-4 text-gray-500 truncate max-w-xs">{{ p.joinDate }}</td>
							<td class="px-6 py-4 text-gray-500 truncate max-w-xs">{{ p.isAdmin }}</td>
							<td class="px-6 py-4 whitespace-nowrap text-right">
								<button 
								@click="selectProfile(p.username)"
								class="bg-blue-500 hover:bg-blue-400 text-white px-3 py-1 rounded text-sm font-semibold transition"
								>
								Select
								</button>
							</td>
						</tr>
					</tbody>
				</table>
				</div>

				<!-- EDIT PANEL -->
				<div class="my-4 dark:text-gray-200">
						<!-- Content -->
						<div v-if="selectedProfile">
								<p class="font-bold border-b text-2xl pb-2 mb-1">Selected Profile</p>
								<p><span class="font-semibold">Username: </span>{{ selectedProfile.username }}</p>
								<p><span class="font-semibold">Name: </span>{{ selectedProfile.name }}</p>
								<p><span class="font-semibold">Bio: </span>{{ selectedProfile.bio }}</p>
								<p><span class="font-semibold">School: </span>{{ selectedProfile.school }}</p>
								<p><span class="font-semibold">Dorm: </span>{{ selectedProfile.dorm }}</p>
						</div>
						<!-- <div v-else>
								<p class="font-bold text-2xl pb-2 mb-1">Add New Profile</p>
						</div> -->
						<!-- Form Buttons -->
						<EditButtons
						:show="false"
						:add-mode="!selectedProfile"
						@submit="triggerSubmitProfileForm"
						@unselect="unselectProfile()"
						/>
				</div>
		</div>
		</div>
	</div>
</div>

</template>