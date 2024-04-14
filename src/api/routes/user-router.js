import express from 'express';

import {
  getUser,
  getUserById,
  postUser,
  putUser,
  deleteUser,
} from '../controllers/user-controller.js';

const userRouter = express.Router();

userRouter.route('/')
  .get(getUser) //List all users
  .post(postUser); //Add new user

userRouter.route('/:id')
  .get(getUserById) //Find user by ID
  .put(putUser) //Modify user
  .delete(deleteUser); //Remove user

export default userRouter;
