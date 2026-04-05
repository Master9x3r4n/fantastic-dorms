<script setup>
import { onBeforeUnmount, watch, computed, ref } from 'vue'
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

const isDirty = ref(false);

const editor = useEditor({
	content: props.modelValue,
	extensions: [
		StarterKit,
		Underline,
		Markdown,
	],
	editorProps: {
		attributes: {
			class: 'w-full flex-1 p-3 text-sm text-slate-900 dark:text-white overflow-y-auto focus:outline-none bg-transparent min-h-[150px]',
		},
	},
	onUpdate: ({ editor }) => {
		isDirty.value = true;
		emit('update:modelValue', editor.storage.markdown.getMarkdown());
	},
});

const characterCount = computed(() => {
	return editor.value?.getText().length ?? 0;
});

const isEmpty = computed(() => characterCount.value === 0);
const isOverLimit = computed(() => characterCount.value > props.maxLength);
const isInvalid = computed(() => isDirty.value && (isEmpty.value || isOverLimit.value));

// Expose so parent can check validity before submitting
defineExpose({ isInvalid, isEmpty, isOverLimit });

watch(() => props.modelValue, (newVal) => {
	if (editor.value && newVal !== editor.value.storage.markdown.getMarkdown()) {
		editor.value.commands.setContent(newVal, false);
	}
});

onBeforeUnmount(() => {
	if (editor.value) editor.value.destroy();
});
</script>

<template>
	<div class="flex flex-col gap-1">
		<div
				v-if="editor"
				:class="[
        'max-w-162 max-h-64 border rounded-md overflow-hidden bg-white dark:bg-[#121422] flex flex-col h-64 shadow-sm transition-colors focus-within:ring-2',
        isInvalid
          ? 'border-red-400 focus-within:ring-red-200 dark:focus-within:ring-red-500/20 focus-within:border-red-400'
          : 'border-slate-200 dark:border-slate-700 focus-within:ring-[#355AFF] focus-within:border-[#355AFF]'
      ]"
		>
			<!-- Toolbar -->
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

			<!-- Footer -->
			<div class="border-t border-slate-200 dark:border-slate-700 p-2 flex justify-between items-center bg-slate-50 dark:bg-slate-800 transition-colors shrink-0">
        <span
						:class="[
            'text-xs transition-colors',
            isOverLimit
              ? 'text-red-500 font-medium'
              : 'text-slate-500 dark:text-slate-400'
          ]"
				>
          {{ characterCount }}/{{ maxLength }} characters
        </span>
			</div>
		</div>

		<!-- Error message -->
		<p v-if="isInvalid" class="text-xs text-red-500">
			{{ isOverLimit ? `Content exceeds the ${maxLength} character limit.` : 'Please write something before submitting.' }}
		</p>
	</div>
</template>