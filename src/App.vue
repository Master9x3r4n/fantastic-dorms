<script setup>
import {onMounted} from 'vue';
import { RouterView, useRoute } from "vue-router";
import PageFooter from "./components/footer/PageFooter.vue";
import PageHeader from "@/components/header/PageHeader.vue";
import { useAuthStore } from '@/auth';

const route = useRoute();
const auth = useAuthStore();
onMounted(() => auth.fetchCurrentUser());

</script>

<template>
	<div class="flex flex-col min-h-screen bg-white dark:bg-[#121422] transition-colors duration-300">
		<PageHeader
				:search="route.meta.search"
				:logged-in="route.meta.loggedIn"
		/>
		<main class="flex-grow">
			<RouterView />
		</main>
		<PageFooter />
	</div>
</template>

<style scoped>
/* Ensure the html and body don't have weird overflow or height issues */
:global(html, body) {
	height: 100%;
	margin: 0;
	padding: 0;
}
</style>