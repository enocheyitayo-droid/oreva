import { ApiProblem, functionHandler, parseBody, requireOwner, sendJson, supabase } from '../../supabase-server.mjs';

export default functionHandler(async (req, res) => {
  if (req.method !== 'POST') throw new ApiProblem('Method not allowed.', 405);
  const { accessToken } = await requireOwner(req, res, { mutation: true });
  const { id } = parseBody(req);
  if (typeof id !== 'string' || !id) throw new ApiProblem('Choose a product to archive.');
  await supabase('/rest/v1/rpc/bagz_delete_product', {
    method: 'POST', accessToken, body: { product: id },
  });
  sendJson(res, 200, { ok: true });
});
