import { Schema, model } from 'mongoose';
import { IAchievement, IHomePage, INotice } from './content.interface';
import { AchievementCategory, NoticeCategory } from './content.types';

// HomePage Schema (Singleton-ish)
const homePageSchema = new Schema<IHomePage>(
  {
    heroImage: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const HomePage = model<IHomePage>('HomePage', homePageSchema);

// Notice Schema
const noticeSchema = new Schema<INotice>(
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
const achievementSchema = new Schema<IAchievement>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    images: [String],
    achievedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    category: {
      type: String,
      enum: Object.values(AchievementCategory),
      default: AchievementCategory.ACADEMIC,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Achievement = model<IAchievement>('Achievement', achievementSchema);
