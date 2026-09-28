import { ApiProblem, clearSessionCookies, functionHandler, requireOwner, sendJson, supabase } from '../../supabase-server.mjs';

export default functionHandler(async (req, res) => {
  if (req.method !== 'POST') throw new ApiProblem('Method not allowed.', 405);
  const { accessToken } = await requireOwner(req, res, { mutation: true });
  try {
    await supabase('/auth/v1/logout', { method: 'POST', accessToken, body: {} });
  } finally {
    clearSessionCookies(res);
  }
  sendJson(res, 200, { ok: true });
});
