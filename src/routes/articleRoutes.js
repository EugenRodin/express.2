import express from 'express';
import { getArticles, getArticleDetails } from '../controllers/articleController.js';

const router = express.Router();

router.get('/', getArticles);
router.get('/:articleId', getArticleDetails);

export default router