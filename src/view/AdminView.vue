<script setup>
import ProfileService from "../services/ProfileService.js";
import ReviewService from "../services/ReviewService.js";
import ListingService from "../services/ListingService.js";

import { ref, onMounted, reactive } from 'vue';
import Divider from "@/components/divider/Divider.vue";
import EditButtons from "@/components/admin/EditButtons.vue";
import SummaryHeader from "@/components/admin/SummaryHeader.vue";

const listings = ref([]);
const profiles = ref([]);
const selectedListing = ref("");
const selectedProfile= ref("");

//GET USER ADMIN STATUS
const userInfo = ref('');
const data = JSON.parse(localStorage.getItem('USER'));
if (data)
	userInfo.value = data;

// FETCH INITIAL DATA FROM DB
onMounted(async () => {
    try {
        /****** GET LISTINGS ******/
        const [listingsRes] = await Promise.all([
            ListingService.getAll()
        ]);
        listings.value = listingsRes.data;
        
        /***** GET PROFILES *****/
        const [profilesRes] = await Promise.all([
            ProfileService.getAll()
        ]);
        profiles.value = profilesRes.data;

	} catch (err) {
		console.error(`Error loading data: ${err.message}`);
	}

});

//INITIALIZE FORM DATA
const profileForm = reactive({
    username: '',
    name: {
        firstName: '',
        lastName: ''
    },
    bio: '',
    school: {
        name: '',
        since: '' //all are just the year
    },
    dorm:  {
        name: '',
        since: ''
    }
});
const profileFormRef = ref(null);

const listingForm = reactive({
    listingId: '',
    owner: '',
    name: '',
    description: '',
    address: '',
    amenities: [],
    contacts: []
});
const listingFormRef = ref(null);

//HELPER FUNCTIONS
const selectListing = async (id) => {
    try {
        /****** GET LISTING ID ******/
        const [listingRes] = await Promise.all([
            ListingService.get(id)
        ]);
        selectedListing.value = listingRes.data;

	} catch (err) {
		console.error(`Error loading data: ${err.message}`);
	}
    
}

const unselectListing = () => {
    selectedListing.value = ""
}

const addListing = () => {
    if (window.confirm(`QUERY: Are you sure you want to add listing ${listingForm.listingId}?`))
        console.log("Added listing: " + listingForm.listingId)
    else
        console.log("Adding listing cancelled")
    resetListingForm();
}

const updateListing = () => {
    if (window.confirm(`WARNING: Are you sure you want to update listing ${selectedListing.value.listingId}?`))
        console.log(`Updating listing: ${selectedListing.value.listingId}`)
    else
        console.log("Updating cancelled")
    resetListingForm();
}

const deleteListing = () => {
    if (window.confirm(`WARNING: Are you sure you want to delete listing ${selectedListing.value.listingId}?`))
        console.log("Deleting listing: " + selectedListing)
    else
        console.log("Deleting cancelled")
    resetListingForm();
}

const submitListingForm = () => {
    console.log('Submitted Listing Form: ' + listingForm)
}

const triggerSubmitListingForm = () => {
    listingFormRef.value.requestSubmit()
}

const resetListingForm = () => {
    Object.assign(listingForm, {
        listingId: '',
        owner: '',
        name: '',
        description: '',
        address: '',
        amenities: [],
        contacts: []
    })
}

