<template>
	<div class="vueApp createVue">
		<transition name="el-fade-in-linear" mode="out-in">
			<Welcome @changeVue="changeVue" v-if="currentType === 'welcome'" />
			<ShowBip39 @changeVue="changeVue" v-else-if="currentType === 'showBip39'" />
			<ValidateBip39 @changeVue="changeVue" v-else-if="currentType === 'validateBip39'" />
			<existingBip39 @changeVue="changeVue" v-else-if="currentType === 'existingBip39'" />
		</transition>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Welcome from "./create/welcome.vue";
import ShowBip39 from "./create/showBip39.vue";
import ValidateBip39 from "./create/validateBip39.vue";
import existingBip39 from "./create/existingBip39.vue";

const emit = defineEmits(["changeVue"]);

const currentType = ref("welcome");
const changeVue = (type: string) => {
	if (type === "main") {
		emit("changeVue", "main");
		currentType.value = "welcome";
		return;
	}
	currentType.value = type;
};
</script>

<style scoped lang="scss">
.createVue {
}
</style>
