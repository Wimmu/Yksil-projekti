async function login(username, password) {
  console.log('Logging in with username:',
      username, 'and password:', password );
  const user = {
    username,
    password,
  };
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


async function postUser(user) {
  try {
    const response = await fetch('https://10.120.32.94/restaurant/api/v1/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error posting user:', error);
  }
}

async function createUser() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmpassword').value;
  const email = document.getElementById('email').value;

  if (!username || !password || !confirmPassword || !email) {
    alert('Please fill in all fields');
    return;
  }

  if (username.length < 1 || username.includes('@')) {
    alert('Username must be at least 1 character and cannot contain @ symbol ');
    return;
  }

  if (password.length < 6) {
    alert('Password must be at least 6 characters');
    return;
  }

  if (password !== confirmPassword) {
    alert('Passwords do not match');
    return;
  }

  if (!email.includes('@')) {
    alert('Invalid email');
    return;
  }

  // const usernameExists = await fetchUsername(username);
  // if (usernameExists) {
  //   alert('Username already exists');
  //   return;
  // }

  const user = {
    username,
    password,
    email,
  };

  console.log('Creating user:', user);
  const newUser = await postUser(user);
  console.log(newUser);

  if (newUser) {
    await login(username, password);
    console.log('User created and logged in');
  }
}

document.addEventListener('DOMContentLoaded', (event) => {
  const usernameInput = document.getElementById('username');

  usernameInput.addEventListener('blur', async () => {
    const username = usernameInput.value;
    const response = await fetch(`https://10.120.32.94/restaurant/api/v1/users/available/${username}`);

    if (response.ok) {
      const data = await response.json();
      if (!data.available) {
        alert('Käyttäjänimi on jo käytössä. Valitse toinen.');
      } else {
        console.log('Käyttäjänimi on käytettävissä');
      }
    } else {
      console.error('Failed to check username availability');
    }
  });
});


document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('register-form');

  form.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission behavior

    // Call the createUser function when the form is submitted
    createUser();
  });
});


