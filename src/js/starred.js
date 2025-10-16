import {
  loadHeaderFooter,
  getLocalStorage,
  renderStars,
  getLocation,
  encodeGeohash,
} from "./utils.mjs";
import { getEvents } from "./ExternalData";
import { eventTemplate } from "./main";

loadHeaderFooter();

async function renderEvents() {
  const eventsEle = document.querySelector("#event-cards");
  const location = await getLocation();
  const geoHashString = encodeGeohash(location.lat, location.long, 6);
  const events = await getEvents(geoHashString);
  const starredEventIds = getLocalStorage("starredList") || [];
  const starredEvents = events.filter(
    (event) => starredEventIds.indexOf(event.id) !== -1,
  );

  eventsEle.innerHTML = "";
  starredEvents
    .map((event) => eventTemplate(event))
    .forEach((eventCard) => {
      eventsEle.appendChild(eventCard);
    });
  renderStars(document.querySelector("#event-cards"));
}

renderEvents();
