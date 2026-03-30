<script setup>
import ProfileService from "../services/ProfileService.js";
import ReviewService from "../services/ReviewService.js";
import ListingService from "../services/ListingService.js";

import { ref, onMounted, reactive } from 'vue';
import Divider from "@/components/divider/Divider.vue";
import EditButtons from "@/components/admin/EditButtons.vue";
import SummaryHeader from "@/components/admin/SummaryHeader.vue";
import FormInput from "@/components/admin/FormInput.vue";

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
const defaultProfile = {
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
};
const defaultListing = {
    listingId: '',
    owner: '',
    name: '',
    description: '',
    address: '',
    amenities: [],
    contacts: []
};
const profileForm = reactive(JSON.parse(JSON.stringify(defaultProfile)));
const listingForm = reactive(JSON.parse(JSON.stringify(defaultListing)));
const profileFormRef = ref(null);
const listingFormRef = ref(null);

//LISTING HELPER FUNCTIONS
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
        console.log("Deleting listing: " + selectedListing.value.listingId)
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
    Object.assign(listingForm, JSON.parse(JSON.stringify(defaultListing)))
}

//PROFILE HELPER FUNCTIONS
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
    //Validate if required field is present
    if (profileForm.username)
    {
        //Confirm processing
        if (window.confirm(`QUERY: Are you sure you want to add profile ${profileForm.username}?`))
        {
            //Create default values
            profileForm.name.firstName = profileForm.name.firstName? profileForm.name.firstName: "Firstname";
            profileForm.name.lastName = profileForm.name.lastName? profileForm.name.lastName: "McLastname";

            //Alert
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
        sp.name.firstName = profileForm.name.firstName? profileForm.name.firstName : sp.name.firstName;
        sp.name.lastName = profileForm.name.lastName? profileForm.name.lastName : sp.name.lastName;
        sp.bio = profileForm.bio? profileForm.bio : sp.bio;
        sp.school.name = profileForm.school.name? profileForm.school.name : sp.school.name;
        sp.school.since = profileForm.school.since? profileForm.school.since : sp.school.since;
        sp.dorm.name = profileForm.dorm.name? profileForm.dorm.name : sp.dorm.name;
        sp.dorm.since = profileForm.dorm.since? profileForm.dorm.since : sp.dorm.since;

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
    }
    else
    {
        console.log("Deleting cancelled");
    }

    //reset forms
    resetProfileForm();
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
                    <form class="flex w-full"
                    ref = "listingFormRef"
                    @submit.prevent="submitListingForm">
                        <!-- Left pane -->
                        <div class="w-full">
                            <!-- Listing Id -->
                            <FormInput formLabel="Listing Id*"
                            v-if="!selectedListing"
                            v-model="listingForm.listingId"/>

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
                            <FormInput formLabel="Username*"
                            v-if="!selectedProfile"
                            v-model="profileForm.username"/>

                            <!-- Full Name -->
                            <div>
                                <!-- First -->
                                <FormInput formLabel="First name"
                                v-model="profileForm.name.firstName"/>
                                
                                <!-- Last -->
                                <FormInput formLabel="Last name"
                                v-model="profileForm.name.lastName"/>
                            </div>

                            <!-- Bio -->
                            <FormInput formLabel="Bio"
                            v-model="profileForm.bio"
                            formType="textarea"/>
                        </div>

                        <!-- Right pane -->
                        <div class="w-full">
                            <!-- School Info -->
                            <div>
                                <!-- Name -->
                                <FormInput formLabel="School Name"
                                v-model="profileForm.school.name"/>
                                
                                <!-- Since -->
                                <FormInput formLabel="School Since"
                                v-model="profileForm.school.since"
                                formType="date"/>
                            </div>

                            <!-- Dorm Info -->
                            <div>
                                <!-- Name -->
                                <FormInput formLabel="Dorm Name"
                                v-model="profileForm.dorm.name"/>
                                
                                <!-- Since -->
                                <FormInput formLabel="Dorm Since"
                                v-model="profileForm.dorm.since"
                                formType="date"/>
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