<script setup>
import { ref } from 'vue';

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const MAX_PHOTOS = 10;

const props = defineProps({
	modelValue: {
		type: Array,
		default: () => []
	}
});

const emit = defineEmits(['update:modelValue']);

const fileInput = ref(null);
const isDragging = ref(false);
const sizeErrors = ref([]);

const triggerFileInput = () => {
	fileInput.value.click();
};

const processFiles = (files) => {
	const fileArray = Array.from(files);
	const imageFiles = fileArray.filter(file => file.type.startsWith('image/'));

	const valid = [];
	const errors = [];

	const remaining = MAX_PHOTOS - props.modelValue.length;

	if (remaining <= 0) {
		sizeErrors.value = [`You can only upload up to ${MAX_PHOTOS} photos.`];
		return;
	}

	imageFiles.forEach(file => {
		if (file.size > MAX_FILE_SIZE_BYTES) {
			errors.push(`"${file.name}" exceeds the ${MAX_FILE_SIZE_MB}MB size limit.`);
		} else {
			valid.push(file);
		}
	});

	// Trim to whatever slots are left
	const trimmed = valid.slice(0, remaining);
	if (valid.length > remaining) {
		errors.push(`Only ${remaining} photo${remaining === 1 ? '' : 's'} could be added — the ${MAX_PHOTOS} photo limit has been reached.`);
	}

	sizeErrors.value = errors;

	if (trimmed.length > 0) {
		emit('update:modelValue', [...props.modelValue, ...trimmed]);
	}
};

const handleFileSelect = (event) => {
	processFiles(event.target.files);
	event.target.value = '';
};

const handleDrop = (event) => {
	isDragging.value = false;
	processFiles(event.dataTransfer.files);
};

const removeFile = (index) => {
	const newFiles = [...props.modelValue];
	newFiles.splice(index, 1);
	emit('update:modelValue', newFiles);
};

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
		<label class="block text-sm font-medium text-slate-900 dark:text-white mb-1">
			Add Photos
			<span class="text-slate-400 font-normal">({{ modelValue.length }}/{{ MAX_PHOTOS }})</span>
		</label>

		<div
				@click="modelValue.length < MAX_PHOTOS ? triggerFileInput() : null"
				@dragover.prevent="isDragging = true"
				@dragenter.prevent="isDragging = true"
				@dragleave.prevent="isDragging = false"
				@drop.prevent="handleDrop"
				:class="[
						'border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center text-center transition-colors',
    				modelValue.length >= MAX_PHOTOS
      			? 'border-slate-200 dark:border-slate-700 opacity-50 cursor-not-allowed bg-white dark:bg-[#121422]'
      			: isDragging
        		? 'border-[#355AFF] bg-[#355AFF]/5 cursor-pointer'
        		: 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 bg-white dark:bg-[#121422] cursor-pointer'
        		]"
		>
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
				{{ modelValue.length >= MAX_PHOTOS ? 'Photo limit reached' : 'Click to upload or drag and drop' }}
			</p>
			<p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
				SVG, PNG, JPG or GIF — max {{ MAX_FILE_SIZE_MB }}MB per file
			</p>
		</div>

		<!-- Size Errors -->
		<div v-if="sizeErrors.length > 0" class="mt-2 space-y-1">
			<p
					v-for="(error, index) in sizeErrors"
					:key="index"
					class="text-xs text-red-500 flex items-center gap-1"
			>
				<span class="material-symbols-outlined text-[14px]!">error</span>
				{{ error }}
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