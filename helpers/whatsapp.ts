import PQueue from "https://deno.land/x/p_queue@1.0.1/mod.ts"
import { Context, helpers } from 'https://deno.land/x/oak/mod.ts';

import { getMessage } from './fines.ts';

const queue = new PQueue({
  concurrency: 4,
});

const WHATSAPP_TOKEN = Deno.env.get('WHATSAPP_TOKEN');
const WHATSAPP_VERIFY_TOKEN = Deno.env.get('WHATSAPP_VERIFY_TOKEN');

export const handleWebHook = async (ctx: Context) => {
  const params = helpers.getQuery(ctx, { mergeParams: true });
  const challenge: string = params['hub.challenge'];

  if (WHATSAPP_VERIFY_TOKEN !== params['hub.verify_token']) {
    ctx.response.status = 403;
    return;
  }

  ctx.response.body = challenge;
  ctx.response.status = 200;
}

export const handleIncoming = async (ctx: Context) => {
  const body = await ctx.request.body().value;
  const value = body.entry[0].changes[0].value;

  if (!value.messages || !value.contacts) {
    ctx.response.status = 200;
    return;
  }

  const phone_number_id = value.metadata.phone_number_id;
  const name = value.contacts[0].profile.name;
  const from = value.messages[0].from;
  const msg_body = value.messages[0].text.body;

  queue.add(async () => {
    const url = `https://graph.facebook.com/v12.0/${phone_number_id}/messages?access_token=${WHATSAPP_TOKEN}`;

    const msg = await getMessage(msg_body);
    const data = {
      messaging_product: 'whatsapp',
      to: from,
      text: {
        body: `Hello, ${name}, ${msg}.`,
      },
    };

    await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      },
    });
  })

  ctx.response.status = 200;
}
