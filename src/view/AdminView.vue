<script setup>
import ProfileService from "../services/ProfileService.js";
import ReviewService from "../services/ReviewService.js";
import ListingService from "../services/ListingService.js";

import { ref, onMounted } from 'vue';
import Divider from "@/components/divider/Divider.vue";

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

//HELPER FUNCTIONS
const parseRating = (ratingData) => {
    ratingData = ratingData[0]
    const validCategories = ['cleanliness', 'comfort', 'communication', 'location'];
    let sum = 0;
    let count = 0;

    for (const category of validCategories) {
        // Check if the category exists in the data to avoid NaN errors
        if (ratingData[category] !== undefined && ratingData[category] !== null) {
            sum += Number(ratingData[category]);
            count++;
        }  
    }

    if (count === 0) return "0.0";
    return (sum / count).toFixed(1);
}

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

const selectProfile = async (id) => {
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

</script>

<template>
<div v-if="userInfo.isAdmin">
<div class="min-h-screen  p-8">
<div class="max-w-6xl mx-auto">
    <!-- LISTINGS -->
    <div class="mb-6">
        <!-- SUMMARY -->
        <div class="flex justify-between items-center mb-4">
            <h1 class="text-3xl font-bold text-gray-800 dark:text-white">Listings</h1>
            <span class="bg-blue-100 text-blue-800 
            px-3 py-1 rounded-full text-sm font-medium">
            Total Listings: {{ listings.length }}
            </span>
        </div>
        
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
        <div v-if="selectedListing" class="my-4">
            <p>Listing: {{ selectedListing.name }}</p>
            <p>Owner: {{ selectedListing.owner }}</p>
            <p>Address: {{ selectedListing.address }}</p>
            <p>Description: {{ selectedListing.description }}</p>
            <p>Amnemities: {{ selectedListing.amenities }}</p>
            
            <!-- Buttons -->
            <div class="flex w-full justify-end gap-4 px-1">
                <button
                class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm font-semibold transition"
                > Update </button>
                <button
                class="bg-red-400 hover:bg-red-500 text-white px-3 py-1 rounded text-sm font-semibold transition"
                > Delete </button>
            </div>
        </div>
    </div>

    <!-- ---------------------------------------------------------------------------------------------- -->
    <Divider/>

    <!-- PROFILES -->
    <div class="mt-6">
        <!-- SUMMARY -->
        <div class="flex justify-between items-center mb-4">
            <h1 class="text-3xl font-bold text-gray-800 dark:text-white">Profiles</h1>
            <span class="bg-blue-100 text-blue-800 
            px-3 py-1 rounded-full text-sm font-medium">
            Total Profiles: {{ profiles.length }}
            </span>
        </div>
        
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
        <div v-if="selectedProfile" class="my-4">
        <!-- Content -->
        <div>
            <p>Username: {{ selectedProfile.username }}</p>
            <p>Name: {{ selectedProfile.name }}</p>
            <p>Bio: {{ selectedProfile.bio }}</p>
            <p>School: {{ selectedProfile.school }}</p>
            <p>Dorm: {{ selectedProfile.dorm }}</p>
        </div>

        <!-- Buttons -->
        <div class="flex w-full justify-end gap-4 px-1">
            <button
            class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm font-semibold transition"
            > Update </button>
            <button
            class="bg-red-400 hover:bg-red-500 text-white px-3 py-1 rounded text-sm font-semibold transition"
            > Delete </button>
        </div>
        </div>
    </div>
</div>
</div>
</div>
<div v-else>
    unauthorized access
</div>

</template>