import { Context, helpers } from 'https://deno.land/x/oak/mod.ts';
import { Router } from 'https://deno.land/x/oak/mod.ts';

import { handleSuccess } from '../helpers/request.ts';

const WHATSAPP_TOKEN = Deno.env.get('WHATSAPP_TOKEN');
const WHATSAPP_VERIFY_TOKEN = Deno.env.get('WHATSAPP_VERIFY_TOKEN');

const getVehicle = async (ctx: Context) => {
  const params = helpers.getQuery(ctx, { mergeParams: true });
  const id: string = params?.id;

  handleSuccess(ctx, { value: id });
}

const handleWebHook = async (ctx: Context) => {
  const params = helpers.getQuery(ctx, { mergeParams: true });
  const challenge: string = params['hub.challenge'];

  if (WHATSAPP_VERIFY_TOKEN !== params['hub.verify_token']) {
    ctx.response.status = 403;
    return;
  }

  ctx.response.body = challenge;
  ctx.response.status = 200;
}

const handleIncoming = async (ctx: Context) => {
  const body = await ctx.request.body().value;
  const value = body.entry[0].changes[0].value;
  console.log(JSON.stringify(value));

  const phone_number_id = value.metadata.phone_number_id;
  const name = value.contacts[0].profile.name;
  const from = value.messages[0].from;
  const msg_body = value.messages[0].text.body;

  const url = `https://graph.facebook.com/v12.0/${phone_number_id}/messages?access_token=${WHATSAPP_TOKEN}`;
  const data = {
    messaging_product: 'whatsapp',
    to: from,
    text: {
      body: `Hi, ${name}, your car ${msg_body} has no outstanding fines.`,
    },
  };

  await fetch(url, {
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  });
  ctx.response.status = 200;
}

const router = new Router();
router
  .get('/', getVehicle)
  .get('webhook', handleWebHook)
  .post('webhook', handleIncoming)

export default router;