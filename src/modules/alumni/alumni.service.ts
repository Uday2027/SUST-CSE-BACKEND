import { Alumni } from './alumni.schema';
import { AppError } from '@/utils/errors';

export const getAllAlumni = async (query: any) => {
  const { batch, search, limit = 50, page = 1 } = query;
  const filter: any = {};

  if (batch) {
    filter.batch = batch;
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { currentCompany: { $regex: search, $options: 'i' } },
      { currentPosition: { $regex: search, $options: 'i' } },
    ];
  }

  const alumni = await Alumni.find(filter)
    .sort({ batch: -1, createdAt: -1 })
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit));

  const total = await Alumni.countDocuments(filter);

  return { alumni, total, page: Number(page), limit: Number(limit) };
};

export const getAlumniById = async (id: string) => {
  const alumni = await Alumni.findById(id);

  if (!alumni) {
    throw new AppError('Alumni not found', 404);
  }

  return alumni;
};

export const createAlumni = async (data: any) => {
  const alumni = await Alumni.create(data);
  return alumni;
};

export const updateAlumni = async (id: string, data: any) => {
  const alumni = await Alumni.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!alumni) {
    throw new AppError('Alumni not found', 404);
  }

  return alumni;
};

export const deleteAlumni = async (id: string) => {
  const alumni = await Alumni.findByIdAndDelete(id);

  if (!alumni) {
    throw new AppError('Alumni not found', 404);
  }

  return alumni;
};
