import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, Alert, Image, useWindowDimensions, ActivityIndicator, Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../context/ThemeContext';
import { CONDITIONS } from '../constants/theme';
import { suggestTeams, getTeamColors } from '../constants/teams';
import { addCard } from '../services/storage';
import { getEbayToken } from '../services/ebay';

const SPORTS = [
  { key: 'NHL', emoji: '🏒' },
  { key: 'NFL', emoji: '🏈' },
  { key: 'NBA', emoji: '🏀' },
  { key: 'MLB', emoji: '⚾' },
  { key: 'OTHER', emoji: '🃏' },
];

// ── Fetch photo depuis eBay Browse API ────────────────────────────────────────
async function fetchCardImageFromEbay(player, set, cardNumber, sport) {
  const token = await getEbayToken();
  const sportKeyword = { NHL: 'hockey card', NFL: 'football card', NBA: 'basketball card', MLB: 'baseball card' }[sport] || 'sports card';
  const numPart = cardNumber ? `#${cardNumber}` : '';
  // Nom du joueur entre guillemets pour résultats précis
  const query = `"${player}" ${set} ${numPart} ${sportKeyword}`.replace(/\s+/g, ' ').trim();
  const q = encodeURIComponent(query);
  const url = `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${q}&category_ids=261328&limit=20&sort=price`;

  const res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
    },
  });

  if (!res.ok) throw new Error(`eBay error: ${res.status}`);
  const data = await res.json();

  // Filtre — garde seulement les items qui contiennent le nom du joueur
  const lastName = player.split(' ').pop().toLowerCase();
  const items = (data.itemSummaries || [])
    .filter(i => i.title?.toLowerCase().includes(lastName))
    .filter(i => i.image?.imageUrl || i.thumbnailImages?.[0]?.imageUrl);

  return items.map(item => ({
    url:      item.image?.imageUrl || item.thumbnailImages?.[0]?.imageUrl,
    title:    item.title,
    price:    item.price?.value,
    currency: item.price?.currency,
  })).filter(i => i.url);
}

