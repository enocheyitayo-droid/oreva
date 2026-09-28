import { ApiProblem, functionHandler, mediaPath, parseBody, requireOwner, sendJson, supabase } from '../../supabase-server.mjs';

function text(value, name, max, optional = false) {
  if (typeof value !== 'string' || (!optional && !value.trim()) || value.length > max) throw new ApiProblem(`Invalid ${name}.`);
  return value.trim();
}

export default functionHandler(async (req, res) => {
  if (req.method !== 'POST') throw new ApiProblem('Method not allowed.', 405);
  const { accessToken } = await requireOwner(req, res, { mutation: true });
  const input = parseBody(req);
  const email = input.ownerEmail ? text(input.ownerEmail, 'owner email', 254, true).toLowerCase() : '';
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new ApiProblem('Enter a valid owner email.');
  const whatsapp = text(input.whatsapp || '', 'WhatsApp number', 20, true);
  if (whatsapp && !/^234[789]\d{9}$/.test(whatsapp)) throw new ApiProblem('Use 234 followed by 10 digits for WhatsApp.');
  if (!Array.isArray(input.deliveryAreas) || input.deliveryAreas.length > 30) throw new ApiProblem('Invalid delivery areas.');
  const ids = new Set();
  const deliveryAreas = input.deliveryAreas.map(area => {
    const id = text(area.id, 'delivery area ID', 80);
    if (id === 'pickup' || ids.has(id)) throw new ApiProblem('Delivery area IDs must be unique.');
    ids.add(id);
    if (!Number.isSafeInteger(area.fee) || area.fee < 0 || area.fee > 10000000) throw new ApiProblem('Invalid delivery fee.');
    return { id, name: text(area.name, 'delivery area name', 120), fee: area.fee, timeframe: text(area.timeframe, 'delivery timeframe', 160) };
  });
  if (!Number.isInteger(input.lowStock) || input.lowStock < 0 || input.lowStock > 100) throw new ApiProblem('Invalid low-stock threshold.');
  const settings = {
    brand: text(input.brand, 'store name', 80),
    logo: mediaPath(input.logo),
    tagline: text(input.tagline, 'tagline', 180),
    ownerEmail: email,
    whatsapp,
    pickupInstructions: text(input.pickupInstructions, 'pickup instructions', 1000),
    pickupTime: text(input.pickupTime, 'pickup timeframe', 160),
    lowStock: input.lowStock,
    emailEnabled: input.emailEnabled === true,
    deliveryAreas,
    bagDisplay: mediaPath(input.bagDisplay),
    shoeDisplay: mediaPath(input.shoeDisplay),
    displayGallery: Array.isArray(input.displayGallery) ? [...new Set(input.displayGallery.map(mediaPath).filter(Boolean))].slice(0, 8) : [],
  };
  const saved = await supabase('/rest/v1/rpc/bagz_save_settings', { method: 'POST', accessToken, body: { settings } });
  sendJson(res, 200, saved);
});
