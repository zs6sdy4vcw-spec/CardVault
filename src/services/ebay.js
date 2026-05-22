import { Buffer } from 'buffer';

const CLIENT_ID     = process.env.EXPO_PUBLIC_EBAY_CLIENT_ID;
const CLIENT_SECRET = process.env.EXPO_PUBLIC_EBAY_CLIENT_SECRET;
const IS_SANDBOX    = process.env.EXPO_PUBLIC_EBAY_SANDBOX === 'true';

const SPORTS_CARDS_CATEGORY = '261328';
const BASE_URL = IS_SANDBOX
  ? 'https://api.sandbox.ebay.com'
  : 'https://api.ebay.com';

let _cachedToken    = null;
let _tokenExpiresAt = 0;

function toBase64(str) {
  return Buffer.from(str, 'utf8').toString('base64');
}

export async function getEbayToken() {
  if (_cachedToken && Date.now() < _tokenExpiresAt) return _cachedToken;
  if (!CLIENT_ID || !CLIENT_SECRET) throw new Error('Clés eBay manquantes dans .env');

  const credentials = toBase64(`${CLIENT_ID}:${CLIENT_SECRET}`);
  console.log(`eBay OAuth [${IS_SANDBOX ? 'SANDBOX' : 'PROD'}] — tentative...`);

  const res = await fetch(`${BASE_URL}/identity/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${credentials}`,
    },
    body: 'grant_type=client_credentials&scope=https%3A%2F%2Fapi.ebay.com%2Foauth%2Fapi_scope',
  });

  const data = await res.json();
  console.log('eBay OAuth status:', res.status, data.error_description || data.error || 'OK');

  if (!res.ok) throw new Error(`eBay auth failed: ${res.status} — ${data.error_description || data.error}`);

  _cachedToken    = data.access_token;
  _tokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000;
  console.log('eBay token OK ✅');
  return _cachedToken;
}

export async function searchActiveListings(player, set, condition, sport) {
  const token = await getEbayToken();

  const sportKeyword = {
    NHL: 'hockey card', NFL: 'football card',
    NBA: 'basketball card', MLB: 'baseball card',
  }[sport] || 'sports card';

  const q   = encodeURIComponent(`${player} ${set} ${condition} ${sportKeyword}`);
  const url = `${BASE_URL}/buy/browse/v1/item_summary/search`
    + `?q=${q}`
    + `&limit=10&sort=price`

  console.log('eBay Browse — recherche:', player, set);

  const res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
      'X-EBAY-C-ENDUSERCTX': 'contextualLocation=country%3DCA',
    },
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('Browse error:', res.status, err.substring(0, 200));
    throw new Error(`Browse API error: ${res.status}`);
  }

  const data  = await res.json();
  const items = data.itemSummaries || [];
  console.log('eBay Browse résultats:', items.length);

  return items.map(item => ({
    title:     item.title,
    price:     parseFloat(item.price?.value || 0),
    currency:  item.price?.currency || 'CAD',
    condition: item.condition || '—',
    seller:    item.seller?.username || '—',
    url:       item.itemWebUrl,
    image:     item.thumbnailImages?.[0]?.imageUrl || item.image?.imageUrl || null,
  }));
}

export function computeStats(listings, cadUsdRate = 0.74) {
  if (!listings.length) return { avg: 0, low: 0, high: 0, count: 0 };
  const cadPrices = listings.map(l =>
    l.currency === 'USD' ? l.price / cadUsdRate : l.price
  );
  return {
    avg:   cadPrices.reduce((s, p) => s + p, 0) / cadPrices.length,
    low:   Math.min(...cadPrices),
    high:  Math.max(...cadPrices),
    count: listings.length,
  };
}

export function buildEbaySoldUrl(player, set, condition) {
  const q = encodeURIComponent(`${player} ${set} ${condition}`);
  return `https://www.ebay.ca/sch/i.html?_nkw=${q}&_sacat=${SPORTS_CARDS_CATEGORY}&LH_Sold=1&LH_Complete=1&_sop=13`;
}

export function build130PointUrl(player, set) {
  return `https://www.130point.com/sales/?q=${encodeURIComponent(`${player} ${set}`)}`;
}

export function buildEbayActiveUrl(player, set, condition) {
  return `https://www.ebay.ca/sch/i.html?_nkw=${encodeURIComponent(`${player} ${set} ${condition}`)}&_sacat=${SPORTS_CARDS_CATEGORY}&_sop=15`;
}

export function buildEbaySellUrl(player, set) {
  return `https://www.ebay.ca/sell/sellflow?query=${encodeURIComponent(`${player} ${set}`)}`;
}
