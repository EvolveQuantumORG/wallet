<template>
	<div>
		<div class="title dragApp">Import mnemonic words</div>
		<div class="mnemonic">
			<el-row :gutter="30">
				<template v-for="(item, index) in mnemonic" :key="index">
					<el-col :span="8">
						<div class="item">
							<div class="index selectNone">{{ index + 1 }}</div>
							<el-input v-model.trim="mnemonic[index]" @input="inputCente"></el-input>
						</div>
					</el-col>
				</template>
			</el-row>
		</div>

		<div class="title">Set Your Password</div>
		<div class="main">
			<el-form :model="formData" label-position="top" :rules="rules" ref="elFormRef">
				<el-form-item label="Enter a Strong Password" prop="password">
					<el-input v-model="formData.password" clearable show-password></el-input>
				</el-form-item>

				<el-form-item label="Confirm Password" prop="pwd">
					<el-input v-model="formData.pwd" clearable show-password></el-input>
				</el-form-item>
			</el-form>

			<div class="btn">
				<el-button type="primary" @click="changeVue('main')">Import</el-button>
				<br />
				<br />
				<el-button type="info" @click="changeVue('welcome')">Backtrack</el-button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { SHA1, SHA1_addValidate, encryptAES } from "@renderer/utils/crypto";
import { ASE_KEY, ASE_VI, BIP39_KEY, SHA1_KEY } from "@renderer/config/CONFIG";
import { UserStore } from "@renderer/stores";
import { FormInstance } from "element-plus";
import { walletCreateApi } from "@renderer/api/create";
const emit = defineEmits(["changeVue"]);

const userStore = UserStore();
const mnemonic = ref<string[]>([]);
for (let i = 0; i < 12; i++) {
	mnemonic.value.push("");
}

const inputCente = (v: string) => {
	if (v.split(" ").length === 12) {
		const arr = v.split(" ");
		for (let i = 0; i < arr.length; i++) {
			mnemonic.value[i] = arr[i];
		}
	} else if (v.split(",").length === 12) {
		const arr = v.split(",");
		for (let i = 0; i < arr.length; i++) {
			mnemonic.value[i] = arr[i];
		}
	}
};

const elFormRef = ref<FormInstance>();
const formData = ref<Record<string, string>>({});

// @ts-ignore
function validatePwd(rule: any, value: any, callback: any) {
	if (formData.value.password !== formData.value.pwd) return callback(new Error("Confirm Password"));
	callback();
}
const rules = reactive({
	password: [
		{ required: true, message: "8 or more characters.", trigger: "blur" },
		{ pattern: /^.{8,}$/, trigger: "change", message: "8 or more characters." }
	],
	pwd: [
		{ required: true, message: "8 or more characters.", trigger: "blur" },
		{ validator: validatePwd, trigger: "change" }
	]
});

const changeVue = async (type: string) => {
	if (type === "main") {
		await elFormRef.value?.validate();

		userStore.password = encryptAES(formData.value.password, ASE_KEY, ASE_VI);

		userStore.bip39 = encryptAES(mnemonic.value.join(","), ASE_KEY, ASE_VI);
		const bip39_has1 = SHA1_addValidate(SHA1(mnemonic.value.join(","), SHA1_KEY), BIP39_KEY);
		await walletCreateApi({ bip39_has1, importType: "1" });
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
		> .el-input {
			position: relative;
			z-index: 10;
			::v-deep(.el-input__wrapper) {
				background-color: transparent !important;
				height: 60px;
				box-shadow: none;
				text-align: center;
			}
		}
	}
}
.btn {
	padding-top: 20px;
	.el-button {
		width: 100%;
	}
}

.main {
	padding: 0 20px 20px;
}
</style>
