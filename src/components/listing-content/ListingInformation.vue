<script setup>
import Divider from '../divider/Divider.vue';
import BlueButton from '../page-buttons/BlueButton.vue';
import ProfileService from '@/services/ProfileService';
import { ref, onMounted, watch, computed } from 'vue';
import { useAuthStore } from '@/auth'; 

const isVerified = ref(false);

// connect to the store
const auth = useAuthStore();

const props = defineProps({
	listing: {
		type: Object,
		required: true,
		// Provide a fallback structure for safety
		default: () => ({
			listingId: '',
			name: '',
			address: '',
			description: '',
			amenities: [],
			contacts: [],
			owner: ''
		})
	}
})

// get current user from store
const user = computed(() => {
		return auth.user
	}
);

// if user exists and username matches the owner, set to true
const isOwner = computed(() => {
    	return user.value && user.value.username === props.listing.owner;
	}
);

const checkOwnerVerification = async () => {
    if (!props.listing.owner) 
	{
		isVerified.value = false
		return;
	}

    try {
        
        const owner = await ProfileService.find(props.listing.owner);
        
		if (owner)
		{
			isVerified.value = true;
		}
		else
		{
			isVerified.value = false;
		}
        
    } catch (err) {
        
        isVerified.value = false;
    }
};

// Call the check when the component mounts or when the listing prop changes
onMounted(async () => {
    
	// if auth.user still not there
    if (!auth.user) 
	{
        await auth.fetchCurrentUser();
    }
    checkOwnerVerification();
});

watch(() => props.listing.owner, checkOwnerVerification);
</script>

<template>
	<div class="bg-white dark:bg-[#121422] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-6 md:p-8 transition-colors duration-200 flex flex-col gap-8">

		<!-- Header Section: Title & Address -->
		<div class="flex flex-col gap-2">
			<div class="flex w-full justify-between">
				<h1 class="font-bold text-3xl md:text-4xl text-slate-900 dark:text-white tracking-tight">
					{{ listing.name }}
				</h1>
				<RouterLink v-if="isOwner" :to="{ name: 'listing-settings', params: {id: listing.listingId}}">
					<BlueButton class="flex items-center gap-2 px-4 py-2">
						<span class="material-symbols-outlined text-white text-[18px]">edit_square</span>
						<span class="font-medium text-[15px] text-white">Edit</span>
					</BlueButton>
				</RouterLink>
			</div>
			<div class="flex items-center gap-2 text-slate-500 dark:text-slate-400">
				<span class="material-symbols-outlined text-[20px]">location_on</span>
				<p class="italic text-base md:text-lg">
					{{ listing.address }}
				</p>
			</div>
		</div>

		<!-- Owner Profile Section -->
		<div class="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 w-fit pr-8">
			<div class="w-14 h-14 rounded-full bg-linear-to-br from-amber-100 to-amber-200 border-2 border-white dark:border-slate-700 shadow-sm flex items-center justify-center">
				<span class="material-symbols-outlined text-amber-600 text-3xl">domain</span>
			</div>
			<div class="flex flex-col">
				<h3 class="font-bold text-lg text-slate-900 dark:text-white leading-tight">
					{{ listing.owner }}
				</h3>
				<div v-if="isVerified" class="flex items-center gap-1.5 text-[#355AFF] font-semibold text-sm mt-1">
					<span class="material-symbols-outlined dark-filled text-[#355AFF] mr-1 text-[18px]!">verified</span>
					Verified Host
				</div>
			</div>
		</div>

		<!-- Description Section -->
		<div v-if="listing.description" class="flex flex-col gap-3">
			<h2 class="text-xl font-bold text-slate-900 dark:text-white">
				About this place
			</h2>
			<div class="text-slate-700 dark:text-slate-300 leading-relaxed text-lg italic border-l-4 border-slate-200 dark:border-slate-700 pl-4 py-1 whitespace-pre-line">
				{{ listing.description }}
			</div>
		</div>

		<Divider />

		<!-- Amenities Section -->
		<div v-if="listing.amenities?.length" class="flex flex-col gap-4">
			<h2 class="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
				<span class="material-symbols-outlined text-[#355AFF]">check_circle</span>
				Amenities
			</h2>
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
				<div
						v-for="(amenity, index) in listing.amenities"
						:key="index"
						class="flex items-center gap-3 text-slate-700 dark:text-slate-300 group"
				>
					<div class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-[#355AFF]/10 transition-colors">
						<span class="material-symbols-outlined text-[18px] text-slate-500 dark:text-slate-400 group-hover:text-[#355AFF]">info</span>
					</div>
					<span class="font-medium">{{ amenity }}</span>
				</div>
			</div>
		</div>

		<!-- Contact Section -->
		<template v-if="listing.contacts?.length">
			<Divider />
			<div class="flex flex-col gap-4">
				<h2 class="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
					<span class="material-symbols-outlined text-[#355AFF]">chat</span>
					Contact & Socials
				</h2>
				<div class="flex flex-wrap gap-3">
					<a
							v-for="contact in listing.contacts"
							:key="contact._id"
							:href="contact.link"
							target="_blank"
							class="flex items-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-slate-800 border border-transparent hover:border-[#355AFF] rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-[#355AFF] dark:hover:text-white transition-all duration-200 shadow-sm"
					>
						<span class="material-symbols-outlined text-[18px]">link</span>
						{{ contact.name }}
					</a>
				</div>
			</div>
		</template>
	</div>
</template>

<style scoped>
</style>