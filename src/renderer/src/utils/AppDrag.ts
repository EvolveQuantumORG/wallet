export default class AppDrag {
	private windowX = 0;
	private windowY = 0;
	private dom?: HTMLDivElement;

	constructor(domName: string) {
		const dom = document.querySelector(domName);
		if (dom) {
			this.dom = dom as HTMLDivElement;
			this.dom.addEventListener("mousedown", this.mounseDown.bind(this));
		}
	}

	private mounseDown(e: MouseEvent) {
		this.windowX = e.pageX;
		this.windowY = e.pageY;
		const fun = this.mousemove.bind(this);
		this.dom?.addEventListener("mousemove", fun);

		this.dom?.addEventListener("mouseup", () => this.dom?.removeEventListener("mousemove", fun));
		this.dom?.addEventListener("mouseout", () => this.dom?.removeEventListener("mousemove", fun));
	}

	private mousemove(e: MouseEvent) {
		const x = e.pageX - this.windowX;
		const y = e.pageY - this.windowY;
		window.api.appDrag({ x, y });
	}
}
