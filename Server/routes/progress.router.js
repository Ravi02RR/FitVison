import { Router } from 'express';

import { getProgress, addProgress } from '../controller/progress.controller.js';

const progressRouter = Router();


progressRouter.get('/', getProgress);
progressRouter.post('/', addProgress);


export default progressRouter;