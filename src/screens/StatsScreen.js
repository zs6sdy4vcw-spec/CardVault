import t from '../i18n/translations';
import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  SafeAreaView, StatusBar, useWindowDimensions, Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme, formatCAD, formatUSD, CAD_USD_RATE } from '../context/ThemeContext';
import { loadCards, loadSales, deleteSale, groupSalesByPeriod } from '../services/storage';

const TABS = [t.stats_collection, t.stats_sales];

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
  const [cards, setCards]   = useState([]);
  const [sales, setSales]   = useState([]);
  const [tab, setTab]       = useState(0);
  const px = width * 0.05;

  useFocusEffect(
    useCallback(() => {
      loadCards().then(setCards);
      loadSales().then(setSales);
    }, [])
  );

  // ── Stats collection ──────────────────────────────────────────────────────
  const totalValueCad = cards.reduce((s, c) => s + c.valueCad * c.quantity, 0);
  const totalCards    = cards.reduce((s, c) => s + c.quantity, 0);
  const avgValue      = cards.length ? totalValueCad / cards.length : 0;
  const mostValuable  = [...cards].sort((a, b) => b.valueCad - a.valueCad)[0];
  const leastValuable = [...cards].sort((a, b) => a.valueCad - b.valueCad)[0];
  const top5          = [...cards].sort((a, b) => b.valueCad - a.valueCad).slice(0, 5);

  const conditionCount = cards.reduce((acc, c) => {
    acc[c.condition] = (acc[c.condition] || 0) + c.quantity;
    return acc;
  }, {});
  const topCondition = Object.entries(conditionCount).sort((a, b) => b[1] - a[1])[0];

  const byYear = cards.reduce((acc, c) => {
    if (c.year) acc[c.year] = (acc[c.year] || 0) + 1;
    return acc;
  }, {});
  const topYear = Object.entries(byYear).sort((a, b) => b[1] - a[1])[0];

  const sportStats = [
    { sport: 'NHL', emoji: '🏒', color: '#4b9fe8' },
    { sport: 'NFL', emoji: '🏈', color: '#e84b4b' },
    { sport: 'NBA', emoji: '🏀', color: '#e87c4b' },
    { sport: 'MLB', emoji: '⚾', color: '#4be87a' },
  ].map(s => ({
    ...s,
    cards: cards.filter(c => c.sport === s.sport),
    value: cards.filter(c => c.sport === s.sport).reduce((sum, c) => sum + c.valueCad * c.quantity, 0),
  })).filter(s => s.cards.length > 0);

  // ── Stats ventes ──────────────────────────────────────────────────────────
  const totalSalesCad   = sales.reduce((s, v) => s + v.salePriceCad, 0);
  const totalProfit     = sales.reduce((s, v) => s + v.profit, 0);
  const avgSalePrice    = sales.length ? totalSalesCad / sales.length : 0;
  const { byDay, byMonth, byYear: byYearSales, today, month, year } = groupSalesByPeriod(sales);

  const todaySales = byDay[today] || 0;
  const monthSales = byMonth[month] || 0;
  const yearSales  = byYearSales[year] || 0;

  // Top 3 mois
  const topMonths = Object.entries(byMonth)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.bg} />

      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.pageTitle, { color: colors.text }]}>📊 Statistiques</Text>
      </View>

      {/* Tabs */}
      <View style={[styles.tabs, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        {TABS.map((t, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.tab, tab === i && { borderBottomWidth: 2.5, borderBottomColor: colors.accent }]}
            onPress={() => setTab(i)}
          >
            <Text style={[styles.tabTxt, { color: tab === i ? colors.accent : colors.textSub }]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingHorizontal: px }]} showsVerticalScrollIndicator={false}>

        {/* ── TAB 0 : Collection ─────────────────────────────────────────── */}
        {tab === 0 && (
          <>
            {!cards.length ? (
              <View style={styles.empty}>
                <Text style={{ fontSize: 48 }}>📊</Text>
                <Text style={[styles.emptyTxt, { color: colors.textSub }]}>Aucune carte dans ta collection</Text>
              </View>
            ) : (
              <>
                <View style={[styles.heroBox, { backgroundColor: colors.navy, borderColor: colors.accent }]}>
                  <Text style={[styles.heroLabel, { color: colors.accent }]}>VALEUR TOTALE DE LA COLLECTION</Text>
                  <Text style={[styles.heroValue, { color: '#ffffff' }]}>{formatCAD(totalValueCad)}</Text>
                  <Text style={[styles.heroSub, { color: colors.textSub }]}>≈ {formatUSD(totalValueCad * CAD_USD_RATE)}</Text>
                </View>

                <Section title=t.stats_summary colors={colors}>
                  <StatRow label=t.stats_count       value={String(totalCards)}                                                    colors={colors} />
                  <StatRow label=t.stats_unique         value={String(cards.length)}                                                  colors={colors} />
                  <StatRow label=t.stats_avg          value={formatCAD(avgValue)}                                                   colors={colors} accent />
                  {mostValuable  && <StatRow label="Carte la plus valuable"  value={`${mostValuable.player} — ${formatCAD(mostValuable.valueCad)}`}   colors={colors} />}
                  {leastValuable && <StatRow label="Carte la moins valuable" value={`${leastValuable.player} — ${formatCAD(leastValuable.valueCad)}`} colors={colors} />}
                  {topYear       && <StatRow label="Année la plus représentée" value={`${topYear[0]} (${topYear[1]} cartes)`}            colors={colors} />}
                  {topCondition  && <StatRow label="Condition la plus fréquente" value={`${topCondition[0]} (${topCondition[1]})`}       colors={colors} />}
                </Section>

                {sportStats.length > 0 && (
                  <>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Par sport</Text>
                    <View style={styles.sportGrid}>
                      {sportStats.map(s => (
                        <View key={s.sport} style={[styles.sportBox, { backgroundColor: colors.card, borderColor: s.color }]}>
                          <Text style={styles.sportEmoji}>{s.emoji}</Text>
                          <Text style={[styles.sportName, { color: colors.textSub }]}>{s.sport}</Text>
                          <Text style={[styles.sportValue, { color: s.color }]}>{formatCAD(s.value)}</Text>
                          <Text style={[styles.sportCount, { color: colors.muted }]}>{s.cards.length} cartes</Text>
                        </View>
                      ))}
                    </View>
                    {sportStats.length > 1 && totalValueCad > 0 && (
                      <View style={[styles.barWrap, { backgroundColor: colors.border }]}>
                        {sportStats.map(s => (
                          <View key={s.sport} style={[styles.barSegment, { flex: s.value / totalValueCad, backgroundColor: s.color }]} />
                        ))}
                      </View>
                    )}
                  </>
                )}

                {top5.length > 0 && (
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
                )}
              </>
            )}
          </>
        )}

        {/* ── TAB 1 : Ventes ────────────────────────────────────────────── */}
        {tab === 1 && (
          <>
            {!sales.length ? (
              <View style={styles.empty}>
                <Text style={{ fontSize: 48 }}>💰</Text>
                <Text style={[styles.emptyTxt, { color: colors.textSub }]}>Aucune vente enregistrée</Text>
                <Text style={[styles.emptySub, { color: colors.muted }]}>
                  Appuie sur 🏷️ sur une carte pour enregistrer une vente
                </Text>
              </View>
            ) : (
              <>
                {/* Résumé ventes */}
                <View style={[styles.heroBox, { backgroundColor: colors.navy, borderColor: colors.green }]}>
                  <Text style={[styles.heroLabel, { color: colors.green }]}>TOTAL DES VENTES</Text>
                  <Text style={[styles.heroValue, { color: '#ffffff' }]}>{formatCAD(totalSalesCad)}</Text>
                  <Text style={[styles.heroSub, { color: colors.textSub }]}>
                    Profit/Perte net : {totalProfit >= 0 ? '+' : ''}{formatCAD(totalProfit)}
                  </Text>
                </View>

                {/* Stats périodes */}
                <View style={styles.periodRow}>
                  {[
                    { label: t.stats_today, value: formatCAD(todaySales) },
                    { label: t.stats_month, value: formatCAD(monthSales) },
                    { label: t.stats_year, value: formatCAD(yearSales) },
                  ].map((p, i) => (
                    <View key={i} style={[styles.periodBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
                      <Text style={[styles.periodLabel, { color: colors.textSub }]}>{p.label}</Text>
                      <Text style={[styles.periodValue, { color: colors.green }]}>{p.value}</Text>
                    </View>
                  ))}
                </View>

                <Section title=t.stats_summary colors={colors}>
                  <StatRow label="Nombre de ventes"    value={String(sales.length)}         colors={colors} />
                  <StatRow label="Prix moyen de vente" value={formatCAD(avgSalePrice)}       colors={colors} accent />
                  <StatRow label="Profit net total"    value={`${totalProfit >= 0 ? '+' : ''}${formatCAD(totalProfit)}`} colors={colors} />
                </Section>

                {/* Top mois */}
                {topMonths.length > 0 && (
                  <Section title="📅 Ventes par mois" colors={colors}>
                    {topMonths.map(([m, v]) => (
                      <View key={m} style={[styles.monthRow, { borderBottomColor: colors.border }]}>
                        <Text style={[styles.monthLabel, { color: colors.textSub }]}>{m}</Text>
                        <View style={[styles.monthBarWrap, { backgroundColor: colors.border }]}>
                          <View style={[styles.monthBar, {
                            width: `${(v / Math.max(...topMonths.map(x => x[1]))) * 100}%`,
                            backgroundColor: colors.green,
                          }]} />
                        </View>
                        <Text style={[styles.monthValue, { color: colors.green }]}>{formatCAD(v)}</Text>
                      </View>
                    ))}
                  </Section>
                )}

                {/* Liste ventes */}
                <Section title={`📋 Historique (${sales.length})`} colors={colors}>
                  {sales.map(sale => {
                    const profit = sale.profit;
                    const profitColor = profit >= 0 ? colors.green : colors.red;
                    return (
                      <View key={sale.id} style={[styles.saleRow, { borderBottomColor: colors.border }]}>
                        <View style={[styles.saleDot, { backgroundColor: sale.teamPrimary || colors.accent }]} />
                        <View style={styles.saleInfo}>
                          <Text style={[styles.salePlayer, { color: colors.text }]} numberOfLines={1}>{sale.player}</Text>
                          <Text style={[styles.saleMeta, { color: colors.muted }]}>
                            {sale.date.split('T')[0]} · {sale.condition}
                          </Text>
                        </View>
                        <View style={styles.salePrices}>
                          <Text style={[styles.salePrice, { color: colors.green }]}>{formatCAD(sale.salePriceCad)}</Text>
                          <Text style={[styles.saleProfit, { color: profitColor }]}>
                            {profit >= 0 ? '+' : ''}{formatCAD(profit)}
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => Alert.alert('Supprimer cette vente?', '', [
                            { text: t.cancel, style: 'cancel' },
                            { text: t.delete, style: 'destructive', onPress: async () => {
                              const updated = await deleteSale(sale.id);
                              setSales(updated);
                            }},
                          ])}
                        >
                          <Text style={{ color: colors.muted, fontSize: 16 }}>🗑️</Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </Section>
              </>
            )}
          </>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:         { flex: 1 },
  header:       { padding: 16, paddingBottom: 12, borderBottomWidth: 1 },
  pageTitle:    { fontSize: 22, fontWeight: '800' },
  tabs:         { flexDirection: 'row', borderBottomWidth: 1 },
  tab:          { flex: 1, alignItems: 'center', paddingVertical: 12 },
  tabTxt:       { fontSize: 14, fontWeight: '700' },
  scroll:       { paddingVertical: 20 },
  empty:        { alignItems: 'center', paddingVertical: 60, gap: 10 },
  emptyTxt:     { fontSize: 15 },
  emptySub:     { fontSize: 13, textAlign: 'center', paddingHorizontal: 32 },
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
  // Ventes
  periodRow:    { flexDirection: 'row', gap: 8, marginBottom: 20 },
  periodBox:    { flex: 1, borderWidth: 1, borderRadius: 12, padding: 12, alignItems: 'center', gap: 4 },
  periodLabel:  { fontSize: 10, letterSpacing: 1, textTransform: 'uppercase' },
  periodValue:  { fontSize: 15, fontWeight: '800' },
  monthRow:     { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1 },
  monthLabel:   { fontSize: 12, width: 70 },
  monthBarWrap: { flex: 1, height: 6, borderRadius: 3 },
  monthBar:     { height: 6, borderRadius: 3 },
  monthValue:   { fontWeight: '700', fontSize: 12, width: 80, textAlign: 'right' },
  saleRow:      { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, gap: 10 },
  saleDot:      { width: 10, height: 10, borderRadius: 5 },
  saleInfo:     { flex: 1 },
  salePlayer:   { fontSize: 13, fontWeight: '600' },
  saleMeta:     { fontSize: 11, marginTop: 2 },
  salePrices:   { alignItems: 'flex-end', gap: 2 },
  salePrice:    { fontSize: 13, fontWeight: '800' },
  saleProfit:   { fontSize: 11, fontWeight: '600' },
});
