import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image, Alert, Modal,
  TextInput, useWindowDimensions,
} from 'react-native';
import { useTheme, formatCAD, formatUSD, CAD_USD_RATE } from '../context/ThemeContext';
import { SPORT_COLORS, SPORT_EMOJIS } from '../constants/theme';
import { recordSale, saveCards, loadCards } from '../services/storage';

export default function CardItem({ card, onPress, onDelete, onEdit, onSold, cards }) {
  const { colors } = useTheme();
  const { width }  = useWindowDimensions();

  const [sellModal, setSellModal]   = useState(false);
  const [sellPrice, setSellPrice]   = useState(String(card.valueCad));

  const stripeColor = card.teamPrimary  || SPORT_COLORS[card.sport] || colors.accent;
  const secColor    = card.teamSecondary || stripeColor;
  const sportEmoji  = SPORT_EMOJIS[card.sport] || '🃏';

  const handleSell = async () => {
    const price = parseFloat(sellPrice);
    if (!price || price <= 0) { Alert.alert('Prix invalide'); return; }
    await recordSale({
      cardId:       card.id,
      player:       card.player,
      set:          card.set,
      condition:    card.condition,
      sport:        card.sport,
      valueCad:     card.valueCad,
      salePriceCad: price,
      teamPrimary:  card.teamPrimary,
      date:         new Date().toISOString(),
    });
    setSellModal(false);
    if (onSold) onSold(card);
    Alert.alert('✅ Vente enregistrée!', `${card.player} vendu pour ${formatCAD(price)}`);
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={onPress}
        activeOpacity={0.75}
      >
        {/* Stripe bicolore */}
        <View style={styles.stripeContainer}>
          <View style={[styles.stripePrimary, { backgroundColor: stripeColor }]} />
          {card.teamSecondary && (
            <View style={[styles.stripeSecondary, { backgroundColor: secColor }]} />
          )}
        </View>

        {/* Header — badge sport + actions rapides */}
        <View style={styles.header}>
          <View style={[styles.badge, { backgroundColor: stripeColor + '22', borderColor: stripeColor + '55' }]}>
            <Text style={[styles.badgeTxt, { color: stripeColor }]}>{sportEmoji} {card.sport}</Text>
          </View>
          {card.quantity > 1 && (
            <View style={[styles.qty, { backgroundColor: colors.border }]}>
              <Text style={[styles.qtyTxt, { color: colors.textSub }]}>×{card.quantity}</Text>
            </View>
          )}
          {/* Boutons rapides */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: colors.green + '22', borderColor: colors.green + '55' }]}
              onPress={() => { setSellPrice(String(card.valueCad)); setSellModal(true); }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.actionEmoji}>🏷️</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: colors.accentBg, borderColor: colors.accent + '55' }]}
              onPress={onEdit}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.actionEmoji}>✏️</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: colors.red + '15', borderColor: colors.red + '44' }]}
              onPress={onDelete}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.actionEmoji}>🗑️</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Photo */}
        {card.img ? (
          <Image source={{ uri: card.img }} style={styles.image} resizeMode="cover" />
        ) : null}

        {/* Infos */}
        <Text style={[styles.player, { color: colors.text }]} numberOfLines={1}>{card.player}</Text>
        <Text style={[styles.team, { color: colors.textSub }]} numberOfLines={1}>
          {card.team}{card.year ? ` · ${card.year}` : ''}
        </Text>
        <Text style={[styles.set, { color: colors.muted }]} numberOfLines={1}>
          {card.set}{card.cardNumber ? ` #${card.cardNumber}` : ''}
        </Text>

        {/* Footer valeur */}
        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <View>
            <Text style={[styles.valueCAD, { color: stripeColor }]}>
              {formatCAD(card.valueCad * card.quantity)}
            </Text>
            <Text style={[styles.valueUSD, { color: colors.muted }]}>
              {formatUSD(card.valueCad * card.quantity * CAD_USD_RATE)}
            </Text>
          </View>
          <View style={[styles.condBadge, { backgroundColor: colors.surface }]}>
            <Text style={[styles.condTxt, { color: colors.textSub }]}>{card.condition}</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* ── Modal vente rapide ───────────────────────────────────────────── */}
      <Modal visible={sellModal} transparent animationType="fade" onRequestClose={() => setSellModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>🏷️ Enregistrer une vente</Text>
            <Text style={[styles.modalSub, { color: colors.textSub }]} numberOfLines={1}>
              {card.player} · {card.set}
            </Text>

            <View style={[styles.modalRef, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.modalRefLabel, { color: colors.muted }]}>Valeur estimée</Text>
              <Text style={[styles.modalRefValue, { color: colors.textSub }]}>{formatCAD(card.valueCad)}</Text>
            </View>

            <Text style={[styles.modalLabel, { color: colors.textSub }]}>Prix de vente (CAD$)</Text>
            <TextInput
              style={[styles.modalInput, { backgroundColor: colors.card, borderColor: colors.accent, color: colors.text }]}
              value={sellPrice}
              onChangeText={setSellPrice}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor={colors.muted}
              autoFocus
            />

            {/* Preview profit/perte */}
            {sellPrice && parseFloat(sellPrice) > 0 && (() => {
              const profit = parseFloat(sellPrice) - card.valueCad;
              const pct    = ((profit / card.valueCad) * 100).toFixed(1);
              const color  = profit >= 0 ? colors.green : colors.red;
              return (
                <View style={[styles.profitRow, { backgroundColor: color + '15', borderColor: color + '44' }]}>
                  <Text style={[styles.profitTxt, { color }]}>
                    {profit >= 0 ? '📈' : '📉'} {profit >= 0 ? '+' : ''}{formatCAD(profit)} ({pct}%)
                  </Text>
                </View>
              );
            })()}

            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={[styles.modalBtn, { borderColor: colors.border }]}
                onPress={() => setSellModal(false)}
              >
                <Text style={[styles.modalBtnTxt, { color: colors.textSub }]}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: colors.green, borderColor: colors.green }]}
                onPress={handleSell}
              >
                <Text style={[styles.modalBtnTxt, { color: '#fff' }]}>✅ Confirmer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card:            { borderRadius: 14, borderWidth: 1, overflow: 'hidden', marginBottom: 2 },
  stripeContainer: { flexDirection: 'row', height: 4 },
  stripePrimary:   { flex: 1 },
  stripeSecondary: { flex: 1 },
  header:          { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingTop: 10, paddingBottom: 6, gap: 6 },
  badge:           { borderRadius: 6, borderWidth: 1, paddingHorizontal: 8, paddingVertical: 3 },
  badgeTxt:        { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  qty:             { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2 },
  qtyTxt:          { fontSize: 12 },
  actions:         { flexDirection: 'row', gap: 6, marginLeft: 'auto' },
  actionBtn:       { borderWidth: 1, borderRadius: 8, width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  actionEmoji:     { fontSize: 14 },
  image:           { width: '100%', height: 110, marginBottom: 10 },
  player:          { fontSize: 18, fontWeight: '800', letterSpacing: 0.3, paddingHorizontal: 14, marginBottom: 2 },
  team:            { fontSize: 13, paddingHorizontal: 14, marginBottom: 2 },
  set:             { fontSize: 12, paddingHorizontal: 14, marginBottom: 12 },
  footer:          { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingHorizontal: 14, paddingBottom: 14, paddingTop: 10, borderTopWidth: 1 },
  valueCAD:        { fontSize: 20, fontWeight: '800' },
  valueUSD:        { fontSize: 11, marginTop: 1 },
  condBadge:       { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 },
  condTxt:         { fontSize: 11 },
  // Modal vente
  modalOverlay:    { flex: 1, backgroundColor: '#00000088', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalBox:        { width: '100%', maxWidth: 400, borderRadius: 20, borderWidth: 1, padding: 24, gap: 12 },
  modalTitle:      { fontSize: 20, fontWeight: '800' },
  modalSub:        { fontSize: 13 },
  modalRef:        { flexDirection: 'row', justifyContent: 'space-between', borderRadius: 10, borderWidth: 1, padding: 12 },
  modalRefLabel:   { fontSize: 12 },
  modalRefValue:   { fontSize: 14, fontWeight: '600' },
  modalLabel:      { fontSize: 12 },
  modalInput:      { borderWidth: 1.5, borderRadius: 10, padding: 14, fontSize: 24, fontWeight: '800', textAlign: 'center' },
  profitRow:       { borderWidth: 1, borderRadius: 10, padding: 12, alignItems: 'center' },
  profitTxt:       { fontWeight: '700', fontSize: 14 },
  modalBtns:       { flexDirection: 'row', gap: 10, marginTop: 4 },
  modalBtn:        { flex: 1, borderWidth: 1, borderRadius: 12, paddingVertical: 13, alignItems: 'center' },
  modalBtnTxt:     { fontWeight: '700', fontSize: 14 },
});
