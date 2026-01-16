import { Types } from 'mongoose';
import { SportType, TournamentStatus } from './sports.types';

export interface ITournament {
  _id: Types.ObjectId;
  name: string;
  sportType: SportType;
  startDate: Date;
  endDate: Date;
  venue: string;
  status: TournamentStatus;
  winner?: string; // Team or User name
  runnerUp?: string;
  bestPlayer?: string; // User ID reference potentially, but string for name showcase
  images: string[];
  description: string;
  createdBy: Types.ObjectId;
  isDeleted: boolean;
}

export interface IPlayerShowcase {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  sportType: SportType;
  achievements: string[];
  totalMatches: number;
  stats?: Record<string, any>;
  image: string;
  isFeatured: boolean;
  createdBy: Types.ObjectId;
  isDeleted: boolean;
}
