import express from 'express';
import * as AuthController from './auth.controller';
import { validate } from '@/middleware/validate.middleware';
import { registerStudentSchema, registerTeacherSchema, loginSchema } from './auth.validator';
import { auth } from '@/middleware/auth.middleware';

const router = express.Router();

router.post(
  '/register/student',
  validate(registerStudentSchema),
  AuthController.registerStudent
);

router.post(
  '/register/teacher',
  validate(registerTeacherSchema),
  AuthController.registerTeacher
);

router.post(
  '/login',
  validate(loginSchema),
  AuthController.login
);

router.get(
  '/me',
  auth(),
  AuthController.getMe
);

export const AuthRoutes = router;
