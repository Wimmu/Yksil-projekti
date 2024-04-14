import express from 'express';
import { loginUser } from '../controllers/auth-controller.js';
import {getMe, postLogin} from '../controllers/auth-controller.js';
import {authenticateToken} from '../middlewares/authentication.js';

const authRouter = express.Router();

authRouter.post('/login', loginUser);

authRouter.route('/me').get(authenticateToken, getMe);


export default authRouter;
