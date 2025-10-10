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

export function getIPAddress() {
	//Reduce API calls by getting information from sessionStorage first
	let ipAddr = getTempStorage("ip");

	if (!ipAddr) {
		//TODO: INSERT API Call to get IP Address
		ipAddr = "127.0.0.1";
		setTempStorage("ip", ipAddr);
	}

	return ipAddr;
}

export function getLocation() {
	//Reduce API calls by getting information from sessionStorage first
	let location = getTempStorage("location");

	if (!location) {
		//TODO: INSERT API Call to get location based on IP address
		location = {"zipcode": "00000", "district": "Unknown", "state": "Unknown"};
		setTempStorage("location", location);
	}

	return location;
}