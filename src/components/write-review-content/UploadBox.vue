<script setup>
import { ref } from 'vue';

const props = defineProps({
	// Allows the parent to use v-model
	modelValue: {
		type: Array,
		default: () => []
	}
});

const emit = defineEmits(['update:modelValue']);

const fileInput = ref(null);
const isDragging = ref(false);

// Opens the native file browser
const triggerFileInput = () => {
	fileInput.value.click();
};

// Process files from either drag-and-drop or click
const processFiles = (files) => {
	const fileArray = Array.from(files);

	// Optional: Filter to ensure only images are added
	const imageFiles = fileArray.filter(file => file.type.startsWith('image/'));

	// Combine existing files with the new ones and emit to parent
	emit('update:modelValue', [...props.modelValue, ...imageFiles]);
};

// Handle file input change
const handleFileSelect = (event) => {
	processFiles(event.target.files);
	event.target.value = ''; // Reset input so the same file can be selected again if removed
};

// Handle drag and drop
const handleDrop = (event) => {
	isDragging.value = false;
	processFiles(event.dataTransfer.files);
};

// Remove a specific file
const removeFile = (index) => {
	const newFiles = [...props.modelValue];
	newFiles.splice(index, 1);
	emit('update:modelValue', newFiles);
};

// Helper function to format file sizes nicely (e.g., 2.5 MB)
const formatSize = (bytes) => {
	if (bytes === 0) return '0 Bytes';
	const k = 1024;
	const sizes = ['Bytes', 'KB', 'MB', 'GB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
</script>

<template>
	<div>
		<label class="block text-sm font-medium text-slate-900 dark:text-white mb-1">Add Photos</label>

		<!-- Drag & Drop Zone -->
		<div
				@click="triggerFileInput"
				@dragover.prevent="isDragging = true"
				@dragenter.prevent="isDragging = true"
				@dragleave.prevent="isDragging = false"
				@drop.prevent="handleDrop"
				:class="[
        'border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors',
        isDragging
          ? 'border-[#355AFF] bg-[#355AFF]/5'
          : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 bg-white dark:bg-[#121422]'
      ]"
		>
			<!-- Hidden File Input -->
			<input
					type="file"
					ref="fileInput"
					class="hidden"
					multiple
					accept="image/png, image/jpeg, image/gif, image/svg+xml"
					@change="handleFileSelect"
			/>

			<span
					class="material-symbols-outlined text-3xl mb-2 transition-colors"
					:class="isDragging ? 'text-[#355AFF]' : 'text-slate-400'"
			>
        cloud_upload
      </span>
			<p class="text-sm font-medium text-slate-900 dark:text-white">
				Click to upload or drag and drop
			</p>
			<p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
				SVG, PNG, JPG or GIF
			</p>
		</div>

		<!-- Uploaded Files Preview List -->
		<div v-if="modelValue.length > 0" class="mt-4 space-y-2">
			<div
					v-for="(file, index) in modelValue"
					:key="index"
					class="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-md"
			>
				<div class="flex items-center gap-3 overflow-hidden">
					<span class="material-symbols-outlined text-slate-400">image</span>
					<div class="flex flex-col truncate">
						<span class="text-sm font-medium text-slate-900 dark:text-white truncate">{{ file.name }}</span>
						<span class="text-xs text-slate-500">{{ formatSize(file.size) }}</span>
					</div>
				</div>

				<button
						@click="removeFile(index)"
						type="button"
						class="p-1 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors focus:outline-none"
				>
					<span class="material-symbols-outlined text-[20px]">delete</span>
				</button>
			</div>
		</div>

	</div>
</template>

<style>
</style>