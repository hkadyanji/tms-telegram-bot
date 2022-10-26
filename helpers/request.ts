import { Context } from 'https://deno.land/x/oak/mod.ts';

export const handleSuccess = async (ctx: Context, data: any) => {
  ctx.response.body = {
    success: true,
    data,
  };
  ctx.response.status = 200;
};

export const handleError = async (ctx: Context, status?: number, message?: string) => {
  ctx.response.body = {
    success: false,
    error: message || null,
    data: null,
  };

  ctx.response.status = status || 400;
  console.log(message);
}
