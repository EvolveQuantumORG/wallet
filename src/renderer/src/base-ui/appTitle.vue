<template>
	<div class="appTitle selectNone">
		<div class="back" @click="back">
			<el-icon><ArrowLeftBold /></el-icon>
		</div>
		<div class="title dragApp">
			<slot>23</slot>
		</div>
	</div>
</template>

<script setup lang="ts">
const emit = defineEmits(["back"]);
const back = () => {
	emit("back");
};
</script>

<style scoped lang="scss">
.appTitle {
	display: flex;
	align-items: center;
	font-size: 20px;
	padding: 10px 10px;
	position: relative;
	.back {
		cursor: pointer;
		padding: 0 10px;
		position: relative;
		top: 3px;
		transition: 0.25s;

		&:hover {
			color: #3f7dbb;
		}
	}
	.title {
		font-weight: bold;
		flex: 1;
		// background-color: red;
		position: absolute;
		top: 0;
		right: 0;
		width: 330px;
		padding: 12px 10px 10px;

	}
}
</style>
