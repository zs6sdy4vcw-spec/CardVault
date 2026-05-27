import t from '../i18n/translations';
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Image,
  StyleSheet, SafeAreaView, Alert, Linking, useWindowDimensions,
  TextInput, Modal,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme, formatCAD, formatUSD, CAD_USD_RATE } from '../context/ThemeContext';
import { SPORT_COLORS, SPORT_EMOJIS, CONDITIONS } from '../constants/theme';
import { deleteCard, saveCards, loadCards } from '../services/storage';
import { buildEbayActiveUrl, buildEbaySellUrl } from '../services/ebay';

const SPORTS = [
  { key: 'NHL', emoji: '🏒' },
  { key: 'NFL', emoji: '🏈' },
  { key: 'NBA', emoji: '🏀' },
  { key: 'MLB', emoji: '⚾' },
  { key: 'OTHER', emoji: '🃏' },
];

export default function CardDetailScreen({ navigation, route }) {
  const { card: initialCard, cards, setCards } = route.params;
  const { colors } = useTheme();
  const { width } = useWindowDimensions();

  const [card, setCard]       = useState(initialCard);
  const [editing, setEditing] = useState(false);
  const [form, setForm]       = useState({ ...initialCard, valueCad: String(initialCard.valueCad), quantity: String(initialCard.quantity) });
  const [condOpen, setCondOpen] = useState(false);

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const sportColor = SPORT_COLORS[card.sport] || colors.accent;
  const sportEmoji = SPORT_EMOJIS[card.sport] || '🃏';
  const ebayUrl    = buildEbayActiveUrl(card.player, card.set, card.condition, card.year, card.cardNumber);
  const sellUrl    = buildEbaySellUrl(card.player, card.set, card.year);
  const px         = width * 0.05;

  // ── Supprimer ────────────────────────────────────────────────────────────────
  const handleDelete = () => {
    Alert.alert(t.delete, `Supprimer ${card.player}?`, [
      { text: t.cancel, style: 'cancel' },
      {
        text: t.delete, style: 'destructive',
        onPress: async () => {
          const updated = await deleteCard(cards, card.id);
          if (setCards) setCards(updated);
          navigation.goBack();
        },
      },
    ]);
  };

  // ── Sauvegarder l'édition ─────────────────────────────────────────────────
  const handleSave = async () => {
    if (!form.player.trim() || !form.valueCad) {
      Alert.alert(t.add_required, 'Le joueur et la valeur sont requis.');
      return;
    }
    const updated = {
      ...form,
      valueCad: parseFloat(form.valueCad) || 0,
      quantity: parseInt(form.quantity) || 1,
    };

    // Met à jour dans le tableau
    const allCards = await loadCards();
    const newCards = allCards.map(c => c.id === card.id ? updated : c);
    await saveCards(newCards);
    if (setCards) setCards(newCards);
    setCard(updated);
    setEditing(false);
  };

  // ── Photo dans l'édition ──────────────────────────────────────────────────
  const pickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permission refusée'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.7 });
    if (!result.canceled) setField('img', result.assets[0].uri);
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permission refusée'); return; }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    if (!result.canceled) setField('img', result.assets[0].uri);
  };

  const inputStyle = {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    color: colors.text,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    marginBottom: 2,
  };

  const Label = ({ text }) => (
    <Text style={{ color: colors.textSub, fontSize: 12, marginBottom: 6, marginTop: 14 }}>{text}</Text>
  );

  const Row = ({ label, value }) => (
    <View style={[styles.row, { borderBottomColor: colors.border }]}>
      <Text style={[styles.rowLabel, { color: colors.textSub }]}>{label}</Text>
      <Text style={[styles.rowValue, { color: colors.text }]}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.back, { color: colors.accent }]}>← Retour</Text>
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.editBtn, { backgroundColor: colors.accentBg, borderColor: colors.accent }]}
            onPress={() => { setForm({ ...card, valueCad: String(card.valueCad), quantity: String(card.quantity) }); setEditing(true); }}
          >
            <Text style={[styles.editBtnTxt, { color: colors.accent }]}>✏️ Éditer</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete}>
            <Text style={[styles.deleteBtn, { color: colors.red }]}>🗑</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingHorizontal: px }]} showsVerticalScrollIndicator={false}>

        {/* Sport stripe */}
        <View style={[styles.stripe, { backgroundColor: sportColor }]} />

        {/* Photo */}
        {card.img && (
          <Image source={{ uri: card.img }} style={[styles.image, { backgroundColor: colors.surface }]} resizeMode="contain" />
        )}

        {/* Badge + nom */}
        <View style={[styles.badge, { backgroundColor: sportColor + '22', borderColor: sportColor + '55' }]}>
          <Text style={[styles.badgeTxt, { color: sportColor }]}>{sportEmoji} {card.sport}</Text>
        </View>
        <Text style={[styles.player, { color: colors.text }]}>{card.player}</Text>
        <Text style={[styles.team, { color: colors.textSub }]}>{card.team} · {card.year}</Text>

        {/* Info grid */}
        <View style={[styles.grid, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Row label="Set" value={card.set || '—'} />
          {card.cardNumber ? <Row label=t.add_number value={`#${card.cardNumber}`} /> : null}
          <Row label=t.add_condition value={card.condition} />
          <Row label="Quantité" value={String(card.quantity)} />
          <Row label=t.add_year value={card.year || '—'} />
        </View>

        {/* Valorisation */}
        <View style={[styles.valuationBox, { backgroundColor: colors.navy, borderColor: colors.accent }]}>
          <Text style={[styles.valuationLabel, { color: colors.accent }]}>VALORISATION</Text>
          <Text style={[styles.valueCAD, { color: '#ffffff' }]}>{formatCAD(card.valueCad)}</Text>
          <Text style={[styles.valueUSD, { color: colors.textSub }]}>≈ {formatUSD(card.valueCad * CAD_USD_RATE)} · taux {CAD_USD_RATE}</Text>
          {card.quantity > 1 && (
            <Text style={[styles.valueTotal, { color: colors.green }]}>
              Total : {formatCAD(card.valueCad * card.quantity)} / {formatUSD(card.valueCad * card.quantity * CAD_USD_RATE)}
            </Text>
          )}
        </View>

        {card.notes ? <Text style={[styles.notes, { color: colors.textSub }]}>📝 {card.notes}</Text> : null}

        {/* Boutons action */}
        <TouchableOpacity
          style={[styles.btnPrimary, { backgroundColor: colors.accent }]}
          onPress={() => navigation.navigate('Comparables', { card })}
        >
          <Text style={styles.btnPrimaryTxt}>📊 Voir les comparables marché</Text>
        </TouchableOpacity>

        <View style={styles.btnRow}>
          <TouchableOpacity style={[styles.btnSecondary, { borderColor: colors.border, backgroundColor: colors.card }]} onPress={() => Linking.openURL(ebayUrl)}>
            <Text style={[styles.btnSecondaryTxt, { color: colors.textSub }]}>🛒 Acheter sur eBay</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btnSecondary, { borderColor: colors.border, backgroundColor: colors.card }]} onPress={() => Linking.openURL(sellUrl)}>
            <Text style={[styles.btnSecondaryTxt, { color: colors.textSub }]}>💰 Vendre sur eBay</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* ── Modal Édition ──────────────────────────────────────────────────── */}
      <Modal visible={editing} animationType="slide" onRequestClose={() => setEditing(false)}>
        <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>

          {/* Header modal */}
          <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
            <TouchableOpacity onPress={() => setEditing(false)}>
              <Text style={[styles.back, { color: colors.muted }]}>✕ Annuler</Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>✏️ Modifier la carte</Text>
            <TouchableOpacity onPress={handleSave}>
              <Text style={[styles.saveBtn, { color: colors.accent }]}>✅ Sauvegarder</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={[styles.scroll, { paddingHorizontal: px }]} keyboardShouldPersistTaps="handled">

            {/* Photo */}
            <View style={[styles.photoSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.photoSectionTitle, { color: colors.text }]}>📸 Photo de la carte</Text>
              {form.img ? (
                <Image source={{ uri: form.img }} style={styles.photoPreviewLarge} resizeMode="contain" />
              ) : (
                <View style={[styles.photoPlaceholderBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <Text style={{ fontSize: 40 }}>🃏</Text>
                  <Text style={[styles.photoPlaceholderTxt, { color: colors.muted }]}>Aucune photo</Text>
                </View>
              )}
              <View style={styles.photoRow}>
                <TouchableOpacity style={[styles.photoBtn, { borderColor: colors.accent, backgroundColor: colors.accentBg }]} onPress={takePhoto}>
                  <Text style={[styles.photoBtnTxt, { color: colors.accent }]}>📸 Caméra</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.photoBtn, { borderColor: colors.border, backgroundColor: colors.surface }]} onPress={pickPhoto}>
                  <Text style={[styles.photoBtnTxt, { color: colors.textSub }]}>🖼 Galerie</Text>
                </TouchableOpacity>
                {form.img && (
                  <TouchableOpacity style={[styles.photoBtn, { borderColor: colors.red + '55', backgroundColor: colors.red + '15' }]} onPress={() => setField('img', null)}>
                    <Text style={[styles.photoBtnTxt, { color: colors.red }]}>🗑 Retirer</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Sport */}
            <Label text=t.add_sport />
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.sportRow}>
                {SPORTS.map(s => (
                  <TouchableOpacity
                    key={s.key}
                    style={[styles.sportBtn, { borderColor: form.sport === s.key ? colors.accent : colors.border, backgroundColor: form.sport === s.key ? colors.accentBg : colors.surface }]}
                    onPress={() => setField('sport', s.key)}
                  >
                    <Text style={[styles.sportTxt, { color: form.sport === s.key ? colors.accent : colors.textSub }]}>{s.emoji} {s.key}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <Label text=t.add_player />
            <TextInput style={inputStyle} value={form.player} onChangeText={v => setField('player', v)} placeholderTextColor={colors.muted} />

            <Label text=t.add_team />
            <TextInput style={inputStyle} value={form.team} onChangeText={v => setField('team', v)} placeholderTextColor={colors.muted} />

            <Label text=t.add_year />
            <TextInput style={inputStyle} value={form.year} onChangeText={v => setField('year', v)} placeholderTextColor={colors.muted} />

            <Label text=t.add_set />
            <TextInput style={inputStyle} value={form.set} onChangeText={v => setField('set', v)} placeholderTextColor={colors.muted} />

            <Label text=t.add_condition />
            <TouchableOpacity style={[inputStyle, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]} onPress={() => setCondOpen(!condOpen)}>
              <Text style={{ color: colors.text, fontSize: 14 }}>{form.condition}</Text>
              <Text style={{ color: colors.muted }}>{condOpen ? '▲' : '▼'}</Text>
            </TouchableOpacity>
            {condOpen && (
              <View style={[styles.dropdown, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                {CONDITIONS.map(c => (
                  <TouchableOpacity key={c} style={[styles.dropItem, { borderBottomColor: colors.border }]} onPress={() => { setField('condition', c); setCondOpen(false); }}>
                    <Text style={[styles.dropTxt, { color: form.condition === c ? colors.accent : colors.text }]}>{c}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <View style={styles.row2}>
              <View style={{ flex: 1 }}>
                <Label text="Valeur (CAD$) *" />
                <TextInput style={inputStyle} value={form.valueCad} onChangeText={v => setField('valueCad', v)} keyboardType="decimal-pad" placeholderTextColor={colors.muted} />
              </View>
              <View style={{ width: 12 }} />
              <View style={{ flex: 0.45 }}>
                <Label text="Qté" />
                <TextInput style={inputStyle} value={form.quantity} onChangeText={v => setField('quantity', v)} keyboardType="number-pad" placeholderTextColor={colors.muted} />
              </View>
            </View>

            <Label text=t.add_number />
            <TextInput style={inputStyle} value={form.cardNumber} onChangeText={v => setField('cardNumber', v)} placeholder="Ex: 201" placeholderTextColor={colors.muted} />

            <Label text=t.add_notes />
            <TextInput style={[inputStyle, { height: 76, textAlignVertical: 'top' }]} value={form.notes} onChangeText={v => setField('notes', v)} multiline placeholderTextColor={colors.muted} />

            <TouchableOpacity style={[styles.btnPrimary, { backgroundColor: colors.accent, marginTop: 20 }]} onPress={handleSave}>
              <Text style={styles.btnPrimaryTxt}>✅ Sauvegarder les modifications</Text>
            </TouchableOpacity>

            <View style={{ height: 32 }} />
          </ScrollView>
        </SafeAreaView>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:             { flex: 1 },
  header:           { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1 },
  back:             { fontSize: 14, fontWeight: '600' },
  headerActions:    { flexDirection: 'row', alignItems: 'center', gap: 12 },
  editBtn:          { borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 7 },
  editBtnTxt:       { fontSize: 13, fontWeight: '700' },
  deleteBtn:        { fontSize: 20 },
  modalTitle:       { fontSize: 16, fontWeight: '800' },
  saveBtn:          { fontSize: 14, fontWeight: '700' },
  scroll:           { paddingVertical: 20 },
  stripe:           { height: 4, borderRadius: 2, marginBottom: 16 },
  image:            { width: '100%', height: 220, borderRadius: 12, marginBottom: 16 },
  badge:            { alignSelf: 'flex-start', borderWidth: 1, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4, marginBottom: 10 },
  badgeTxt:         { fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  player:           { fontSize: 32, fontWeight: '900', letterSpacing: 0.5, marginBottom: 4 },
  team:             { fontSize: 16, marginBottom: 20 },
  grid:             { borderRadius: 14, borderWidth: 1, overflow: 'hidden', marginBottom: 16 },
  row:              { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 13, borderBottomWidth: 1 },
  rowLabel:         { fontSize: 13 },
  rowValue:         { fontWeight: '600', fontSize: 13 },
  valuationBox:     { borderWidth: 1.5, borderRadius: 14, padding: 20, marginBottom: 16 },
  valuationLabel:   { fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 },
  valueCAD:         { fontSize: 38, fontWeight: '800' },
  valueUSD:         { fontSize: 14, marginTop: 4 },
  valueTotal:       { fontSize: 13, marginTop: 8 },
  notes:            { fontSize: 13, fontStyle: 'italic', marginBottom: 16, lineHeight: 20 },
  btnPrimary:       { borderRadius: 12, paddingVertical: 15, alignItems: 'center', marginBottom: 12 },
  btnPrimaryTxt:    { color: '#0a0d14', fontWeight: '800', fontSize: 15 },
  btnRow:           { flexDirection: 'row', gap: 10 },
  btnSecondary:     { flex: 1, borderWidth: 1, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  btnSecondaryTxt:  { fontWeight: '600', fontSize: 13 },
  // Modal edit
  photoSection:       { borderRadius: 14, borderWidth: 1, padding: 16, marginBottom: 16, gap: 12 },
  photoSectionTitle:  { fontSize: 14, fontWeight: '700' },
  photoPreviewLarge:  { width: '100%', height: 200, borderRadius: 10 },
  photoPlaceholderBox: { height: 140, borderRadius: 10, borderWidth: 1, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', gap: 8 },
  photoPlaceholderTxt: { fontSize: 13 },
  photoRow:           { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  photoBtn:           { flex: 1, minWidth: 90, borderWidth: 1, borderRadius: 8, paddingVertical: 10, alignItems: 'center' },
  photoBtnTxt:        { fontWeight: '600', fontSize: 13 },
  sportRow:           { flexDirection: 'row', gap: 8 },
  sportBtn:           { borderWidth: 1.5, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8 },
  sportTxt:           { fontWeight: '700', fontSize: 13 },
  row2:               { flexDirection: 'row' },
  dropdown:           { borderWidth: 1, borderRadius: 10, overflow: 'hidden', marginTop: 4 },
  dropItem:           { paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1 },
  dropTxt:            { fontSize: 14 },
});
