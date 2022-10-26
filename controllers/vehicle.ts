import { Context, helpers } from 'https://deno.land/x/oak/mod.ts';
import { Router } from 'https://deno.land/x/oak/mod.ts';

import { handleSuccess } from '../helpers/request.ts';

const getVehicle = async (ctx: Context) => {
  const params = helpers.getQuery(ctx, { mergeParams: true });
  const id: string = params?.id;

  handleSuccess(ctx, { value: id });
}

const handleWebHook = async (ctx: Context) => {
  const params = helpers.getQuery(ctx, { mergeParams: true });
  const id: string = params?.id;

  handleSuccess(ctx, { value: 'callback' });
}

const router = new Router();
router
  .get('/', getVehicle)
  .get('callback', handleWebHook)

export default router;