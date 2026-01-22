import { Schema, model } from 'mongoose';
import { IProduct } from './product.interface';

const productSchema = new Schema<any>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    link: {
      type: String,
      required: true,
      trim: true,
    },
    icon: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
productSchema.index({ isActive: 1, isDeleted: 1, order: 1 });

export const Product = model<IProduct>('Product', productSchema);
