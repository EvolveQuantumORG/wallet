<template>
	<div class="vueApp receive">
		<app-title @back="changeVue('back')">receive</app-title>
		<div class="main">
			<el-image :src="qrCodeUrl" class="qrcode"></el-image>

			<div class="address">
				{{ userStore.user.address }}
				<el-icon @click="copy(userStore.user.address)"><CopyDocument /></el-icon>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { UserStore } from "@renderer/stores";
import ParamsStore from "@renderer/stores/modules/ParamsStore";
import { copyToClipboard } from "@renderer/utils/tools";
import QRCode from "qrcode";
import { ref } from "vue";

const emit = defineEmits(["changeVue"]);
const changeVue = (type: string) => {
	if (type === "back") {
		if (paramsStore.params.receive && paramsStore.params.receive.back) {
			type = paramsStore.params.receive.back;
		}
	}
	if (type === "back") {
		type = "main";
	}

	emit("changeVue", type);
};

const paramsStore = ParamsStore();
const userStore = UserStore();

const qrCodeUrl = ref("");
generateQRCode();
function generateQRCode() {
	const text = userStore.user.address;
	QRCode.toDataURL(text, { width: 320, height: 320 }, (err, url) => {
		if (err) {
			console.error(err);
		} else {
			qrCodeUrl.value = url;
		}
	});
}

const copy = (value: string) => {
	copyToClipboard(value);
};
</script>

<style scoped lang="scss">
.receive {
	.main {
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: #fff;
		margin: 30px 20px;
		border-radius: 20px;
		overflow: hidden;
		box-shadow: 0 0 10px rgba($color: #000000, $alpha: 0.3);

		.qrcode {
			width: 100%;
		}

		.address {
			margin-top: 10px;
			margin-bottom: 20px;
			padding: 10px 0px;
			border-radius: 10px;
			font-size: 12px;
			text-align: center;

			.el-icon {
				cursor: pointer;

				&:hover {
					color: #409eff;
				}
			}
		}
	}
}
</style>
