import { Types } from 'mongoose';

export interface IProduct {
  name: string;
  description?: string;
  link: string;
  icon?: string;
  isActive: boolean;
  order: number;
  createdBy: Types.ObjectId;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
