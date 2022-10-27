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
  const challenge: string = params['hub.challenge'];

  ctx.response.body = challenge;
  ctx.response.status = 200;
}

const handleIncoming = async (ctx: Context) => {
  const body = await ctx.request.body().value;
  console.log(body);
  ctx.response.status = 200;
}

const router = new Router();
router
  .get('/', getVehicle)
  .get('webhook', handleWebHook)
  .post('webhook', handleIncoming)

export default router;