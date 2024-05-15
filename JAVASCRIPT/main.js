document.addEventListener('DOMContentLoaded', (event) => {
  const profileLink = document.getElementById('profile-link');
  const logoutBtn = document.getElementById('logout-btn');
  const token = localStorage.getItem('token');
  if (token) {
    profileLink.href = 'profile.html';
    logoutBtn.style.display = '';
  } else {
    profileLink.href = 'login.html';
    logoutBtn.style.display = 'none';
  }

  logoutBtn.addEventListener('click', logout);
});

function logout() {
  // Clear the user's session or token
  localStorage.removeItem('token');

  // Redirect the user to the login page or perform any other necessary actions
  window.location.href = 'index.html';
}
