<template>
	<div class="mainVue vueApp">
		<transition name="el-fade-in-linear" mode="out-in">
			<Main @changeVue="changeVue" v-if="currentType === 'main'" />
			<tokenInfo @changeVue="changeVue" v-else-if="currentType === 'tokenInfo' || currentType === 'recordInfo'" />
			<receive @changeVue="changeVue" v-else-if="currentType === 'receive'" />
			<send @changeVue="changeVue" @getWallet="getWallet" v-else-if="currentType === 'send'" />
			<setting @changeVue="changeVue" @getWallet="getWallet" v-else-if="currentType === 'setting'" />
		</transition>
		<!-- <recordInfo @changeVue="changeVue" v-if="currentType === 'recordInfo'" /> -->
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Main from "./main/main.vue";
import tokenInfo from "./main/tokenInfo.vue";
// import recordInfo from "./main/recordInfo.vue";
import receive from "./main/receive.vue";
import send from "./main/send.vue";
import setting from "./main/setting.vue";
import { UserStore } from "@renderer/stores";
import { getWalletApi } from "@renderer/api/main";

const emit = defineEmits(["changeVue"]);
const currentType = ref("main");
const changeVue = (type: string) => {
	currentType.value = type;
};

const userStore = UserStore();
async function getWallet() {
	try {
		const { user } = await getWalletApi();
		userStore.user = user;
	} catch (error: any) {
		if (error?.code === 999) {
			emit("changeVue", "create");
		}
	}
}
getWallet();
setInterval(() => {
	getWallet();
}, 23000);
</script>

<style scoped lang="scss">
.mainVue {
	border: none;
}
</style>
