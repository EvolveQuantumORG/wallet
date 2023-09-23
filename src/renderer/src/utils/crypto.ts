import CryptoJS from "crypto-js";

export function encryptAES(data: string, key: string, iv: string) {
	const cipher = CryptoJS.AES.encrypt(data, key, { iv: iv });
	return cipher.toString();
}

export function decryptAES(data: string, key: string, iv: string) {
	const decipher = CryptoJS.AES.decrypt(data, key, { iv: iv });
	return decipher.toString(CryptoJS.enc.Utf8);
}

export function SHA1(data: string, key: string) {
	return CryptoJS.SHA1(data + key).toString();
}

export function SHA1_addValidate(data: string, key: string) {
	const has = data.substring(0, data.length - 4);

	const SHA1_encrypt = SHA1(has, key).slice(-4);

	return has + SHA1_encrypt;
}

export function SHA1_validate(data: string, key: string) {
	const validate = data.slice(-4);
	console.log(validate, "validate");

	const has = data.substring(0, data.length - 4);
	console.log(has, "has");

	const co_validate = SHA1(has, key).slice(-4);
	console.log(co_validate, "co_validate");

	return validate === co_validate;
}
