import { login } from '../models/user-model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import 'dotenv/config';

const loginUser = async (req, res) => {
  try {
    const {username, password} = req.body;

    const user = await login(username);

    if (!user) {
      return res.status(401).json({ message: 'Invalid username' });
    }

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    await postLogin(req, res)

  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const postLogin = async (req, res) => {
  console.log('postLogin', req.body);
  const user = await login(req.body.username);
  if (!user) {
    res.sendStatus(401);
    return;
  }

  if (!bcrypt.compareSync(req.body.password, user.password)) {
    res.sendStatus(401);
    return;
  }

  const userWithNoPassword = {
    user_id: user.user_id,
    name: user.name,
    username: user.username,
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(userWithNoPassword, process.env.JWT_SECRET, {
    expiresIn: '24h',
  });
  res.json({user: userWithNoPassword, token});
};

const getMe = async (req, res) => {
  console.log('getMe', res.locals.user);
  if ( res.locals.user) {
    res.json({message: 'token ok', user:  res.locals.user});
  } else {
    res.sendStatus(401);
  }
};


export { loginUser, postLogin, getMe };
