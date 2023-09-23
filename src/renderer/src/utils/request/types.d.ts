interface ResultTypw<T = any> {
	code: number;
	data: T;
	access_token?: string;
	responseType?: string;
	msg?: string;
	status?: string;
}
