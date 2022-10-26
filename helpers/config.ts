import * as flags from 'https://deno.land/std/flags/mod.ts';

const envPort = flags.parse(Deno.args).port;

export const DEFAULT_PORT = envPort ? Number(envPort) : 3100;
