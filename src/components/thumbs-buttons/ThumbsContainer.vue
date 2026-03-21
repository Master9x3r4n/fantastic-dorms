<script setup>
import ThumbsButton from './ThumbsButton.vue';
import { ref, computed } from 'vue'

const props = defineProps({
    score: {
        type: Number,
        default: 0
    }
});

const selectedDir = ref("none");
const vote = ref(0);

const updateToggle = (id) => {
    if ((id == "up" || id == "down") && selectedDir.value === "none")
        selectedDir.value = id;
    else if (id == "up" && selectedDir.value == "down")
        selectedDir.value = "up";
    else if (id == "down" && selectedDir.value == "up")
        selectedDir.value = "down";
    else
        selectedDir.value = "none";

    vote.value = (selectedDir.value === "up")? 1: (selectedDir.value === "down")? -1: 0;
}

</script>

<template>
    <ThumbsButton direction="up" 
    :toggled="selectedDir == 'up'"
    @handleClick="updateToggle"/>
        <div class="text-sm font-medium">{{ props.score + vote }}</div>
    <ThumbsButton direction="down" 
    :toggled="selectedDir == 'down'"
    @handleClick="updateToggle"/>
</template>