import React from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  StyleSheet, SafeAreaView, Switch, useWindowDimensions, Image,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

function SettingRow({ label, sub, children, colors }) {
  return (
    <View style={[styles.row, { borderBottomColor: colors.border }]}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.rowLabel, { color: colors.text }]}>{label}</Text>
        {sub && <Text style={[styles.rowSub, { color: colors.textSub }]}>{sub}</Text>}
      </View>
      {children}
    </View>
  );
}

function ThemeBtn({ label, selected, onPress, colors }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.themeBtn, {
        backgroundColor: selected ? colors.accentBg : colors.surface,
        borderColor: selected ? colors.accent : colors.border,
      }]}
    >
      <Text style={[styles.themeBtnTxt, { color: selected ? colors.accent : colors.textSub }]}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const { colors, mode, setThemeMode, isDark } = useTheme();
  const { width } = useWindowDimensions();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>⚙️ Réglages</Text>
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingHorizontal: width * 0.05 }]}>

        {/* Logo app */}
        <View style={[styles.logoSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Image
            source={require('../../assets/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={[styles.appName, { color: colors.text }]}>CardVault</Text>
          <Text style={[styles.appVersion, { color: colors.textSub }]}>Version 1.0.0 · Collector Series</Text>
        </View>

        {/* Thème */}
        <Text style={[styles.sectionTitle, { color: colors.textSub }]}>APPARENCE</Text>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Thème de l'application</Text>
          <View style={styles.themeBtns}>
            <ThemeBtn label="☀️ Clair"    selected={mode === 'light'}  onPress={() => setThemeMode('light')}  colors={colors} />
            <ThemeBtn label="🌙 Sombre"   selected={mode === 'dark'}   onPress={() => setThemeMode('dark')}   colors={colors} />
            <ThemeBtn label="📱 Système"  selected={mode === 'system'} onPress={() => setThemeMode('system')} colors={colors} />
          </View>
          <Text style={[styles.themeNote, { color: colors.muted }]}>
            {mode === 'system' ? `Thème actuel : ${isDark ? 'Sombre' : 'Clair'} (selon ton téléphone)` : ''}
          </Text>
        </View>

        {/* Collection */}
        <Text style={[styles.sectionTitle, { color: colors.textSub, marginTop: 24 }]}>COLLECTION</Text>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SettingRow label="Devise principale" sub="Valeur affichée en CAD$" colors={colors}>
            <View style={[styles.badge, { backgroundColor: colors.accentBg, borderColor: colors.accent }]}>
              <Text style={[styles.badgeTxt, { color: colors.accent }]}>CAD / USD</Text>
            </View>
          </SettingRow>
          <SettingRow label="Sports supportés" sub="NHL Hockey · NFL Football" colors={colors}>
            <Text style={{ fontSize: 18 }}>🏒🏈</Text>
          </SettingRow>
        </View>

        {/* À propos */}
        <Text style={[styles.sectionTitle, { color: colors.textSub, marginTop: 24 }]}>À PROPOS</Text>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SettingRow label="Version" colors={colors}>
            <Text style={[styles.rowValue, { color: colors.textSub }]}>1.0.0</Text>
          </SettingRow>
          <SettingRow label="Données eBay" sub="Browse API · Production" colors={colors}>
            <View style={[styles.badge, { backgroundColor: colors.green + '22', borderColor: colors.green }]}>
              <Text style={[styles.badgeTxt, { color: colors.green }]}>Actif</Text>
            </View>
          </SettingRow>
          <SettingRow label="Stockage" sub="Local · AsyncStorage" colors={colors}>
            <Text style={[styles.rowValue, { color: colors.textSub }]}>Sur l'appareil</Text>
          </SettingRow>
        </View>

        {/* Accent bleu nuit / cyan */}
        <View style={[styles.accentBar, { backgroundColor: colors.navy, borderColor: colors.accent }]}>
          <Text style={[styles.accentTxt, { color: colors.accent }]}>CardVault · NHL & NFL Collector</Text>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:         { flex: 1 },
  header:       { padding: 16, borderBottomWidth: 1 },
  title:        { fontSize: 22, fontWeight: '800' },
  scroll:       { paddingVertical: 20 },
  logoSection:  { alignItems: 'center', borderRadius: 16, borderWidth: 1, padding: 24, marginBottom: 24 },
  logo:         { width: 80, height: 80, borderRadius: 18, marginBottom: 10 },
  appName:      { fontSize: 20, fontWeight: '800', marginBottom: 4 },
  appVersion:   { fontSize: 12, letterSpacing: 1 },
  sectionTitle: { fontSize: 11, fontWeight: '600', letterSpacing: 2, marginBottom: 8 },
  card:         { borderRadius: 14, borderWidth: 1, overflow: 'hidden', marginBottom: 4 },
  cardTitle:    { fontSize: 14, fontWeight: '700', padding: 16, paddingBottom: 12 },
  row:          { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1 },
  rowLabel:     { fontSize: 14, fontWeight: '500' },
  rowSub:       { fontSize: 12, marginTop: 2 },
  rowValue:     { fontSize: 13 },
  badge:        { borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  badgeTxt:     { fontSize: 11, fontWeight: '700' },
  themeBtns:    { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingBottom: 12 },
  themeBtn:     { flex: 1, borderWidth: 1.5, borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  themeBtnTxt:  { fontSize: 12, fontWeight: '700' },
  themeNote:    { fontSize: 11, textAlign: 'center', paddingHorizontal: 16, paddingBottom: 12 },
  accentBar:    { borderWidth: 1, borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 24 },
  accentTxt:    { fontSize: 12, fontWeight: '700', letterSpacing: 2 },
});
