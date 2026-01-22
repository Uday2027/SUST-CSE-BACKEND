import { Types } from 'mongoose';
import { AchievementCategory, NoticeCategory } from './content.types';

export interface IHeroSlide {
  _id?: string;
  image: string;
  title: string;
  subtitle: string;
  description: string;
  ctaText?: string;
  ctaLink?: string;
}

export interface IHomePage {
  heroSlides: IHeroSlide[];
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
  teamName?: string;
  competitionName: string;
  position: string;
  image: string;
  achievedBy?: Types.ObjectId; // User reference (optional if guest/team lead)
  date: Date;
  category: AchievementCategory;
  createdBy: Types.ObjectId;
  isDeleted: boolean;
}
