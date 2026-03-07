<script setup>
import {RouterView, useRoute} from "vue-router";
import PageFooter from "./components/footer/PageFooter.vue";
import PageHeader from "@/components/header/PageHeader.vue";

const route = useRoute();
</script>

<template>
<div class="dark:bg-[#121422]">
	<PageHeader
		:search="route.meta.search"
		:logged-in="route.meta.loggedIn"
	/>
	<RouterView />
	<PageFooter/>
</div>
</template>

<style lang = "scss" scoped></style>
