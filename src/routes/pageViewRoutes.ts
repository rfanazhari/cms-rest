import express from 'express';
import {
  createPageView,
  getPageViewCount,
  getPageViewAggregation,
  pageViewValidation,
  countQueryValidation,
  aggregateQueryValidation,
} from '../controllers/pageViewController';
import { auth } from '../middleware/auth';

const router = express.Router();

// POST /page-view - Record a page view (Public)
router.post('/', pageViewValidation, createPageView);

// GET /page-view/count - Get page view count (Private)
router.get('/count', auth, countQueryValidation, getPageViewCount);

// GET /page-view/aggregate-date - Get page view aggregation by date interval (Private)
router.get('/aggregate-date', auth, aggregateQueryValidation, getPageViewAggregation);

export default router;