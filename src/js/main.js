import { loadHeaderFooter, getLocation, encodeGeohash } from "./utils.mjs";
import { getEvents } from "./ExternalData";

loadHeaderFooter();

function eventTemplate(event) {
  const imgSrcs = event.images.filter((img) => img.ratio === "4_3");
  let imgSrc = "https://dummyimage.com/100x4:3";
  if (imgSrcs.length > 0) {
    imgSrc = imgSrcs[0].url;
  }

  let category = "Unknown";
  let genre = "Unknown";
  if (Object.hasOwn(event, "classifications")) {
    category = event.classifications[0].segment.name;
    genre = event.classifications[0].genre.name;
  }

  return `
	<div class="event-card" data-category=${category}-${genre}>
	<img src=${imgSrc} loading="lazy">
	<p class="event-name">${event.name}</p>
    <p class="star">★</p>
    <p class="categories">Category: ${category} - ${genre}</p>
    <p class="venue">${event._embedded.venues[0].name} - ${event._embedded.venues[0].city.name}</p>
    <p class="time">${event.dates.start.localTime}</p>
	</div>`;
}

async function renderEvents() {
  const eventsEle = document.querySelector("#event-cards");
  const location = await getLocation();
  const geoHashString = encodeGeohash(location.lat, location.long, 6);
  const events = await getEvents(geoHashString);

  const eventsHTML = events.map((event) => eventTemplate(event)).join("");
  eventsEle.innerHTML = eventsHTML;
}

renderEvents();
