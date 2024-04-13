import express from 'express';
const hostname = '127.0.0.1'; // localhost
const app = express();
const port = 3000;

// Middleware function
// - happens before the request is processed
app.get('/', (req, res) => {
  res.send('Welcome to my REST API???');
});

app.use('/public', express.static('public'));

app.get('/api/v1/cat', (req, res) => {
  const cat = {
    cat_id: 1,
    name: 'Fluffy',
    birthdate: '2018-01-01',
    weight: 12,
    owner: 'John Doe',
    image: 'http://placekitten.com/200/300'
  };
  res.json(cat);
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
