<template>
	<div class="welcomeVue selectNone">
		<img src="@renderer/assets/img/evolve_logo.png" alt="" class="bg dragApp" />
		<main>
			<div class="title">Welcome to EvolveQuantum Wallet</div>
			<div class="content">
				EvolveQuantum aims to be a powerful and flexible blockchain platform that provides users with smart contract publishing
				and trading capabilities.
			</div>
			<div class="btn">
				<el-button type="primary" @click="changeVue('existingBip39')">Use existing wallet</el-button>
				<br />
				<br />
				<el-button type="success" @click="changeVue('showBip39')">Create wallet</el-button>
			</div>
		</main>
	</div>
</template>

<script setup lang="ts">
const emit = defineEmits(["changeVue"]);

const changeVue = (type: string) => {
	console.log(type);

	emit("changeVue", type);
};
</script>

<style scoped lang="scss">
.welcomeVue {
	padding: 20px;
	> .bg {
		position: absolute;
		width: 100%;
		top: 0;
		left: 0;
	}
	> main {
		padding-top: 300px;
		> .title {
			font-size: 18px;
			font-weight: bold;
			color: #1e2026;
			margin-bottom: 10px;
		}
		.content {
			color: #838a96;
			line-height: 1.6;
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
