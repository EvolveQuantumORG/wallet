export function getRandomNumber(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function copyToClipboard(text: string): void {
	const textarea: HTMLTextAreaElement = document.createElement("textarea");
	textarea.value = text;
	textarea.setAttribute("readonly", "");
	textarea.style.position = "absolute";
	textarea.style.left = "-9999px";
	document.body.appendChild(textarea);

	textarea.select();

	document.execCommand("copy");

	document.body.removeChild(textarea);
}
