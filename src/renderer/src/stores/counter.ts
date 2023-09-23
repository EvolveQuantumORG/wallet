import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useConfigStore = defineStore(
	"config",
	() => {
		const appPath = ref("");
		function setAppPath(str: string) {
			appPath.value = str;
		}

		return { appPath, setAppPath };
	},
	{ persist: true }
);
