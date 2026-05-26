import React, { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ActivityIndicator, Linking, useWindowDimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useTheme, formatCAD, formatUSD, CAD_USD_RATE } from '../context/ThemeContext';
import { buildEbaySoldUrl, build130PointUrl, buildEbayActiveUrl, buildEbaySellUrl } from '../services/ebay';

const TABS = [
  { key: 'sold',   label: '💰 eBay Sold',  sub: 'Ventes complétées' },
  { key: 'active', label: '🛒 eBay Actif',  sub: 'Annonces en cours' },
  { key: 'point',  label: '🎯 130point',    sub: 'Last Sold' },
];

// JS injecté pour cacher le header/footer eBay et améliorer l'affichage mobile
const EBAY_CLEANUP_JS = `
(function() {
  // Cache les éléments non essentiels d'eBay pour une UI plus propre
  const toHide = [
    '#gh-header', '.gh-header', '#gh-t', '.gh-t',
    '#gh-nav', '.gh-eb', '#gh-f', '.gh-f',
    '.pagination', '#srp-river-main .x-banner',
  ];
  toHide.forEach(sel => {
    const el = document.querySelector(sel);
    if (el) el.style.display = 'none';
  });

  // Force fond blanc pour meilleure lisibilité
  document.body.style.paddingTop = '0';
})();
`;

export default function ComparablesScreen({ navigation, route }) {
  const { card } = route.params || {};
  const { colors, isDark } = useTheme();
  const { width, height } = useWindowDimensions();

  const [activeTab, setActiveTab] = useState('sold');
  const [loading, setLoading]     = useState(true);
  const webviewRef = useRef(null);

  if (!card) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
        <View style={styles.center}>
          <Text style={[styles.emptyTxt, { color: colors.textSub }]}>Sélectionne une carte</Text>
        </View>
      </SafeAreaView>
    );
  }

  const urls = {
    sold:   buildEbaySoldUrl(card.player, card.set, card.condition, card.year, card.cardNumber),
    active: buildEbayActiveUrl(card.player, card.set, card.condition, card.year, card.cardNumber),
    point:  build130PointUrl(card.player, card.set, card.year, card.cardNumber),
  };

  const currentUrl = urls[activeTab];

  const handleTabChange = (key) => {
    setActiveTab(key);
    setLoading(true);
  };

  const handleLoadEnd = () => {
    setLoading(false);
    // Injecte le CSS de nettoyage après chargement
    if (activeTab !== 'point') {
      setTimeout(() => {
        webviewRef.current?.injectJavaScript(EBAY_CLEANUP_JS);
      }, 800);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={[styles.back, { color: colors.accent }]}>← Retour</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
            {card.player}
          </Text>
          <Text style={[styles.headerSub, { color: colors.textSub }]} numberOfLines={1}>
            {card.set}{card.cardNumber ? ` #${card.cardNumber}` : ''} · {card.condition}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.sellBtn, { backgroundColor: colors.accentBg, borderColor: colors.accent }]}
          onPress={() => Linking.openURL(buildEbaySellUrl(card.player, card.set, card.year))}
        >
          <Text style={[styles.sellBtnTxt, { color: colors.accent }]}>📦 Vendre</Text>
        </TouchableOpacity>
      </View>

      {/* Valuation bar */}
      <View style={[styles.valuationBar, { backgroundColor: colors.navy, borderBottomColor: colors.accent }]}>
        <View>
          <Text style={[styles.valLabel, { color: colors.accent }]}>TA CARTE</Text>
          <Text style={[styles.valValue, { color: '#fff' }]}>{formatCAD(card.valueCad || 0)}</Text>
        </View>
        <Text style={[styles.valSep, { color: colors.border }]}>|</Text>
        <View>
          <Text style={[styles.valLabel, { color: colors.accent }]}>USD</Text>
          <Text style={[styles.valValue, { color: '#fff' }]}>{formatUSD((card.valueCad || 0) * CAD_USD_RATE)}</Text>
        </View>
        <TouchableOpacity
          style={[styles.extBtn, { borderColor: colors.accent + '66' }]}
          onPress={() => Linking.openURL(currentUrl)}
        >
          <Text style={[styles.extBtnTxt, { color: colors.accent }]}>🌐 Safari</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={[styles.tabs, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        {TABS.map(t => (
          <TouchableOpacity
            key={t.key}
            style={[
              styles.tab,
              activeTab === t.key && { borderBottomWidth: 2.5, borderBottomColor: colors.accent },
            ]}
            onPress={() => handleTabChange(t.key)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.tabLabel,
              { color: activeTab === t.key ? colors.accent : colors.textSub },
            ]}>
              {t.label}
            </Text>
            <Text style={[styles.tabSub, { color: colors.muted }]}>{t.sub}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* WebView */}
      <View style={{ flex: 1, position: 'relative' }}>
        {loading && (
          <View style={[styles.loadingOverlay, { backgroundColor: colors.bg }]}>
            <ActivityIndicator color={colors.accent} size="large" />
            <Text style={[styles.loadingTxt, { color: colors.textSub }]}>
              {activeTab === 'point' ? 'Chargement 130point…' : 'Chargement eBay…'}
            </Text>
            <Text style={[styles.loadingHint, { color: colors.muted }]}>
              Recherche : {card.player} {card.year || ''} {card.set}
            </Text>
          </View>
        )}
        <WebView
          ref={webviewRef}
          key={activeTab} // Force remount quand on change d'onglet
          source={{ uri: currentUrl }}
          style={{ flex: 1, backgroundColor: isDark ? '#0a0d14' : '#ffffff' }}
          onLoadEnd={handleLoadEnd}
          onLoadStart={() => setLoading(true)}
          javaScriptEnabled
          domStorageEnabled
          userAgent="Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
          onError={() => setLoading(false)}
          onHttpError={() => setLoading(false)}
        />
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:           { flex: 1 },
  center:         { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyTxt:       { fontSize: 15 },

  header:         {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 10,
    borderBottomWidth: 1, gap: 10,
  },
  backBtn:        { paddingRight: 4 },
  back:           { fontSize: 14, fontWeight: '600' },
  headerTitle:    { fontSize: 15, fontWeight: '800' },
  headerSub:      { fontSize: 11, marginTop: 1 },

  sellBtn:        { borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  sellBtnTxt:     { fontSize: 12, fontWeight: '700' },

  valuationBar:   {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 10,
    borderBottomWidth: 1.5, gap: 20,
  },
  valLabel:       { fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 2 },
  valValue:       { fontSize: 20, fontWeight: '800' },
  valSep:         { fontSize: 24, opacity: 0.3 },
  extBtn:         { marginLeft: 'auto', borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  extBtnTxt:      { fontSize: 12, fontWeight: '600' },

  tabs:           { flexDirection: 'row', borderBottomWidth: 1 },
  tab:            { flex: 1, alignItems: 'center', paddingVertical: 9, paddingHorizontal: 4 },
  tabLabel:       { fontSize: 12, fontWeight: '700' },
  tabSub:         { fontSize: 9, marginTop: 1 },

  loadingOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 10, alignItems: 'center', justifyContent: 'center', gap: 12,
  },
  loadingTxt:     { fontSize: 14, fontWeight: '600' },
  loadingHint:    { fontSize: 12, textAlign: 'center', paddingHorizontal: 32 },
});
