<template>
	<div class="vueApp mainVue">
		<header>
			<div class="top">
				<div class="dragApp no1"></div>
				<div class="dragApp no2"></div>
				<div class="setBox" @click="changeVue('setting')">
					<el-icon><Setting /></el-icon>
				</div>
				<div class="dragApp"></div>
				<el-select v-model="mainType" placeholder="" size="small">
					<el-option label="Network" value="Network"></el-option>
				</el-select>
				<div class="dragApp"></div>
				<div class="close" @click="exitApp">
					<el-icon><Close /></el-icon>
				</div>
			</div>

			<div class="infoBox">
				<div class="addressBox">
					<div class="addTop">
						<div class="left">
							<label>{{ userStore.user?.label }}</label>
						</div>
						<div class="icon">
							<el-icon @click="copy(userStore.user?.address)"><CopyDocument /></el-icon>
							<el-icon @click="openExternal('https://explorer.evolveq.org/address/' + userStore.user?.address)"
								><Stopwatch
							/></el-icon>
							<el-tooltip class="box-item" effect="dark" content="Add EVQ Token in metamask" placement="top-start">
								<el-image
									class="iconImg"
									src="./img/metamask-fox.svg"
									@click="openExternal('https://wallet.evolveq.org/')"
								></el-image>
							</el-tooltip>
						</div>
					</div>

					<div class="address">{{ userStore.user?.address }}</div>
				</div>

				<div class="sum">{{ userStore.user?.evq }}</div>

				<div class="btn">
					<el-button-group>
						<el-button type="primary" @click="changeVue('send')">
							<el-icon><TopRight /></el-icon>
							Send
						</el-button>
						<el-button type="primary" @click="changeVue('receive')">
							Receive
							<el-icon><BottomLeft /></el-icon>
						</el-button>
					</el-button-group>
				</div>
			</div>
		</header>

		<div class="main">
			<div class="tokenList">
				<template v-for="item in coinStore.coins" :key="item.name">
					<div class="item" @click="changeVue('tokenInfo', item)">
						<div class="left">
							<el-avatar :src="item.logo" />
							<div class="name">{{ item.name }}</div>
						</div>
						<div class="right">
							<div class="number">{{ userStore.user[item.value] }}</div>
						</div>
					</div>
				</template>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { CoinStore, UserStore } from "@renderer/stores";
import ParamsStore from "@renderer/stores/modules/ParamsStore";
import { copyToClipboard } from "@renderer/utils/tools";
import { ref } from "vue";

const paramsStore = ParamsStore();
const emit = defineEmits(["changeVue"]);
const changeVue = (type: string, item?: any) => {
	if (type === "tokenInfo" && item) {
		paramsStore.params["tokenInfo"] = item;
	} else if (type === "send") {
		paramsStore.params["send"] = {
			back: "main",
			token: ""
		};
	} else if (type === "receive") {
		paramsStore.params["receive"] = {
			back: "main"
		};
	}

	emit("changeVue", type);
};

const userStore = UserStore();
const coinStore = CoinStore();

const mainType = ref("Network");

const copy = (value: string) => {
	copyToClipboard(value);
};

const openExternal = (url: string) => {
	window.api.openExternal(url);
};

const exitApp = () => {
	window.api.exitApp();
};
</script>

<style scoped lang="scss">
.mainVue {
	border: none;
	header {
		height: 300px;
		background-color: #14151a;
		color: #fff;

		.top {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 10px 20px;
			position: relative;
			.dragApp {
				flex: 1;
				height: 30px;
				position: relative;
				top: -10px;

				&.no1 {
					position: absolute;
					left: 0;
					top: 0;
					width: 20px;
					height: 40px;
				}
				&.no2 {
					position: absolute;
					right: 0;
					top: 0;
					width: 20px;
					height: 40px;
				}
			}

			.el-select {
				::v-deep(.el-input__wrapper) {
					background-color: #2e323a;
					color: #fff;
					box-shadow: none;
				}
				::v-deep(.el-input__inner) {
					color: #fff;
				}
			}

			.el-icon {
				cursor: pointer;
				font-size: 20px;
				&:hover {
					color: #409eff;
				}
			}
		}

		.infoBox {
			display: flex;
			flex-direction: column;
			align-items: center;
			padding-top: 20px;
			.addressBox {
				padding: 10px 0;
				width: 320px;
				border: 1px solid #2e323a;
				border-radius: 8px;
				font-size: 18px;
				margin-bottom: 20px;

				.addTop {
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding: 0px 20px;
					margin-bottom: 5px;

					.left {
						display: flex;
						align-items: center;
					}

					.icon {
						display: flex;
						align-items: center;
						.el-icon {
							margin-left: 10px;
							cursor: pointer;
							&:hover {
								color: #409eff;
							}
						}
						.iconImg {
							cursor: pointer;
							width: 20px;
							margin-left: 20px;
						}
					}
				}

				.address {
					font-size: 12px;
					margin-left: 10px;
					color: #ffffff85;
					position: relative;
					top: 1px;
					text-align: center;
				}
			}

			.sum {
				font-size: 32px;
			}

			.btn {
				padding-top: 20px;
				font-size: 30px;
			}
		}
	}

	.main {
		.tokenList {
			.item {
				padding: 10px 25px;
				display: flex;
				justify-content: space-between;
				align-items: center;
				cursor: pointer;
				transition: 0.3s;
				position: relative;
				.left {
					display: flex;
					justify-content: space-between;
					align-items: center;
					.name {
						margin-left: 20px;
						font-weight: bold;
					}
				}
				.right {
					.number {
						font-size: 14px;
					}
				}

				&:hover {
					background-color: #2e323a23;
				}
			}
		}
	}
}
</style>
