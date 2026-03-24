<script setup>
const props = defineProps({
	replyText: {
		type: String,
		required: true
	},
	// If true, cuts text off at 2 lines. If false, shows the whole thing.
	truncate: {
		type: Boolean,
		default: true
	}
})
</script>

<template>
	<div class="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 rounded-xl p-4 mt-2">
		<p class="text-sm italic text-slate-500 dark:text-slate-400 mb-1">
			Reply from the owner
		</p>

		<div
				class="text-slate-800 dark:text-slate-300 text-sm"
				:class="{ 'line-clamp-2': truncate }"
		>
			{{ replyText }}
		</div>
	</div>
</template>