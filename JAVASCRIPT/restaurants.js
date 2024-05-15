const makeFetch = async (url) => {
  const result = await fetch(url);
  return await result.json();
};

async function fetchUser(token) {
  const url = `https://10.120.32.94/restaurant/api/v1/users/token`;
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  };

  const response = await fetch(url, options);
  return await response.json();
}

async function updateUser(token, favouriteRestaurant) {
  console.log(favouriteRestaurant);

  const user = {
    favouriteRestaurant,
  };

  const url = `https://10.120.32.94/restaurant/api/v1/users`;
  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(user),
  };

  const response = await fetch(url, options);
  return await response.json();
}

const fetchRestaurants = async () =>
  await makeFetch('https://10.120.32.94/restaurant/api/v1/restaurants');

const populateRestaurants = async (restaurants) => {
  const list = document.getElementById('restaurants-list');
  const token = localStorage.getItem('token');
  const user = await fetchUser(token);

  list.innerHTML = '';
  restaurants.forEach((restaurant) => {
    let favoriteIcon = '';
    if (user.favouriteRestaurant === restaurant._id) {
      favoriteIcon = '&#9733;';
    } else {
      favoriteIcon = '&#9734;';
    }

    const row = `
      <div class="restaurant-box">
        <div class="header">
          <h2>${restaurant.name}</h2>
           <p class="favoriteIcon">${favoriteIcon}</p>
        </div>
        <p>${restaurant.address}</p>
        <p id="restaurant-id" style="display: none;">${restaurant._id}</p>
        <p>${restaurant.city} ${restaurant.postalCode}</p>
        <br>
        <a href="singlerestaurant.html?id=${restaurant._id}"
        class="restaurant-button">View Restaurant</a>
      </div>
    `;
    list.innerHTML += row;
  });

  const favoriteIcons = document.querySelectorAll('.favoriteIcon');
  favoriteIcons.forEach((icon) => {
    icon.addEventListener('click', async (event) => {
      const restaurantId =
        icon.parentElement.nextElementSibling.nextElementSibling.textContent;
      if (!user.favoriteRestaurant ||
        user.favoriteRestaurant !== restaurantId) {
        // Update user's favorite restaurant
        const updatedUser = await updateUser(token, restaurantId);
        if (updatedUser.message) {
          console.log(updatedUser.data);
          console.log(updatedUser.data.favoriteRestaurant);
          // Refresh the UI
          populateRestaurants(restaurants);
        }
      }
    });
  });
};

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

async function buildWebsite() {
  const restaurants = await fetchRestaurants();
  let displayedRestaurants = restaurants;
  populateRestaurants(displayedRestaurants);

  // Fetch user's location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async function(position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const nearbyRestaurants = restaurants.map((restaurant) => {
        const distance = getDistance(
            latitude,
            longitude,
            restaurant.location.coordinates[1],
            restaurant.location.coordinates[0],
        );
        return {...restaurant, distance};
      });

      nearbyRestaurants.sort((a, b) => a.distance - b.distance);

      document.getElementById('sort-type')
          .addEventListener('change', function() {
            const sortType = document.getElementById('sort-type').value;
            if (sortType === 'name') {
              displayedRestaurants = displayedRestaurants.sort((a, b) =>
                a.name.localeCompare(b.name));
            } else if (sortType === 'address') {
              displayedRestaurants = displayedRestaurants.sort((a, b) =>
                a.address.localeCompare(b.address));
            } else if (sortType === 'nearest') {
              displayedRestaurants = nearbyRestaurants;
            }
            populateRestaurants(displayedRestaurants);
          });

      document.getElementById('search-bar')
          .addEventListener('input', function(event) {
            const searchTerm = event.target.value.toLowerCase();
            const filteredRestaurants = restaurants.filter((restaurant) =>
              restaurant.name.toLowerCase().includes(searchTerm) ||
          restaurant.address.toLowerCase().includes(searchTerm));
            displayedRestaurants = filteredRestaurants;
            populateRestaurants(displayedRestaurants);
          });
    }, function(error) {
      console.error('Error getting user\'s location:', error);
    });
  }
}

buildWebsite();


buildWebsite();
