import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  SafeAreaView, StatusBar, useWindowDimensions,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme, formatCAD, formatUSD, CAD_USD_RATE } from '../context/ThemeContext';
import { loadCards } from '../services/storage';

function StatRow({ label, value, accent, colors }) {
  return (
    <View style={[styles.statRow, { borderBottomColor: colors.border }]}>
      <Text style={[styles.statLabel, { color: colors.textSub }]}>{label}</Text>
      <Text style={[styles.statValue, { color: accent ? colors.accent : colors.text }]}>{value}</Text>
    </View>
  );
}

function Section({ title, children, colors }) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      <View style={[styles.sectionBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {children}
      </View>
    </View>
  );
}

export default function StatsScreen() {
  const { colors, isDark } = useTheme();
  const { width } = useWindowDimensions();
  const [cards, setCards] = useState([]);

  useFocusEffect(
    useCallback(() => {
      loadCards().then(setCards);
    }, [])
  );

  const px = width * 0.05;

  if (!cards.length) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.bg} />
        <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <Text style={[styles.pageTitle, { color: colors.text }]}>📊 Statistiques</Text>
        </View>
        <View style={styles.empty}>
          <Text style={{ fontSize: 48 }}>📊</Text>
          <Text style={[styles.emptyTxt, { color: colors.textSub }]}>Aucune carte dans ta collection</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ── Calculs ────────────────────────────────────────────────────────────────
  const totalValueCad = cards.reduce((s, c) => s + c.valueCad * c.quantity, 0);
  const totalCards    = cards.reduce((s, c) => s + c.quantity, 0);
  const avgValue      = totalValueCad / cards.length;
  const mostValuable  = [...cards].sort((a, b) => b.valueCad - a.valueCad)[0];
  const leastValuable = [...cards].sort((a, b) => a.valueCad - b.valueCad)[0];

  const nhlCards = cards.filter(c => c.sport === 'NHL');
  const nflCards = cards.filter(c => c.sport === 'NFL');
  const nbaCards = cards.filter(c => c.sport === 'NBA');
  const mlbCards = cards.filter(c => c.sport === 'MLB');
  const nhlValue = nhlCards.reduce((s, c) => s + c.valueCad * c.quantity, 0);
  const nflValue = nflCards.reduce((s, c) => s + c.valueCad * c.quantity, 0);
  const nbaValue = nbaCards.reduce((s, c) => s + c.valueCad * c.quantity, 0);
  const mlbValue = mlbCards.reduce((s, c) => s + c.valueCad * c.quantity, 0);

  const conditionCount = cards.reduce((acc, c) => {
    acc[c.condition] = (acc[c.condition] || 0) + c.quantity;
    return acc;
  }, {});
  const topCondition = Object.entries(conditionCount).sort((a, b) => b[1] - a[1])[0];

  const top5 = [...cards].sort((a, b) => b.valueCad - a.valueCad).slice(0, 5);

  const byYear = cards.reduce((acc, c) => {
    if (c.year) acc[c.year] = (acc[c.year] || 0) + 1;
    return acc;
  }, {});
  const topYear = Object.entries(byYear).sort((a, b) => b[1] - a[1])[0];

  const sportRows = [
    { sport: 'NHL', emoji: '🏒', cards: nhlCards, value: nhlValue, color: colors.nhl },
    { sport: 'NFL', emoji: '🏈', cards: nflCards, value: nflValue, color: colors.nfl },
    { sport: 'NBA', emoji: '🏀', cards: nbaCards, value: nbaValue, color: '#e87c4b' },
    { sport: 'MLB', emoji: '⚾', cards: mlbCards, value: mlbValue, color: '#4be87a' },
  ].filter(s => s.cards.length > 0);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.bg} />

      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.pageTitle, { color: colors.text }]}>📊 Statistiques</Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingHorizontal: px }]}
        showsVerticalScrollIndicator={false}
      >

        {/* Hero valeur totale */}
        <View style={[styles.heroBox, { backgroundColor: colors.navy, borderColor: colors.accent }]}>
          <Text style={[styles.heroLabel, { color: colors.accent }]}>VALEUR TOTALE DE LA COLLECTION</Text>
          <Text style={[styles.heroValue, { color: '#ffffff' }]}>{formatCAD(totalValueCad)}</Text>
          <Text style={[styles.heroSub, { color: colors.textSub }]}>≈ {formatUSD(totalValueCad * CAD_USD_RATE)}</Text>
        </View>

        {/* Résumé */}
        <Section title="Résumé" colors={colors}>
          <StatRow label="Nombre de cartes"       value={String(totalCards)}                                    colors={colors} />
          <StatRow label="Entrées uniques"         value={String(cards.length)}                                 colors={colors} />
          <StatRow label="Valeur moyenne"          value={formatCAD(avgValue)}                                  colors={colors} accent />
          <StatRow label="Carte la plus valuable"  value={`${mostValuable.player} — ${formatCAD(mostValuable.valueCad)}`}  colors={colors} />
          <StatRow label="Carte la moins valuable" value={`${leastValuable.player} — ${formatCAD(leastValuable.valueCad)}`} colors={colors} />
          {topYear    && <StatRow label="Année la plus représentée"   value={`${topYear[0]} (${topYear[1]} cartes)`}  colors={colors} />}
          {topCondition && <StatRow label="Condition la plus fréquente" value={`${topCondition[0]} (${topCondition[1]})`} colors={colors} />}
        </Section>

        {/* Par sport */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Par sport</Text>
        <View style={styles.sportGrid}>
          {sportRows.map(s => (
            <View key={s.sport} style={[styles.sportBox, { backgroundColor: colors.card, borderColor: s.color }]}>
              <Text style={styles.sportEmoji}>{s.emoji}</Text>
              <Text style={[styles.sportName, { color: colors.textSub }]}>{s.sport}</Text>
              <Text style={[styles.sportValue, { color: s.color }]}>{formatCAD(s.value)}</Text>
              <Text style={[styles.sportCount, { color: colors.muted }]}>{s.cards.length} cartes</Text>
            </View>
          ))}
        </View>

        {/* Barre proportionnelle */}
        {sportRows.length > 1 && totalValueCad > 0 && (
          <View style={[styles.barWrap, { backgroundColor: colors.border }]}>
            {sportRows.map(s => (
              <View
                key={s.sport}
                style={[styles.barSegment, { flex: s.value / totalValueCad, backgroundColor: s.color }]}
              />
            ))}
          </View>
        )}

        {/* Top 5 */}
        <Section title="🏆 Top 5 cartes les plus valuables" colors={colors}>
          {top5.map((card, i) => (
            <View key={card.id} style={[styles.topRow, { borderBottomColor: colors.border }]}>
              <Text style={[styles.topRank, { color: colors.accent }]}>#{i + 1}</Text>
              <View style={styles.topInfo}>
                <Text style={[styles.topPlayer, { color: colors.text }]} numberOfLines={1}>{card.player}</Text>
                <Text style={[styles.topMeta, { color: colors.muted }]}>{card.set} · {card.condition}</Text>
              </View>
              <Text style={[styles.topValue, { color: colors.text }]}>{formatCAD(card.valueCad)}</Text>
            </View>
          ))}
        </Section>

        {/* Répartition par condition */}
        <Section title="Répartition par condition" colors={colors}>
          {Object.entries(conditionCount).sort((a, b) => b[1] - a[1]).map(([cond, count]) => (
            <View key={cond} style={[styles.condRow, { borderBottomColor: colors.border }]}>
              <Text style={[styles.condName, { color: colors.textSub }]}>{cond}</Text>
              <View style={[styles.condBarWrap, { backgroundColor: colors.border }]}>
                <View style={[styles.condBar, { width: `${(count / totalCards) * 100}%`, backgroundColor: colors.accent }]} />
              </View>
              <Text style={[styles.condCount, { color: colors.text }]}>{count}</Text>
            </View>
          ))}
        </Section>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:         { flex: 1 },
  header:       { padding: 16, paddingBottom: 12, borderBottomWidth: 1 },
  pageTitle:    { fontSize: 22, fontWeight: '800' },
  scroll:       { paddingVertical: 20 },
  empty:        { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  emptyTxt:     { fontSize: 15 },

  heroBox:      { borderWidth: 1.5, borderRadius: 16, padding: 22, alignItems: 'center', marginBottom: 24 },
  heroLabel:    { fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 },
  heroValue:    { fontSize: 40, fontWeight: '800' },
  heroSub:      { fontSize: 14, marginTop: 4 },

  section:      { marginBottom: 20 },
  sectionTitle: { fontSize: 15, fontWeight: '700', marginBottom: 10 },
  sectionBox:   { borderRadius: 14, borderWidth: 1, overflow: 'hidden' },

  statRow:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 13, borderBottomWidth: 1 },
  statLabel:    { fontSize: 13, flex: 1 },
  statValue:    { fontSize: 13, fontWeight: '700', textAlign: 'right', flex: 1 },

  sportGrid:    { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 12 },
  sportBox:     { flex: 1, minWidth: 130, borderWidth: 1.5, borderRadius: 12, padding: 14, alignItems: 'center', gap: 4 },
  sportEmoji:   { fontSize: 26 },
  sportName:    { fontSize: 11, fontWeight: '600', letterSpacing: 1 },
  sportValue:   { fontSize: 18, fontWeight: '800' },
  sportCount:   { fontSize: 11 },

  barWrap:      { flexDirection: 'row', height: 6, borderRadius: 3, overflow: 'hidden', marginBottom: 24 },
  barSegment:   {},

  topRow:       { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  topRank:      { fontWeight: '800', fontSize: 14, width: 28 },
  topInfo:      { flex: 1 },
  topPlayer:    { fontWeight: '700', fontSize: 13 },
  topMeta:      { fontSize: 11, marginTop: 2 },
  topValue:     { fontWeight: '800', fontSize: 13 },

  condRow:      { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1 },
  condName:     { fontSize: 12, width: 110 },
  condBarWrap:  { flex: 1, height: 6, borderRadius: 3 },
  condBar:      { height: 6, borderRadius: 3 },
  condCount:    { fontWeight: '700', fontSize: 12, width: 24, textAlign: 'right' },
});
