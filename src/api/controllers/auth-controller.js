import { findUserByUsernameAndPassword } from '../models/user-model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {getUserByUsername} from '../models/user-model.js';
import 'dotenv/config';

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    // Query the database to find the user by username and password
    const user = await findUserByUsernameAndPassword(username, password);
    if (user) {
      // User found, generate and send JWT token as response
      const token = generateJWTToken(user);
      res.json({ token });
    } else {
      // User not found or password incorrect
      res.status(401).json({ error: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const postLogin = async (req, res) => {
  console.log('postLogin', req.body);
  const user = await getUserByUsername(req.body.username);
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

export { postLogin, loginUser, getMe };
