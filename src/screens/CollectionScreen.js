import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  StyleSheet, StatusBar, Image, useWindowDimensions,
  ScrollView, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme, formatCAD, formatUSD, CAD_USD_RATE } from '../context/ThemeContext';
import { loadCards, deleteCard } from '../services/storage';
import { SPORT_COLORS, SPORT_EMOJIS } from '../constants/theme';
import CardItem from '../components/CardItem';

// ── Hero Banner ───────────────────────────────────────────────────────────────
function HeroBanner({ colors, totalCards, isDark }) {
  return (
    <View style={[styles.hero, { backgroundColor: colors.navy }]}>
      {/* Fond dégradé */}
      <View style={[styles.heroGradient, { backgroundColor: isDark ? '#0d1b4b' : '#1a2a6c' }]} />
      {/* Pixels décoratifs */}
      {[
        { top: 12, right: 80, size: 8, color: '#00c8ff' },
        { top: 28, right: 60, size: 5, color: '#7c4dff' },
        { top: 8,  right: 40, size: 6, color: '#00e676' },
        { top: 40, right: 20, size: 4, color: '#ff6d00' },
        { bottom: 20, right: 90, size: 5, color: '#00c8ff' },
        { bottom: 10, right: 50, size: 7, color: '#7c4dff' },
      ].map((p, i) => (
        <View key={i} style={[styles.pixel, {
          top: p.top, bottom: p.bottom, right: p.right,
          width: p.size, height: p.size, backgroundColor: p.color,
          borderRadius: 1,
        }]} />
      ))}
      <View style={styles.heroContent}>
        <Text style={styles.heroPre}>Bienvenue dans</Text>
        <View style={styles.heroTitleRow}>
          <Text style={styles.heroTitleWhite}>Card</Text>
          <Text style={styles.heroTitleBlue}>Vault</Text>
        </View>
        <Text style={styles.heroSub}>Gérez, suivez et protégez{'\n'}votre collection.</Text>
      </View>
      {/* Logo flottant */}
      <Image
        source={require('../../assets/icon.png')}
        style={styles.heroIcon}
        resizeMode="contain"
      />
    </View>
  );
}

