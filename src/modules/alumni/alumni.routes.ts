import express from 'express';
import * as AlumniController from './alumni.controller';
import { auth } from '@/middleware/auth.middleware';
import { upload } from '@/middleware/upload.middleware';
import { validate } from '@/middleware/validate.middleware';
import { createAlumniSchema, updateAlumniSchema } from './alumni.validator';
import { UserRole } from '@/modules/user/user.types';

const router = express.Router();

// Public routes
router.get('/', AlumniController.getAllAlumni);
router.get('/:id', AlumniController.getAlumniById);

// Admin routes
router.post(
  '/',
  auth(UserRole.ADMIN),
  upload.single('profileImage'),
  validate(createAlumniSchema),
  AlumniController.createAlumni
);

router.patch(
  '/:id',
  auth(UserRole.ADMIN),
  upload.single('profileImage'),
  validate(updateAlumniSchema),
  AlumniController.updateAlumni
);

router.delete(
  '/:id',
  auth(UserRole.ADMIN),
  AlumniController.deleteAlumni
);

export const AlumniRoutes = router;
