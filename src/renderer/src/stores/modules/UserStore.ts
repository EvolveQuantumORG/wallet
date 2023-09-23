import { ref, computed } from "vue";
import { defineStore } from "pinia";

export default defineStore(
	"UserStore",
	() => {
		const token = ref("");
		function setToken(t: string) {
			token.value = t;
		}

		const bip39 = ref("");
		const password = ref("");

		const user = ref<Record<string, any>>({});
		const users = ref<Record<string, any>[]>([]);

		return { token, setToken, bip39, password, user, users };
	},
	{ persist: true }
);
