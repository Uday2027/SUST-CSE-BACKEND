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
    .select('name email role status phone profileImage studentId designation createdAt')
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
  const userId = (req as any).user._id;
  const updates: any = { ...req.body };
  
  // Remove sensitive or unauthorized fields
  delete updates.email;
  delete updates.password;
  delete updates.role;
  delete updates.status;
  delete updates.isDeleted;

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Handle profile image update
  if (req.file) {
    // Note: If the project doesn't store public_id, we might not be able to delete reliably 
    // without parsing the URL. For now, let's just upload the new one.
    const result = await uploadToCloudinary(req.file, 'profiles');
    updates.profileImage = result.url;
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    updates,
    { new: true, runValidators: true }
  );

  successResponse(res, updatedUser, 'Profile updated successfully');
});
