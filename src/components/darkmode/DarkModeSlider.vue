<script setup>
    import {ref, watch} from "vue"
    import Icon from "../icon/Icon.vue"

    const darkMode = ref(false) // ref for dark mode toggle

	// Trigger dark mode call back when darkMode boolean is changed
    watch(darkMode, (enabled) => {
        document.documentElement.classList.toggle('dark', enabled)
    })

</script>

<template>
<div class="p-0.5 flex gap-2">
    <div class="border-2 rounded-2xl p-1 size-8.5 flex items-center justify-center dark:bg-black">
        <Icon name="themeMode"/>
	</div>

    <label class="relative inline-block w-15 h-8.5">
        <input type="checkbox" 
        v-model="darkMode"
        class="opacity-0 w-0 h-0">

        <span class="slider round absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-[#ccc] rounded-4xl">
        </span>
    </label>
</div>
</template>

<style scoped>
    /* Yeah no, I give up copying into tailwind css, 
    code from:https://www.w3schools.com/howto/howto_css_switch.asp
     */

    .slider {
    -webkit-transition: .4s;
    transition: .4s;
    }

    .slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
    }

    input:checked + .slider {
    background-color: #000000;
    }

    input:focus + .slider {
    box-shadow: 0 0 1px #000000;
    }

    input:checked + .slider:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
    }

    .slider.round:before {
    border-radius: 50%;
    }
</style>