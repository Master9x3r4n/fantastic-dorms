<script setup>
const emit = defineEmits(['add', 'update', 'delete', 'unselect'])
const props = defineProps({
    addMode: {type: Boolean, default: true}
})
</script>

<template>
    <!-- Buttons -->
    <div class="flex w-full justify-end gap-4 px-1" v-if="!props.addMode">
        <button
        @click="emit('update')"
        class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-md font-semibold transition"
        > Update </button>
        <button
        @click="emit('delete')"
        class="bg-red-400 hover:bg-red-500 text-white px-3 py-1 rounded text-md font-semibold transition"
        > Delete </button>
        <button
        @click="emit('unselect')"
        class="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded text-md font-semibold transition"
        > Cancel </button>
    </div>
    <div class="flex w-full justify-end gap-4 px-1" v-else>
        <button
        @click="emit('add')"
        class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-md font-semibold transition"
        > Add </button>
    </div>
</template>