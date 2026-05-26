import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTheme, formatCAD, formatUSD, CAD_USD_RATE } from '../context/ThemeContext';
import { SPORT_COLORS, SPORT_EMOJIS } from '../constants/theme';

export default function CardItem({ card, onPress }) {
  const { colors } = useTheme();

  // Couleurs d'équipe officielles si disponibles, sinon couleur du sport
  const stripeColor   = card.teamPrimary  || SPORT_COLORS[card.sport] || colors.accent;
  const secondColor   = card.teamSecondary || stripeColor;
  const sportEmoji    = SPORT_EMOJIS[card.sport] || '🃏';

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {/* Stripe couleur équipe — dégradé si deux couleurs dispo */}
      <View style={styles.stripeContainer}>
        <View style={[styles.stripePrimary, { backgroundColor: stripeColor }]} />
        {card.teamSecondary && (
          <View style={[styles.stripeSecondary, { backgroundColor: secondColor }]} />
        )}
      </View>

      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.badge, { backgroundColor: stripeColor + '22', borderColor: stripeColor + '55' }]}>
          <Text style={[styles.badgeTxt, { color: stripeColor }]}>
            {sportEmoji} {card.sport}
          </Text>
        </View>
        {card.quantity > 1 && (
          <View style={[styles.qty, { backgroundColor: colors.border }]}>
            <Text style={[styles.qtyTxt, { color: colors.textSub }]}>×{card.quantity}</Text>
          </View>
        )}
      </View>

      {/* Photo */}
      {card.img ? (
        <Image source={{ uri: card.img }} style={styles.image} resizeMode="cover" />
      ) : null}

      {/* Infos */}
      <Text style={[styles.player, { color: colors.text }]} numberOfLines={1}>
        {card.player}
      </Text>
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
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 2,
  },
  stripeContainer: {
    flexDirection: 'row',
    height: 4,
  },
  stripePrimary: {
    flex: 1,
  },
  stripeSecondary: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 8,
  },
  badge: {
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeTxt: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  qty: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  qtyTxt: { fontSize: 12 },
  image: {
    width: '100%',
    height: 110,
    marginBottom: 10,
  },
  player: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.3,
    paddingHorizontal: 14,
    marginBottom: 2,
  },
  team: {
    fontSize: 13,
    paddingHorizontal: 14,
    marginBottom: 2,
  },
  set: {
    fontSize: 12,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 14,
    paddingBottom: 14,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  valueCAD: {
    fontSize: 20,
    fontWeight: '800',
  },
  valueUSD: {
    fontSize: 11,
    marginTop: 1,
  },
  condBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  condTxt: {
    fontSize: 11,
  },
});
