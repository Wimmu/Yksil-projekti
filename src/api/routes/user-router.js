import express from 'express';
import multer from 'multer';

import {
  getUser,
  getUserById,
  postUser,
  putUser,
  deleteUser,
} from '../controllers/user-controller.js';

const userRouter = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now());
  }
});

const upload = multer({ storage: storage });
const logRequest = (req, res, next) => {
  console.log('Request Body:', req.body);
  next(); // Call next middleware in the chain
};

userRouter.route('/')
  .get(getUser)
  .post(logRequest, postUser);

userRouter.route('/:id')
  .get(getUserById)
  .put(putUser)
  .delete(deleteUser);

export default userRouter;
