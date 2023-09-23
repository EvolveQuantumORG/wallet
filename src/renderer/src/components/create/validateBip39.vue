<template>
	<div>
		<div class="title dragApp" :class="{ errorTitle: isShowError }">Confirm Your Seed Phrase</div>

		<div class="mnemonic">
			<el-row :gutter="30">
				<template v-for="item in validateIndes" :key="item">
					<el-col :span="8">
						<div
							class="item"
							:class="{
								success: bip39ArrInput[item] === bip39Arr[item],
								error: bip39ArrInput[item] && bip39ArrInput[item] !== bip39Arr[item]
							}"
						>
							<div class="index selectNone">{{ item + 1 }}</div>
							<el-input v-model="bip39ArrInput[item]"></el-input>
						</div>
					</el-col>
				</template>
			</el-row>
		</div>

		<div class="title dragApp">Set Your Password</div>
		<el-form :model="formData" label-position="top" :rules="rules" ref="elFormRef">
			<el-form-item label="Enter a Strong Password" prop="password">
				<el-input v-model="formData.password" clearable show-password></el-input>
			</el-form-item>

			<el-form-item label="Confirm Password" prop="pwd">
				<el-input v-model="formData.pwd" clearable show-password></el-input>
			</el-form-item>
		</el-form>

		<div class="btn">
			<el-button type="primary" @click="changeVue('main')">Create wallet</el-button>
			<br />
			<br />
			<el-button type="info" @click="changeVue('showBip39')">Backtrack</el-button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { getRandomNumber } from "@renderer/utils/tools";
import { decryptAES, SHA1, SHA1_addValidate } from "@renderer/utils/crypto";
import { ASE_KEY, ASE_VI, SHA1_KEY, BIP39_KEY } from "@renderer/config/CONFIG";
import { UserStore } from "@renderer/stores";
import { encryptAES } from "@renderer/utils/crypto";
import { FormInstance } from "element-plus";
import { walletCreateApi } from "@renderer/api/create";

const emit = defineEmits(["changeVue"]);

const userStore = UserStore();
const bip39Str = decryptAES(userStore.bip39, ASE_KEY, ASE_VI);

const bip39Arr = bip39Str.split(",") as string[];
const bip39ArrInput = ref<string[]>([]);
const validateIndes = ref<number[]>([]);

for (let i = 0; i < 3; i++) {
	const index = getRandomNumber(0, bip39Arr.length - 1);
	if (validateIndes.value.includes(index)) {
		i--;
	} else {
		validateIndes.value.push(index);
	}
}

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

const isShowError = ref(false);

const changeVue = async (type: string) => {
	if (type === "main") {
		if (process.env.NODE_ENV === "production") {
			for (let index of validateIndes.value) {
				if (bip39ArrInput.value[index] !== bip39Arr[index]) return (isShowError.value = true);
			}
			isShowError.value = false;
		}

		await elFormRef.value?.validate();

		userStore.password = encryptAES(formData.value.password, ASE_KEY, ASE_VI);

		const bip39_has1 = SHA1_addValidate(SHA1(bip39Str, SHA1_KEY), BIP39_KEY);
		await walletCreateApi({ bip39_has1 });
	}

	emit("changeVue", type);
	return;
};
</script>

<style scoped lang="scss">
.title {
	font-size: 20px;
	padding: 20px;
	font-weight: bold;

	&.errorTitle {
		color: #f56c6c;
	}
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
		border: 1px solid transparent;
		&.success {
			border-color: #67c23a !important;
		}
		&.error {
			border-color: #f56c6c !important;
		}
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
			}
		}
	}
}

.btn {
	padding: 20px;
	.el-button {
		width: 100%;
	}
}

.el-form {
	padding: 0 20px;
}

.tips {
	line-height: 1.3;
}
</style>
