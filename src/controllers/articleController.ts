import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import Article, { ArticleStatus } from '../models/Article';

// Article validation rules
export const articleValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('status')
    .optional()
    .isIn(Object.values(ArticleStatus))
    .withMessage('Status must be either draft or published'),
];

// Get all published articles
export const getPublishedArticles = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const articles = await Article.find({ status: ArticleStatus.PUBLISHED })
      .populate('user', 'name username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Article.countDocuments({ status: ArticleStatus.PUBLISHED });

    res.json({
      articles,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get articles error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user's articles (published and drafts)
export const getUserArticles = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status as string;

    const query: any = { user: req.user._id };
    
    if (status && Object.values(ArticleStatus).includes(status as ArticleStatus)) {
      query.status = status;
    }

    const articles = await Article.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Article.countDocuments(query);

    res.json({
      articles,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get user articles error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get article by ID
export const getArticleById = async (req: Request, res: Response) => {
  try {
    const article = await Article.findById(req.params.id).populate('user', 'name username');

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // If article is a draft and user is not the owner, deny access
    if (
      article.status === ArticleStatus.DRAFT &&
      (!req.user || req.user._id.toString() !== article.user.toString())
    ) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(article);
  } catch (error) {
    console.error('Get article error:', error);
    
    if ((error as any).kind === 'ObjectId') {
      return res.status(404).json({ message: 'Article not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

// Create article
export const createArticle = async (req: Request, res: Response) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, status } = req.body;

    // Create new article
    const article = new Article({
      title,
      content,
      status: status || ArticleStatus.DRAFT,
      user: req.user._id,
    });

    await article.save();

    res.status(201).json({
      message: 'Article created successfully',
      article,
    });
  } catch (error) {
    console.error('Create article error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update article
export const updateArticle = async (req: Request, res: Response) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, status } = req.body;

    // Find article by ID
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // Update fields if provided
    if (title) article.title = title;
    if (content) article.content = content;
    if (status && Object.values(ArticleStatus).includes(status as ArticleStatus)) {
      article.status = status as ArticleStatus;
    }

    await article.save();

    res.json({
      message: 'Article updated successfully',
      article,
    });
  } catch (error) {
    console.error('Update article error:', error);
    
    if ((error as any).kind === 'ObjectId') {
      return res.status(404).json({ message: 'Article not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete article
export const deleteArticle = async (req: Request, res: Response) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    await article.deleteOne();

    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Delete article error:', error);
    
    if ((error as any).kind === 'ObjectId') {
      return res.status(404).json({ message: 'Article not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};