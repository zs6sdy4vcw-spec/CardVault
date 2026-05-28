import t from '../i18n/translations';
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  SafeAreaView, StatusBar, ScrollView, useWindowDimensions, Image,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useTheme } from '../context/ThemeContext';

const TABS_MARKET = ['En vedette', 'Nouvelles', 'Populaires'];

const FEATURED_CARDS = [
  { player:'Connor McDavid', set:'2023-24 Upper Deck', number:'Young Guns #201', price:'$320', likes:24, ago:'2h', sport:'NHL', color:'#1E90FF' },
  { player:'Shohei Ohtani',  set:'2023 Topps Chrome', number:'#17',             price:'$185', likes:18, ago:'3h', sport:'MLB', color:'#00E676' },
  { player:'LeBron James',   set:'2022-23 Prizm',     number:'#6',              price:'$145', likes:30, ago:'4h', sport:'NBA', color:'#FF6B35' },
  { player:'Luka Dončić',    set:'2023 Panini Select', number:'#72',            price:'$210', likes:12, ago:'5h', sport:'NBA', color:'#FF6B35' },
];

export default function MarketScreen({ navigation }) {
  const { colors, isDark } = useTheme();
  const { width } = useWindowDimensions();
  const [search, setSearch] = useState('');
  const [tab, setTab]       = useState(0);
  const [webUrl, setWebUrl] = useState(null);

  const bg    = isDark ? '#070B17' : '#F5F7FC';
  const surf  = isDark ? '#0F172A' : '#FFFFFF';
  const card  = isDark ? '#111B33' : '#FFFFFF';
  const text  = isDark ? '#F0F4FF' : '#070B17';
  const sub   = isDark ? '#A0AEC0' : '#4A5A7A';
  const muted = isDark ? '#3D5080' : '#8899BB';
  const border= isDark ? '#1E2D4D' : '#E8EFFF';
  const accent= colors.accent;

  if (webUrl) {
    return (
      <SafeAreaView style={[s.safe, {backgroundColor: bg}]}>
        <View style={[s.webHeader, {backgroundColor: surf, borderBottomColor: border}]}>
          <TouchableOpacity onPress={() => setWebUrl(null)}>
            <Text style={{color: accent, fontSize:14, fontWeight:'600'}}>← {t.back}</Text>
          </TouchableOpacity>
          <Text style={[s.webTitle, {color: text}]} numberOfLines={1}>{webUrl.slice(0,40)}…</Text>
        </View>
        <WebView source={{uri: webUrl}} style={{flex:1}} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[s.safe, {backgroundColor: bg}]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={bg} />

      {/* Header */}
      <View style={[s.header, {backgroundColor: surf, borderBottomColor: border}]}>
        <Text style={[s.pageTitle, {color: text}]}>{t.market_title}</Text>
        <TouchableOpacity style={[s.filterBtn, {borderColor: border}]}>
          <Text style={{color: sub, fontSize:16}}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={[s.searchWrap, {backgroundColor: surf, borderBottomColor: border}]}>
        <View style={[s.searchRow, {backgroundColor: isDark ? '#111B33' : '#F0F4FF', borderColor: border}]}>
          <Text style={{color: muted, fontSize:16}}>🔍</Text>
          <TextInput
            style={[s.searchInput, {color: text}]}
            placeholder="Rechercher une carte ou un joueur…"
            placeholderTextColor={muted}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {/* Tabs */}
      <View style={[s.tabs, {backgroundColor: surf, borderBottomColor: border}]}>
        {TABS_MARKET.map((tb, i) => (
          <TouchableOpacity
            key={i}
            style={[s.tab, tab===i && {borderBottomWidth:2.5, borderBottomColor: accent}]}
            onPress={() => setTab(i)}
          >
            <Text style={[s.tabTxt, {color: tab===i ? accent : sub}]}>{tb}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={[s.scroll, {paddingHorizontal: width*0.04}]} showsVerticalScrollIndicator={false}>

        {/* Liste cartes style mockup */}
        {FEATURED_CARDS.map((item, i) => (
          <TouchableOpacity
            key={i}
            style={[s.cardRow, {backgroundColor: card, borderColor: border}]}
            onPress={() => setWebUrl(`https://www.ebay.ca/sch/i.html?_nkw=${encodeURIComponent(item.player + ' ' + item.set)}&_sacat=261328&LH_Sold=1`)}
            activeOpacity={0.75}
          >
            {/* Placeholder image avec couleur sport */}
            <View style={[s.cardThumb, {backgroundColor: item.color+'22', borderColor: item.color+'44'}]}>
              <Text style={{fontSize:24}}>
                {item.sport==='NHL'?'🏒':item.sport==='NFL'?'🏈':item.sport==='NBA'?'🏀':'⚾'}
              </Text>
            </View>
            <View style={s.cardInfo}>
              <Text style={[s.cardPlayer, {color: text}]}>{item.player}</Text>
              <Text style={[s.cardSet, {color: sub}]}>{item.set}</Text>
              <Text style={[s.cardNum, {color: muted}]}>{item.number}</Text>
              <Text style={[s.cardPrice, {color: '#00E676'}]}>{item.price}</Text>
            </View>
            <View style={s.cardRight}>
              <View style={s.likesRow}>
                <Text style={{color: muted, fontSize:12}}>♡ {item.likes}</Text>
              </View>
              <Text style={[s.cardAgo, {color: muted}]}>{item.ago}</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* Liens rapides eBay */}
        <Text style={[s.sectionTitle, {color: text, marginTop:20}]}>Accès rapide eBay</Text>
        {[
          { label: t.market_ebay,   sub: t.market_sold_sub,   url:'https://www.ebay.ca/sch/i.html?_sacat=261328&LH_Sold=1&LH_Complete=1&_sop=13' },
          { label: t.market_active, sub: 'Cartes disponibles', url:'https://www.ebay.ca/sch/i.html?_sacat=261328&_sop=15' },
          { label: t.market_nhl,    sub: t.market_nhl_sub,     url:'https://www.ebay.ca/sch/i.html?_nkw=hockey+card&_sacat=261328' },
          { label: t.market_nfl,    sub: t.market_nfl_sub,     url:'https://www.ebay.ca/sch/i.html?_nkw=football+card&_sacat=261328' },
          { label: t.market_130,    sub: 'Données ventes',      url:'https://www.130point.com' },
        ].map((link, i) => (
          <TouchableOpacity
            key={i}
            style={[s.linkCard, {backgroundColor: card, borderColor: border}]}
            onPress={() => setWebUrl(link.url)}
            activeOpacity={0.75}
          >
            <View style={s.linkInfo}>
              <Text style={[s.linkLabel, {color: text}]}>{link.label}</Text>
              <Text style={[s.linkSub, {color: muted}]}>{link.sub}</Text>
            </View>
            <Text style={{color: muted}}>›</Text>
          </TouchableOpacity>
        ))}

        <View style={{height:32}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:        {flex:1},
  header:      {flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingHorizontal:20, paddingVertical:16, borderBottomWidth:1},
  pageTitle:   {fontSize:24, fontWeight:'800'},
  filterBtn:   {borderWidth:1, borderRadius:10, padding:8},
  webHeader:   {flexDirection:'row', alignItems:'center', gap:12, paddingHorizontal:16, paddingVertical:12, borderBottomWidth:1},
  webTitle:    {flex:1, fontSize:12},
  searchWrap:  {paddingHorizontal:16, paddingVertical:10, borderBottomWidth:1},
  searchRow:   {flexDirection:'row', alignItems:'center', gap:10, borderWidth:1, borderRadius:14, paddingHorizontal:14, paddingVertical:10},
  searchInput: {flex:1, fontSize:14},
  tabs:        {flexDirection:'row', borderBottomWidth:1},
  tab:         {flex:1, alignItems:'center', paddingVertical:14},
  tabTxt:      {fontSize:14, fontWeight:'700'},
  scroll:      {paddingVertical:16},
  cardRow:     {flexDirection:'row', alignItems:'center', borderWidth:1, borderRadius:16, padding:14, marginBottom:10, gap:14},
  cardThumb:   {width:70, height:90, borderRadius:10, borderWidth:1, alignItems:'center', justifyContent:'center'},
  cardInfo:    {flex:1, gap:3},
  cardPlayer:  {fontSize:15, fontWeight:'700'},
  cardSet:     {fontSize:12},
  cardNum:     {fontSize:11},
  cardPrice:   {fontSize:16, fontWeight:'800', marginTop:4},
  cardRight:   {alignItems:'flex-end', gap:6},
  likesRow:    {flexDirection:'row', alignItems:'center'},
  cardAgo:     {fontSize:11},
  sectionTitle:{fontSize:16, fontWeight:'700', marginBottom:10},
  linkCard:    {flexDirection:'row', alignItems:'center', borderWidth:1, borderRadius:14, padding:16, marginBottom:8},
  linkInfo:    {flex:1},
  linkLabel:   {fontSize:14, fontWeight:'600', marginBottom:2},
  linkSub:     {fontSize:12},
});
