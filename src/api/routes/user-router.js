import express from 'express';

import {
  getAllUsers,
  getUserById,
  getOrdersByUserId
} from '../controllers/user-controller.js';

const userRouter = express.Router();

userRouter.route('/')
  .get(getAllUsers) //List all users
  // .post(postUser); //Add new user

userRouter.route('/:id/orders')
  .get(getOrdersByUserId) //List all users
// .post(postUser); //Add new user

userRouter.route('/:id')
  .get(getUserById) //Find user by ID
  // .put(putUser) //Modify user
  // .delete(deleteUser); //Remove user

export default userRouter;
