import AsyncStorage from '@react-native-async-storage/async-storage';
import { SAMPLE_CARDS } from '../constants/theme';

const KEY = 'cardvault_cards';

export async function loadCards() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
    // Premier lancement : collection vide
    return [];
  } catch {
    return [];
  }
}

export async function saveCards(cards) {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(cards));
  } catch (e) {
    console.error('Erreur de sauvegarde:', e);
  }
}

export async function addCard(cards, newCard) {
  const updated = [...cards, { ...newCard, id: Date.now() }];
  await saveCards(updated);
  return updated;
}

export async function deleteCard(cards, id) {
  const updated = cards.filter((c) => c.id !== id);
  await saveCards(updated);
  return updated;
}
