import AsyncStorage from '@react-native-async-storage/async-storage';

const CARDS_KEY = '@cardvault_cards';
const SALES_KEY = '@cardvault_sales';

// ── Cards ─────────────────────────────────────────────────────────────────────
export async function loadCards() {
  try {
    const raw = await AsyncStorage.getItem(CARDS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export async function saveCards(cards) {
  try { await AsyncStorage.setItem(CARDS_KEY, JSON.stringify(cards)); } catch {}
}

export async function addCard(cards, card) {
  const newCard = { ...card, id: Date.now() };
  const updated = [...cards, newCard];
  await saveCards(updated);
  return updated;
}

export async function deleteCard(cards, id) {
  const updated = cards.filter(c => c.id !== id);
  await saveCards(updated);
  return updated;
}

export async function updateCard(cards, updatedCard) {
  const updated = cards.map(c => c.id === updatedCard.id ? updatedCard : c);
  await saveCards(updated);
  return updated;
}

// ── Sales ─────────────────────────────────────────────────────────────────────
export async function loadSales() {
  try {
    const raw = await AsyncStorage.getItem(SALES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export async function saveSales(sales) {
  try { await AsyncStorage.setItem(SALES_KEY, JSON.stringify(sales)); } catch {}
}

export async function recordSale(sale) {
  const sales = await loadSales();
  const newSale = {
    id:          Date.now(),
    cardId:      sale.cardId,
    player:      sale.player,
    set:         sale.set,
    condition:   sale.condition,
    sport:       sale.sport,
    valueCad:    sale.valueCad,    // valeur estimée au moment de la vente
    salePriceCad: sale.salePriceCad, // prix de vente réel
    profit:      sale.salePriceCad - sale.valueCad,
    date:        sale.date || new Date().toISOString(),
    teamPrimary: sale.teamPrimary,
  };
  const updated = [newSale, ...sales];
  await saveSales(updated);
  return updated;
}

export async function deleteSale(id) {
  const sales = await loadSales();
  const updated = sales.filter(s => s.id !== id);
  await saveSales(updated);
  return updated;
}

// ── Stats helpers ─────────────────────────────────────────────────────────────
export function groupSalesByPeriod(sales) {
  const now   = new Date();
  const today = now.toISOString().split('T')[0];
  const month = today.slice(0, 7);
  const year  = today.slice(0, 4);

  const byDay   = {};
  const byMonth = {};
  const byYear  = {};

  sales.forEach(s => {
    const d = s.date.split('T')[0];
    const m = d.slice(0, 7);
    const y = d.slice(0, 4);
    byDay[d]   = (byDay[d]   || 0) + s.salePriceCad;
    byMonth[m] = (byMonth[m] || 0) + s.salePriceCad;
    byYear[y]  = (byYear[y]  || 0) + s.salePriceCad;
  });

  return { byDay, byMonth, byYear, today, month, year };
}
