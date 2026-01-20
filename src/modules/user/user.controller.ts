import { Request, Response } from 'express';
import { asyncHandler } from '@/utils/asyncHandler.util';
import { successResponse } from '@/utils/response.util';
import { User } from './user.schema';
import { uploadToCloudinary, deleteFromCloudinary } from '@/utils/cloudinary.util';
import { AppError } from '@/utils/errors';

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const { email, role, status, limit = 50, page = 1 } = req.query;
  const filter: any = { isDeleted: false };

  if (email) {
    filter.email = { $regex: email, $options: 'i' };
  }
  if (role) {
    filter.role = role;
  }
  if (status) {
    filter.status = status;
  }

  const users = await User.find(filter)
    .select('name email role status phone profileImage studentId designation isEmailVerified createdAt')
    .sort({ createdAt: -1 })
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit));

  successResponse(res, users, 'Users fetched successfully');
});

export const updateUserStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const user = await User.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new Error('User not found');
  }

  successResponse(res, user, `User status updated to ${status} successfully`);
});

export const updateMyProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const updates = req.body;

  // Handle profile image upload
  if (req.file) {
    const uploadResult = await uploadToCloudinary(req.file, 'profiles');
    updates.profileImage = uploadResult.secure_url;
  }

  // Prevent updating sensitive fields
  const sanitizedUpdates: any = {};
  const allowedFields = ['name', 'phone', 'profileImage', 'designation', 'researchInterests', 'publications', 'cgpa'];
  
  Object.keys(updates).forEach((key) => {
    if (allowedFields.includes(key)) {
      sanitizedUpdates[key] = updates[key];
    }
  });

  const updatedUser = await User.findByIdAndUpdate(
    user.userId,
    sanitizedUpdates,
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    throw new AppError('User not found', 404);
  }

  successResponse(res, updatedUser, 'Profile updated successfully');
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.id as string;

  const user = await User.findByIdAndDelete(userId);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  successResponse(res, null, 'User deleted successfully');
});
