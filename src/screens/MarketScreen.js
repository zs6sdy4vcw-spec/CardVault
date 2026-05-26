import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, SafeAreaView, ActivityIndicator, Linking,
  useWindowDimensions,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { buildEbaySoldUrl, build130PointUrl, buildEbayActiveUrl } from '../services/ebay';

function DeepLinkBtn({ emoji, label, sublabel, url, colors, accent }) {
  return (
    <TouchableOpacity
      style={[styles.deepBtn, {
        backgroundColor: accent ? colors.accentBg : colors.card,
        borderColor: accent ? colors.accent : colors.border,
      }]}
      onPress={() => Linking.openURL(url)}
      activeOpacity={0.75}
    >
      <Text style={styles.deepEmoji}>{emoji}</Text>
      <View style={{ flex: 1 }}>
        <Text style={[styles.deepLabel, { color: accent ? colors.accent : colors.text }]}>{label}</Text>
        {sublabel && <Text style={[styles.deepSub, { color: colors.textSub }]}>{sublabel}</Text>}
      </View>
      <Text style={[styles.deepArrow, { color: accent ? colors.accent : colors.textSub }]}>→</Text>
    </TouchableOpacity>
  );
}

export default function MarketScreen({ navigation }) {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const [player, setPlayer]     = useState('');
  const [set, setSet]           = useState('');
  const [condition, setCondition] = useState('');

  const canSearch = player.trim().length > 0;

  const handleSearch = () => {
    if (!canSearch) return;
    navigation.navigate('Comparables', {
      card: {
        player,
        set:       set || player,
        condition: condition || 'Mint 9',
        sport:     'NHL',
        valueCad:  0,
      }
    });
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>🛒 Marché</Text>
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingHorizontal: width * 0.05 }]}>

        {/* Recherche rapide */}
        <View style={[styles.searchBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>🔍 Rechercher des comparables</Text>

          <Text style={[styles.label, { color: colors.textSub }]}>Joueur *</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
            placeholder="Ex: Connor McDavid"
            placeholderTextColor={colors.muted}
            value={player}
            onChangeText={setPlayer}
          />

          <Text style={[styles.label, { color: colors.textSub }]}>Set / Collection</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
            placeholder="Ex: Upper Deck Young Guns"
            placeholderTextColor={colors.muted}
            value={set}
            onChangeText={setSet}
          />

          <Text style={[styles.label, { color: colors.textSub }]}>Condition</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
            placeholder="Ex: Mint 9"
            placeholderTextColor={colors.muted}
            value={condition}
            onChangeText={setCondition}
          />

          <TouchableOpacity
            style={[styles.searchBtn, { backgroundColor: canSearch ? colors.navy : colors.border, borderColor: colors.accent, opacity: canSearch ? 1 : 0.5 }]}
            onPress={handleSearch}
            disabled={!canSearch}
          >
            <Text style={[styles.searchBtnTxt, { color: colors.accent }]}>Voir les comparables eBay →</Text>
          </TouchableOpacity>
        </View>

        {/* Liens rapides */}
        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 24, marginBottom: 12 }]}>⚡ Liens rapides</Text>

        <DeepLinkBtn
          emoji="💰" label="eBay — Ventes complétées" sublabel="Cartes sportives · 90 derniers jours"
          url="https://www.ebay.ca/sch/i.html?_sacat=261328&LH_Sold=1&LH_Complete=1&_sop=13"
          colors={colors} accent
        />
        <DeepLinkBtn
          emoji="🎯" label="130point.com — Last Sold" sublabel="Spécialisé cartes · Best Offer inclus"
          url="https://www.130point.com/sales/"
          colors={colors} accent
        />
        <DeepLinkBtn
          emoji="🏒" label="eBay Hockey Cards" sublabel="NHL · Annonces actives"
          url="https://www.ebay.ca/sch/i.html?_nkw=hockey+card&_sacat=261328&_sop=15"
          colors={colors}
        />
        <DeepLinkBtn
          emoji="🏈" label="eBay Football Cards" sublabel="NFL · Annonces actives"
          url="https://www.ebay.ca/sch/i.html?_nkw=football+card&_sacat=261328&_sop=15"
          colors={colors}
        />
        <DeepLinkBtn
          emoji="📦" label="Vendre sur eBay.ca" sublabel="Mettre une carte en vente"
          url="https://www.ebay.ca/sell"
          colors={colors}
        />

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1 },
  header: { padding: 16, borderBottomWidth: 1 },
  title:  { fontSize: 22, fontWeight: '800' },
  scroll: { paddingVertical: 20 },
  searchBox: { borderRadius: 16, borderWidth: 1, padding: 18, marginBottom: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 14 },
  label:  { fontSize: 12, marginBottom: 6, marginTop: 12 },
  input:  { borderWidth: 1, borderRadius: 10, padding: 12, fontSize: 14, marginBottom: 4 },
  searchBtn: { borderWidth: 1.5, borderRadius: 10, padding: 14, alignItems: 'center', marginTop: 16 },
  searchBtnTxt: { fontWeight: '700', fontSize: 14 },
  deepBtn: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderRadius: 12, padding: 16, marginBottom: 10 },
  deepEmoji: { fontSize: 22 },
  deepLabel: { fontWeight: '700', fontSize: 14 },
  deepSub:   { fontSize: 12, marginTop: 2 },
  deepArrow: { fontSize: 18, fontWeight: '700' },
});
