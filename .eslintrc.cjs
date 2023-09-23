/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
	extends: [
		"eslint:recommended",
		"plugin:vue/vue3-recommended",
		"@electron-toolkit",
		"@electron-toolkit/eslint-config-ts/eslint-recommended",
		"@vue/eslint-config-typescript/recommended",
		"@vue/eslint-config-prettier"
	],
	rules: {
		"vue/require-default-prop": "off",
		"vue/multi-word-component-names": "off",
		"vue/attributes-order": "off",
		"vue/v-on-event-hyphenation": "off",
		"@typescript-eslint/ban-ts-comment": "off",
		"@typescript-eslint/no-unused-vars": "off",
		"prefer-const": "off",
		"vue/no-v-for-template-key-on-child": "off",
	}
};
