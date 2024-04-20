import {
  listAllItems,
  removeItem
} from "../models/menuitem-model.js";

const getAllItems = async (req, res) => {
  try {
    const users = await listAllItems();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteItemByName = async (req, res) => {
  try {
    const result = await removeItem(req.params.name);
    if (result) {
      res.json(result);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export {
  getAllItems,
  deleteItemByName
};
