import { z } from 'zod';
import { UserRole } from '../../modules/user/user.types';

export const registerBaseSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().regex(/^(?:\+88|88)?(01[3-9]\d{8})$/, 'Invalid Bangladesh phone number'),
});

export const registerStudentSchema = registerBaseSchema.extend({
  email: z.string().email('Invalid email address'),
  studentId: z.string().min(3, 'Student ID is required'),
  batch: z.string().min(1, 'Batch is required'),
  session: z.string().min(3, 'Session is required'),
  enrollmentYear: z.number().int().min(1990),
});

export const registerTeacherSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().regex(/^(?:\+88|88)?(01[3-9]\d{8})$/, 'Invalid Bangladesh phone number'),
  designation: z.string().min(2, 'Designation is required'),
  researchInterests: z.array(z.string()).optional(),
  publications: z.array(z.string()).optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export const verifyEmailSchema = z.object({
  email: z.string().email('Invalid email address'),
  code: z.string().length(6, 'Verification code must be 6 digits'),
});

export const resendCodeSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
  code: z.string().length(6, 'Verification code must be 6 digits'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
});

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
});
