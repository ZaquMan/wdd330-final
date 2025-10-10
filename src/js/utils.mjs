import { getIPAddress, getLocation } from "./ExternalData";

function convertToText(response) {
	if (response.ok) {
		return response.text();
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

	const location = getLocation();
	locationName.textContent = `${location.district}, ${location.state}`;
	ipAddrEle.textContent = getIPAddress();
	currentYear.textContent = new Date().getFullYear();
}