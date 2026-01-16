import express from 'express';
import { AuthRoutes } from '@/modules/auth/auth.routes';
import { ContentRoutes } from '@/modules/content/content.routes';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/content',
    route: ContentRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
