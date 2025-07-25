import { Request, Response } from 'express';
import { body, query, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import PageView from '../models/PageView';
import Article from '../models/Article';

// PageView validation rules
export const pageViewValidation = [
  body('article')
    .notEmpty()
    .withMessage('Article ID is required')
    .isMongoId()
    .withMessage('Invalid article ID'),
];

// Count query validation rules
export const countQueryValidation = [
  query('article')
    .optional()
    .isMongoId()
    .withMessage('Invalid article ID'),
  query('startAt')
    .optional()
    .isISO8601()
    .withMessage('startAt must be a valid ISO date'),
  query('endAt')
    .optional()
    .isISO8601()
    .withMessage('endAt must be a valid ISO date'),
];

// Aggregate query validation rules
export const aggregateQueryValidation = [
  query('interval')
    .isIn(['hourly', 'daily', 'monthly'])
    .withMessage('Interval must be hourly, daily, or monthly'),
  query('article')
    .optional()
    .isMongoId()
    .withMessage('Invalid article ID'),
  query('startAt')
    .optional()
    .isISO8601()
    .withMessage('startAt must be a valid ISO date'),
  query('endAt')
    .optional()
    .isISO8601()
    .withMessage('endAt must be a valid ISO date'),
];

// Create page view
export const createPageView = async (req: Request, res: Response) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { article } = req.body;

    // Check if article exists and is published
    const articleDoc = await Article.findById(article);
    if (!articleDoc) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // Create new page view
    const pageView = new PageView({
      article,
      viewedAt: new Date(),
    });

    await pageView.save();

    res.status(201).json({
      message: 'Page view recorded successfully',
      pageView,
    });
  } catch (error) {
    console.error('Create page view error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get page view count
export const getPageViewCount = async (req: Request, res: Response) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { article, startAt, endAt } = req.query;

    let query: any = {};

    // Add article filter if provided
    if (article) {
      query.article = new mongoose.Types.ObjectId(article as string);
    }

    // Add date range filter if provided
    if (startAt || endAt) {
      query.viewedAt = {};
      if (startAt) {
        query.viewedAt.$gte = new Date(startAt as string);
      }
      if (endAt) {
        query.viewedAt.$lte = new Date(endAt as string);
      }
    }

    // Count page views
    const count = await PageView.countDocuments(query);

    res.json({ count });
  } catch (error) {
    console.error('Get page view count error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get page view aggregation by interval
export const getPageViewAggregation = async (req: Request, res: Response) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { interval, article, startAt, endAt } = req.query;

    let match: any = {};

    // Add article filter if provided
    if (article) {
      match.article = new mongoose.Types.ObjectId(article as string);
    }

    // Add date range filter if provided
    if (startAt || endAt) {
      match.viewedAt = {};
      if (startAt) {
        match.viewedAt.$gte = new Date(startAt as string);
      }
      if (endAt) {
        match.viewedAt.$lte = new Date(endAt as string);
      }
    }

    // Determine date format based on interval
    let dateFormat;
    switch (interval) {
      case 'hourly':
        dateFormat = { $dateToString: { format: '%Y-%m-%d %H:00', date: '$viewedAt' } };
        break;
      case 'daily':
        dateFormat = { $dateToString: { format: '%Y-%m-%d', date: '$viewedAt' } };
        break;
      case 'monthly':
        dateFormat = { $dateToString: { format: '%Y-%m', date: '$viewedAt' } };
        break;
      default:
        dateFormat = { $dateToString: { format: '%Y-%m-%d', date: '$viewedAt' } };
    }

    // Aggregate page views
    const aggregation = await PageView.aggregate([
      { $match: match },
      {
        $group: {
          _id: dateFormat,
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          date: '$_id',
          count: 1,
        },
      },
    ]);

    res.json(aggregation);
  } catch (error) {
    console.error('Get page view aggregation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};