let BASE_URL = "";
const TIME_OUT = 50000;
const MD5_KEY = "";

switch (process.env.NODE_ENV) {
	case "development":
		BASE_URL = "/wallet";
		break;
	case "production":
		BASE_URL = "/wallet";
		break;
	case "test":
		BASE_URL = "/test";
		break;
}

export { BASE_URL, TIME_OUT, MD5_KEY };
