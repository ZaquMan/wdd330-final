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
    try {
      category = event.classifications[0].segment.name;
      genre = event.classifications[0].genre.name;
    } catch {
      category = "Unknown";
      genre = "Unknown";
    }
  }

  let venue = "Unknown";
  let city = "Unknown";
  // ${event._embedded.venues[0].name} - ${event._embedded.venues[0].city.name}
  if (Object.hasOwn(event._embedded, "venues")) {
    try {
      if (Object.hasOwn(event._embedded.venues[0], "name")) {
        venue = event._embedded.venues[0].name;
      }
      if (Object.hasOwn(event._embedded.venues[0], "city")) {
        city = event._embedded.venues[0].city.name;
      }
    } catch {
      venue = "Unknown";
      city = "Unknown";
    }
  }


  const cardEle = document.createElement("div");
  cardEle.classList.add("event-card");
  cardEle.setAttribute("data-category", `${category}-${genre}`);
  cardEle.setAttribute("data-event-id", event.id);

  const imgLink = document.createElement("a");
  imgLink.setAttribute("href", event.url);
  imgLink.classList.add("event-img");

  const imgEle = document.createElement("img");
  imgEle.setAttribute("src", imgSrc);
  imgEle.setAttribute("alt", event.name);
  imgEle.setAttribute("loading", "lazy");
  imgLink.appendChild(imgEle);
  cardEle.appendChild(imgLink);

  const titleLink = document.createElement("a");
  titleLink.setAttribute("href", event.url);
  titleLink.classList.add("event-name");
  titleLink.textContent = event.name;
  cardEle.appendChild(titleLink);

  const star = document.createElement("p");
  star.classList.add("star");
  star.textContent = "★";
  star.addEventListener("click", () => {
    star.classList.toggle("starred");
    //TODO: Add to localStorage Star list
  });
  cardEle.appendChild(star);

  const categoryEle = document.createElement("p");
  categoryEle.classList.add("categories");
  categoryEle.textContent = `${category} - ${genre}`
  cardEle.appendChild(categoryEle);

  const venueEle = document.createElement("p");
  venueEle.classList.add("venue");
  venueEle.textContent = `${venue} - ${city}`;
  cardEle.appendChild(venueEle);

  const timeEle = document.createElement("p");
  timeEle.classList.add("time");
  timeEle.textContent = event.dates.start.localTime;
  cardEle.appendChild(timeEle);

  return cardEle;

  // return `
  // <div class="event-card" data-category=${category}-${genre}>
  // <img src=${imgSrc} loading="lazy">
  // <p class="event-name">${event.name}</p>
  //   <p class="star">★</p>
  //   <p class="categories">Category: ${category} - ${genre}</p>
  //   <p class="venue">${event._embedded.venues[0].name} - ${event._embedded.venues[0].city.name}</p>
  //   <p class="time">${event.dates.start.localTime}</p>
  // </div>`;
}

async function renderEvents() {
  const eventsEle = document.querySelector("#event-cards");
  const location = await getLocation();
  const geoHashString = encodeGeohash(location.lat, location.long, 6);
  const events = await getEvents(geoHashString);

  // const eventsHTML = events.map((event) => eventTemplate(event)).join("");
  // eventsEle.innerHTML = eventsHTML;

  events.map((event) => eventTemplate(event)).forEach(eventCard => { eventsEle.appendChild(eventCard) });
}

renderEvents();
