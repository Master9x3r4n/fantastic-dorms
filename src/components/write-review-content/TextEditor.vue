<script setup>
import { onBeforeUnmount, watch } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import { Markdown } from 'tiptap-markdown'

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

// Using the text editor from TipTap mashallah
const editor = useEditor({
	content: props.modelValue,
	extensions: [
		StarterKit,
		Underline, // Added the Underline extension here
		Markdown,
	],
	editorProps: {
		attributes: {
			class: 'w-full flex-1 p-3 text-sm text-slate-900 dark:text-white overflow-y-auto focus:outline-none bg-transparent min-h-[150px]',
		},
	},
	onUpdate: ({ editor }) => {
		emit('update:modelValue', editor.storage.markdown.getMarkdown());
	},
});

watch(() => props.modelValue, (newVal) => {
	if (editor.value && newVal !== editor.value.storage.markdown.getMarkdown()) {
		editor.value.commands.setContent(newVal, false);
	}
});

onBeforeUnmount(() => {
	if (editor.value) {
		editor.value.destroy();
	}
});
</script>

<template>
	<div v-if="editor" class="max-w-162 max-h-64 border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden bg-white dark:bg-[#121422] flex flex-col h-64 shadow-sm transition-colors focus-within:ring-2 focus-within:ring-[#355AFF] focus-within:border-[#355AFF]">

		<div class="flex items-center gap-1 border-b border-slate-200 dark:border-slate-700 p-2 bg-slate-50 dark:bg-slate-800 transition-colors shrink-0 overflow-x-auto">

			<button @click.prevent="editor.chain().focus().toggleBold().run()" :class="{'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white': editor.isActive('bold')}" class="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors" title="Bold"><span class="material-symbols-outlined text-[18px]">format_bold</span></button>
			<button @click.prevent="editor.chain().focus().toggleItalic().run()" :class="{'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white': editor.isActive('italic')}" class="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors" title="Italic"><span class="material-symbols-outlined text-[18px]">format_italic</span></button>
			<button @click.prevent="editor.chain().focus().toggleUnderline().run()" :class="{'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white': editor.isActive('underline')}" class="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors" title="Underline"><span class="material-symbols-outlined text-[18px]">format_underlined</span></button>
			<button @click.prevent="editor.chain().focus().toggleStrike().run()" :class="{'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white': editor.isActive('strike')}" class="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors" title="Strikethrough"><span class="material-symbols-outlined text-[18px]">strikethrough_s</span></button>

			<div class="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1"></div>

			<button @click.prevent="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white': editor.isActive('heading', { level: 2 })}" class="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors" title="Heading 2"><span class="material-symbols-outlined text-[18px]">format_h2</span></button>
			<button @click.prevent="editor.chain().focus().toggleHeading({ level: 3 }).run()" :class="{'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white': editor.isActive('heading', { level: 3 })}" class="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors" title="Heading 3"><span class="material-symbols-outlined text-[18px]">format_h3</span></button>

			<div class="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1"></div>

			<button @click.prevent="editor.chain().focus().toggleBulletList().run()" :class="{'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white': editor.isActive('bulletList')}" class="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors" title="Bullet List"><span class="material-symbols-outlined text-[18px]">format_list_bulleted</span></button>
			<button @click.prevent="editor.chain().focus().toggleOrderedList().run()" :class="{'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white': editor.isActive('orderedList')}" class="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors" title="Numbered List"><span class="material-symbols-outlined text-[18px]">format_list_numbered</span></button>
			<button @click.prevent="editor.chain().focus().toggleBlockquote().run()" :class="{'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white': editor.isActive('blockquote')}" class="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors" title="Quote"><span class="material-symbols-outlined text-[18px]">format_quote</span></button>
		</div>

		<editor-content :editor="editor" class="editor-wrapper flex-1 overflow-y-auto" />

		<div class="border-t border-slate-200 dark:border-slate-700 p-2 flex justify-between items-center bg-slate-50 dark:bg-slate-800 transition-colors shrink-0">
      <span class="text-xs text-slate-500 dark:text-slate-400 transition-colors">
        {{ props.modelValue.length }}/{{ maxLength }} characters
      </span>
			<!--<span class="material-symbols-outlined text-slate-400 text-[16px] cursor-nwse-resize hover:text-slate-600 dark:hover:text-slate-300 pointer-events-none">open_in_full</span>-->
		</div>
	</div>
</template>

<style scoped>
:deep(.ProseMirror) {
	outline: none;
}
:deep(.ProseMirror p.is-editor-empty:first-child::before) {
	content: attr(data-placeholder);
	float: left;
	color: #94a3b8; /* Tailwind text-slate-400 */
	pointer-events: none;
	height: 0;
}

/* Base elements */
:deep(.ProseMirror p) {
	margin-bottom: 0.5rem;
}

/* Lists */
:deep(.ProseMirror ul) {
	list-style-type: disc;
	padding-left: 1.5rem;
	margin-top: 0.25rem;
	margin-bottom: 0.25rem;
}
:deep(.ProseMirror ol) {
	list-style-type: decimal;
	padding-left: 1.5rem;
	margin-top: 0.25rem;
	margin-bottom: 0.25rem;
}

/* Headings */
:deep(.ProseMirror h2) {
	font-size: 1.5em;
	font-weight: 700;
	margin-top: 1rem;
	margin-bottom: 0.5rem;
	line-height: 1.2;
}
:deep(.ProseMirror h3) {
	font-size: 1.25em;
	font-weight: 600;
	margin-top: 1rem;
	margin-bottom: 0.5rem;
	line-height: 1.2;
}

/* Blockquote */
:deep(.ProseMirror blockquote) {
	border-left: 3px solid #cbd5e1; /* Tailwind slate-300 */
	padding-left: 1rem;
	margin-top: 0.5rem;
	margin-bottom: 0.5rem;
	font-style: italic;
	color: #64748b; /* Tailwind slate-500 */
}
.dark :deep(.ProseMirror blockquote) {
	border-left-color: #475569; /* Tailwind slate-600 */
	color: #94a3b8; /* Tailwind slate-400 */
}
</style>