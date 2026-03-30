<script setup>
const model = defineModel();

const props = defineProps({
    formLabel: {type: String, default: "Field"},
    formType: {type: String, default: "text"}
});
</script>

<template>
    <div class="flex gap-2 my-3">
        <label class="block font-semibold text-[19px]">{{ formLabel }}: </label>
        <textarea 
        v-if="formType === 'textarea'"
        v-model="model"
        class="w-7/12 px-2 py-1 border rounded-md"></textarea>
        <input 
        v-else
        v-model="model"
        class="w-5/12 px-2 py-1 border rounded-md"
        :type="formType"/>
    </div>
</template>