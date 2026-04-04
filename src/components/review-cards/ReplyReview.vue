<script setup>
import { ref, computed } from "vue";
import ReviewService from "@/services/ReviewService";

const props = defineProps({
	reviewId: {
		type: String,
		required: true
	},
	initialReply: {
		type: String,
		default: ""
	}
});

const emit = defineEmits(['closeReview', 'rerouteLink']);

const reply = ref(props.initialReply);
const isSubmitting = ref(false);

const replyCharacterCount = computed(() => reply.value?.length || 0);
const isReplyInvalid = computed(() => replyCharacterCount.value > 200);

const handleReplySave = () => {
	// Validation check for reply length
	if (isReplyInvalid.value) {
		alert(`Your reply is ${replyCharacterCount.value} characters long, which exceeds the 200 character limit. Please shorten it before saving.`);
		return;
	}

	isSubmitting.value = true;

	ReviewService.update(props.reviewId, { "content.reply": reply.value.trim() })
			.then(() => {
				console.log("Reply made: " + reply.value);
				emit('closeReview');
				emit('rerouteLink', reply.value.trim());
			})
			.catch(error => {
				console.error(`Error retrieving/updating review '${props.reviewId}': ${error.message}`);
				alert("Failed to save reply. Please try again.");
			})
			.finally(() => {
				isSubmitting.value = false;
			});
}
</script>

<template>
	<div class="w-full bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50 p-4 mt-2 transition-colors duration-200">
		<form @submit.prevent="handleReplySave" class="flex flex-col gap-4">

			<div class="space-y-2">
				<label class="text-sm font-semibold text-slate-900 dark:text-white">Owner Reply</label>
				<textarea
						v-model="reply"
						rows="3"
						placeholder="Leave a reply..."
						:disabled="isSubmitting"
						:class="[
                    'w-full px-4 py-3 rounded-xl border bg-white dark:bg-[#121422] text-slate-900 dark:text-white outline-none transition-all resize-none placeholder:text-slate-400 dark:placeholder:text-slate-500',
                    isReplyInvalid
                        ? 'border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-500/20 focus:border-red-500'
                        : 'border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-[#355AFF]/20 focus:border-[#355AFF]'
                ]"
				></textarea>

				<div class="flex justify-between items-start">
					<p class="text-xs text-slate-500 dark:text-slate-400">
						This reply will be visible publicly on the review. Clear the text to delete.
					</p>
					<p
							:class="[
                        'text-xs text-right whitespace-nowrap ml-4',
                        isReplyInvalid ? 'text-red-500 font-medium' : 'text-slate-500 dark:text-slate-400'
                    ]"
					>
						{{ replyCharacterCount }} / 200
					</p>
				</div>
			</div>

			<!-- Action Buttons -->
			<div class="flex justify-end gap-3 pt-2">
				<button
						@click="emit('closeReview')"
						type="button"
						:disabled="isSubmitting"
						class="text-slate-500 dark:text-slate-400 px-4 py-2 text-sm font-medium hover:text-slate-900 dark:hover:text-white transition-colors disabled:opacity-50"
				>
					Cancel
				</button>
				<button
						type="submit"
						:disabled="isSubmitting"
						class="bg-[#355AFF] hover:bg-[#2b4bcc] text-white px-6 py-2 rounded-md text-sm font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[80px]"
				>
					<span v-if="isSubmitting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
					<span v-else>Save</span>
				</button>
			</div>
		</form>
	</div>
</template>

<style scoped>
@reference "tailwindcss";
</style>