import { Schema, model } from 'mongoose';
import { IAchievement, IHomePage, INotice } from './content.interface';
import { AchievementCategory, NoticeCategory } from './content.types';

// HomePage Schema
const heroSlideSchema = new Schema({
  image: { type: String, required: true },
  title: { type: String, required: true },
  subtitle: { type: String },
  description: { type: String },
  ctaText: { type: String },
  ctaLink: { type: String },
});

const homePageSchema = new Schema<IHomePage>(
  {
    heroSlides: [heroSlideSchema],
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const HomePage = model<IHomePage>('SiteContent', homePageSchema);

// Notice Schema
const noticeSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    attachments: [String],
    publishDate: { type: Date, default: Date.now },
    expiryDate: { type: Date },
    isPinned: { type: Boolean, default: false },
    category: {
      type: String,
      enum: Object.values(NoticeCategory),
      default: NoticeCategory.GENERAL,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Notice = model<INotice>('Notice', noticeSchema);

// Achievement Schema
const achievementSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    teamName: { type: String },
    competitionName: { type: String, required: true },
    position: { type: String, required: true },
    image: { type: String, required: true },
    achievedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, required: true },
    category: {
      type: String,
      enum: Object.values(AchievementCategory),
      default: AchievementCategory.CP,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Achievement = model<IAchievement>('Achievement', achievementSchema);
