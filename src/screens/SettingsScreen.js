import t from '../i18n/translations';
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Switch,
  SafeAreaView, StatusBar, ScrollView, useWindowDimensions, Image, Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import { lang } from '../i18n/translations';

const APP_VERSION = '1.0.0';

export default function SettingsScreen() {
  const { colors, isDark, mode, setThemeMode } = useTheme();
  const { width } = useWindowDimensions();
  const [notifs, setNotifs]   = useState(true);
  const [sounds, setSounds]   = useState(true);

  const bg    = isDark ? '#070B17' : '#F5F7FC';
  const surf  = isDark ? '#0F172A' : '#FFFFFF';
  const card  = isDark ? '#111B33' : '#FFFFFF';
  const text  = isDark ? '#F0F4FF' : '#070B17';
  const sub   = isDark ? '#A0AEC0' : '#4A5A7A';
  const muted = isDark ? '#3D5080' : '#8899BB';
  const border= isDark ? '#1E2D4D' : '#E8EFFF';
  const accent= colors.accent;

  const SettingRow = ({ icon, label, value, onPress, right, isSwitch, switchVal, onSwitch, danger }) => (
    <TouchableOpacity
      style={[s.row, {borderBottomColor: border}]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <Text style={s.rowIcon}>{icon}</Text>
      <Text style={[s.rowLabel, {color: danger ? '#FF4D6D' : text}]}>{label}</Text>
      <View style={s.rowRight}>
        {value && <Text style={[s.rowValue, {color: accent}]}>{value}</Text>}
        {isSwitch && <Switch value={switchVal} onValueChange={onSwitch} trackColor={{false:'#3D5080', true: accent}} thumbColor={'#FFFFFF'} />}
        {!isSwitch && onPress && <Text style={{color: muted, fontSize:18}}>›</Text>}
      </View>
    </TouchableOpacity>
  );

  const SectionTitle = ({title}) => (
    <Text style={[s.sectionTitle, {color: muted}]}>{title}</Text>
  );

  const SectionCard = ({children}) => (
    <View style={[s.sectionCard, {backgroundColor: card, borderColor: border}]}>
      {children}
    </View>
  );

  const themeLabel = mode === 'dark' ? t.settings_theme_dark : mode === 'light' ? t.settings_theme_light : t.settings_theme_auto;
  const langLabel  = lang === 'fr' ? 'Français' : 'English';

  return (
    <SafeAreaView style={[s.safe, {backgroundColor: bg}]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={bg} />

      {/* Header */}
      <View style={[s.header, {backgroundColor: surf, borderBottomColor: border}]}>
        <Text style={[s.pageTitle, {color: text}]}>{t.settings_title}</Text>
      </View>

      <ScrollView contentContainerStyle={[s.scroll, {paddingHorizontal: width*0.04}]} showsVerticalScrollIndicator={false}>

        {/* Profil utilisateur */}
        <View style={[s.profileCard, {backgroundColor: card, borderColor: border}]}>
          <View style={[s.profileAvatar, {backgroundColor: accent+'22', borderColor: accent+'44'}]}>
            <Text style={{fontSize:28}}>🛡️</Text>
          </View>
          <View style={s.profileInfo}>
            <Text style={[s.profileName, {color: text}]}>CardVault</Text>
            <Text style={[s.profileEmail, {color: muted}]}>Collection personnelle</Text>
          </View>
          <Text style={{color: muted, fontSize:18}}>›</Text>
        </View>

        {/* Général */}
        <SectionTitle title="Général" />
        <SectionCard>
          <SettingRow icon="🌐" label={t.settings_language} value={langLabel} onPress={() => {}} />
          <SettingRow
            icon="🎨"
            label={t.settings_theme}
            value={themeLabel}
            onPress={() => {
              Alert.alert(t.settings_theme, '', [
                { text: t.settings_theme_auto,  onPress: () => setThemeMode('system') },
                { text: t.settings_theme_dark,  onPress: () => setThemeMode('dark') },
                { text: t.settings_theme_light, onPress: () => setThemeMode('light') },
                { text: t.cancel, style: 'cancel' },
              ]);
            }}
          />
          <SettingRow icon="💵" label={t.settings_currency} value="CAD ($)" onPress={() => {}} />
          <SettingRow icon="🔔" label="Notifications" isSwitch switchVal={notifs} onSwitch={setNotifs} />
          <SettingRow icon="🔊" label="Sons" isSwitch switchVal={sounds} onSwitch={setSounds} />
        </SectionCard>

        {/* Compte */}
        <SectionTitle title="Compte" />
        <SectionCard>
          <SettingRow icon="🔒" label="Sécurité" onPress={() => {}} />
          <SettingRow icon="⭐" label="Abonnement" value="Premium" onPress={() => {}} />
          <SettingRow icon="☁️" label="Sauvegarde et synchronisation" onPress={() => {}} />
        </SectionCard>

        {/* Infos techniques */}
        <SectionTitle title="Système" />
        <SectionCard>
          <SettingRow icon="🏒" label={t.settings_sports} value="NHL · NFL · NBA · MLB" />
          <SettingRow icon="🛒" label={t.settings_ebay}   value="Browse API" />
          <SettingRow icon="💾" label={t.settings_storage} value="AsyncStorage" />
        </SectionCard>

        {/* À propos */}
        <SectionTitle title={t.settings_about} />
        <SectionCard>
          <SettingRow icon="ℹ️" label="À propos de CardVault" onPress={() =>
            Alert.alert('CardVault', `Version ${APP_VERSION}\n\nGérez, suivez et protégez votre collection de cartes sportives.`, [{text:'OK'}])
          } />
          <SettingRow icon="✉️" label="Nous contacter" onPress={() => {}} />
          <View style={[s.row, {borderBottomWidth:0}]}>
            <Text style={[s.rowLabel, {color: muted}]}>{t.settings_version}</Text>
            <Text style={[s.rowValue, {color: muted}]}>{APP_VERSION}</Text>
          </View>
        </SectionCard>

        <View style={{height:32}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:         {flex:1},
  header:       {paddingHorizontal:20, paddingVertical:16, borderBottomWidth:1},
  pageTitle:    {fontSize:24, fontWeight:'800'},
  scroll:       {paddingVertical:20, gap:0},
  profileCard:  {flexDirection:'row', alignItems:'center', borderWidth:1, borderRadius:20, padding:16, gap:14, marginBottom:24},
  profileAvatar:{width:56, height:56, borderRadius:28, borderWidth:1, alignItems:'center', justifyContent:'center'},
  profileInfo:  {flex:1},
  profileName:  {fontSize:16, fontWeight:'700', marginBottom:2},
  profileEmail: {fontSize:13},
  sectionTitle: {fontSize:12, fontWeight:'700', letterSpacing:1.5, textTransform:'uppercase', marginBottom:8, marginTop:8, paddingHorizontal:4},
  sectionCard:  {borderWidth:1, borderRadius:20, overflow:'hidden', marginBottom:16},
  row:          {flexDirection:'row', alignItems:'center', paddingHorizontal:16, paddingVertical:14, borderBottomWidth:1, gap:12},
  rowIcon:      {fontSize:18, width:28, textAlign:'center'},
  rowLabel:     {flex:1, fontSize:14, fontWeight:'500'},
  rowRight:     {flexDirection:'row', alignItems:'center', gap:8},
  rowValue:     {fontSize:13, fontWeight:'600'},
});
