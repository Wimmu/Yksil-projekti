import {addUser, findUserById, listAllUsers} from "../models/user-model.js";

const getUser = (req, res) => {
  res.json(listAllUsers());
};

const getUserById = (req, res) => {
  const user = findUserById(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.sendStatus(404);
  }
};

const postUser = (req, res) => {
  console.log('post user', req.body)
  const result = addUser(req.body);
  if (result.user_id) {
    res.status(201);
    res.json({message: 'New user added.', result});
  } else {
    res.sendStatus(400);
  }
};

const putUser = (req, res) => {
  console.log('User item updated: ', req.body)
  res.sendStatus(200);
};

const deleteUser = (req, res) => {
  console.log('User item deleted: ', req.body)
  res.sendStatus(200);
};

export {getUser, getUserById, postUser, putUser, deleteUser};
