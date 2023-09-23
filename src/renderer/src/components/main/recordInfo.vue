<template>
	<div class="recordInfo">
		<!-- <app-title @back="changeVue('tokenInfo')">cre</app-title> -->

		<div class="close" @click="close">
			<el-icon><CircleClose /></el-icon>
		</div>

		<div class="main">
			<div class="checkBox">
				<el-icon><Check /></el-icon>
			</div>

			<div class="name">{{ recordInfoData.type }} {{ recordInfoData.coin_type }}</div>
			<div class="number error-color" v-if="recordInfoData.type === 'Send'">
				- {{ recordInfoData.coin }} {{ recordInfoData.coin_type }}
			</div>
			<div class="number success-color" v-else>+ {{ recordInfoData.coin }} {{ recordInfoData.coin_type }}</div>

			<div class="explainBox">
				<div class="valueBox">
					<label>
						<el-icon><TopRight /></el-icon>
						from
					</label>
					<div class="value" v-if="recordInfoData.from">
						{{ recordInfoData.from }}
						<el-icon @click="copy(recordInfoData.from)"><CopyDocument /></el-icon>
					</div>
					<div class="value" v-else>Coinbase</div>
				</div>

				<div class="valueBox">
					<label>
						<el-icon><BottomLeft /></el-icon>
						to
					</label>
					<div class="value">
						{{ recordInfoData.to }}
						<el-icon @click="copy(recordInfoData.to)"><CopyDocument /></el-icon>
					</div>
				</div>

				<div class="valueBox">
					<label> Hash </label>
					<div class="value">
						{{ recordInfoData.hash }}
						<el-icon @click="copy(recordInfoData.hash)"><CopyDocument /></el-icon>
					</div>
				</div>

				<div class="valueBox">
					<label> Trade </label>
					<div class="value">
						EvolveQuantum -> EvolveQuantum
						<el-tag size="small" style="margin-left: 10px">{{ recordInfoData.coin_type }}</el-tag>
					</div>
				</div>

				<div class="valueBox">
					<label> Time </label>
					<div class="value">{{ recordInfoData.time }}</div>
				</div>

				<div class="valueBox">
					<label> Fee </label>
					<div class="value">{{ recordInfoData.fee }} EVQ</div>
				</div>
			</div>

			<el-link type="primary" @click="openExternal('https://explorer.evolveq.org/transaction/' + recordInfoData.hash)"
				>View in Explorer <el-icon><TopRight /></el-icon
			></el-link>
		</div>
	</div>
</template>

<script setup lang="ts">
import { copyToClipboard } from "@renderer/utils/tools";
import { computed } from "vue";

const emit = defineEmits(["close"]);
const close = () => {
	emit("close");
};
const props = defineProps<{
	recordInfoData: Record<string, any>;
}>();

const copy = (value: string) => {
	copyToClipboard(value);
};
const openExternal = (url: string) => {
	window.api.openExternal(url);
};
</script>

<style scoped lang="scss">
.recordInfo {
	border: 1px solid #ccc;
	border-radius: 10px;
	height: 540px;
	position: relative;

	.close {
		font-size: 20px;
		position: absolute;
		top: 15px;
		right: 15px;
		cursor: pointer;
	}
	.main {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 20px;
		.checkBox {
			font-size: 40px;
			background-color: #67c23a;
			color: #fff;
			width: 60px;
			height: 60px;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.name {
			padding-top: 10px;
			font-size: 20px;
		}
		> .number {
			padding-top: 5px;
			font-size: 20px;
			font-weight: bold;
		}

		.explainBox {
			margin-top: 20px;
			padding: 10px 20px;
			// background-color: #f7f8fa;
			width: 330px;
			border-radius: 10px;
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
				.el-icon {
					cursor: pointer;

					&:hover {
						color: #409eff;
					}
				}
			}
		}
	}
}
</style>
