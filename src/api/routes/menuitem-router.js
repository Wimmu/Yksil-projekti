import express from 'express';

import {
  getAllItems,
  deleteItemByName
} from '../controllers/menuitem-controller.js';

const itemRouter = express.Router();

itemRouter.route('/')
  .get(getAllItems) //List all items

itemRouter.route('/:name')
  .delete(deleteItemByName) //Delete item by name

export default itemRouter;
