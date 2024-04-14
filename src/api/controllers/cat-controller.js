import {addCat, findCatById, listAllCats} from "../models/cat-model.js";

const getCat = async (req, res) => {
  try {
    const cats = await listAllCats();
    res.json(cats);
  } catch (error) {
    console.error('Error fetching cats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getCatById = async (req, res) => {
  try {
    const cat = await findCatById(req.params.id);
    res.json(cat);
  } catch (error) {
    console.error('Error fetching cat:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const postCat = async (req, res) => {
  try {
    const result = await addCat(req.body);
    res.json({message: 'New cat added.', result});
  } catch (error) {
    console.error('Error adding cat:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const putCat = async (req, res) => {
  try {
    const result = await modifyCat(req.body, req.params.id);
    if (result) {
      res.json(result);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error('Error modifying cat:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteCat = async (req, res) => {
  try {
    const result = await removeCat(req.params.id);
    if (result) {
      res.json(result);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error('Error deleting cat:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export {getCat, getCatById, postCat, putCat, deleteCat};
