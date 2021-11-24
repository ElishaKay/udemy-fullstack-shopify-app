import { setCookie } from 'nookies';
import { addShopifyUser } from '../../../server/shopify-server'
import { internalError, runApi } from '../../../server/api-helpers'
import { redirect } from '../../../utils/req'
import { log, tryStringify } from '../../../utils/error'

const GET = async (req, res) => {
  console.log('ran install-granted GET function');
  const { token, shopUrl } = await addShopifyUser(req.query);
  console.log('token: ',token);
  console.log('shopUrl: ',shopUrl);
  if (!token || !shopUrl) {
    return internalError(res);
  }

  const cookie = tryStringify({ token, shopUrl });
  setCookie({ res }, 'user', cookie, {
    path: '/',
    domain: process.env.FOR_SERVER_CODE_COOKIE_DOMAIN
  });

  await log('set cookie', { headers: res.getHeaders() });
  redirect(res, 303, '/app/shopify-welcome');
}

export default async (req, res) => {
  await runApi(req, res, { GET });
}