import express from 'express'
import { getUsers, getUserDetails } from '../controllers/userController.js'

const router = express.Router();

router.get('/', getUsers);
router.get('/:userId', getUserDetails);

export default router