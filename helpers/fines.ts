import puppeteer from "https://deno.land/x/puppeteer@14.1.1/mod.ts";

const getFines = async (plateNum: string) => {
  const BROWSER_CLOUD_KEY = Deno.env.get('BROWSER_CLOUD_KEY');

  const browser = await puppeteer.connect({
    browserWSEndpoint: `wss://chrome.browsercloud.io?token=${BROWSER_CLOUD_KEY}`
  });

  const page = await browser.newPage();
  await page.goto('https://tms.tpf.go.tz/');
  await page.type('input[name="searchable"]', plateNum);
  await page.click('button.search-form');

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

  if (!values) {
    return `The car ${plateNum} has no fine.`;
  }

  return `The car ${values[2]} has a fine of Tsh. ${values[6]} and penalty of Tsh. ${values[7]} bringing the total to ${values[8]}. The offence was "${values[5]}, which took place at ${values[4]} on the date ${values[1]}"`;
}

export const getMessage = async (msg: string): Promise<string> => {
  const plateNumber = msg.match(/[tT]\d{3}[a-zA-Z]{3}/);
  if (!plateNumber || plateNumber.length < 1) {
    return 'please enter valid plate number example: T123AAA';
  }

  return await getFines(plateNumber[0]);
}
