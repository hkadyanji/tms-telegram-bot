import { Router } from 'https://deno.land/x/oak/mod.ts';

import vehicleRouter from './controllers/vehicle.ts';

const router = new Router();
router
  .use(
    '/api/v1/',
    vehicleRouter.routes(),
    vehicleRouter.allowedMethods(),
  )

export default router;
