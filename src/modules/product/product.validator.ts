import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Product name is required'),
    description: z.string().optional(),
    link: z.string().url('Invalid URL format'),
    isActive: z.boolean().default(true),
    order: z.number().int().min(0).default(0),
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    link: z.string().url().optional(),
    isActive: z.boolean().optional(),
    order: z.number().int().min(0).optional(),
  }),
});

export const reorderProductsSchema = z.object({
  body: z.object({
    productIds: z.array(z.string()),
  }),
});
