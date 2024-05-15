
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


async function fetchRestaurant(id) {
  const url = `https://10.120.32.94/restaurant/api/v1/restaurants/${id}`;
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const response = await fetch(url, options);
  return await response.json();
}

const populateProfile = (user) => {
  const username = document.getElementById('username');
  const email = document.getElementById('email');
  const avatar = document.getElementById('profile-picture');
  const id = document.getElementById('id');
  const role = document.getElementById('role');
  const restaurant = document.getElementById('fav-restaurant');
  username.textContent = user.username;
  email.textContent = user.email;
  id.textContent = user._id;
  role.textContent = user.role;

  if (user.avatar) {
    avatar.src = 'https://10.120.32.94/restaurant/uploads/' + user.avatar;
  } else {
    avatar.src = '../IMG/avatar4.jpg';
  }

  console.log(user.favouriteRestaurant);

  if (user.favouriteRestaurant) {
    fetchRestaurant(user.favouriteRestaurant)
        .then((restaurant) => {
          console.log(restaurant);
          const restaurantDiv = document.createElement('div');
          restaurantDiv.className = 'restaurant-info';
          // Set the inner HTML of the new div with restaurant information
          restaurantDiv.innerHTML = `
        <h2>${restaurant.name}</h2>
        <p>Address: ${restaurant.address}</p>
        <p>Phone: ${restaurant.phone}</p>
        <button onclick="window.location.href=
        '../HTML/singlerestaurant.html?id=${restaurant._id}'">Show Menu</button>
      `;

          document.getElementById('restaurant-info').appendChild(restaurantDiv);
        });
  } else {
    restaurant.innerHTML = 'You don\'t have a favorite restaurant yet!' +
      '<br>Go choose one <a href="restaurants.html">here</a>!';
  }
};

// Delete user account
async function deleteUser() {
  const token = localStorage.getItem('token');
  const url = 'https://10.120.32.94/restaurant/api/v1/users';
  const options = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  };

  const response = await fetch(url, options);
  return await response.json();
}

const deleteAccountBtn = document.querySelector('.delete-account-btn');
deleteAccountBtn.addEventListener('click', () => {
  const confirmation = confirm('Are you sure you want to delete your account?');
  if (confirmation) {
    deleteUser()
        .then((data) => {
          if (data.message) {
          // Log out the user and redirect to the login page
            localStorage.removeItem('token');
            window.location.href = 'index.html';
          } else {
            alert('Failed to delete user account');
          }
        })
        .catch((error) => console.error('Error:', error));
  }
});


async function buildProfile() {
  const token = localStorage.getItem('token');
  const user = await fetchUser(token);
  populateProfile(user);
}

const editAccountBtn = document.querySelector('.edit-account-btn');
const editAccountModal = document.getElementById('editAccountModal');

editAccountBtn.addEventListener('click', () => {
  if (editAccountModal.style.display === 'none') {
    editAccountModal.style.display = 'block';
  } else {
    editAccountModal.style.display = 'none';
  }
});

// Save edited account details
const editAccountForm = document.getElementById('edit-account-form');
editAccountForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const token = localStorage.getItem('token');
  const username = document.getElementById('edit-username').value;
  const email = document.getElementById('edit-email').value;

  const user = {
    username,
    email,
  };

  const url = 'https://10.120.32.94/restaurant/api/v1/users'; // Corrected URL
  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(user),
  };

  const response = await fetch(url, options);
  const data = await response.json();

  if (response.ok) {
    // Update user profile with new details
    buildProfile();
    editAccountModal.style.display = 'none';
    alert('Account details updated successfully!');
  } else {
    alert(data.message);
  }
});

// Function to handle profile image update
// Show file input when the profile image is clicked
const profilePicture = document.getElementById('profile-picture');
profilePicture.addEventListener('click', () => {
  const profileImageInput = document.getElementById('profile-image-input');
  profileImageInput.click();
});

// Event listener for file input change
const profileImageInput = document.getElementById('profile-image-input');
profileImageInput.addEventListener('change', () => {
  handleProfileImageUpdate();
});

// Function to handle profile image update
const handleProfileImageUpdate = async () => {
  const token = localStorage.getItem('token');
  const profileImageInput = document.getElementById('profile-image-input');
  const file = profileImageInput.files[0];
  const formData = new FormData();
  formData.append('avatar', file);

  const url = 'https://10.120.32.94/restaurant/api/v1/users/avatar';
  const options = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  };

  const response = await fetch(url, options);
  const data = await response.json();

  if (response.ok) {
    console.log(data);
    // Update profile picture
    buildProfile();
  } else {
    alert(data.message);
  }
};

document.addEventListener('DOMContentLoaded', function() {
  const profilePicture = document.getElementById('profile-picture');
  const changeAvatarText = document.getElementById('change-avatar-text');

  profilePicture.addEventListener('mouseover', function() {
    profilePicture.style.filter = 'brightness(70%)';
    changeAvatarText.style.display = 'block';
  });

  profilePicture.addEventListener('mouseout', function() {
    profilePicture.style.filter = 'brightness(100%)';
    changeAvatarText.style.display = 'none';
  });
});

buildProfile();
