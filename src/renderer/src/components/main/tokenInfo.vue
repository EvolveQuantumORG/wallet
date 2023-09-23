<template>
	<div class="vueApp tokenInfo">
		<app-title @back="changeVue('main')">{{ paramsStore.params.tokenInfo.name }}</app-title>

		<div class="infoBox">
			<el-avatar :src="coinImg()" :size="80" />
			<div class="number">{{ userStore.user[paramsStore.params.tokenInfo.value] }}</div>
		</div>

		<div class="recordBox">
			<div class="btnBox">
				<el-button-group>
					<el-button type="primary" size="small" @click="changeVue('send')"> Send </el-button>
					<el-button type="primary" size="small" @click="changeVue('receive')"> Receive </el-button>
				</el-button-group>
			</div>
			<el-tabs v-model="currentTabs" class="demo-tabs">
				<el-tab-pane label="All" name="All"></el-tab-pane>
				<el-tab-pane label="Send" name="Send"></el-tab-pane>
				<el-tab-pane label="Receive" name="Receive"></el-tab-pane>
			</el-tabs>
			<div class="showFee" v-if="paramsStore.params.tokenInfo.name === 'EVQ'">
				<span>Show Fee</span>
				<el-switch v-model="isShowFee" size="mini"></el-switch>
			</div>
		</div>
		<div>
			<!-- <el-scrollbar height="320px" @scroll="scrolling" ref="scrollRef"> -->
			<div
				style="height: 320px; overflow: auto"
				v-infinite-scroll="scrolling"
				:infinite-scroll-immediate="false"
				:infinite-scroll-distance="20"
				:infinite-scroll-delay="600"
				class="scroll"
				ref="scrollRef"
			>
				<div class="scrollbarBox recordList">
					<template v-for="(item, index) in cacheData" :key="index">
						<div class="record" style="cursor: no-drop">
							<div class="left">
								<div class="type" v-if="item.type === 2">Send</div>
								<div class="type" v-else-if="item.type === 3">Receive</div>
								<div class="type" v-else-if="item.type === 4">Fee</div>
								<div class="date">{{ item.create_time }}</div>
							</div>
							<div class="right">
								<el-tooltip class="box-item" effect="dark" content="In memory pool" placement="top">
									<el-icon><Timer /></el-icon>
								</el-tooltip>
								<div class="number success-color" v-if="item.type === 3">+{{ item.coin }}</div>
								<div class="number error-color" v-else-if="[2, 4].includes(item.type)">-{{ item.coin }}</div>
							</div>
						</div>
					</template>
				</div>

				<div class="scrollbarBox recordList">
					<template v-for="(item, index) in payData" :key="index">
						<div class="record" @click="lookInfo(item)">
							<div class="left">
								<div class="type" v-if="item.type === 2">Send</div>
								<div class="type" v-else-if="[1, 3].includes(item.type)">Receive</div>
								<div class="type" v-else-if="item.type === 4">Fee</div>
								<div class="date">{{ item.create_time }}</div>
							</div>
							<div class="right">
								<div class="number success-color" v-if="[1, 3].includes(item.type)">+{{ item.coin }}</div>
								<div class="number error-color" v-else-if="[2, 4].includes(item.type)">-{{ item.coin }}</div>
							</div>
						</div>
					</template>
				</div>
				<p v-if="!isGetData" class="tips">No more</p>
				<p v-else class="tips">Loading...</p>
			</div>

			<!-- </el-scrollbar> -->
		</div>
		<el-dialog title="" v-model="isShowInfo" width="100%" top="0">
			<recordInfo @close="isShowInfo = false" :recordInfoData="recordInfoData" />
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { searchRecirdApi, getRecirdInfoApi } from "@renderer/api/main";
import { CoinStore, UserStore } from "@renderer/stores";
import ParamsStore from "@renderer/stores/modules/ParamsStore";
import { ref, watch } from "vue";
import recordInfo from "./recordInfo.vue";

const emit = defineEmits(["changeVue"]);
const changeVue = (type: string) => {
	if (type === "send") {
		paramsStore.params["send"] = {
			back: "tokenInfo",
			token: paramsStore.params.tokenInfo.value
		};
	} else if (type === "receive") {
		paramsStore.params["receive"] = {
			back: "tokenInfo"
		};
	}

	emit("changeVue", type);
};

