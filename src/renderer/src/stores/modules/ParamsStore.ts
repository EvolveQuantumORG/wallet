import { ref, computed } from "vue";
import { defineStore } from "pinia";

export default defineStore("ParamsStore", () => {
	const params = ref<Record<string, Record<string, any>>>({});

	return { params };
});
