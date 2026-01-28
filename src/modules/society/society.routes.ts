import express from 'express';
import * as SocietyController from './society.controller';
import { validate } from '../../middleware/validate.middleware';
import { createSocietySchema, addMemberSchema, updateSocietySchema, updateMemberSchema } from './society.validator';
import { auth } from '../../middleware/auth.middleware';
import { UserRole } from '../../modules/user/user.types';
import { upload } from '../../middleware/upload.middleware';
import { UserPermission } from '../user/user.interface';

const router = express.Router();

// Societies
router.get('/', SocietyController.getSocieties);
router.get('/:id', SocietyController.getSocietyById);

router.post(
  '/',
  auth([UserRole.ADMIN], [UserPermission.MANAGE_SOCIETIES]),
  upload.single('logo'),
  validate(createSocietySchema),
  SocietyController.createSociety
);

router.patch(
  '/:id',
  auth([UserRole.ADMIN], [UserPermission.MANAGE_SOCIETIES]),
  upload.single('logo'),
  validate(updateSocietySchema),
  SocietyController.updateSociety
);

// Members
router.get('/:id/members', SocietyController.getMembers);
router.post(
  ('/:id/members'),
  auth([UserRole.ADMIN], [UserPermission.MANAGE_SOCIETIES]),
  upload.single('image'), // Enable image upload
  validate(addMemberSchema),
  SocietyController.addMember
);

router.patch(
  '/members/:memberId',
  auth([UserRole.ADMIN], [UserPermission.MANAGE_SOCIETIES]),
  validate(updateMemberSchema),
  SocietyController.updateMember
);

router.delete(
  '/members/:memberId',
  auth([UserRole.ADMIN], [UserPermission.MANAGE_SOCIETIES]),
  SocietyController.removeMember
);

export const SocietyRoutes = router;
