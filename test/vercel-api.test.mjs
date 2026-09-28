import test from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/[...path].mjs';

function response() {
  return {
    headers: {},
    setHeader(name, value) { this.headers[name] = value; },
    end(body) { this.body = body; },
  };
}

test('Vercel catalogue endpoint reads the public Supabase RPC', async () => {
  const previous = { url: process.env.SUPABASE_URL, key: process.env.SUPABASE_ANON_KEY, fetch: globalThis.fetch };
  process.env.SUPABASE_URL = 'https://project.supabase.co';
  process.env.SUPABASE_ANON_KEY = 'public-test-key';
  let request;
  globalThis.fetch = async (url, options) => {
    request = { url: String(url), options };
    return new Response(JSON.stringify({ settings: { brand: 'Orẽva' }, products: [], mode: 'disabled' }), { status: 200 });
  };
  try {
    const res = response();
    await handler({ method: 'GET', url: '/api/shop' }, res);
    assert.equal(res.statusCode, 200);
    assert.equal(request.url, 'https://project.supabase.co/rest/v1/rpc/bagz_catalogue');
    assert.equal(request.options.headers.apikey, 'public-test-key');
    assert.deepEqual(JSON.parse(res.body), { settings: { brand: 'Orẽva' }, products: [], mode: 'disabled' });
  } finally {
    globalThis.fetch = previous.fetch;
    if (previous.url === undefined) delete process.env.SUPABASE_URL;
    else process.env.SUPABASE_URL = previous.url;
    if (previous.key === undefined) delete process.env.SUPABASE_ANON_KEY;
    else process.env.SUPABASE_ANON_KEY = previous.key;
  }
});

test('Vercel catalogue endpoint returns JSON when Supabase is not configured', async () => {
  const previous = { url: process.env.SUPABASE_URL, key: process.env.SUPABASE_ANON_KEY };
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_ANON_KEY;
  try {
    const res = response();
    await handler({ method: 'GET', url: '/api/shop' }, res);
    assert.equal(res.statusCode, 503);
    assert.match(res.headers['Content-Type'], /application\/json/);
    assert.match(JSON.parse(res.body).error, /not configured/i);
  } finally {
    if (previous.url === undefined) delete process.env.SUPABASE_URL;
    else process.env.SUPABASE_URL = previous.url;
    if (previous.key === undefined) delete process.env.SUPABASE_ANON_KEY;
    else process.env.SUPABASE_ANON_KEY = previous.key;
  }
});