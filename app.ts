// importing the oak from the url.
import { Application } from 'https://deno.land/x/oak/mod.ts';

import router from './router.ts';
import { DEFAULT_PORT } from './helpers/config.ts';

const app = new Application();
const PORT: number = DEFAULT_PORT;

// Starting the server
app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener('listen', ({ hostname, port, secure }) => {
  console.log(
    `Listening on: ${secure ? 'https://' : 'http://'}${hostname ?? 'localhost'}:${port}`,
  );
});

await app.listen({ port: PORT });
