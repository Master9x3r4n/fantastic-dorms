<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
	modelValue: {
		type: String,
		default: ''
	},
	placeholder: {
		type: String,
		default: 'My experience with this place was...'
	},
	maxLength: {
		type: Number,
		default: 1000
	}
});

const emit = defineEmits(['update:modelValue']);

const editorRef = ref(null);
const charCount = ref(0);

// Keep track of active formatting for button highlighting
const activeFormats = ref({
	bold: false,
	italic: false,
	underline: false,
	strikeThrough: false,
	insertUnorderedList: false,
	insertOrderedList: false,
	justifyLeft: false,
	justifyCenter: false
});

// Execute the formatting command
const format = (command) => {
	// bare with me im working with literally nothing here to make this text editor
	document.execCommand(command, false, null);
	editorRef.value.focus();
	updateContent();
	checkFormatting();
};

// Update v-model and character count
const updateContent = () => {
	if (!editorRef.value) return;

	const html = editorRef.value.innerHTML;
	const text = editorRef.value.innerText || '';

	charCount.value = text.trim().length;
	emit('update:modelValue', html);
};

// Check which formats are currently active at the cursor position
const checkFormatting = () => {
	Object.keys(activeFormats.value).forEach(cmd => {
		activeFormats.value[cmd] = document.queryCommandState(cmd);
	});
};

// Sync external changes to the editor (but avoid moving the cursor if user is typing)
watch(() => props.modelValue, (newValue) => {
	if (editorRef.value && newValue !== editorRef.value.innerHTML) {
		editorRef.value.innerHTML = newValue;
		charCount.value = (editorRef.value.innerText || '').trim().length;
	}
});

onMounted(() => {
	if (editorRef.value && props.modelValue) {
		editorRef.value.innerHTML = props.modelValue;
		charCount.value = (editorRef.value.innerText || '').trim().length;
	}

	// Listen to selection changes to highlight active buttons
	document.addEventListener('selectionchange', checkFormatting);
});

onBeforeUnmount(() => {
	document.removeEventListener('selectionchange', checkFormatting);
});
</script>

<template>
	<div class="max-w-162 max-h-64 border border-slate-200 dark:border-slate-700	rounded-md overflow-hidden bg-white dark:bg-[#121422] flex flex-col h-64 shadow-sm transition-colors focus-within:ring-2 focus-within:ring-[#355AFF] focus-within:border-[#355AFF]">

		<!-- Toolbar -->
		<div class="flex items-center gap-1 border-b border-slate-200 dark:border-slate-700 p-2 bg-slate-50 dark:bg-slate-800 transition-colors shrink-0 overflow-x-auto">

			<!-- Text Styles -->
			<button @click.prevent="format('bold')" type="button" :class="{'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white': activeFormats.bold}" class="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"><span class="material-symbols-outlined text-[18px]">format_bold</span></button>
			<button @click.prevent="format('italic')" type="button" :class="{'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white': activeFormats.italic}" class="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"><span class="material-symbols-outlined text-[18px]">format_italic</span></button>
			<button @click.prevent="format('underline')" type="button" :class="{'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white': activeFormats.underline}" class="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"><span class="material-symbols-outlined text-[18px]">format_underlined</span></button>
			<button @click.prevent="format('strikeThrough')" type="button" :class="{'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white': activeFormats.strikeThrough}" class="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"><span class="material-symbols-outlined text-[18px]">strikethrough_s</span></button>

			<div class="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1"></div>

			<!-- Lists -->
			<button @click.prevent="format('insertUnorderedList')" type="button" :class="{'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white': activeFormats.insertUnorderedList}" class="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"><span class="material-symbols-outlined text-[18px]">format_list_bulleted</span></button>
			<button @click.prevent="format('insertOrderedList')" type="button" :class="{'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white': activeFormats.insertOrderedList}" class="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"><span class="material-symbols-outlined text-[18px]">format_list_numbered</span></button>

			<div class="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1"></div>

			<!-- Alignment -->
			<button @click.prevent="format('justifyLeft')" type="button" :class="{'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white': activeFormats.justifyLeft}" class="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"><span class="material-symbols-outlined text-[18px]">format_align_left</span></button>
			<button @click.prevent="format('justifyCenter')" type="button" :class="{'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white': activeFormats.justifyCenter}" class="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"><span class="material-symbols-outlined text-[18px]">format_align_center</span></button>
		</div>

		<!-- Editable Content Area -->
		<div
				ref="editorRef"
				contenteditable="true"
				@input="updateContent"
				@keyup="checkFormatting"
				@mouseup="checkFormatting"
				:data-placeholder="placeholder"
				class="editor-content w-full flex-1 p-3 text-sm text-slate-900 dark:text-white overflow-y-auto focus:outline-none bg-transparent"
		></div>

		<!-- Footer -->
		<div class="border-t border-slate-200 dark:border-slate-700 p-2 flex justify-between items-center bg-slate-50 dark:bg-slate-800 transition-colors shrink-0">
      <span :class="{'text-red-500': charCount > maxLength, 'text-slate-500 dark:text-slate-400': charCount <= maxLength}" class="text-xs transition-colors">
        {{ charCount }}/{{ maxLength }} characters
      </span>
			<span class="material-symbols-outlined text-slate-400 text-[16px] cursor-nwse-resize hover:text-slate-600 dark:hover:text-slate-300 pointer-events-none">open_in_full</span>
		</div>
	</div>
</template>

<style scoped>
@reference "tailwindcss";

.editor-content:empty:before {
	content: attr(data-placeholder);
	@apply text-slate-400 dark:text-slate-500 pointer-events-none block;
}

.editor-content :deep(ul) {
	list-style-type: disc;
	padding-left: 1.5rem;
	margin-top: 0.25rem;
	margin-bottom: 0.25rem;
}
.editor-content :deep(ol) {
	list-style-type: decimal;
	padding-left: 1.5rem;
	margin-top: 0.25rem;
	margin-bottom: 0.25rem;
}
.editor-content :deep(b), .editor-content :deep(strong) {
	font-weight: 700;
}
.editor-content :deep(i), .editor-content :deep(em) {
	font-style: italic;
}
.editor-content :deep(u) {
	text-decoration: underline;
}
.editor-content :deep(strike) {
	text-decoration: line-through;
}
</style>