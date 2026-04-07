<script setup>
import ThumbsButton from './ThumbsButton.vue';
import ReviewService from '@/services/ReviewService';
import { ref, computed } from 'vue'

const props = defineProps({
    reviewId: String,
    score: {
        type: Number,
        default: 0
    }
});

const selectedDir = ref("none");
const currentScore = ref(props.score);

const updateToggle = async (id) => {
    console.log("My Review ID is:", props.reviewId);
    
    let choice = '';

    if (id == 'up' && selectedDir.value === 'none')
    {
        selectedDir.value = 'up';
        choice = 'up'
    }  
    else if (id == 'down' && selectedDir.value === 'none')
    {
        selectedDir.value = 'down';
        choice = 'down'
    }
    else if (id == 'up' && selectedDir.value == 'down')
    {
        selectedDir.value = 'up';
        choice = 'upup'
    }   
    else if (id == 'down' && selectedDir.value == 'up')
    {
        selectedDir.value = 'down';
        choice = 'downdown'
    }    
    else if (id == 'down' && selectedDir.value == 'down')
    {
        selectedDir.value = 'none';
        choice = 'up';
    }
    else if (id == 'up' && selectedDir.value == 'up')
    {
        selectedDir.value = 'none';
        choice = 'down';
    }
        

    try
    {
        // update the score in the db
        const res = await ReviewService.updateScore(props.reviewId, choice);

        // 
        currentScore.value = res.data.score;
    }
    catch (err)
    {
        console.error("ERR score update failed--> ", err);
    }
    
}
//vote.value = (selectedDir.value === "up")? 1: (selectedDir.value === "down")? -1: 0;
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