// ── Action Grid ───────────────────────────────────────────────────────────────
function ActionGrid({ colors, navigation, totalCards, totalValueCad }) {
  const actions = [
    { icon: '🃏', label: 'Ma collection', sub: `${totalCards} cartes`,      onPress: () => {} },
    { icon: '📊', label: 'Statistiques',  sub: 'Valeur totale',             onPress: () => navigation.navigate('Stats') },
    { icon: '➕', label: 'Ajouter',       sub: 'Nouvelle carte',            onPress: () => navigation.navigate('Ajouter'), accent: true },
    { icon: '🛒', label: 'Marché',        sub: 'Parcourir',                  onPress: () => navigation.navigate('Marché') },
  ];

  return (
    <View style={[styles.actionGrid, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {actions.map((a, i) => (
        <TouchableOpacity
          key={i}
          style={[
            styles.actionBtn,
            a.accent && { borderColor: colors.accent, backgroundColor: colors.accentBg },
            !a.accent && { borderColor: colors.border },
          ]}
          onPress={a.onPress}
          activeOpacity={0.75}
        >
          <View style={[styles.actionIconWrap, {
            backgroundColor: a.accent ? colors.accent + '33' : colors.surface,
          }]}>
            <Text style={styles.actionIcon}>{a.icon}</Text>
          </View>
          <Text style={[styles.actionLabel, { color: a.accent ? colors.accent : colors.text }]}>{a.label}</Text>
          <Text style={[styles.actionSub, { color: colors.muted }]}>{a.sub}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ── Overview Row ──────────────────────────────────────────────────────────────
function OverviewRow({ colors, totalCards, totalCategories, totalValueCad, navigation }) {
  return (
    <View style={styles.overviewSection}>
      <View style={styles.overviewHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Aperçu de la collection</Text>
        <TouchableOpacity onPress={() => {}}>
          <Text style={[styles.seeAll, { color: colors.accent }]}>Voir tout</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.overviewRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {[
          { icon: '🃏', value: String(totalCards),       label: 'Cartes',        color: '#7c4dff' },
          { icon: '📂', value: String(totalCategories),  label: 'Catégories',    color: '#00c8ff' },
          { icon: '💰', value: formatCAD(totalValueCad), label: 'Valeur totale', color: '#00e676' },
        ].map((item, i) => (
          <View key={i} style={[
            styles.overviewItem,
            i < 2 && { borderRightWidth: 1, borderRightColor: colors.border },
          ]}>
            <View style={[styles.overviewIconWrap, { backgroundColor: item.color + '22' }]}>
              <Text style={styles.overviewIcon}>{item.icon}</Text>
            </View>
            <Text style={[styles.overviewValue, { color: colors.text }]}>{item.value}</Text>
            <Text style={[styles.overviewLabel, { color: colors.muted }]}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ── Recent Activity Card ──────────────────────────────────────────────────────
function ActivityCard({ card, colors, onPress }) {
  const stripeColor = card.teamPrimary || SPORT_COLORS[card.sport] || colors.accent;
  const dateStr = card.addedAt
    ? new Date(card.addedAt).toLocaleDateString('fr-CA', { month: 'short', day: 'numeric' })
    : "Aujourd'hui";

  return (
    <TouchableOpacity
      style={[styles.activityCard, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {/* Photo ou placeholder */}
      {card.img ? (
        <Image source={{ uri: card.img }} style={styles.activityImg} resizeMode="cover" />
      ) : (
        <View style={[styles.activityImgPlaceholder, { backgroundColor: stripeColor + '22' }]}>
          <Text style={{ fontSize: 28 }}>{SPORT_EMOJIS[card.sport] || '🃏'}</Text>
        </View>
      )}
      {/* Infos */}
      <View style={styles.activityInfo}>
        <Text style={[styles.activityPlayer, { color: colors.text }]} numberOfLines={1}>{card.player}</Text>
        <Text style={[styles.activitySet, { color: colors.textSub }]} numberOfLines={1}>
          {card.year ? `${card.year} ` : ''}{card.set}{card.cardNumber ? ` #${card.cardNumber}` : ''}
        </Text>
        <Text style={[styles.activityCond, { color: colors.muted }]}>{card.condition}</Text>
      </View>
      {/* Valeur + date */}
      <View style={styles.activityRight}>
        <Text style={[styles.activityValue, { color: colors.green }]}>{formatCAD(card.valueCad)}</Text>
        <Text style={[styles.activityDate, { color: colors.muted }]}>{dateStr}</Text>
      </View>
    </TouchableOpacity>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function CollectionScreen({ navigation }) {
  const { colors, isDark } = useTheme();
  const { width } = useWindowDimensions();
  const [cards, setCards]     = useState([]);
  const [search, setSearch]   = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [sportFilter, setSportFilter] = useState('ALL');

  useFocusEffect(
    useCallback(() => { loadCards().then(setCards); }, [])
  );

  const totalValueCad   = cards.reduce((s, c) => s + c.valueCad * c.quantity, 0);
  const totalCards      = cards.reduce((s, c) => s + c.quantity, 0);
  const sports          = [...new Set(cards.map(c => c.sport))];
  const totalCategories = sports.length;
  const recentCards     = [...cards].slice(-5).reverse();

  const filtered = cards.filter(c => {
    const matchSport  = sportFilter === 'ALL' || c.sport === sportFilter;
    const q           = search.toLowerCase();
    const matchSearch = !q ||
      c.player.toLowerCase().includes(q) ||
      (c.team || '').toLowerCase().includes(q) ||
      (c.set || '').toLowerCase().includes(q);
    return matchSport && matchSearch;
  });

  const handleDelete = (card) => {
    Alert.alert('Supprimer', `Supprimer ${card.player}?`, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: async () => {
        const updated = await deleteCard(cards, card.id);
        setCards(updated);
      }},
    ]);
  };

  const px = width * 0.04;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.navy} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity>
          <Text style={[styles.menuIcon, { color: colors.text }]}>☰</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleRow}>
          <Text style={[styles.headerTitleWhite, { color: colors.text }]}>Card</Text>
          <Text style={[styles.headerTitleBlue, { color: colors.accent }]}>Vault</Text>
        </View>
        <TouchableOpacity onPress={() => setShowSearch(!showSearch)}>
          <Text style={[styles.searchIcon, { color: colors.text }]}>🔍</Text>
        </TouchableOpacity>
      </View>

      {/* Barre de recherche dépliable */}
      {showSearch && (
        <View style={[styles.searchBar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Joueur, équipe, set…"
            placeholderTextColor={colors.muted}
            value={search}
            onChangeText={setSearch}
            autoFocus
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text style={{ color: colors.muted }}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Hero Banner */}
        <HeroBanner colors={colors} totalCards={totalCards} isDark={isDark} />

        <View style={{ paddingHorizontal: px }}>

          {/* Action Grid */}
          <ActionGrid
            colors={colors}
            navigation={navigation}
            totalCards={totalCards}
            totalValueCad={totalValueCad}
          />

          {/* Overview */}
          <OverviewRow
            colors={colors}
            totalCards={totalCards}
            totalCategories={totalCategories}
            totalValueCad={totalValueCad}
            navigation={navigation}
          />

          {/* Activité récente */}
          {recentCards.length > 0 && (
            <View style={styles.recentSection}>
              <View style={styles.overviewHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Activité récente</Text>
                <TouchableOpacity>
                  <Text style={[styles.seeAll, { color: colors.accent }]}>Voir tout</Text>
                </TouchableOpacity>
              </View>
              {recentCards.map(card => (
                <ActivityCard
                  key={card.id}
                  card={card}
                  colors={colors}
                  onPress={() => navigation.navigate('CardDetail', { card, cards, setCards })}
                />
              ))}
            </View>
          )}

          {/* Collection complète */}
          {cards.length > 0 && (
            <View style={styles.collectionSection}>
              <View style={styles.overviewHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Ma collection</Text>
                <Text style={[styles.seeAll, { color: colors.muted }]}>{filtered.length} cartes</Text>
              </View>

              {/* Filtres sport */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                <View style={styles.filterRow}>
                  {['ALL', 'NHL', 'NFL', 'NBA', 'MLB', 'OTHER'].map(s => (
                    <TouchableOpacity
                      key={s}
                      style={[styles.filterBtn, {
                        backgroundColor: sportFilter === s ? colors.accentBg : colors.surface,
                        borderColor: sportFilter === s ? colors.accent : colors.border,
                      }]}
                      onPress={() => setSportFilter(s)}
                    >
                      <Text style={[styles.filterTxt, { color: sportFilter === s ? colors.accent : colors.textSub }]}>
                        {s === 'ALL' ? 'Tous' : s === 'NHL' ? '🏒 NHL' : s === 'NFL' ? '🏈 NFL' : s === 'NBA' ? '🏀 NBA' : s === 'MLB' ? '⚾ MLB' : '🃏 Autre'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              {/* Grille de cartes */}
              {filtered.map(card => (
                <CardItem
                  key={card.id}
                  card={card}
                  cards={cards}
                  onPress={() => navigation.navigate('CardDetail', { card, cards, setCards })}
                  onDelete={() => handleDelete(card)}
                  onEdit={() => navigation.navigate('CardDetail', { card, cards, setCards })}
                  onSold={() => loadCards().then(setCards)}
                />
              ))}
            </View>
          )}

          {/* Onboarding si vide */}
          {cards.length === 0 && (
            <View style={styles.emptySection}>
              <Image source={require('../../assets/icon.png')} style={styles.emptyLogo} resizeMode="contain" />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>Ta collection est vide</Text>
              <Text style={[styles.emptySub, { color: colors.textSub }]}>
                Ajoute ta première carte pour commencer à suivre ta collection.
              </Text>
              <TouchableOpacity
                style={[styles.emptyBtn, { backgroundColor: colors.accent }]}
                onPress={() => navigation.navigate('Ajouter')}
              >
                <Text style={styles.emptyBtnTxt}>➕ Ajouter ma première carte</Text>
              </TouchableOpacity>
            </View>
          )}

        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:         { flex: 1 },

  // Header
  header:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1 },
  menuIcon:     { fontSize: 20 },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center' },
  headerTitleWhite: { fontSize: 22, fontWeight: '800' },
  headerTitleBlue:  { fontSize: 22, fontWeight: '800' },
  searchIcon:   { fontSize: 18 },
  searchBar:    { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10, borderBottomWidth: 1, gap: 10 },
  searchInput:  { flex: 1, fontSize: 14 },

  // Hero
  hero:         { height: 180, marginHorizontal: 0, overflow: 'hidden', position: 'relative', marginBottom: 0 },
  heroGradient: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  pixel:        { position: 'absolute', opacity: 0.7 },
  heroContent:  { position: 'absolute', left: 20, top: 28, bottom: 20 },
  heroPre:      { color: '#aac4e8', fontSize: 13, marginBottom: 4 },
  heroTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  heroTitleWhite: { fontSize: 32, fontWeight: '900', color: '#ffffff' },
  heroTitleBlue:  { fontSize: 32, fontWeight: '900', color: '#00c8ff' },
  heroSub:      { color: '#aac4e8', fontSize: 13, lineHeight: 18 },
  heroIcon:     { position: 'absolute', right: -10, bottom: -10, width: 160, height: 160, opacity: 0.9 },

  // Action grid
  actionGrid:   { flexDirection: 'row', flexWrap: 'wrap', gap: 10, padding: 14, borderRadius: 18, borderWidth: 1, marginTop: 16, marginBottom: 16 },
  actionBtn:    { width: '47%', borderWidth: 1, borderRadius: 14, padding: 14, alignItems: 'center', gap: 6 },
  actionIconWrap: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  actionIcon:   { fontSize: 24 },
  actionLabel:  { fontSize: 13, fontWeight: '700', textAlign: 'center' },
  actionSub:    { fontSize: 11, textAlign: 'center' },

  // Overview
  overviewSection: { marginBottom: 20 },
  overviewHeader:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle:    { fontSize: 16, fontWeight: '700' },
  seeAll:          { fontSize: 13, fontWeight: '600' },
  overviewRow:     { flexDirection: 'row', borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  overviewItem:    { flex: 1, alignItems: 'center', paddingVertical: 16, gap: 4 },
  overviewIconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  overviewIcon:    { fontSize: 20 },
  overviewValue:   { fontSize: 14, fontWeight: '800' },
  overviewLabel:   { fontSize: 11 },

  // Activity
  recentSection:   { marginBottom: 20 },
  activityCard:    { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 14, padding: 12, marginBottom: 10, gap: 12 },
  activityImg:     { width: 60, height: 76, borderRadius: 8 },
  activityImgPlaceholder: { width: 60, height: 76, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  activityInfo:    { flex: 1, gap: 3 },
  activityPlayer:  { fontSize: 14, fontWeight: '700' },
  activitySet:     { fontSize: 12 },
  activityCond:    { fontSize: 11 },
  activityRight:   { alignItems: 'flex-end', gap: 4 },
  activityValue:   { fontSize: 14, fontWeight: '800' },
  activityDate:    { fontSize: 11 },

  // Collection
  collectionSection: { marginBottom: 20 },
  filterRow:       { flexDirection: 'row', gap: 8 },
  filterBtn:       { borderWidth: 1, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8 },
  filterTxt:       { fontWeight: '600', fontSize: 13 },

  // Empty
  emptySection:    { alignItems: 'center', paddingVertical: 40, gap: 12 },
  emptyLogo:       { width: 90, height: 90, borderRadius: 20 },
  emptyTitle:      { fontSize: 20, fontWeight: '800', textAlign: 'center' },
  emptySub:        { fontSize: 14, textAlign: 'center', paddingHorizontal: 32, lineHeight: 20 },
  emptyBtn:        { borderRadius: 14, paddingVertical: 14, paddingHorizontal: 28, marginTop: 8 },
  emptyBtnTxt:     { color: '#0a0d14', fontWeight: '800', fontSize: 15 },
});
