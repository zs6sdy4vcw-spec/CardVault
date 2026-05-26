import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  StyleSheet, StatusBar, Image, useWindowDimensions, Alert, Modal, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme, formatCAD, formatUSD, CAD_USD_RATE } from '../context/ThemeContext';
import { loadCards, saveCards, deleteCard } from '../services/storage';
import { CONDITIONS, SPORT_COLORS, SPORT_EMOJIS } from '../constants/theme';
import { suggestTeams, getTeamColors } from '../constants/teams';
import CardItem from '../components/CardItem';

const SPORTS = [
  { key: 'NHL', emoji: '🏒' },
  { key: 'NFL', emoji: '🏈' },
  { key: 'NBA', emoji: '🏀' },
  { key: 'MLB', emoji: '⚾' },
  { key: 'OTHER', emoji: '🃏' },
];

export default function CollectionScreen({ navigation }) {
  const { colors, isDark } = useTheme();
  const { width, height }  = useWindowDimensions();
  const isLandscape = width > height;

  const [cards, setCards]             = useState([]);
  const [search, setSearch]           = useState('');
  const [sportFilter, setSportFilter] = useState('ALL');
  const [editCard, setEditCard]       = useState(null);
  const [editForm, setEditForm]       = useState({});
  const [condOpen, setCondOpen]       = useState(false);
  const [teamSuggestions, setTeamSuggestions] = useState([]);

  useFocusEffect(
    useCallback(() => { loadCards().then(setCards); }, [])
  );

  const filtered = cards.filter(c => {
    const matchSport  = sportFilter === 'ALL' || c.sport === sportFilter;
    const q           = search.toLowerCase();
    const matchSearch = !q || c.player.toLowerCase().includes(q) || (c.team||'').toLowerCase().includes(q) || (c.set||'').toLowerCase().includes(q);
    return matchSport && matchSearch;
  });

  const totalValueCad = cards.reduce((s, c) => s + c.valueCad * c.quantity, 0);
  const totalCards    = cards.reduce((s, c) => s + c.quantity, 0);
  const nhlCount      = cards.filter(c => c.sport === 'NHL').length;
  const nflCount      = cards.filter(c => c.sport === 'NFL').length;

  const numColumns = width > 900 ? 3 : width > 600 ? 2 : 1;

  const statBoxBg     = isDark ? colors.navy : colors.accent + '18';
  const statBoxBorder = isDark ? colors.accent : colors.accent + '55';
  const statValueColor = isDark ? '#ffffff' : colors.navy;

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleDelete = (card) => {
    Alert.alert('Supprimer', `Supprimer ${card.player}?`, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer', style: 'destructive',
        onPress: async () => {
          const updated = await deleteCard(cards, card.id);
          setCards(updated);
        },
      },
    ]);
  };

  const handleEdit = (card) => {
    setEditForm({ ...card, valueCad: String(card.valueCad), quantity: String(card.quantity) });
    setTeamSuggestions([]);
    setEditCard(card);
  };

  const handleSaveEdit = async () => {
    if (!editForm.player?.trim()) { Alert.alert('Joueur requis'); return; }
    const updated = {
      ...editForm,
      valueCad: parseFloat(editForm.valueCad) || 0,
      quantity: parseInt(editForm.quantity) || 1,
    };
    const newCards = cards.map(c => c.id === updated.id ? updated : c);
    await saveCards(newCards);
    setCards(newCards);
    setEditCard(null);
  };

  const setEditField = (k, v) => setEditForm(f => ({ ...f, [k]: v }));

  const handleTeamChange = (v) => {
    setEditField('team', v);
    setTeamSuggestions(suggestTeams(editForm.sport, v));
    const tc = getTeamColors(editForm.sport, v);
    if (tc.primary) {
      setEditField('teamPrimary', tc.primary);
      setEditField('teamSecondary', tc.secondary);
    }
  };

  const inputStyle = {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    color: colors.text,
    borderWidth: 1, borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 10,
    fontSize: 14,
  };

  const Label = ({ text }) => (
    <Text style={{ color: colors.textSub, fontSize: 12, marginBottom: 5, marginTop: 12 }}>{text}</Text>
  );

  const ListHeader = () => (
    <View>
      <View style={[styles.statsRow, { gap: width * 0.02 }]}>
        <View style={[styles.statBox, { backgroundColor: statBoxBg, borderColor: statBoxBorder, flex: 1.4 }]}>
          <Text style={[styles.statLabel, { color: colors.accent }]}>VALEUR TOTALE</Text>
          <Text style={[styles.statValue, { color: statValueColor, fontSize: width > 600 ? 28 : 22 }]}>
            {formatCAD(totalValueCad)}
          </Text>
          <Text style={[styles.statSub, { color: colors.textSub }]}>{formatUSD(totalValueCad * CAD_USD_RATE)}</Text>
        </View>
        <View style={{ flex: 1, gap: width * 0.02 }}>
          <View style={[styles.statBoxSm, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.statLabel, { color: colors.textSub }]}>CARTES</Text>
            <Text style={[styles.statValueSm, { color: colors.text }]}>{totalCards}</Text>
          </View>
          <View style={[styles.statBoxSm, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.statLabel, { color: colors.textSub }]}>🏒{nhlCount} · 🏈{nflCount}</Text>
            <Text style={[styles.statValueSm, { color: colors.text }]}>{cards.length} uniques</Text>
          </View>
        </View>
      </View>

      <View style={[styles.searchRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={{ fontSize: 16 }}>🔍</Text>
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Joueur, équipe, set…"
          placeholderTextColor={colors.muted}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Text style={{ color: colors.muted, fontSize: 16 }}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filterRow}>
        {[
          { key: 'ALL', label: 'Tous' },
          { key: 'NHL', label: '🏒 NHL' },
          { key: 'NFL', label: '🏈 NFL' },
          { key: 'NBA', label: '🏀 NBA' },
          { key: 'MLB', label: '⚾ MLB' },
          { key: 'OTHER', label: '🃏 Autre' },
        ].map(s => (
          <TouchableOpacity
            key={s.key}
            style={[styles.filterBtn, {
              backgroundColor: sportFilter === s.key ? colors.accentBg : colors.surface,
              borderColor: sportFilter === s.key ? colors.accent : colors.border,
            }]}
            onPress={() => setSportFilter(s.key)}
          >
            <Text style={[styles.filterTxt, { color: sportFilter === s.key ? colors.accent : colors.textSub }]}>
              {s.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]} edges={['top', 'left', 'right']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.bg} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Image source={require('../../assets/icon.png')} style={styles.logo} resizeMode="contain" />
        <View>
          <Text style={[styles.appTitle, { color: colors.text }]}>CardVault</Text>
          <Text style={[styles.appSub, { color: colors.textSub }]}>NHL · NFL Collection</Text>
        </View>
        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: statBoxBg, borderColor: statBoxBorder }]}
          onPress={() => navigation.navigate('Ajouter')}
        >
          <Text style={[styles.addBtnTxt, { color: colors.accent }]}>+ Ajouter</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filtered}
        key={numColumns}
        numColumns={numColumns}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <View style={{ flex: 1, margin: 6 }}>
            <CardItem
              card={item}
              cards={cards}
              onPress={() => navigation.navigate('CardDetail', { card: item, cards, setCards })}
              onDelete={() => handleDelete(item)}
              onEdit={() => handleEdit(item)}
              onSold={() => loadCards().then(setCards)}
            />
          </View>
        )}
        ListHeaderComponent={<ListHeader />}
        ListEmptyComponent={
          <View style={[styles.welcome, { backgroundColor: colors.bg }]}>
            <Image source={require('../../assets/icon.png')} style={styles.welcomeLogo} resizeMode="contain" />
            <Text style={[styles.welcomeTitle, { color: colors.text }]}>Bienvenue sur CardVault!</Text>
            <Text style={[styles.welcomeSub, { color: colors.textSub }]}>
              L'outil tout-en-un pour gérer ta collection de cartes sportives.
            </Text>
            {[
              { emoji: '➕', title: 'Ajoute tes cartes', desc: 'Appuie sur le bouton + pour ajouter une carte manuellement ou par photo.' },
              { emoji: '💰', title: 'Valorise ta collection', desc: 'Entre le prix estimé en CAD$ — la conversion USD se fait automatiquement.' },
              { emoji: '📊', title: 'Consulte les comparables', desc: 'Clique sur une carte → Comparables pour voir les ventes récentes sur eBay.' },
              { emoji: '📈', title: 'Suis tes statistiques', desc: 'L\'onglet Stats affiche la valeur totale, le top 5 et la répartition par sport.' },
            ].map((step, i) => (
              <View key={i} style={[styles.guideStep, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={[styles.guideEmojiBg, { backgroundColor: colors.accentBg }]}>
                  <Text style={styles.guideEmoji}>{step.emoji}</Text>
                </View>
                <View style={styles.guideText}>
                  <Text style={[styles.guideTitle, { color: colors.text }]}>{step.title}</Text>
                  <Text style={[styles.guideDesc, { color: colors.textSub }]}>{step.desc}</Text>
                </View>
              </View>
            ))}
            <TouchableOpacity
              style={[styles.ctaBtn, { backgroundColor: colors.accent }]}
              onPress={() => navigation.navigate('Ajouter')}
            >
              <Text style={styles.ctaBtnTxt}>➕ Ajouter ma première carte</Text>
            </TouchableOpacity>
            <Text style={[styles.welcomeHint, { color: colors.muted }]}>Supporte NHL · NFL · NBA · MLB</Text>
          </View>
        }
        contentContainerStyle={{ padding: width * 0.04 }}
        showsVerticalScrollIndicator={false}
      />

      {/* ── Modal édition rapide ──────────────────────────────────────────── */}
      <Modal visible={!!editCard} animationType="slide" onRequestClose={() => setEditCard(null)}>
        <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
          <View style={[styles.modalHeader, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
            <TouchableOpacity onPress={() => setEditCard(null)}>
              <Text style={[styles.modalClose, { color: colors.muted }]}>✕ Annuler</Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>✏️ Modifier</Text>
            <TouchableOpacity onPress={handleSaveEdit}>
              <Text style={[styles.modalSave, { color: colors.accent }]}>✅ Sauvegarder</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
            {/* Sport */}
            <Label text="Sport" />
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {SPORTS.map(s => (
                  <TouchableOpacity
                    key={s.key}
                    style={[styles.sportBtn, {
                      borderColor: editForm.sport === s.key ? colors.accent : colors.border,
                      backgroundColor: editForm.sport === s.key ? colors.accentBg : colors.surface,
                    }]}
                    onPress={() => setEditField('sport', s.key)}
                  >
                    <Text style={{ color: editForm.sport === s.key ? colors.accent : colors.textSub, fontWeight: '700' }}>
                      {s.emoji} {s.key}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <Label text="Joueur *" />
            <TextInput style={inputStyle} value={editForm.player} onChangeText={v => setEditField('player', v)} placeholderTextColor={colors.muted} />

            <Label text="Équipe" />
            <TextInput style={inputStyle} value={editForm.team} onChangeText={handleTeamChange} placeholderTextColor={colors.muted} />
            {teamSuggestions.length > 0 && (
              <View style={[styles.suggestions, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                {teamSuggestions.map(t => (
                  <TouchableOpacity key={t.abbr} style={[styles.suggestion, { borderBottomColor: colors.border }]}
                    onPress={() => {
                      setEditField('team', t.name);
                      setEditField('teamPrimary', t.primary);
                      setEditField('teamSecondary', t.secondary);
                      setTeamSuggestions([]);
                    }}>
                    <View style={[styles.swatch, { backgroundColor: t.primary }]} />
                    <View style={[styles.swatch, { backgroundColor: t.secondary }]} />
                    <Text style={[styles.suggTxt, { color: colors.text }]}>{t.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <Label text="Année" />
            <TextInput style={inputStyle} value={editForm.year} onChangeText={v => setEditField('year', v)} placeholderTextColor={colors.muted} />

            <Label text="Set / Collection" />
            <TextInput style={inputStyle} value={editForm.set} onChangeText={v => setEditField('set', v)} placeholderTextColor={colors.muted} />

            <Label text="# Carte" />
            <TextInput style={inputStyle} value={editForm.cardNumber} onChangeText={v => setEditField('cardNumber', v)} placeholderTextColor={colors.muted} />

            <Label text="Condition" />
            <TouchableOpacity
              style={[inputStyle, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}
              onPress={() => setCondOpen(!condOpen)}
            >
              <Text style={{ color: colors.text, fontSize: 14 }}>{editForm.condition}</Text>
              <Text style={{ color: colors.muted }}>{condOpen ? '▲' : '▼'}</Text>
            </TouchableOpacity>
            {condOpen && (
              <View style={[styles.dropdown, { backgroundColor: colors.surface, borderColor: colors.border, maxHeight: 200 }]}>
                <ScrollView>
                  {CONDITIONS.map(c => (
                    <TouchableOpacity key={c} style={[styles.dropItem, { borderBottomColor: colors.border }]}
                      onPress={() => { setEditField('condition', c); setCondOpen(false); }}>
                      <Text style={[styles.dropTxt, { color: editForm.condition === c ? colors.accent : colors.text }]}>{c}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Label text="Valeur (CAD$) *" />
                <TextInput style={inputStyle} value={editForm.valueCad} onChangeText={v => setEditField('valueCad', v)} keyboardType="decimal-pad" placeholderTextColor={colors.muted} />
              </View>
              <View style={{ flex: 0.4 }}>
                <Label text="Qté" />
                <TextInput style={inputStyle} value={editForm.quantity} onChangeText={v => setEditField('quantity', v)} keyboardType="number-pad" placeholderTextColor={colors.muted} />
              </View>
            </View>

            <Label text="Notes" />
            <TextInput style={[inputStyle, { height: 70, textAlignVertical: 'top' }]} value={editForm.notes} onChangeText={v => setEditField('notes', v)} multiline placeholderTextColor={colors.muted} />

            <TouchableOpacity
              style={[styles.saveBtn, { backgroundColor: colors.accent, marginTop: 20 }]}
              onPress={handleSaveEdit}
            >
              <Text style={styles.saveBtnTxt}>✅ Sauvegarder</Text>
            </TouchableOpacity>
            <View style={{ height: 32 }} />
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:         { flex: 1 },
  header:       { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, gap: 10 },
  logo:         { width: 38, height: 38, borderRadius: 10 },
  appTitle:     { fontSize: 18, fontWeight: '800', letterSpacing: 0.5 },
  appSub:       { fontSize: 10, letterSpacing: 1 },
  addBtn:       { marginLeft: 'auto', borderWidth: 1.5, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 },
  addBtnTxt:    { fontWeight: '800', fontSize: 13 },
  statsRow:     { flexDirection: 'row', marginBottom: 14 },
  statBox:      { borderWidth: 1.5, borderRadius: 14, padding: 16 },
  statBoxSm:    { borderWidth: 1, borderRadius: 12, padding: 12, flex: 1 },
  statLabel:    { fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 },
  statValue:    { fontWeight: '800', letterSpacing: 0.5 },
  statValueSm:  { fontWeight: '700', fontSize: 14 },
  statSub:      { fontSize: 11, marginTop: 2 },
  searchRow:    { flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 12 },
  searchInput:  { flex: 1, fontSize: 14 },
  filterRow:    { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  filterBtn:    { borderWidth: 1, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8 },
  filterTxt:    { fontWeight: '600', fontSize: 13 },
  // Welcome
  welcome:      { paddingTop: 10, paddingBottom: 40, alignItems: 'center', paddingHorizontal: 8 },
  welcomeLogo:  { width: 90, height: 90, borderRadius: 20, marginBottom: 16 },
  welcomeTitle: { fontSize: 24, fontWeight: '800', marginBottom: 8, textAlign: 'center' },
  welcomeSub:   { fontSize: 14, textAlign: 'center', marginBottom: 28, lineHeight: 20, paddingHorizontal: 16 },
  guideStep:    { flexDirection: 'row', alignItems: 'flex-start', gap: 14, borderWidth: 1, borderRadius: 14, padding: 16, marginBottom: 10, width: '100%' },
  guideEmojiBg: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  guideEmoji:   { fontSize: 22 },
  guideText:    { flex: 1 },
  guideTitle:   { fontSize: 14, fontWeight: '700', marginBottom: 4 },
  guideDesc:    { fontSize: 12, lineHeight: 18 },
  ctaBtn:       { borderRadius: 14, paddingVertical: 16, paddingHorizontal: 32, marginTop: 20, marginBottom: 12, width: '100%', alignItems: 'center' },
  ctaBtnTxt:    { color: '#0a0d14', fontWeight: '800', fontSize: 16 },
  welcomeHint:  { fontSize: 12, letterSpacing: 1 },
  // Modal edit
  modalHeader:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1 },
  modalClose:   { fontSize: 14 },
  modalTitle:   { fontSize: 16, fontWeight: '800' },
  modalSave:    { fontSize: 14, fontWeight: '700' },
  sportBtn:     { borderWidth: 1.5, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8 },
  suggestions:  { borderWidth: 1, borderRadius: 10, overflow: 'hidden', marginTop: 4 },
  suggestion:   { flexDirection: 'row', alignItems: 'center', padding: 10, borderBottomWidth: 1, gap: 8 },
  swatch:       { width: 14, height: 14, borderRadius: 7 },
  suggTxt:      { flex: 1, fontSize: 14 },
  dropdown:     { borderWidth: 1, borderRadius: 10, overflow: 'hidden', marginTop: 4 },
  dropItem:     { paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1 },
  dropTxt:      { fontSize: 14 },
  saveBtn:      { borderRadius: 12, paddingVertical: 15, alignItems: 'center' },
  saveBtnTxt:   { color: '#0a0d14', fontWeight: '800', fontSize: 15 },
});
