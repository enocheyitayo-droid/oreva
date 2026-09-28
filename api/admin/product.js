import { ApiProblem, functionHandler, mediaPath, parseBody, requireOwner, sendJson, supabase } from '../../supabase-server.mjs';

export default functionHandler(async (req, res) => {
  if (req.method !== 'POST') throw new ApiProblem('Method not allowed.', 405);
  const { accessToken } = await requireOwner(req, res, { mutation: true });
  const data = parseBody(req);
  if (!Array.isArray(data.variants) || data.variants.length < 1 || data.variants.length > 60) {
    throw new ApiProblem('Add between 1 and 60 product options.');
  }
  const item = {
    ...(typeof data.id === 'string' && data.id ? { id: data.id } : {}),
    name: data.name,
    description: data.description,
    category: data.category,
    visible: data.visible === true,
    material: data.material || '',
    care: data.care || '',
    photos: [...new Set([data.photo, ...(Array.isArray(data.photos) ? data.photos : [])].filter(Boolean).map(mediaPath))].slice(0, 8),
    variants: data.variants.map(variant => ({
      ...(typeof variant.id === 'string' && variant.id ? { id: variant.id } : {}),
      colour: variant.colour,
      size: data.category === 'Bags' ? 'One size' : variant.size,
      price: variant.price,
      cost: variant.cost,
      stock: variant.stock,
    })),
  };
  const id = await supabase('/rest/v1/rpc/bagz_save_product', {
    method: 'POST', accessToken, body: { item },
  });
  sendJson(res, 200, { id });
});
