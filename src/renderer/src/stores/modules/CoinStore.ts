import { ref, computed } from "vue";
import { defineStore } from "pinia";

export default defineStore("CoinStore", () => {
	const coins = ref([
		{
			name: "EVQ",
			value: "evq",
			logo: "img/coin.png",
			address: ""
		},
		{
			name: "USDT",
			value: "usdt",
			logo: "img/usdt_coin.png",
			address: ""
		}
	]);

	return { coins };
});