export default function AddCardScreen({ navigation, route }) {
  const { colors } = useTheme();
  const { width }  = useWindowDimensions();
  const { cards, setCards } = route?.params || { cards: [], setCards: () => {} };

  const [form, setForm] = useState({
    player: '', team: '', sport: 'NHL', year: '',
    set: '', condition: 'Mint 9', valueCad: '',
    quantity: '1', notes: '', cardNumber: '',
  });
  const [photo, setPhoto]                   = useState(null);
  const [condOpen, setCondOpen]             = useState(false);
  const [teamSuggestions, setTeamSuggestions] = useState([]);
  const [teamColors, setTeamColors]         = useState({ primary: null, secondary: null });

  // ── Photo eBay fetch ──────────────────────────────────────────────────────
  const [fetchingPhoto, setFetchingPhoto]   = useState(false);
  const [ebayPhotos, setEbayPhotos]         = useState([]);
  const [photoModalVisible, setPhotoModalVisible] = useState(false);

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleTeamChange = (v) => {
    setField('team', v);
    setTeamSuggestions(suggestTeams(form.sport, v));
    setTeamColors(getTeamColors(form.sport, v));
  };

  const selectTeam = (team) => {
    setField('team', team.name);
    setTeamSuggestions([]);
    setTeamColors({ primary: team.primary, secondary: team.secondary });
  };

  // ── Chercher photo eBay ───────────────────────────────────────────────────
  const handleFetchPhoto = async () => {
    if (!form.player.trim()) {
      Alert.alert('Joueur requis', 'Entre le nom du joueur avant de chercher la photo.');
      return;
    }
    setFetchingPhoto(true);
    try {
      const results = await fetchCardImageFromEbay(form.player, form.set, form.cardNumber, form.sport);
      if (results.length === 0) {
        Alert.alert('Aucune photo trouvée', 'Essaie avec plus de détails (set, numéro de carte).');
      } else {
        setEbayPhotos(results);
        setPhotoModalVisible(true);
      }
    } catch (e) {
      Alert.alert('Erreur', `Impossible de chercher la photo : ${e.message}`);
    }
    setFetchingPhoto(false);
  };

  const selectEbayPhoto = (imgUrl) => {
    setPhoto(imgUrl);
    setPhotoModalVisible(false);
    setEbayPhotos([]);
  };

  // ── Photo locale ──────────────────────────────────────────────────────────
  const pickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permission refusée'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.7, mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.canceled) setPhoto(result.assets[0].uri);
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permission refusée'); return; }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    if (!result.canceled) setPhoto(result.assets[0].uri);
  };

  // ── Ajouter carte ─────────────────────────────────────────────────────────
  const handleAdd = async () => {
    if (!form.player.trim() || !form.valueCad) {
      Alert.alert('Champs manquants', 'Le joueur et la valeur sont requis.');
      return;
    }
    const newCard = {
      ...form,
      valueCad:      parseFloat(form.valueCad),
      quantity:      parseInt(form.quantity) || 1,
      img:           photo,
      teamPrimary:   teamColors.primary,
      teamSecondary: teamColors.secondary,
    };
    const updated = await addCard(cards, newCard);
    if (setCards) setCards(updated);
    navigation.goBack();
  };

  const px = width * 0.05;

  const inputStyle = {
    backgroundColor: colors.surface,
    borderColor:     colors.border,
    color:           colors.text,
    borderWidth: 1, borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 11,
    fontSize: 14,
  };

  const Label = ({ text }) => (
    <Text style={{ color: colors.textSub, fontSize: 12, marginBottom: 6, marginTop: 14 }}>{text}</Text>
  );

  // Bouton chercher photo actif si joueur rempli
  const canFetchPhoto = form.player.trim().length > 0;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]} edges={['top','left','right']}>

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.back, { color: colors.accent }]}>← Retour</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>+ Ajouter une carte</Text>
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingHorizontal: px }]} keyboardShouldPersistTaps="handled">

        {/* ── Section Photo ─────────────────────────────────────────────── */}
        <View style={[styles.photoSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.photoTitle, { color: colors.text }]}>📸 Photo de la carte</Text>

          {/* Preview */}
          {photo ? (
            <Image source={{ uri: photo }} style={styles.photoPreview} resizeMode="contain" />
          ) : (
            <View style={[styles.photoPlaceholder, { backgroundColor: colors.surface, borderColor: colors.accent + '44' }]}>
              <Text style={{ fontSize: 44 }}>🃏</Text>
              <Text style={[styles.photoPlaceholderTxt, { color: colors.muted }]}>Aucune photo</Text>
            </View>
          )}

          {/* Boutons photo */}
          <View style={styles.photoRow}>
            <TouchableOpacity style={[styles.photoBtn, { backgroundColor: colors.accentBg, borderColor: colors.accent }]} onPress={takePhoto}>
              <Text style={[styles.photoBtnTxt, { color: colors.accent }]}>📸 Caméra</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.photoBtn, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={pickPhoto}>
              <Text style={[styles.photoBtnTxt, { color: colors.textSub }]}>🖼 Galerie</Text>
            </TouchableOpacity>
            {photo && (
              <TouchableOpacity style={[styles.photoBtn, { backgroundColor: colors.red + '15', borderColor: colors.red + '55' }]} onPress={() => setPhoto(null)}>
                <Text style={[styles.photoBtnTxt, { color: colors.red }]}>🗑 Retirer</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Bouton fetch eBay */}
          <TouchableOpacity
            style={[
              styles.fetchPhotoBtn,
              {
                backgroundColor: canFetchPhoto ? colors.navy : colors.surface,
                borderColor: canFetchPhoto ? colors.accent : colors.border,
                opacity: canFetchPhoto ? 1 : 0.5,
              }
            ]}
            onPress={handleFetchPhoto}
            disabled={!canFetchPhoto || fetchingPhoto}
          >
            {fetchingPhoto ? (
              <ActivityIndicator color={colors.accent} size="small" />
            ) : (
              <Text style={[styles.fetchPhotoBtnTxt, { color: canFetchPhoto ? colors.accent : colors.muted }]}>
                🔍 Chercher la photo sur eBay
              </Text>
            )}
            {!fetchingPhoto && (
              <Text style={[styles.fetchPhotoHint, { color: colors.muted }]}>
                Basé sur joueur + set + # carte
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* ── Formulaire ───────────────────────────────────────────────── */}
        <View style={[styles.form, { backgroundColor: colors.card, borderColor: colors.border }]}>

          <Label text="Sport" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.sportRow}>
              {SPORTS.map(s => (
                <TouchableOpacity
                  key={s.key}
                  style={[styles.sportBtn, {
                    borderColor: form.sport === s.key ? colors.accent : colors.border,
                    backgroundColor: form.sport === s.key ? colors.accentBg : colors.surface,
                  }]}
                  onPress={() => { setField('sport', s.key); setTeamSuggestions([]); }}
                >
                  <Text style={[styles.sportTxt, { color: form.sport === s.key ? colors.accent : colors.textSub }]}>
                    {s.emoji} {s.key}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <Label text="Joueur *" />
          <TextInput style={inputStyle} placeholder="Connor McDavid" placeholderTextColor={colors.muted} value={form.player} onChangeText={v => setField('player', v)} />

          <Label text="Équipe" />
          <TextInput style={inputStyle} placeholder="Edmonton Oilers" placeholderTextColor={colors.muted} value={form.team} onChangeText={handleTeamChange} />
          {teamSuggestions.length > 0 && (
            <View style={[styles.suggestions, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              {teamSuggestions.map(team => (
                <TouchableOpacity key={team.abbr} style={[styles.suggestion, { borderBottomColor: colors.border }]} onPress={() => selectTeam(team)}>
                  <View style={[styles.suggestionColor, { backgroundColor: team.primary }]} />
                  <View style={[styles.suggestionColor, { backgroundColor: team.secondary }]} />
                  <Text style={[styles.suggestionTxt, { color: colors.text }]}>{team.name}</Text>
                  <Text style={[styles.suggestionAbbr, { color: colors.muted }]}>{team.abbr}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          {teamColors.primary && (
            <View style={styles.colorPreview}>
              <View style={[styles.colorSwatch, { backgroundColor: teamColors.primary }]} />
              <View style={[styles.colorSwatch, { backgroundColor: teamColors.secondary }]} />
              <Text style={[styles.colorLabel, { color: colors.muted }]}>Couleurs officielles détectées ✓</Text>
            </View>
          )}

          <Label text="Année" />
          <TextInput style={inputStyle} placeholder="2015-16" placeholderTextColor={colors.muted} value={form.year} onChangeText={v => setField('year', v)} />

          <Label text="Set / Collection" />
          <TextInput style={inputStyle} placeholder="Upper Deck Young Guns" placeholderTextColor={colors.muted} value={form.set} onChangeText={v => setField('set', v)} />

          <Label text="# Carte" />
          <TextInput style={inputStyle} placeholder="Ex: 201, RC-15…" placeholderTextColor={colors.muted} value={form.cardNumber} onChangeText={v => setField('cardNumber', v)} />

          <Label text="Condition" />
          <TouchableOpacity style={[inputStyle, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]} onPress={() => setCondOpen(!condOpen)}>
            <Text style={{ color: colors.text, fontSize: 14 }}>{form.condition}</Text>
            <Text style={{ color: colors.muted }}>{condOpen ? '▲' : '▼'}</Text>
          </TouchableOpacity>
          {condOpen && (
            <View style={[styles.dropdown, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              {[
                { header: '📋 Non gradé', items: CONDITIONS.slice(0, 10) },
                { header: '🏆 PSA', items: CONDITIONS.slice(10, 23) },
                { header: '💎 BGS / Beckett', items: CONDITIONS.slice(23, 32) },
                { header: '🔵 SGC', items: CONDITIONS.slice(32, 39) },
                { header: '🟡 CGC', items: CONDITIONS.slice(39) },
              ].map(group => (
                <View key={group.header}>
                  <View style={[styles.dropHeader, { backgroundColor: colors.border }]}>
                    <Text style={[styles.dropHeaderTxt, { color: colors.textSub }]}>{group.header}</Text>
                  </View>
                  {group.items.map(c => (
                    <TouchableOpacity key={c} style={[styles.dropItem, { borderBottomColor: colors.border }]} onPress={() => { setField('condition', c); setCondOpen(false); }}>
                      <Text style={[styles.dropTxt, { color: form.condition === c ? colors.accent : colors.text }]}>{c}</Text>
                      {form.condition === c && <Text style={{ color: colors.accent }}>✓</Text>}
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </View>
          )}

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Label text="Valeur (CAD$) *" />
              <TextInput style={inputStyle} placeholder="0.00" placeholderTextColor={colors.muted} value={form.valueCad} onChangeText={v => setField('valueCad', v)} keyboardType="decimal-pad" />
            </View>
            <View style={{ width: 12 }} />
            <View style={{ flex: 0.45 }}>
              <Label text="Qté" />
              <TextInput style={inputStyle} placeholder="1" placeholderTextColor={colors.muted} value={form.quantity} onChangeText={v => setField('quantity', v)} keyboardType="number-pad" />
            </View>
          </View>

          <Label text="Notes" />
          <TextInput style={[inputStyle, { height: 76, textAlignVertical: 'top' }]} placeholder="RC, autographe, numérotée…" placeholderTextColor={colors.muted} value={form.notes} onChangeText={v => setField('notes', v)} multiline />

          <TouchableOpacity style={[styles.addBtn, { backgroundColor: colors.accent, marginTop: 20 }]} onPress={handleAdd}>
            <Text style={styles.addBtnTxt}>✅ Ajouter à ma collection</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* ── Modal sélection photo eBay ──────────────────────────────────── */}
      <Modal visible={photoModalVisible} animationType="slide" onRequestClose={() => setPhotoModalVisible(false)}>
        <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
          <View style={[styles.modalHeader, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
            <TouchableOpacity onPress={() => setPhotoModalVisible(false)}>
              <Text style={[styles.modalClose, { color: colors.red }]}>✕ Annuler</Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              📸 Choisir une photo ({ebayPhotos.length} trouvées)
            </Text>
          </View>

          <ScrollView contentContainerStyle={styles.photoGrid}>
            {ebayPhotos.map((item, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.photoGridItem, { borderColor: colors.border, backgroundColor: colors.card }]}
                onPress={() => selectEbayPhoto(item.url)}
                activeOpacity={0.75}
              >
                <Image source={{ uri: item.url }} style={styles.photoGridImg} resizeMode="contain" />
                <View style={[styles.photoGridInfo, { backgroundColor: colors.surface }]}>
                  <Text style={[styles.photoGridTitle, { color: colors.text }]} numberOfLines={2}>{item.title}</Text>
                  {item.price && (
                    <Text style={[styles.photoGridPrice, { color: colors.accent }]}>
                      {item.currency === 'USD' ? 'US$' : 'CA$'}{item.price}
                    </Text>
                  )}
                  <Text style={[styles.photoGridSelect, { color: colors.accent }]}>✅ Utiliser cette photo</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:               { flex: 1 },
  header:             { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderBottomWidth: 1 },
  back:               { fontSize: 14, fontWeight: '600' },
  title:              { fontSize: 18, fontWeight: '800' },
  scroll:             { paddingVertical: 20 },
  photoSection:       { borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 16, gap: 12 },
  photoTitle:         { fontSize: 15, fontWeight: '700' },
  photoPreview:       { width: '100%', height: 200, borderRadius: 10 },
  photoPlaceholder:   { height: 130, borderRadius: 12, borderWidth: 1.5, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', gap: 6 },
  photoPlaceholderTxt: { fontSize: 13 },
  photoRow:           { flexDirection: 'row', gap: 8 },
  photoBtn:           { flex: 1, borderWidth: 1, borderRadius: 10, paddingVertical: 11, alignItems: 'center' },
  photoBtnTxt:        { fontWeight: '700', fontSize: 13 },
  fetchPhotoBtn:      { borderWidth: 1.5, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 16, alignItems: 'center', gap: 4 },
  fetchPhotoBtnTxt:   { fontWeight: '700', fontSize: 14 },
  fetchPhotoHint:     { fontSize: 11 },
  form:               { borderRadius: 16, borderWidth: 1, padding: 16 },
  sportRow:           { flexDirection: 'row', gap: 8, marginBottom: 2 },
  sportBtn:           { borderWidth: 1.5, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8 },
  sportTxt:           { fontWeight: '700', fontSize: 13 },
  suggestions:        { borderWidth: 1, borderRadius: 10, overflow: 'hidden', marginTop: 4 },
  suggestion:         { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1, gap: 8 },
  suggestionColor:    { width: 14, height: 14, borderRadius: 7 },
  suggestionTxt:      { flex: 1, fontSize: 14 },
  suggestionAbbr:     { fontSize: 12 },
  colorPreview:       { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  colorSwatch:        { width: 20, height: 20, borderRadius: 10 },
  colorLabel:         { fontSize: 11 },
  row:                { flexDirection: 'row' },
  dropdown:           { borderWidth: 1, borderRadius: 10, overflow: 'hidden', marginTop: 4, maxHeight: 320 },
  dropHeader:         { paddingHorizontal: 14, paddingVertical: 8 },
  dropHeaderTxt:      { fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
  dropItem:           { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1 },
  dropTxt:            { fontSize: 14, flex: 1 },
  addBtn:             { borderRadius: 12, paddingVertical: 15, alignItems: 'center' },
  addBtnTxt:          { color: '#0a0d14', fontWeight: '800', fontSize: 15 },
  // Modal
  modalHeader:        { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderBottomWidth: 1 },
  modalClose:         { fontSize: 14, fontWeight: '700' },
  modalTitle:         { flex: 1, fontSize: 15, fontWeight: '700' },
  photoGrid:          { padding: 12, gap: 12 },
  photoGridItem:      { borderWidth: 1, borderRadius: 14, overflow: 'hidden' },
  photoGridImg:       { width: '100%', height: 200, backgroundColor: '#111' },
  photoGridInfo:      { padding: 12, gap: 4 },
  photoGridTitle:     { fontSize: 12, lineHeight: 16 },
  photoGridPrice:     { fontSize: 14, fontWeight: '800' },
  photoGridSelect:    { fontSize: 13, fontWeight: '700', marginTop: 4 },
});
