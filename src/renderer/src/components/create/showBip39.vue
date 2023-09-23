<template>
	<div>
		<div class="title dragApp">Back Up Your Seed Phrase</div>
		<div class="mnemonic">
			<el-row :gutter="30">
				<template v-for="(item, index) in mnemonic" :key="item">
					<el-col :span="8">
						<div class="item">
							<div class="index selectNone">{{ index + 1 }}</div>
							<span>{{ item }}</span>
						</div>
					</el-col>
				</template>
			</el-row>

			<el-alert type="info" :closable="false">
				<p>Please write the mnemonic on the paper and store it safely.</p>
				<br />
				<p>
					EvolveQuantum will not store your mnemonic on its server, and therefore is unable to recoveryour wallet once it is lost.
				</p>
			</el-alert>

			<div class="btn">
				<el-button type="primary" @click="changeVue('validateBip39')">Next step</el-button>
				<br />
				<br />
				<el-button type="info" @click="changeVue('welcome')">Backtrack</el-button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { nextTick, ref } from "vue";
import { encryptAES } from "@renderer/utils/crypto";
import { ASE_KEY, ASE_VI } from "@renderer/config/CONFIG";
import { UserStore } from "@renderer/stores";
const emit = defineEmits(["changeVue"]);

const userStore = UserStore();
const mnemonic = ref<string[]>([]);
nextTick(async () => {
	const bip39 = await window.api.getBip39();
	mnemonic.value = bip39.split(" ");
});

const changeVue = (type: string) => {
	if (type === "validateBip39") {
		userStore.bip39 = encryptAES(mnemonic.value.join(","), ASE_KEY, ASE_VI);
	}

	emit("changeVue", type);
};
</script>

<style scoped lang="scss">
.title {
	font-size: 20px;
	padding: 20px;
	font-weight: bold;
}
.mnemonic {
	padding: 0 20px;
	.item {
		margin-bottom: 20px;
		position: relative;
		background-color: #fafbfb;
		padding: 15px 0;
		border-radius: 10px;
		text-align: center;
		font-size: 14px;
		.index {
			font-weight: bold;
			font-size: 40px;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			color: #ebeeef;
		}
		> span {
			position: relative;
			z-index: 10;
		}
	}

	.btn {
		padding-top: 20px;
		.el-button {
			width: 100%;
		}
	}
}
</style>
