<script setup>
import ProfileService from '@/services/ProfileService';
import ThumbsButton from './ThumbsButton.vue';
import ReviewService from '@/services/ReviewService';
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/auth';

const props = defineProps({
    reviewId: String,
    score: {
        type: Number,
        default: 0
    },
    dir: {
        type: String,
        default: "none"
    }
});

const selectedDir = ref(props.dir);
const currentScore = ref(props.score);
const profile = ref(null);

const updateToggle = async (id) => {
    //console.log("My Review ID is:", props.reviewId);
    if (!profile.value)
        return
    
    let choice = '';
    let change = 0;

    if (id == 'up' && selectedDir.value === 'none')
    {
        selectedDir.value = 'up';
        choice = 'up'
        change = 1
    }  
    else if (id == 'down' && selectedDir.value === 'none')
    {
        selectedDir.value = 'down';
        choice = 'down'
        change = -1
    }
    else if (id == 'up' && selectedDir.value == 'down')
    {
        selectedDir.value = 'up';
        choice = 'upup'
        change = 2
    }   
    else if (id == 'down' && selectedDir.value == 'up')
    {
        selectedDir.value = 'down';
        choice = 'downdown'
        change = -2
    }    
    else if (id == 'down' && selectedDir.value == 'down')
    {
        selectedDir.value = 'none';
        choice = 'up';
        change = 1
    }
    else if (id == 'up' && selectedDir.value == 'up')
    {
        selectedDir.value = 'none';
        choice = 'down';
        change = -1
    }
        
    try
    {
        // update the score in the db
        const res = await ReviewService.updateScore(props.reviewId, { userId: profile.value, direction: choice });
        currentScore.value = currentScore.value + change;
    }
    catch (err)
    {
        console.error("ERR score update failed--> ", err);
    }
}
//vote.value = (selectedDir.value === "up")? 1: (selectedDir.value === "down")? -1: 0;
const auth = useAuthStore();
onMounted(async () => {
	if (!auth.user) {
		try {
			await auth.fetchCurrentUser();
		} catch (e) {
			console.log("User is not logged in.");
		}
	}

	if (auth.user) {
		profile.value = auth.user.username;
	}
});
</script>

<template>
    <ThumbsButton 
    direction="up" 
    :toggled="selectedDir == 'up'"
    @handleClick="updateToggle"/>
        <div class="text-sm font-medium">{{ currentScore }}</div>
    <ThumbsButton 
    direction="down" 
    :toggled="selectedDir == 'down'"
    @handleClick="updateToggle"/>
</template>