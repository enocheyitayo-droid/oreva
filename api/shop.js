const json = (res, status, value) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.end(JSON.stringify(value));
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return json(res, 405, { error: 'Method not allowed' });
  }

  const endpoint = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  if (!endpoint || !anonKey) {
    return json(res, 503, { error: 'Store data is not configured. Add the Supabase URL and anon key to Vercel.' });
  }

  let origin;
  try {
    origin = new URL(endpoint);
  } catch {
    return json(res, 500, { error: 'Supabase URL is invalid.' });
  }
  if (origin.protocol !== 'https:' || origin.username || origin.password || origin.pathname !== '/') {
    return json(res, 500, { error: 'Supabase URL must be a plain HTTPS origin.' });
  }

  try {
    const response = await fetch(new URL('/rest/v1/rpc/bagz_catalogue', origin), {
      method: 'POST',
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        'Content-Type': 'application/json',
      },
      body: '{}',
      signal: AbortSignal.timeout(10000),
    });
    const body = await response.text();
    let data;
    try {
      data = JSON.parse(body);
    } catch {
      return json(res, 502, { error: 'Supabase returned an invalid catalogue response.' });
    }
    if (!response.ok) {
      return json(res, 502, { error: 'Could not load the store catalogue.' });
    }
    if (!data || typeof data !== 'object' || !data.settings || !Array.isArray(data.products)) {
      return json(res, 502, { error: 'Supabase returned an incomplete catalogue.' });
    }
    return json(res, 200, data);
  } catch {
    return json(res, 502, { error: 'Could not reach the store database.' });
  }
}