// importing the oak from the url.
import { Application } from 'https://deno.land/x/oak/mod.ts';

import router from './router.ts';
import { PORT } from './helpers/config.ts';

const app = new Application();

// Starting the server
app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener('error', (evt) => {
  evt.preventDefault();
  console.log(`Caught error: ${evt.error?.message}`)
});

app.addEventListener('listen', ({ hostname, port, secure }) => {
  console.log(
    `Listening on: ${secure ? 'https://' : 'http://'}${hostname ?? 'localhost'}:${port}`,
  );
});

await app.listen({ port: PORT });
