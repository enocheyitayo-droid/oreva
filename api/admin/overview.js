import { ApiProblem, functionHandler, mediaUrl, requireOwner, sendJson, supabase } from '../../supabase-server.mjs';

const defaults = {
  brand: 'Orẽva', logo: '/oreva-logo.jpg', tagline: 'Timeless elegance.', ownerEmail: '', whatsapp: '',
  pickupInstructions: 'Pickup instructions will be shared by the owner.', pickupTime: '1–2 working days after payment',
  deliveryAreas: [], lowStock: 3, emailEnabled: false, pushEnabled: false, bagDisplay: '', shoeDisplay: '',
};

export default functionHandler(async (req, res) => {
  if (req.method !== 'GET') throw new ApiProblem('Method not allowed.', 405);
  const { accessToken } = await requireOwner(req, res);
  const [products, variants, settingsRows] = await Promise.all([
    supabase('/rest/v1/bagz_products?select=id,name,description,category,visible,material,care,photos,created_at&archived=eq.false&order=created_at.desc', { accessToken }),
    supabase('/rest/v1/bagz_variants?select=id,product_id,colour,size,price,cost,stock,reserved', { accessToken }),
    supabase('/rest/v1/bagz_settings?select=value&id=eq.true', { accessToken }),
  ]);
  if (!Array.isArray(products) || !Array.isArray(variants)) throw new ApiProblem('Supabase returned invalid product data.', 502);
  const byProduct = new Map();
  for (const variant of variants) {
    const list = byProduct.get(variant.product_id) || [];
    list.push({ ...variant, available: variant.stock - variant.reserved });
    byProduct.set(variant.product_id, list);
  }
  const mapped = products.map(product => ({
    ...product,
    photo: mediaUrl(product.photos?.[0] || ''),
    photos: (product.photos || []).map(mediaUrl),
    sample: false,
    variants: (byProduct.get(product.id) || []).map(variant => ({
      ...variant,
      size: product.category === 'Bags' ? '' : variant.size,
    })),
  }));
  const rawSettings = { ...defaults, ...(settingsRows?.[0]?.value || {}) };
  const settings = {
    ...rawSettings,
    logo: mediaUrl(rawSettings.logo),
    bagDisplay: mediaUrl(rawSettings.bagDisplay),
    shoeDisplay: mediaUrl(rawSettings.shoeDisplay),
    displayGallery: (rawSettings.displayGallery || []).map(mediaUrl),
  };
  sendJson(res, 200, {
    products: mapped,
    settings,
    orders: [], notifications: [], expenses: [], refunds: [],
    report: { gross: 0, refunds: 0, revenue: 0, cost: 0, expenses: 0, estimatedProfit: 0, outstanding: 0 },
  });
});
