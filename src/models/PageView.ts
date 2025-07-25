import mongoose, { Document, Schema } from 'mongoose';

// PageView interface
export interface IPageView extends Document {
  article: mongoose.Types.ObjectId;
  viewedAt: Date;
}

// PageView schema
const PageViewSchema: Schema = new Schema({
  article: {
    type: Schema.Types.ObjectId,
    ref: 'Article',
    required: [true, 'Article is required'],
  },
  viewedAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexes for faster queries
PageViewSchema.index({ article: 1 });
PageViewSchema.index({ viewedAt: 1 });
PageViewSchema.index({ article: 1, viewedAt: 1 });

// Static methods for aggregation
PageViewSchema.statics.countByArticle = async function (articleId: mongoose.Types.ObjectId) {
  return this.countDocuments({ article: articleId });
};

PageViewSchema.statics.countByDateRange = async function (
  startAt?: Date,
  endAt?: Date,
  articleId?: mongoose.Types.ObjectId
) {
  const query: any = {};
  
  if (startAt || endAt) {
    query.viewedAt = {};
    if (startAt) query.viewedAt.$gte = startAt;
    if (endAt) query.viewedAt.$lte = endAt;
  }
  
  if (articleId) {
    query.article = articleId;
  }
  
  return this.countDocuments(query);
};

PageViewSchema.statics.aggregateByInterval = async function (
  interval: 'hourly' | 'daily' | 'monthly',
  startAt?: Date,
  endAt?: Date,
  articleId?: mongoose.Types.ObjectId
) {
  const match: any = {};
  
  if (startAt || endAt) {
    match.viewedAt = {};
    if (startAt) match.viewedAt.$gte = startAt;
    if (endAt) match.viewedAt.$lte = endAt;
  }
  
  if (articleId) {
    match.article = articleId;
  }
  
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
  
  return this.aggregate([
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
};

// Create and export PageView model
export default mongoose.model<IPageView>('PageView', PageViewSchema);