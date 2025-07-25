import express from 'express';
import {
  getPublishedArticles,
  getUserArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  articleValidation,
} from '../controllers/articleController';
import { auth, isOwner } from '../middleware/auth';
import Article from '../models/Article';

const router = express.Router();

// GET /article - Get all published articles (Public)
router.get('/', getPublishedArticles);

// GET /article/me - Get user's articles (Private)
router.get('/me', auth, getUserArticles);

// GET /article/:id - Get article by ID (Public for published, Private for drafts)
router.get('/:id', getArticleById);

// POST /article - Create a new article (Private)
router.post('/', auth, articleValidation, createArticle);

// PATCH /article/:id - Update article (Private - owner only)
router.patch(
  '/:id',
  auth,
  isOwner(async (req) => {
    const article = await Article.findById(req.params.id);
    return article ? article.user.toString() : '';
  }),
  articleValidation,
  updateArticle
);

// DELETE /article/:id - Delete article (Private - owner only)
router.delete(
  '/:id',
  auth,
  isOwner(async (req) => {
    const article = await Article.findById(req.params.id);
    return article ? article.user.toString() : '';
  }),
  deleteArticle
);

export default router;