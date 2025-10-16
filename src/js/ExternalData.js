import { getTempStorage, setTempStorage, convertToJson } from "./utils.mjs";

const ipGeoUrl = import.meta.env.VITE_IPGEOLOCATION_URL;
const ipGeoApiKey = import.meta.env.VITE_IPGEOLOCATION_API_KEY;
const ticketmasterUrl = import.meta.env.VITE_TICKETMASTER_URL;
const ticketmasterApiKey = import.meta.env.VITE_TICEKTMASTER_API_KEY;
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
    } catch {
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
      state: ipGeo.location.state_code.slice(-2),
    };
  } catch {
    location = { long: 0, lat: 0, city: "Unknown", state: "Unknown" };
  }
  return location;
}

export async function getEvents(geoHash) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateString = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, "0")}-${String(tomorrow.getDate()).padStart(2, "0")}T${String(tomorrow.getTimezoneOffset() / 60).padStart(2, "0")}:${String(tomorrow.getMinutes()).padStart(2, "0")}:${String(tomorrow.getSeconds()).padStart(2, "0")}Z`;

  const eventsJson = await fetch(
    `${ticketmasterUrl}events.json?apikey=${ticketmasterApiKey}&radius=50&unit=miles&geoPoint=${geoHash}&endDateTime=${dateString}`,
    requestOptions,
  )
    .then(convertToJson)
    .then((data) => data);
  return eventsJson._embedded.events;
}
