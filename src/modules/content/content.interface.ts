import { Types } from 'mongoose';
import { AchievementCategory, NoticeCategory } from './content.types';

export interface IHomePage {
  heroImages: string[];
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  updatedBy: Types.ObjectId;
}

export interface INotice {
  _id: Types.ObjectId;
  title: string;
  description: string;
  attachments: string[];
  publishDate: Date;
  expiryDate?: Date;
  isPinned: boolean;
  category: NoticeCategory;
  createdBy: Types.ObjectId;
  isDeleted: boolean;
}

export interface IAchievement {
  _id: Types.ObjectId;
  title: string;
  description: string;
  images: string[];
  achievedBy: Types.ObjectId; // User reference
  date: Date;
  category: AchievementCategory;
  createdBy: Types.ObjectId;
  isDeleted: boolean;
}
