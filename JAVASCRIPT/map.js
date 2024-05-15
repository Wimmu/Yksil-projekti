/* global L */
// ----------------- API -----------------
const makeFetch = async (url) => {
  const result = await fetch(url);
  return await result.json();
};

const fetchRestaurants = async () =>
  await makeFetch('https://10.120.32.94/restaurant/api/v1/restaurants');

// ----------------- Map -----------------
document.addEventListener('DOMContentLoaded', async function() {
  const map = L.map('map').setView([60.186776, 24.922108], 12);
  const restaurants = await fetchRestaurants();

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  const markerIcon = L.icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  restaurants.forEach((restaurant) => {
    const {name, address, company, location} = restaurant;
    const {coordinates} = location;
    const longitude = coordinates[1];
    const latitude = coordinates[0];
    const marker = L.marker([longitude, latitude],
        {icon: markerIcon}).addTo(map);
    console.log('coordinates', longitude, latitude);

    const link = document.createElement('a');
    link.href = `singlerestaurant.html?id=${restaurant._id}`;
    link.textContent = 'View Details';
    link.className = 'map-view-details';

    marker.bindPopup(`<h2>${name}</h2><p>${address}<br>` + `<br>` + link.outerHTML);
  });
});

// ----------------- Restaurants -----------------

