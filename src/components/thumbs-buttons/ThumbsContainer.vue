<script setup>
import ThumbsButton from './ThumbsButton.vue';
import ReviewService from '@/services/ReviewService';
import { ref, onMounted } from 'vue'
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
	if (id === 'up' && selectedDir.value === 'none')
	{
		choice = 'up'
	}
	else if (id === 'down' && selectedDir.value === 'none')
	{
		choice = 'down'
	}
	else if (id === 'up' && selectedDir.value === 'down') {
		choice = 'up';  // backend already handles pulling opposite
	}
	else if (id === 'down' && selectedDir.value === 'up') {
		choice = 'down';
	}
	else if (id === 'down' && selectedDir.value === 'down') {
		choice = 'removedown';
	}
	else if (id === 'up' && selectedDir.value === 'up') {
		choice = 'removeup';
	}
	const prevDir = selectedDir.value;
	const prevScore = currentScore.value;

	// apply optimistic update to dir before the request
	selectedDir.value = choice === 'removeup' || choice === 'removedown' ? 'none'
			: choice === 'up' ? 'up'
					: 'down';

	try {
		const res = await ReviewService.updateScore(props.reviewId, { userId: profile.value, direction: choice });
		const updatedVotes = res.data.votes;
		currentScore.value = updatedVotes.upvotes.length - updatedVotes.downvotes.length;
	} catch (err) {
		selectedDir.value = prevDir;
		currentScore.value = prevScore;
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
    :toggled="selectedDir === 'up'"
    @handleClick="updateToggle"/>
        <div class="text-sm font-medium">{{ currentScore }}</div>
    <ThumbsButton 
    direction="down" 
    :toggled="selectedDir === 'down'"
    @handleClick="updateToggle"/>
</template>