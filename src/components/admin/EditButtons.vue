<script setup>
const emit = defineEmits(['add', 'update', 'delete', 'unselect', 'submit'])
const props = defineProps({
    addMode: {type: Boolean, default: true},
    showButtons: {type: Boolean, default: true}
})

const emitUpdate = () => {
    emit('submit')
    emit('update')
}

const emitAdd = () => {
    emit('submit')
    emit('add')
}
</script>

<template>
    <!-- Buttons -->
    <div class="flex w-full justify-end gap-4 px-1" v-if="!props.addMode">
        <button v-if="showButtons"
        @click="emitUpdate()"
        class="bg-blue-500 hover:bg-blue-400 text-white px-3 py-1 rounded text-md font-semibold transition"
        > Update </button>
        <button v-if="showButtons"
        @click="emit('delete')"
        class="bg-red-400 hover:bg-red-300 text-white px-3 py-1 rounded text-md font-semibold transition"
        > Delete </button>
        <button
        @click="emit('unselect')"
        class="bg-gray-400 hover:bg-gray-300 text-white px-3 py-1 rounded text-md font-semibold transition"
        > Cancel </button>
    </div>
    <div class="flex w-full justify-end gap-4 px-1" v-else>
        <button
        @click="emitAdd()"
        class="bg-blue-500 hover:bg-blue-400 text-white px-3 py-1 rounded text-md font-semibold transition"
        > Add </button>
    </div>
</template>