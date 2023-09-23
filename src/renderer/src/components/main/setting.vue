<template>
	<div class="vueApp setting selectNone">
		<app-title @back="changeVue('main')">Setting</app-title>

		<div class="main">
			<div class="title">
				<el-icon><User /></el-icon>
				My Account
			</div>
			<div class="accountList">
				<el-scrollbar max-height="350px">
					<div
						class="item"
						:class="{ pointer: item.address !== userStore.user.address, active: item.address === userStore.user.address }"
						v-for="item in userStore.users"
						:key="item.address"
						@click="changeAccount(item.address)"
					>
						<div class="labelBox">
							<div class="label">{{ item.label }}</div>
							<div class="icon">
								<el-icon @click.stop="copy(item.address)"><CopyDocument /></el-icon>
								<el-icon @click="openExternal('https://explorer.evolveq.org/address/' + item.address)"><Stopwatch /></el-icon>
							</div>
						</div>
						<div class="address">{{ item.address }}</div>
					</div>
				</el-scrollbar>

				<div class="add" @click="addAccount">
					<el-icon><Plus /></el-icon>
					Add Account
				</div>
			</div>

			<div class="setList">
				<div class="item" @click="showBip39">
					<el-icon><Reading /></el-icon>
					<span> View Seed Phrase </span>
				</div>
				<div class="item" @click="resetWallet">
					<el-icon><Switch /></el-icon>
					<span> Reset Wallet </span>
				</div>
			</div>
		</div>

		<el-dialog title="" v-model="isShowPhrase" width="100%" top="0">
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

				<div class="btn">
					<el-button type="info" @click="isShowPhrase = false">Backtrack</el-button>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from "element-plus";
import { addAccountApi, getAccountLisApi, changeAccountApi } from "@renderer/api/main";
import { UserStore } from "@renderer/stores";
import { copyToClipboard } from "@renderer/utils/tools";
import { decryptAES } from "@renderer/utils/crypto";
import { ASE_KEY, ASE_VI } from "@renderer/config/CONFIG";
import { ref } from "vue";

const emit = defineEmits(["changeVue", "getWallet"]);
const changeVue = (type: string) => {
	emit("changeVue", type);
};

const userStore = UserStore();

function getAccountList() {
	getAccountLisApi().then(res => {
		userStore.users = res.list;
	});
}
getAccountList();

const addAccount = async () => {
	const res = await ElMessageBox.prompt("Account Name", "Add Account", {
		confirmButtonText: "Confirm",
		cancelButtonText: "Cancel",
		inputPattern: /^[\w\s\u4e00-\u9fa5]{0,10}$/,
		inputErrorMessage: "Please enter special characters, maximum 10"
	});
	await addAccountApi({
		label: res.value
	});
	getAccountList();
};

const changeAccount = async (address: string) => {
	console.log(address);

	if (address === userStore.user.address) return;
	await changeAccountApi({ address });
	emit("getWallet");
};

function validatePassword(v: string) {
	const pasw = decryptAES(userStore.password, ASE_KEY, ASE_VI);
	return v === pasw;
}

const isShowPhrase = ref(false);
const mnemonic = ref<string[]>([]);
const showBip39 = async () => {
	const res = await ElMessageBox.prompt("validate password", "View Seed Phrase", {
		confirmButtonText: "validate",
		cancelButtonText: "Cancel",
		inputType: "password",
		inputPlaceholder: "password"
		// inputValidator: validatePassword
	});

	if (validatePassword(res.value)) {
		const bip39Str = decryptAES(userStore.bip39, ASE_KEY, ASE_VI);
		console.log(bip39Str);
		mnemonic.value = bip39Str.split(",");
		isShowPhrase.value = true;
	} else {
		ElMessage.error("Wrong password");
	}
};

const resetWallet = async () => {
	await ElMessageBox.confirm("Confirm the replacement wallet?", "Warning", {
		confirmButtonText: "OK",
		cancelButtonText: "Cancel",
		type: "warning"
	});
	userStore.token = "";
	emit("getWallet");
};

const copy = (value: string) => {
	copyToClipboard(value);
};

const openExternal = (url: string) => {
	window.api.openExternal(url);
};
</script>

<style scoped lang="scss">
.main {
	padding: 20px;
	.title {
		font-weight: bold;
	}

	.accountList {
		padding: 5px 0;
		.item {
			padding: 10px 15px;
			transition: 0.3s;
			margin-bottom: 4px;
			position: relative;

			&.pointer {
				cursor: pointer;

				&:hover {
					background-color: #409eff11;
				}
			}

			&.active {
				color: #409eff;
				&::after {
					content: "";
					display: block;
					position: absolute;
					left: 4px;
					top: 10px;
					bottom: 5px;
					width: 3px;
					background-color: #409eff;
				}
			}

			.labelBox {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-bottom: 4px;
				.el-icon {
					cursor: pointer;
					margin-left: 6px;
					color: #333;
					&:hover {
						color: #409eff;
					}
				}
			}
			.address {
				font-size: 12px;
			}
		}

		.add {
			text-align: center;
			cursor: pointer;
			font-size: 14px;
			padding: 5px;
			&:hover {
				color: #409eff;
			}
			.el-icon {
				position: relative;
				top: 1px;
			}
		}
	}

	.setList {
		font-weight: bold;
		.item {
			padding: 15px 20px;
			cursor: pointer;
			&:hover {
				background-color: #409eff11;
			}
			.el-icon {
				position: relative;
				top: 1px;
				margin-right: 4px;
			}
		}
	}
}

::v-deep(.el-dialog) {
	margin: 0 !important;
}
::v-deep(.el-dialog__header) {
	display: none;
}

.mnemonic {
	padding: 0 20px;
	height: 540px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	user-select: all;
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
