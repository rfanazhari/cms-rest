import mongoose, { Document, Schema } from 'mongoose';

// Article status enum
export enum ArticleStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

// Article interface
export interface IArticle extends Document {
  status: ArticleStatus;
  title: string;
  content: string;
  user: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Article schema
const ArticleSchema: Schema = new Schema(
  {
    status: {
      type: String,
      enum: Object.values(ArticleStatus),
      default: ArticleStatus.DRAFT,
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Indexes for faster queries
ArticleSchema.index({ status: 1 });
ArticleSchema.index({ user: 1 });
ArticleSchema.index({ user: 1, status: 1 });

// Create and export Article model
export default mongoose.model<IArticle>('Article', ArticleSchema);