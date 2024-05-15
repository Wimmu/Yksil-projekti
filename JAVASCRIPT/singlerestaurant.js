/* global L */


const makeFetch = async (url) => {
  const result = await fetch(url);
  return await result.json();
};

const fetchSingeRestaurant = async (id) =>
  await makeFetch(`https://10.120.32.94/restaurant/api/v1/restaurants/${id}`);

const fetchMenuForRestaurant = async (id, lang) =>
  await makeFetch(`https://10.120.32.94/restaurant/api/v1/restaurants/weekly/${id}/${lang}`);

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[[\]]/g, '\\$&');
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

const restaurantId = getParameterByName('id');

const populateRestaurant = (restaurant) => {
  const name = document.getElementById('restaurant-name');
  const address = document.getElementById('restaurant-address');
  const phone = document.getElementById('restaurant-phone');
  const company = document.getElementById('restaurant-company');

  name.innerHTML = restaurant.name;
  address.innerHTML = 'Address: ' + restaurant.address + ', ' +
    restaurant.postalCode + ' ' + restaurant.city;
  phone.innerHTML = 'Phone: ' + restaurant.phone;
  company.innerHTML = 'Company: ' + restaurant.company;


  // Initialize map
  const map = L.map('map').setView([restaurant.location.coordinates[1],
    restaurant.location.coordinates[0]], 11.5);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 30,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  const markerIcon = L.icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  // Add marker for the restaurant
  L.marker([restaurant.location.coordinates[1],
    restaurant.location.coordinates[0]], {icon: markerIcon})
      .addTo(map)
      .bindPopup(`${restaurant.name}<br><br>${restaurant.address}</br>`);
};

const populateMenu = (menu) => {
  const list = document.getElementById('menu-items');

  list.innerHTML = '';

  menu.days.forEach((day) => {
    const dayDiv = document.createElement('div');
    dayDiv.classList.add('menu-day');
    dayDiv.innerHTML = `<h2>${day.date}</h2>`;

    if (day.courses && Array.isArray(day.courses)) {
      day.courses.forEach((course) => {
        const courseDiv = document.createElement('div');
        courseDiv.classList.add('menu-course');
        courseDiv.innerHTML = `
          <div class="menu-items-box">
              <p class="menu-course-name">${course.name}</p>
              <p class="menu-course-price">${course.price}</p>
              <p class="menu-course-diets">${course.diets}</p>
          </div>
          `;
        dayDiv.appendChild(courseDiv);
      });
    }

    list.appendChild(dayDiv);
  });
};

async function buildWebsite() {
  const restaurant = await fetchSingeRestaurant(restaurantId);
  const menu = await fetchMenuForRestaurant(restaurantId, 'fi');
  populateRestaurant(restaurant);
  populateMenu(menu);
}

buildWebsite();