const selectProfile = async (id) => {
    resetProfileForm();
    try {
        /****** GET PROFILE ID ******/
        const [profileRes] = await Promise.all([
            ProfileService.get(id),
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
    if (window.confirm(`QUERY: Are you sure you want to add profile ${profileForm.username}?`))
        console.log("Added profile: " + profileForm.username)
    else
        console.log("Adding profile cancelled")
    resetProfileForm();
}

const updateProfile = () => {
    if (window.confirm(`WARNING: Are you sure you want to update profile ${selectedProfile.value.username}?`))
        console.log(`Updating profile: ${selectedProfile.value.username}`)
    else
        console.log("Updating cancelled")
    resetProfileForm();
}

const deleteProfile = () => {
    if (window.confirm(`WARNING: Are you sure you want to delete profile ${selectedProfile.value.username}?`))
        console.log("Deleting profile: " + selectedProfile)
    else
        console.log("Deleting cancelled")
    resetProfileForm();
}

const submitProfileForm = () => {
    console.log('Submitted Profile Form: ' + profileForm)
}

const triggerSubmitProfileForm = () => {
    profileFormRef.value.requestSubmit()
}

const resetProfileForm = () => {
    Object.assign(profileForm, {
        username: '',
        name: {
            firstName: '',
            lastName: ''
        },
        bio: '',
        school: {
            name: '',
            since: ''
        },
        dorm: {
            name: '',
            since: ''
        }
    });
}

</script>

<template>
<div v-if="userInfo.isAdmin">
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
                        class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm font-semibold transition"
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
                <form>
                    <!-- Listing Name -->
                    <!-- Owner -->
                    
                </form>
            </div>

            <!-- Form Buttons -->
            <EditButtons
            :add-mode="!selectedListing"
            @unselect="unselectListing()"
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
                <tr><th v-for="i in ['username', 'name', 'join date', 'listing owner']"
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
                    <td class="px-6 py-4 text-gray-500 truncate max-w-xs"> false </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right">
                        <button 
                        @click="selectProfile(p.username)"
                        class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm font-semibold transition"
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
                <p class="font-bold border-b text-2xl pb-2 mb-1">Update Profile</p>
                <p><span class="font-semibold">Username: </span>{{ selectedProfile.username }}</p>
                <p><span class="font-semibold">Name: </span>{{ selectedProfile.name }}</p>
                <p><span class="font-semibold">Bio: </span>{{ selectedProfile.bio }}</p>
                <p><span class="font-semibold">School: </span>{{ selectedProfile.school }}</p>
                <p><span class="font-semibold">Dorm: </span>{{ selectedProfile.dorm }}</p>
            </div>
            <div v-else>
                <p class="font-bold text-2xl pb-2 mb-1">Add New Profile</p>
            </div>

            <!-- Input forms for add/edit -->
            <div class="border-t pt-2 mt-2 mb-1">
            <form 
            ref = "profileFormRef"
            class="flex w-full" 
            @submit.prevent="submitProfileForm">
                <!-- Left pane -->
                <div class="w-full">
                    <!-- Username -->
                    <div class="flex gap-2 my-3" v-if="!selectedProfile">
                        <label class="block font-semibold text-[19px]">Username: </label>
                        <input 
                        v-model="profileForm.username"
                        class="w-5/12 px-2 py-1 border rounded-md"
                        type="text"/>
                    </div>

                    <!-- Full Name -->
                    <div>
                        <!-- First -->
                        <div class="flex gap-2 my-3">
                            <label class="block font-semibold text-[19px]">First name: </label>
                            <input 
                            v-model="profileForm.name.firstName"
                            class="w-5/12 px-2 py-1 border rounded-md"
                            type="text"/>
                        </div>
                        
                        <!-- Last -->
                        <div class="flex gap-2 my-3">
                            <label class="block font-semibold text-[19px]">Last name: </label>
                            <input 
                            v-model="profileForm.name.lastName"
                            class="w-5/12 px-2 py-1 border rounded-md"
                            type="text"/>
                        </div>
                    </div>

                    <!-- Bio -->
                    <div class="flex gap-2 my-3">
                        <label class="block font-semibold text-[19px]">Bio: </label>
                        <textarea 
                        v-model="profileForm.bio"
                        class="w-7/12 px-2 py-1 border rounded-md"></textarea>
                    </div>
                </div>

                <!-- Right pane -->
                <div class="w-full">
                    <!-- School Info -->
                    <div>
                        <!-- Name -->
                        <div class="flex gap-2 my-3">
                            <label class="block font-semibold text-[19px]">School Name: </label>
                            <input 
                            v-model="profileForm.school.name"
                            class="w-5/12 px-2 py-1 border rounded-md"
                            type="text"/>
                        </div>
                        
                        <!-- Since -->
                        <div class="flex gap-2 my-3">
                            <label class="block font-semibold text-[19px]">School Since: </label>
                            <input 
                            v-model="profileForm.school.since"
                            class="w-5/12 px-2 py-1 border rounded-md"
                            type="date"/>
                        </div>
                    </div>

                    <!-- Dorm Info -->
                    <div>
                        <!-- Name -->
                        <div class="flex gap-2 my-3">
                            <label class="block font-semibold text-[19px]">Dorm Name: </label>
                            <input 
                            v-model="profileForm.dorm.name"
                            class="w-5/12 px-2 py-1 border rounded-md"
                            type="text"/>
                        </div>
                        
                        <!-- Since -->
                        <div class="flex gap-2 my-3">
                            <label class="block font-semibold text-[19px]">Dorm Since: </label>
                            <input 
                            v-model="profileForm.dorm.since"
                            class="w-5/12 px-2 py-1 border rounded-md"
                            type="date"/>
                        </div>
                    </div>
                </div>
            </form>
            </div>

            <!-- Form Buttons -->
            <EditButtons
            :add-mode="!selectedProfile"
            @submit="triggerSubmitProfileForm"
            @add="addProfile()"
            @update="updateProfile()"
            @unselect="unselectProfile()"
            @delete="deleteProfile()"
            />
        </div>
    </div>
</div>
</div>
</div>
<div v-else>
    unauthorized access
</div>

</template>