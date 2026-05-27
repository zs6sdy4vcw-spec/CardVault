import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Image, StyleSheet,
  StatusBar, useWindowDimensions, Alert, TextInput, Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme, formatCAD, formatUSD, CAD_USD_RATE } from '../context/ThemeContext';
import { loadCards, deleteCard, saveCards } from '../services/storage';
import { SPORT_COLORS, SPORT_EMOJIS, CONDITIONS } from '../constants/theme';
import { suggestTeams, getTeamColors } from '../constants/teams';
import CardItem from '../components/CardItem';
import t from '../i18n/translations';

const SPORTS = ['ALL','NHL','NFL','NBA','MLB','OTHER'];

export default function CollectionScreen({ navigation }) {
  const { colors, isDark } = useTheme();
  const { width } = useWindowDimensions();
  const [cards, setCards]           = useState([]);
  const [search, setSearch]         = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [sportFilter, setSport]     = useState('ALL');
  const [editCard, setEditCard]     = useState(null);
  const [editForm, setEditForm]     = useState({});
  const [condOpen, setCondOpen]     = useState(false);
  const [teamSugg, setTeamSugg]     = useState([]);

  useFocusEffect(useCallback(() => { loadCards().then(setCards); }, []));

  const totalValue = cards.reduce((s,c) => s + c.valueCad * c.quantity, 0);
  const totalCards = cards.reduce((s,c) => s + c.quantity, 0);
  const sports     = [...new Set(cards.map(c => c.sport))];
  const recent     = [...cards].reverse().slice(0, 5);

  const filtered = cards.filter(c => {
    const ms = sportFilter === 'ALL' || c.sport === sportFilter;
    const q  = search.toLowerCase();
    const mq = !q || c.player.toLowerCase().includes(q) || (c.team||'').toLowerCase().includes(q) || (c.set||'').toLowerCase().includes(q);
    return ms && mq;
  });

  const handleDelete = (card) => {
    Alert.alert(t.delete, `${t.delete} ${card.player}?`, [
      { text: t.cancel, style: 'cancel' },
      { text: t.delete, style: 'destructive', onPress: async () => setCards(await deleteCard(cards, card.id)) },
    ]);
  };

  const handleEdit = (card) => {
    setEditForm({ ...card, valueCad: String(card.valueCad), quantity: String(card.quantity) });
    setEditCard(card);
  };

  const handleSaveEdit = async () => {
    const updated = { ...editForm, valueCad: parseFloat(editForm.valueCad)||0, quantity: parseInt(editForm.quantity)||1 };
    const newCards = cards.map(c => c.id === updated.id ? updated : c);
    await saveCards(newCards);
    setCards(newCards);
    setEditCard(null);
  };

  const setF = (k,v) => setEditForm(f => ({...f,[k]:v}));

  const inputStyle = { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text, borderWidth:1, borderRadius:10, paddingHorizontal:14, paddingVertical:10, fontSize:14 };
  const Label = ({text}) => <Text style={{color:colors.textSub,fontSize:12,marginBottom:5,marginTop:12}}>{text}</Text>;

  const bg = colors.bg;
  const surf = isDark ? colors.surface : '#FFFFFF';

  return (
    <SafeAreaView style={[s.safe, {backgroundColor: bg}]} edges={['top','left','right']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={isDark ? colors.navy : surf} />

      {/* ── Header ── */}
      <View style={[s.header, { backgroundColor: isDark ? colors.navy : surf, borderBottomColor: colors.border }]}>
        <TouchableOpacity><Text style={[s.menuIcon, {color: colors.text}]}>☰</Text></TouchableOpacity>
        <Text style={s.logo}>
          <Text style={{color: isDark ? '#FFFFFF' : colors.text}}>Card</Text>
          <Text style={{color: colors.accent}}>Vault</Text>
        </Text>
        <TouchableOpacity onPress={() => setShowSearch(!showSearch)}>
          <Text style={{fontSize:20, color: colors.text}}>🔍</Text>
        </TouchableOpacity>
      </View>

      {/* Barre recherche */}
      {showSearch && (
        <View style={[s.searchBar, { backgroundColor: surf, borderBottomColor: colors.border }]}>
          <TextInput
            style={[s.searchInput, { color: colors.text }]}
            placeholder={t.search}
            placeholderTextColor={colors.muted}
            value={search}
            onChangeText={setSearch}
            autoFocus
          />
          {search.length > 0 && <TouchableOpacity onPress={() => setSearch('')}><Text style={{color:colors.muted}}>✕</Text></TouchableOpacity>}
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 100}}>

        {/* ── Hero Banner ── */}
        <View style={s.heroWrap}>
          <Image
            source={isDark ? require('../../assets/banner_dark.png') : require('../../assets/banner_light.png')}
            style={s.heroBanner}
            resizeMode="cover"
          />
          <View style={[s.heroOverlay, {backgroundColor: isDark ? 'rgba(7,11,23,0.55)' : 'rgba(13,27,75,0.45)'}]}>
            <Text style={s.heroPre}>{t.hero_welcome}</Text>
            <View style={{flexDirection:'row'}}>
              <Text style={s.heroTitle}>Card</Text>
              <Text style={[s.heroTitle, {color: '#00C2FF'}]}>Vault</Text>
            </View>
            <Text style={s.heroSub}>{t.hero_subtitle}</Text>
          </View>
        </View>

        <View style={{paddingHorizontal: width * 0.04}}>

          {/* ── Action Grid ── */}
          <View style={[s.actionGrid, {backgroundColor: surf, borderColor: colors.border}]}>
            {[
              {icon:'collection', label:t.action_collection, sub:`${totalCards} ${t.action_cards}`, route:'Accueil'},
              {icon:'stats',      label:t.action_stats,      sub:t.action_total,  route:'Stats'},
              {icon:'add',        label:t.action_add,        sub:t.action_new,    route:'Ajouter', accent:true},
              {icon:'market',     label:t.action_market,     sub:t.action_browse, route:'Marché'},
            ].map((a, i) => {
              const iconSrc = isDark
                ? require('../../assets/icons/collection_dark.png') // placeholder, géré plus bas
                : require('../../assets/icons/collection_light.png');
              const icons = {
                collection: isDark ? require('../../assets/icons/collection_dark.png') : require('../../assets/icons/collection_light.png'),
                stats:      isDark ? require('../../assets/icons/stats_dark.png')      : require('../../assets/icons/stats_light.png'),
                add:        isDark ? require('../../assets/icons/add_dark.png')        : require('../../assets/icons/add_light.png'),
                market:     isDark ? require('../../assets/icons/market_dark.png')     : require('../../assets/icons/market_light.png'),
              };
              return (
                <TouchableOpacity
                  key={i}
                  style={[s.actionBtn, {
                    borderColor: a.accent ? colors.accent : colors.border,
                    backgroundColor: a.accent ? colors.accent+'15' : 'transparent',
                  }]}
                  onPress={() => navigation.navigate(a.route)}
                  activeOpacity={0.75}
                >
                  <View style={[s.actionIconBg, {backgroundColor: a.accent ? colors.accent+'25' : colors.border+'55'}]}>
                    <Image source={icons[a.icon]} style={{width:30,height:30}} resizeMode="contain" />
                  </View>
                  <Text style={[s.actionLabel, {color: a.accent ? colors.accent : colors.text}]}>{a.label}</Text>
                  <Text style={[s.actionSub, {color: colors.muted}]}>{a.sub}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* ── Aperçu collection ── */}
          <View style={s.sectionHeader}>
            <Text style={[s.sectionTitle, {color: colors.text}]}>{t.overview_title}</Text>
            <TouchableOpacity><Text style={[s.seeAll, {color: colors.accent}]}>{t.overview_see_all}</Text></TouchableOpacity>
          </View>

          <View style={[s.overviewRow, {backgroundColor: surf, borderColor: colors.border}]}>
            {[
              {emoji:'🃏', val: String(totalCards),              label: t.overview_cards, color:'#7C4DFF'},
              {emoji:'📂', val: String(sports.length),           label: t.overview_cats,  color:'#00C2FF'},
              {emoji:'💰', val: formatCAD(totalValue),           label: t.overview_value, color:'#00E676'},
            ].map((item, i) => (
              <View key={i} style={[s.overviewItem, i < 2 && {borderRightWidth:1, borderRightColor: colors.border}]}>
                <View style={[s.overviewIcon, {backgroundColor: item.color+'22'}]}>
                  <Text style={{fontSize:18}}>{item.emoji}</Text>
                </View>
                <Text style={[s.overviewVal, {color: colors.text}]}>{item.val}</Text>
                <Text style={[s.overviewLabel, {color: colors.muted}]}>{item.label}</Text>
              </View>
            ))}
          </View>

          {/* ── Activité récente ── */}
          {recent.length > 0 && (
            <>
              <View style={s.sectionHeader}>
                <Text style={[s.sectionTitle, {color: colors.text}]}>{t.recent_title}</Text>
                <TouchableOpacity><Text style={[s.seeAll, {color: colors.accent}]}>{t.recent_see_all}</Text></TouchableOpacity>
              </View>
              {recent.map(card => {
                const stripeColor = card.teamPrimary || SPORT_COLORS[card.sport] || colors.accent;
                const dateStr = card.addedAt
                  ? (Date.now() - card.addedAt < 86400000 ? t.recent_today : t.recent_yesterday)
                  : t.recent_today;
                return (
                  <TouchableOpacity
                    key={card.id}
                    style={[s.activityCard, {backgroundColor: surf, borderColor: colors.border}]}
                    onPress={() => navigation.navigate('CardDetail', {card, cards, setCards})}
                    activeOpacity={0.75}
                  >
                    {card.img
                      ? <Image source={{uri: card.img}} style={s.activityImg} resizeMode="cover" />
                      : <View style={[s.activityImgPlaceholder, {backgroundColor: stripeColor+'22'}]}>
                          <Text style={{fontSize:26}}>{SPORT_EMOJIS[card.sport]||'🃏'}</Text>
                        </View>
                    }
                    <View style={s.activityInfo}>
                      <Text style={[s.activityPlayer, {color: colors.text}]} numberOfLines={1}>{card.player}</Text>
                      <Text style={[s.activitySet, {color: colors.textSub}]} numberOfLines={1}>
                        {card.year ? `${card.year} ` : ''}{card.set}{card.cardNumber ? ` #${card.cardNumber}` : ''}
                      </Text>
                      <Text style={[s.activityCond, {color: colors.muted}]}>{card.condition}</Text>
                    </View>
                    <View style={s.activityRight}>
                      <Text style={[s.activityValue, {color: colors.green}]}>{formatCAD(card.valueCad)}</Text>
                      <Text style={[s.activityDate, {color: colors.muted}]}>{dateStr}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </>
          )}

          {/* ── Collection complète ── */}
          {cards.length > 0 && (
            <>
              <View style={s.sectionHeader}>
                <Text style={[s.sectionTitle, {color: colors.text}]}>{t.nav_collection}</Text>
                <Text style={[s.seeAll, {color: colors.muted}]}>{filtered.length} {t.action_cards}</Text>
              </View>
              {/* Filtres */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:12}}>
                <View style={{flexDirection:'row', gap:8}}>
                  {SPORTS.map(sp => (
                    <TouchableOpacity
                      key={sp}
                      style={[s.filterBtn, {
                        backgroundColor: sportFilter===sp ? colors.accentBg : surf,
                        borderColor: sportFilter===sp ? colors.accent : colors.border,
                      }]}
                      onPress={() => setSport(sp)}
                    >
                      <Text style={[s.filterTxt, {color: sportFilter===sp ? colors.accent : colors.textSub}]}>
                        {sp==='ALL' ? t.all : sp==='OTHER' ? t.other : `${SPORT_EMOJIS[sp]} ${sp}`}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
              {filtered.map(card => (
                <CardItem
                  key={card.id}
                  card={card}
                  cards={cards}
                  onPress={() => navigation.navigate('CardDetail', {card, cards, setCards})}
                  onDelete={() => handleDelete(card)}
                  onEdit={() => handleEdit(card)}
                  onSold={() => loadCards().then(setCards)}
                />
              ))}
            </>
          )}

          {/* ── Empty state ── */}
          {cards.length === 0 && (
            <View style={s.empty}>
              <Image source={require('../../assets/icon.png')} style={s.emptyLogo} resizeMode="contain" />
              <Text style={[s.emptyTitle, {color: colors.text}]}>{t.empty_title}</Text>
              <Text style={[s.emptySub, {color: colors.textSub}]}>{t.empty_sub}</Text>
              <TouchableOpacity
                style={[s.emptyBtn, {backgroundColor: colors.accent}]}
                onPress={() => navigation.navigate('Ajouter')}
              >
                <Text style={s.emptyBtnTxt}>{t.empty_cta}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* ── Modal édition ── */}
      <Modal visible={!!editCard} animationType="slide" onRequestClose={() => setEditCard(null)}>
        <SafeAreaView style={[s.safe, {backgroundColor: bg}]}>
          <View style={[s.modalHeader, {backgroundColor: surf, borderBottomColor: colors.border}]}>
            <TouchableOpacity onPress={() => setEditCard(null)}>
              <Text style={{color: colors.muted, fontSize:14}}>✕ {t.cancel}</Text>
            </TouchableOpacity>
            <Text style={[s.modalTitle, {color: colors.text}]}>✏️ {t.edit}</Text>
            <TouchableOpacity onPress={handleSaveEdit}>
              <Text style={{color: colors.accent, fontSize:14, fontWeight:'700'}}>✅ {t.save}</Text>
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={{padding:20}} keyboardShouldPersistTaps="handled">
            <Label text={t.add_player} />
            <TextInput style={inputStyle} value={editForm.player} onChangeText={v=>setF('player',v)} placeholderTextColor={colors.muted} />
            <Label text={t.add_team} />
            <TextInput style={inputStyle} value={editForm.team} onChangeText={v=>{
              setF('team',v);
              setTeamSugg(suggestTeams(editForm.sport, v));
              const tc = getTeamColors(editForm.sport, v);
              if (tc.primary) { setF('teamPrimary',tc.primary); setF('teamSecondary',tc.secondary); }
            }} placeholderTextColor={colors.muted} />
            {teamSugg.length > 0 && (
              <View style={[s.suggestions, {backgroundColor: surf, borderColor: colors.border}]}>
                {teamSugg.map(t2 => (
                  <TouchableOpacity key={t2.abbr} style={[s.suggestion, {borderBottomColor: colors.border}]}
                    onPress={() => { setF('team',t2.name); setF('teamPrimary',t2.primary); setF('teamSecondary',t2.secondary); setTeamSugg([]); }}>
                    <View style={[s.swatch, {backgroundColor:t2.primary}]} />
                    <View style={[s.swatch, {backgroundColor:t2.secondary}]} />
                    <Text style={{color:colors.text, fontSize:14}}>{t2.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            <Label text={t.add_year} />
            <TextInput style={inputStyle} value={editForm.year} onChangeText={v=>setF('year',v)} placeholderTextColor={colors.muted} />
            <Label text={t.add_set} />
            <TextInput style={inputStyle} value={editForm.set} onChangeText={v=>setF('set',v)} placeholderTextColor={colors.muted} />
            <View style={{flexDirection:'row', gap:12}}>
              <View style={{flex:1}}>
                <Label text={`${t.add_value} (CAD$)`} />
                <TextInput style={inputStyle} value={editForm.valueCad} onChangeText={v=>setF('valueCad',v)} keyboardType="decimal-pad" placeholderTextColor={colors.muted} />
              </View>
              <View style={{flex:0.4}}>
                <Label text={t.add_qty} />
                <TextInput style={inputStyle} value={editForm.quantity} onChangeText={v=>setF('quantity',v)} keyboardType="number-pad" placeholderTextColor={colors.muted} />
              </View>
            </View>
            <TouchableOpacity style={[s.saveBtn, {backgroundColor: colors.accent, marginTop:20}]} onPress={handleSaveEdit}>
              <Text style={s.saveBtnTxt}>✅ {t.save}</Text>
            </TouchableOpacity>
            <View style={{height:32}} />
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:         {flex:1},
  header:       {flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal:20, paddingVertical:14, borderBottomWidth:1},
  menuIcon:     {fontSize:20},
  logo:         {fontSize:22, fontWeight:'900'},
  searchBar:    {flexDirection:'row', alignItems:'center', paddingHorizontal:20, paddingVertical:10, borderBottomWidth:1, gap:10},
  searchInput:  {flex:1, fontSize:14},
  heroWrap:     {height:200, position:'relative', overflow:'hidden'},
  heroBanner:   {width:'100%', height:'100%'},
  heroOverlay:  {position:'absolute', top:0, left:0, right:0, bottom:0, justifyContent:'center', paddingHorizontal:24, paddingVertical:20},
  heroPre:      {color:'#AAC4E8', fontSize:13, marginBottom:4},
  heroTitle:    {fontSize:32, fontWeight:'900', color:'#FFFFFF'},
  heroSub:      {color:'#AAC4E8', fontSize:12, marginTop:6, lineHeight:18},
  actionGrid:   {flexDirection:'row', flexWrap:'wrap', gap:10, padding:12, borderRadius:20, borderWidth:1, marginTop:16, marginBottom:16},
  actionBtn:    {width:'47%', borderWidth:1.5, borderRadius:16, padding:14, alignItems:'center', gap:6},
  actionIconBg: {width:46, height:46, borderRadius:14, alignItems:'center', justifyContent:'center'},
  actionLabel:  {fontSize:12, fontWeight:'700', textAlign:'center'},
  actionSub:    {fontSize:10, textAlign:'center'},
  sectionHeader:{flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:10, marginTop:8},
  sectionTitle: {fontSize:16, fontWeight:'700'},
  seeAll:       {fontSize:13, fontWeight:'600'},
  overviewRow:  {flexDirection:'row', borderRadius:18, borderWidth:1, overflow:'hidden', marginBottom:16},
  overviewItem: {flex:1, alignItems:'center', paddingVertical:16, gap:5},
  overviewIcon: {width:40, height:40, borderRadius:12, alignItems:'center', justifyContent:'center'},
  overviewVal:  {fontSize:14, fontWeight:'800'},
  overviewLabel:{fontSize:11},
  activityCard: {flexDirection:'row', alignItems:'center', borderWidth:1, borderRadius:16, padding:12, marginBottom:10, gap:12},
  activityImg:  {width:60, height:76, borderRadius:10},
  activityImgPlaceholder:{width:60, height:76, borderRadius:10, alignItems:'center', justifyContent:'center'},
  activityInfo: {flex:1, gap:3},
  activityPlayer:{fontSize:14, fontWeight:'700'},
  activitySet:  {fontSize:12},
  activityCond: {fontSize:11},
  activityRight:{alignItems:'flex-end', gap:4},
  activityValue:{fontSize:14, fontWeight:'800'},
  activityDate: {fontSize:11},
  filterBtn:    {borderWidth:1, borderRadius:8, paddingHorizontal:14, paddingVertical:8},
  filterTxt:    {fontWeight:'600', fontSize:13},
  empty:        {alignItems:'center', paddingVertical:40, gap:12},
  emptyLogo:    {width:90, height:90, borderRadius:20},
  emptyTitle:   {fontSize:20, fontWeight:'800', textAlign:'center'},
  emptySub:     {fontSize:14, textAlign:'center', paddingHorizontal:24, lineHeight:20},
  emptyBtn:     {borderRadius:14, paddingVertical:14, paddingHorizontal:28, marginTop:8, width:'100%', alignItems:'center'},
  emptyBtnTxt:  {color:'#070B17', fontWeight:'800', fontSize:15},
  modalHeader:  {flexDirection:'row', alignItems:'center', justifyContent:'space-between', padding:16, borderBottomWidth:1},
  modalTitle:   {fontSize:16, fontWeight:'800'},
  suggestions:  {borderWidth:1, borderRadius:10, overflow:'hidden', marginTop:4},
  suggestion:   {flexDirection:'row', alignItems:'center', padding:10, borderBottomWidth:1, gap:8},
  swatch:       {width:14, height:14, borderRadius:7},
  saveBtn:      {borderRadius:12, paddingVertical:15, alignItems:'center'},
  saveBtnTxt:   {color:'#070B17', fontWeight:'800', fontSize:15},
});
