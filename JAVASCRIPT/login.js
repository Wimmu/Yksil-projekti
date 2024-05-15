async function login(username, password) {
  // eslint-disable-next-line max-len
  const user = {
    username,
    password,
  };

  console.log('Logging in with username:', username, 'and password:', password );

  const response = await fetch('https://10.120.32.94/restaurant/api/v1/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });

  if (response.ok) {
    const {user, token} = await response.json();
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    window.location.href = 'index.html';
  } else {
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = 'Incorrect username or password';
  }
}
document.addEventListener('DOMContentLoaded', (event) => {
  const form = document.getElementById("login-form");

  form.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission behavior
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    // Call the login function when the form is submitted
    login(username, password);
  });
});

