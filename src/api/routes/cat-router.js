import express from 'express';
import multer from 'multer';

import {
  getCat,
  getCatById,
  postCat,
  putCat,
  deleteCat,
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
  .get(getCat)
  .post(upload.single('catImage'), postCat);

catRouter.route('/:id')
  .get(getCatById)
  .put(putCat)
  .delete(deleteCat);

export default catRouter;
