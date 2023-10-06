<template>
	<div class="vueApp send">
		<app-title @back="changeVue('back')">Send</app-title>

		<div class="form">
			<el-form :model="formData" label-width="80px">
				<el-form-item label="Receiving" label-position="top">
					<el-input
						v-model.trim="formData.address"
						placeholder="Paste or enter the account address"
						clearable
						type="textarea"
						:rows="2"
					></el-input>
				</el-form-item>

				<el-form-item label="Token" label-position="top">
					<el-select v-model="formData.token" placeholder="">
						<el-option :value="item.value" v-for="item in coinStore.coins" :key="item.name">
							<div style="display: flex; align-items: center">
								<el-avatar :src="item.logo" size="20" />
								<div class="name">{{ item.name }}</div>
							</div>
						</el-option>
					</el-select>
					<span style="color: #22a3fa; line-height: 1.1" v-if="formData.token">{{ userStore.user[formData.token] }}</span>
				</el-form-item>
				<el-form-item label="Amount" label-position="top">
					<el-input
						v-model.trim="formData.number"
						placeholder="0"
						clearable
						:disabled="!formData.token || userStore.user[formData.token] == 0"
						@blur="AmountBlur"
					>
						<template #append>
							<el-button @click="setMaxCoin" :disabled="!formData.token || userStore.user[formData.token] == 0">MAX</el-button>
						</template>
					</el-input>
					<div v-if="formData.token === 'evq'">
						<el-switch v-model="formData.isMyFee" :disabled="!formData.token || userStore.user[formData.token] == 0"></el-switch>
						<span style="margin-left: 10px; font-size: 12px">Deduct from the amount Fee</span>
					</div>
				</el-form-item>
			</el-form>
		</div>

		<transition name="el-zoom-in-top">
			<div v-if="Number(formData.number) > 0 && formData.address && formData.address.length == 42">
				<div class="explainBox">
					<div class="valueBox">
						<label> From </label>
						<div class="value">{{ userStore.user.address }}</div>
					</div>
					<div class="valueBox">
						<label> To </label>
						<div class="value">
							{{ formData.address }}
							<br />
							<!-- <span style="color: #f56c6c" v-if="!isSelfChainAddress">
								<el-icon><Warning /></el-icon>
								Non-EvolveQuantum chain address detected
							</span> -->
							<el-tag v-if="!isSelfChainAddress" size="mini">BSC</el-tag>
						</div>
					</div>
					<div class="valueBox">
						<label> Amount </label>
						<div class="value">{{ amountCoumput() }} {{ formData.token }}</div>
					</div>
					<div class="valueBox">
						<label> Fee </label>
						<div class="value">
							{{ feeCoumput() }} EVQ
							<span style="color: #f56c6c" v-if="!isPay">
								<el-icon><Warning /></el-icon>
								Be not able to pay Fee
							</span>
						</div>
					</div>
				</div>

				<div class="btn">
					<el-button type="primary" :disabled="!isPay" @click="onSend">Send</el-button>
				</div>
			</div>
		</transition>
	</div>
</template>

<script setup lang="ts">
import { CoinStore, UserStore } from "@renderer/stores";
import { computed, ref, watch } from "vue";
import { sendApi } from "@renderer/api/main";
import ParamsStore from "@renderer/stores/modules/ParamsStore";
import { ElMessageBox, ElNotification } from "element-plus";
import { SHA1_validate } from "@renderer/utils/crypto";
import { ADDRESS_KEY } from "@renderer/config/CONFIG";

const emit = defineEmits(["changeVue", "getWallet"]);
const changeVue = (type: string) => {
	if (type === "back") {
		if (paramsStore.params.send && paramsStore.params.send.back) {
			type = paramsStore.params.send.back;
		}
	}
	if (type === "back") {
		type = "main";
	}

	emit("changeVue", type);
};

const paramsStore = ParamsStore();
const coinStore = CoinStore();
const userStore = UserStore();

const FeeEachK = ref(0.000723);

const formData = ref<Record<string, any>>({});
if (paramsStore.params?.send?.token) {
	formData.value.token = paramsStore.params.send.token;
}
watch(
	() => formData.value.token,
	() => {
		formData.value.number = 0;
		formData.value.isMyFee = false;
	}
);
const AmountBlur = () => {
	if (Number(formData.value.number) >= userStore.user[formData.value.token]) {
		formData.value.number = userStore.user[formData.value.token];
		formData.value.isMyFee = true;
		return;
	}

	formData.value.number = Number(formData.value.number).toFixed(8);
};

const setMaxCoin = () => {
	if (formData.value.token === "evq") {
		formData.value.isMyFee = true;
	}

	formData.value.number = userStore.user[formData.value.token];
};

const feeCoumput = () => {
	const data = formData.value;
	let fee = 0;
	if (data.token === "evq") {
		fee = FeeEachK.value * parseInt(data.number / 10.24 + "");
	} else {
		fee = FeeEachK.value * parseInt(data.number / 4.096 + "");
	}

	if (fee < 0.00353027) fee = 0.00353027;
	return fee.toFixed(8);
};
const amountCoumput = () => {
	const data = formData.value;
	let number = Number(data.number);
	if (data.isMyFee && data.token === "evq") {
		number -= Number(feeCoumput());
	}
	return number.toFixed(8);
};
const isPay = computed(() => {
	const data = formData.value;
	if (data.token === "evq") {
		const sum = (Number(amountCoumput()) + Number(feeCoumput())).toFixed(8);
		return Number(sum) <= Number(userStore.user["evq"]);
	} else {
		return Number(feeCoumput()) <= Number(userStore.user["evq"]);
	}
});
const isSelfChainAddress = computed(() => {
	return SHA1_validate(formData.value.address, ADDRESS_KEY);
});

const onSend = async () => {
	if (!isSelfChainAddress.value && formData.value.token === "usdt") {
		ElMessageBox.alert("USDT tokens for BEP20 are not currently available");
		return;
	}

	await ElMessageBox.confirm("Please confirm sending, it will not be recovered after sending!", "Warning", {
		confirmButtonText: "OK",
		cancelButtonText: "Cancel",
		type: "warning"
	});

	await sendApi({
		address: formData.value.address,
		coin_type: formData.value.token,
		number: amountCoumput(),
		fee: feeCoumput(),
		status: isSelfChainAddress.value ? 0 : 3
	});

	emit("getWallet");

	ElNotification({
		title: "Success",
		message: "send successfully.",
		type: "success",
		position: "bottom-left"
	});

	changeVue("back");
};
</script>

<style scoped lang="scss">
.send {
	.el-select {
		width: 100%;
	}
	.form {
		padding: 0 20px;
		padding-top: 10px;
	}

	.explainBox {
		margin-top: 10px;
		padding: 10px 20px;
		background-color: #f7f8fa;
		width: 355px;
		border-radius: 10px;
		margin: 0 auto;
	}
	.valueBox {
		margin-bottom: 8px;

		label {
			font-size: 14px;
			color: #909399;
		}
		.value {
			font-size: 12px;
			color: #606266;
			word-wrap: break-word;
		}
	}

	.btn {
		padding: 10px 20px;
		.el-button {
			width: 100%;
		}
	}
}
</style>
