import { Router } from 'express';
import userAuthMiddleware from '../middleware/auth.middleware.js';

import { getProgress, addProgress } from '../controller/progress.controller.js';

const progressRouter = Router();


progressRouter.get('/', userAuthMiddleware, getProgress);
progressRouter.post('/', userAuthMiddleware, addProgress);

export default progressRouter;