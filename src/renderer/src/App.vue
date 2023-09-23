<template>
	<el-config-provider size="large">
		<div class="app">
			<transition name="el-fade-in-linear" mode="out-in">
				<Start @changeVue="changeVue" v-if="currentType == 'start'" />
				<Main @changeVue="changeVue" v-else-if="currentType == 'main'" />
				<Create @changeVue="changeVue" v-else-if="currentType == 'create'" />
			</transition>
		</div>
	</el-config-provider>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Start from "./components/start.vue";
import Main from "./components/main.vue";
import Create from "./components/create.vue";

const currentType = ref("start");
const changeVue = (type: string) => {
	currentType.value = type;
};
</script>
<style lang="sass"></style>