const paramsStore = ParamsStore();
if (!paramsStore.params.tokenInfo) {
	changeVue("main");
}

const coinStore = CoinStore();
const coinImg = () => {
	return coinStore.coins.find(v => v.name === paramsStore.params.tokenInfo.name)?.logo;
};

const userStore = UserStore();

let isGetData = true;
const page = ref(1);
const isShowFee = ref(false);
watch(isShowFee, () => {
	scrollRef.value.scrollTop = 0;
	payData.value = []
	isGetData = true;
	page.value = 1;
	searchRecird();
});
const currentTabs = ref("All");
watch(currentTabs, () => {
	scrollRef.value.scrollTop = 0;
	payData.value = []
	isGetData = true;
	page.value = 1;
	searchRecird();
});
const cacheData = ref<any[]>([]);
const payData = ref<any[]>([]);
const loading = ref(false);
async function searchRecird() {
	loading.value = true;
	try {
		const { cacheList, payList } = await searchRecirdApi({
			coin_type: paramsStore.params.tokenInfo.value,
			isFee: isShowFee.value ? "1" : "",
			page: page.value,
			type: currentTabs.value
		});
		cacheData.value = cacheList;
		if (page.value === 1) {
			payData.value = payList;
			if (payList.length < 10) {
				isGetData = false;
			}
		} else {
			if (payList.length === 0) {
				page.value--;
				isGetData = false;
			}
			payData.value = [...payData.value, ...payList];
		}
	} catch (error) {
		console.log(error);
	} finally {
		loading.value = false;
	}
}
searchRecird();

const scrollRef = ref();
const scrolling = e => {
	// if (scrollRef.value.wrapRef.scrollHeight - scrollRef.value.wrapRef.clientHeight == e.scrollTop) {

	if (!isGetData) return;
	page.value++;
	searchRecird();
	// }
};

const isShowInfo = ref(false);
const recordInfoData = ref<any>();
const lookInfo = async (item: any) => {
	const { list: data } = await getRecirdInfoApi({
		pay_hash: item.pay_hash
	});

	let coinType = "EVQ";
	const send = data.find(v => v.type === 2);
	if (send && send.coin_type === 2) {
		coinType = "USDT";
	}

	let params: any = {};
	if ([2, 4].includes(item.type)) {
		params.coin = send.coin;
		params.from = item.address;
		params.to = data.find(v => v.type === 3).address;
		params.hash = item.pay_hash;
		params.coin_type = coinType;
		params.time = item.create_time;
		params.fee = data.find(v => v.type === 4).coin;
		params.type = "Send";
	} else if ([1, 3].includes(item.type)) {
		params.coin = item.coin;
		if (item.type === 3) {
			params.from = data.find(v => v.type === 3).address;
		} else {
			params.from = "";
		}
		params.to = item.address;
		params.hash = item.pay_hash;
		params.coin_type = coinType;
		params.time = item.create_time;
		const d = data.find(v => v.type === 4);
		params.fee = 0;
		if (d) {
			params.fee = d.coin;
		}
		params.type = "Receive";
	}

	// console.log(type);
	recordInfoData.value = params;
	isShowInfo.value = true;
};
</script>

<style scoped lang="scss">
.tokenInfo {
	.infoBox {
		padding: 20px 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		.number {
			font-size: 20px;
			margin-top: 20px;
			font-weight: bold;
		}
	}

	.recordBox {
		padding: 0 20px;
		position: relative;
		.btnBox {
			position: absolute;
			right: 20px;
			top: 10px;
			z-index: 1;
		}
		.showFee {
			position: absolute;
			bottom: -14px;
			right: 20px;
			z-index: 999;
			font-size: 12px;
			display: flex;
			align-items: center;
			color: #999;
			> span {
				margin-right: 8px;
			}
		}
	}

	.scrollbarBox {
		padding: 0 20px;
		position: relative;
	}
	.recordList {
		.record {
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 14px;
			padding: 10px 0;
			border-bottom: 1px solid #eee;
			cursor: pointer;

			.date {
				font-size: 12px;
				color: #999;
			}

			.number {
				font-weight: bold;
			}
			.right {
				display: flex;
				align-items: center;
				> .el-icon {
					cursor: pointer;
					font-size: 20px;
					color: #999;
					margin-right: 16px;
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

	.scroll {
		.tips {
			text-align: center;
			font-size: 14px;
			padding: 10px;
			color: #999;
		}
	}
}
</style>
