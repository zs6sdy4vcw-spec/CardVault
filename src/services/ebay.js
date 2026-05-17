// ─────────────────────────────────────────────────────────────────────────────
// eBay Service — Card Vault
// • Browse API  : annonces actives en temps réel (prix demandés)
// • Deeplinks   : eBay Sold + 130point.com pour les last sold
// ─────────────────────────────────────────────────────────────────────────────

const CLIENT_ID     = process.env.EXPO_PUBLIC_EBAY_CLIENT_ID;
const CLIENT_SECRET = process.env.EXPO_PUBLIC_EBAY_CLIENT_SECRET;

// Catégorie eBay pour cartes sportives (Sports Mem, Cards & Fan Shop > Cards)
const SPORTS_CARDS_CATEGORY = '261328';

// Token cache en mémoire (valide 2h)
let _cachedToken     = null;
let _tokenExpiresAt  = 0;

// ── OAuth : Client Credentials (token public, sans login utilisateur) ─────────
export async function getEbayToken() {
  if (_cachedToken && Date.now() < _tokenExpiresAt) return _cachedToken;

  const credentials = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);

  const res = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${credentials}`,
    },
    body: 'grant_type=client_credentials&scope=https%3A%2F%2Fapi.ebay.com%2Foauth%2Fapi_scope',
  });

  if (!res.ok) throw new Error(`eBay auth failed: ${res.status}`);

  const data = await res.json();
  _cachedToken    = data.access_token;
  _tokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000; // 60s de marge
  return _cachedToken;
}

// ── Browse API : annonces actives ─────────────────────────────────────────────
export async function searchActiveListings(player, set, condition, sport) {
  const token = await getEbayToken();

  // Construire la requête — on cible les cartes sportives
  const sportKeyword = sport === 'NHL' ? 'hockey card' : 'football card';
  const q = encodeURIComponent(`${player} ${set} ${condition} ${sportKeyword}`);
  const url = `https://api.ebay.com/buy/browse/v1/item_summary/search`
    + `?q=${q}`
    + `&category_ids=${SPORTS_CARDS_CATEGORY}`
    + `&limit=10`
    + `&sort=price`
    + `&filter=buyingOptions%3A%7BFIXED_PRICE%7D`; // Buy It Now seulement

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      'X-EBAY-C-MARKETPLACE-ID': 'EBAY_CA', // eBay.ca en priorité
      'X-EBAY-C-ENDUSERCTX': 'contextualLocation=country%3DCA',
    },
  });

  if (!res.ok) throw new Error(`Browse API error: ${res.status}`);

  const data = await res.json();
  const items = data.itemSummaries || [];

  return items.map((item) => ({
    title:       item.title,
    price:       parseFloat(item.price?.value || 0),
    currency:    item.price?.currency || 'CAD',
    condition:   item.condition || '—',
    seller:      item.seller?.username || '—',
    url:         item.itemWebUrl,
    image:       item.thumbnailImages?.[0]?.imageUrl || item.image?.imageUrl || null,
    listingType: 'Actif',
  }));
}

// ── Calcul stats à partir des annonces actives ────────────────────────────────
export function computeStats(listings, cadUsdRate = 0.74) {
  if (!listings.length) return { avg: 0, low: 0, high: 0, count: 0 };

  const cadPrices = listings.map((l) =>
    l.currency === 'USD' ? l.price / cadUsdRate : l.price
  );

  const avg  = cadPrices.reduce((s, p) => s + p, 0) / cadPrices.length;
  const low  = Math.min(...cadPrices);
  const high = Math.max(...cadPrices);

  return { avg, low, high, count: listings.length };
}

// ── Deeplinks : eBay Sold (90 derniers jours) ─────────────────────────────────
export function buildEbaySoldUrl(player, set, condition) {
  // LH_Sold=1 & LH_Complete=1 = ventes complétées uniquement
  const q = encodeURIComponent(`${player} ${set} ${condition}`);
  return `https://www.ebay.ca/sch/i.html?_nkw=${q}&_sacat=${SPORTS_CARDS_CATEGORY}&LH_Sold=1&LH_Complete=1&_sop=13`;
}

// ── Deeplink : 130point.com (spécialisé cartes, "Best Offer Accepted" inclus) ─
export function build130PointUrl(player, set) {
  const q = encodeURIComponent(`${player} ${set}`);
  return `https://www.130point.com/sales/?q=${q}`;
}

// ── Deeplink : eBay annonces actives ─────────────────────────────────────────
export function buildEbayActiveUrl(player, set, condition) {
  const q = encodeURIComponent(`${player} ${set} ${condition}`);
  return `https://www.ebay.ca/sch/i.html?_nkw=${q}&_sacat=${SPORTS_CARDS_CATEGORY}&_sop=15`;
}

// ── Deeplink : Vendre sur eBay ────────────────────────────────────────────────
export function buildEbaySellUrl(player, set) {
  const q = encodeURIComponent(`${player} ${set}`);
  return `https://www.ebay.ca/sell/sellflow?query=${q}`;
}
