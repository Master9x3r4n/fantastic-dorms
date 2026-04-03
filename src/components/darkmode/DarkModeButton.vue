<script setup>
    import {ref, watch} from "vue"

	// Object data for dark and light mode themes
	const theme = {
		"light": {
			"src": "src/assets/darkmode-assets/sun-svgrepo-com.svg",
			"alt": "Light Mode Icon"
		},
		"dark": {
			"src": "src/assets/darkmode-assets/moon-svgrepo-com.svg",
			"alt": "Dark Mode Icon"
		}
	}

	//get theme preference from local storage
	const savedPreference = localStorage.getItem('DARK_PREFERENCE');
    const darkMode = ref(savedPreference !== null ? JSON.parse(savedPreference): false);

	const iconSrc = ref(darkMode.value ? theme.dark : theme.light) // ref for current theme

	// Trigger dark mode call back when darkMode boolean is changed
    watch(darkMode, (enabled) => {
		iconSrc.value = darkMode.value ? theme.dark : theme.light;
        document.documentElement.classList.toggle('dark', enabled)
		localStorage.setItem('DARK_PREFERENCE', JSON.stringify(enabled));
    })

	// Callback function to toggle dark mode
    const toggleDarkMode = () => {
		darkMode.value = !darkMode.value;
    }

</script>

<template>
  	<button @click="toggleDarkMode()" class="border-2 rounded-2xl p-2 dark:bg-black">
		<img :src="iconSrc.src" :alt="iconSrc.alt" width = "20px" height= "20px">
	</button>
</template>