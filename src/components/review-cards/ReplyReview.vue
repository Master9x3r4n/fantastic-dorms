<script setup>

import ReviewService from "@/services/ReviewService";
import { ref, computed, defineEmits } from "vue";

const props = defineProps({
    reviewId: {type: String}
})
const emit = defineEmits(['closeReview', 'rerouteLink']);
const reply = ref("");
const replyCharacterCount = computed(() => reply.value?.length || 0);
const isReplyInvalid = computed(() => replyCharacterCount.value > 200);

const handleReplySave = () => {
    // Validation check for reply length
	if (isReplyInvalid.value) {
		alert(`Your reply is ${replyCharacterCount.value} characters long, which exceeds the 200 character limit. Please shorten it before saving.`);
	} else if (replyCharacterCount.value <= 0) {
        alert("Reply field is empty");
    } else {
        ReviewService.update(props.reviewId, {"content.reply": reply.value})
            .then(res => {
                alert("Reply saved!")
                console.log("Reply made: " + reply.value);
            })
            .catch(error => {
                console.log(`Error retrieving review \'${props.reviewId}\': ${error.message}`)
            });

        emit('closeReview');
        emit('rerouteLink', reply.value);
    }
}
</script>

<template>
<div>
<form @submit.prevent="handleReplySave">
    <!-- Bio -->
    <div class="space-y-2">
        <label class="text-sm font-semibold text-black dark:text-white">Reply</label>
        <textarea
            v-model="reply"
            rows="4"
            placeholder="Leave a reply..."
            :class="[
                'w-full mt-1 px-4 py-3 rounded-xl border bg-white dark:bg-[#121422] text-black dark:text-white outline-none transition-all resize-none placeholder:text-slate-400 dark:placeholder:text-slate-500',
                isReplyInvalid
                    ? 'border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-500/20 focus:border-red-500'
                    : 'border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-[#355AFF] focus:border-transparent'
                ]"
        ></textarea>
        <p
            :class="[
                'text-xs mt-1',
                isReplyInvalid ? 'text-red-500 font-medium' : 'text-slate-500 dark:text-slate-400'
                ]"s
            >
            {{ replyCharacterCount }} / 200 characters
        </p>
    </div>

    <!-- Action Buttons -->
    <div class="flex justify-end gap-4 border-slate-100 dark:border-slate-800">
        <button 
        @click="emit('closeReview')"
        type="button" 
        class="text-slate-500 dark:text-slate-400 px-4 py-2 text-sm font-medium hover:text-slate-900 dark:hover:text-white transition-colors">
            Cancel
        </button>
        <button type="submit" class="bg-[#355AFF] hover:bg-[#2b4bcc] text-white px-6 py-2 rounded-md text-sm font-medium transition-colors shadow-sm">
            Save
        </button>
    </div>
</form>
</div>
				
</template>