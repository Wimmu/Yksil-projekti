import express from 'express';
import userRouter from './routes/user-router.js';
import itemRouter from './routes/menuitem-router.js';


const router = express.Router();

router.use('/users', userRouter);
router.use('/items', itemRouter);

export default router;
