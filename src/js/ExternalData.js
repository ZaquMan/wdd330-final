import {
	getTempStorage,
	setTempStorage,
	convertToText,
	convertToJson,
} from "./utils.mjs";

const ipGeoUrl = import.meta.env.VITE_IPGEOLOCATION_URL;
const ipGeoApiKey = import.meta.env.VITE_IPGEOLOCATION_API_KEY;
const myHeaders = new Headers();
const requestOptions = {
	method: "GET",
	headers: myHeaders,
	redirect: "follow",
};

export async function getIPAddress() {
	//Reduce API calls by getting information from sessionStorage first
	let ipAddr = getTempStorage("ip");

	if (typeof ipAddr != "string") {
		try {
			const ipAddrJson = await fetch(`${ipGeoUrl}getip`, requestOptions)
				.then(convertToJson)
				.then((data) => data);
			ipAddr = ipAddrJson.ip;
		} catch (e) {
			console.error(e);
			ipAddr = "0.0.0.0";
		}
		setTempStorage("ip", ipAddr);
	}

	return ipAddr;
}

export async function queryLocationApi() {
	//Reduce API calls by getting information from sessionStorage first
	let location = {};
	try {
		const ipGeo = await fetch(
			`${ipGeoUrl}timezone?apiKey=${ipGeoApiKey}`,
			requestOptions,
		)
			.then(convertToJson)
			.then((data) => data);
		location = {
			long: ipGeo.location.longitude,
			lat: ipGeo.location.latitude,
			city: ipGeo.location.city,
			state: ipGeo.location.state_code.slice(-2)
		};
	} catch (e) {
		console.error(e);
		location = { long: 0, lat: 0, city: "Unknown", state: "Unknown" };
	}
	return location;
}

