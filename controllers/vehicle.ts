import { Context, helpers } from 'https://deno.land/x/oak/mod.ts';
import { Router } from 'https://deno.land/x/oak/mod.ts';
import puppeteer from "https://deno.land/x/puppeteer@14.1.1/mod.ts";

import { handleSuccess } from '../helpers/request.ts';

const WHATSAPP_TOKEN = Deno.env.get('WHATSAPP_TOKEN');
const WHATSAPP_VERIFY_TOKEN = Deno.env.get('WHATSAPP_VERIFY_TOKEN');
const BROWSERLESS_TOKEN = Deno.env.get('BROWSERLESS_TOKEN');

const getFines = async (plateNum: string) => {
  const browser = await puppeteer.connect({
    browserWSEndpoint: `wss://chrome.browserless.io?token=${BROWSERLESS_TOKEN}`
  });

  const page = await browser.newPage();
  await page.goto('https://tms.tpf.go.tz/');
  await page.type('input[name="vehicle"]', plateNum);
  await page.click('input[type="submit"]');
  await page.waitForNetworkIdle();

  const result = await page.$$eval<string[][]>('table tr', (rows) => {
    return Array.from(rows).map((row: any) => {
      const header = row.querySelectorAll('th');
      const columns = header.length > 0 ? header : row.querySelectorAll('td');
      return Array.from(columns).map((column: any) => column.textContent);
    });
  });
  await browser.close();
  const values = JSON.parse(JSON.stringify(result))[1];

  if (values.length < 2) {
    return values[0];
  }

  return `The car ${values[3]} has a fine of Tsh. ${values[7]} and penalty of Tsh. ${values[8]} bringing the total to ${values[9]}. The offence was "${values[6]}, which took place at ${values[5]} on the date ${values[1]}"`;
}

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

const getMessage = async (msg: string): Promise<string> => {
  const plateNumber = msg.match(/T\d{3}[a-zA-Z]{3}/);
  if (!plateNumber || plateNumber.length < 1) {
    return 'please enter valid plate number example: T123AAA';
  }

  return await getFines(plateNumber[0]);
}

const handleIncoming = async (ctx: Context) => {
  const body = await ctx.request.body().value;
  try {
    const value = body.entry[0].changes[0].value;

    const phone_number_id = value.metadata.phone_number_id;
    const name = value.contacts[0].profile.name;
    const from = value.messages[0].from;
    const msg_body = value.messages[0].text.body;

    const msg = await getMessage(msg_body);

    const url = `https://graph.facebook.com/v12.0/${phone_number_id}/messages?access_token=${WHATSAPP_TOKEN}`;
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
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.log(JSON.stringify(error));
  }

  ctx.response.status = 200;
}

const router = new Router();
router
  .get('/', getVehicle)
  .get('webhook', handleWebHook)
  .post('webhook', handleIncoming)

export default router;