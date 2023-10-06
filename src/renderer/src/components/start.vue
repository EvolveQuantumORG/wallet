<template>
	<div class="start dragApp">
		<img src="@renderer/assets/img/evolve_coin.png" class="startImg" />
		<div class="progress">{{ progress }}%</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { versionTestApi } from "@renderer/api/start";
// @ts-ignore
import packageJson from "../../../../package.json";
import { UserStore } from "@renderer/stores";

const emit = defineEmits(["changeVue"]);
const userStore = UserStore();

const progress = ref(5);
versionTestApi().then(
	res => {
		if (res.version !== packageJson.version) {
			progress.value = 50;

			window.api.openExternal("https://github.com/EvolveQuantumORG/wallet");
			window.api.exitApp();
		} else {
			if (res.start === 1) {
				window.api.startApp();
			}

			progress.value = 100;
			window.api.openMain();

			if (userStore.token) {
				emit("changeVue", "main");
			} else {
				emit("changeVue", "create");
			}
		}
	},
	// @ts-ignore
	(err: any) => {
		window.api.exitApp();
	}
);
</script>

<style scoped lang="scss">
.start {
	width: 100%;
	height: 100%;
	position: relative;
	.progress {
		position: absolute;
		bottom: 20px;
		left: 50%;
		transform: translateX(-50%);
		color: #ddab51;
	}

	.startImg {
		width: 220px;
		height: 220px;
		display: block;
	}
}
</style>
