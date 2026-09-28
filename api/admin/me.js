import { ApiProblem, functionHandler, requireOwner, sendJson } from '../../supabase-server.mjs';

export default functionHandler(async (req, res) => {
  if (req.method !== 'GET') throw new ApiProblem('Method not allowed.', 405);
  const owner = await requireOwner(req, res);
  sendJson(res, 200, { csrf: owner.csrf, pushKey: '', mode: 'disabled' });
});
