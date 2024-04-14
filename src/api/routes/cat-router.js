import express from 'express';
import multer from 'multer';

import {
  getCat,
  getCatById,
  postCat,
  putCat,
  deleteCat,
  getCatsByUserId
} from '../controllers/cat-controller.js';

const catRouter = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now());
  }
});

const upload = multer({ storage: storage });

catRouter.route('/')
  .get(getCat) // Get all cats
  .post(upload.single('catImage'), postCat); // Add a new cat

catRouter.route('/:id')
  .get(getCatById) // Get a cat by id
  .put(putCat) // Modify a cat
  .delete(deleteCat); // Delete a cat

catRouter.get('/user/:userId', getCatsByUserId);

export default catRouter;
