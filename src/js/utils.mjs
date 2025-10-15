import { getIPAddress, queryLocationApi } from "./ExternalData";

export function convertToText(response) {
	if (response.ok) {
		return response.text();
	} else {
		throw new Error(`Unable to convert this to text: ${response}`);
	}
}

export function convertToJson(response) {
	if (response.ok) {
		return response.json();
	} else {
		throw new Error(`Unable to convert this to text: ${response}`);
	}
}

async function loadTemplate(path) {
	return fetch(path).then(convertToText).then((data) => data);
}


export async function loadHeaderFooter() {
	const headerPath = "/partials/header.html";
	const footerPath = "/partials/footer.html";

	const headerTemplate = await loadTemplate(headerPath);
	const footerTemplate = await loadTemplate(footerPath);

	document.querySelector("header").innerHTML = headerTemplate;
	document.querySelector("footer").innerHTML = footerTemplate;

	populateFooter();
}

async function populateFooter() {
	const locationName = document.querySelector("#locationName")
	const ipAddrEle = document.querySelector("#ipAddress");
	const currentYear = document.querySelector("#currentYear");

	const location = await getLocation();
	locationName.textContent = `${location.city}, ${location.state}`;
	ipAddrEle.textContent = await getIPAddress();
	currentYear.textContent = new Date().getFullYear();
}

export async function getLocation() {
	//Reduce API calls by getting information from sessionStorage first
	let location = getTempStorage("location") || {};
	if (typeof location != "object") {
		location = await queryLocationApi();
		setTempStorage("location", location);
	}
	else if (!location.hasOwnProperty("city") || location.city === "Unknown") {
		location = await queryLocationApi();
		setTempStorage("location", location);
	}


	return location;
}

export function getLocalStorage(key) {
	return JSON.parse(localStorage.getItem(key));
}

export function setLocalStorage(key, data) {
	localStorage.setItem(key, JSON.stringify(data));
}

export function getTempStorage(key) {
	return JSON.parse(sessionStorage.getItem(key));
}

export function setTempStorage(key, data) {
	sessionStorage.setItem(key, JSON.stringify(data));
}


export function encodeGeohash(lat, lon, precision) {
	//This function is taken from Gustavo Niemeyer’s geocoding system.
	//Ticketmaster's API works better with a geohash than a zipcode.
	const base32 = '0123456789bcdefghjkmnpqrstuvwxyz';
	// infer precision?
	if (typeof precision == 'undefined') {
		precision = 12; // set to maximum
	}
	lat = Number(lat);
	lon = Number(lon);
	precision = Number(precision);
	if (isNaN(lat) || isNaN(lon) || isNaN(precision)) throw new Error('Invalid geohash');
	let idx = 0; // index into base32 map
	let bit = 0; // each char holds 5 bits
	let evenBit = true;
	let geohash = '';
	let latMin = -90, latMax = 90;
	let lonMin = -180, lonMax = 180;
	while (geohash.length < precision) {
		if (evenBit) {
			// bisect E-W longitude
			const lonMid = (lonMin + lonMax) / 2;
			if (lon >= lonMid) {
				idx = idx * 2 + 1;
				lonMin = lonMid;
			} else {
				idx = idx * 2;
				lonMax = lonMid;
			}
		} else {
			// bisect N-S latitude
			const latMid = (latMin + latMax) / 2;
			if (lat >= latMid) {
				idx = idx * 2 + 1;
				latMin = latMid;
			} else {
				idx = idx * 2;
				latMax = latMid;
			}
		}
		evenBit = !evenBit;
		if (++bit == 5) {
			// 5 bits gives us a character: append it and start over
			geohash += base32.charAt(idx);
			bit = 0;
			idx = 0;
		}
	}
	return geohash;
}