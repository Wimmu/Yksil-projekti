const makeFetch = async (url) => {
  const result = await fetch(url);
  return await result.json();
};

const fetchRestaurants = async () =>
  await makeFetch('https://10.120.32.94/restaurant/api/v1/restaurants');

const populateFeatured = (restaurants) => {
  const featuredBody = document.getElementById('featured-restaurants-list');
  // Clear existing restaurant boxes
  featuredBody.innerHTML = '';

  // Shuffle the restaurants array
  const shuffledRestaurants = shuffleArray(restaurants);

  // Select the first 4 restaurants
  const limitedRestaurants = shuffledRestaurants.slice(0, 4);

  // Create a row
  const row = document.createElement('div');
  row.classList.add('row');

  // Iterate over the data and create restaurant boxes
  limitedRestaurants.forEach((restaurant) => {
    const card = `
    <div class="restaurant-box">
      <h2>${restaurant.name}</h2>
      <p>${restaurant.address}</p>
      <button class="restaurant-box-btn" onclick="window.location.href=
        '../HTML/singlerestaurant.html?id=${restaurant._id}'">View Menu</button>
    </div>
    `;
    row.innerHTML += card;
  });

  // Append the row to the featuredBody
  featuredBody.appendChild(row);
};

// Function to shuffle an array
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

async function buildWebsite() {
  const restaurants = await fetchRestaurants();
  populateFeatured(restaurants);
}

buildWebsite();
