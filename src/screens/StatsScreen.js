import t from '../i18n/translations';
import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  SafeAreaView, StatusBar, useWindowDimensions, Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme, formatCAD, formatUSD, CAD_USD_RATE } from '../context/ThemeContext';
import { loadCards, loadSales, deleteSale, groupSalesByPeriod } from '../services/storage';

const PERIODS = ['7j', '30j', '90j', 'Tout'];

export default function StatsScreen() {
  const { colors, isDark } = useTheme();
  const { width } = useWindowDimensions();
  const [cards, setCards]   = useState([]);
  const [sales, setSales]   = useState([]);
  const [period, setPeriod] = useState('30j');
  const [tab, setTab]       = useState(0);

  useFocusEffect(useCallback(() => {
    loadCards().then(setCards);
    loadSales().then(setSales);
  }, []));

  const bg   = isDark ? '#070B17' : '#F5F7FC';
  const surf = isDark ? '#0F172A' : '#FFFFFF';
  const card = isDark ? '#111B33' : '#FFFFFF';
  const text = isDark ? '#F0F4FF' : '#070B17';
  const sub  = isDark ? '#A0AEC0' : '#4A5A7A';
  const muted= isDark ? '#3D5080' : '#8899BB';
  const border=isDark ? '#1E2D4D' : '#E8EFFF';
  const accent= colors.accent;

  const totalValue = cards.reduce((s,c) => s + c.valueCad * c.quantity, 0);
  const totalCards = cards.reduce((s,c) => s + c.quantity, 0);
  const sports     = [...new Set(cards.map(c => c.sport))];
  const avgValue   = cards.length ? totalValue / cards.length : 0;
  const top5       = [...cards].sort((a,b) => b.valueCad - a.valueCad).slice(0,5);

  const sportStats = ['NHL','NFL','NBA','MLB','OTHER'].map(sp => ({
    sport: sp,
    emoji: {NHL:'🏒',NFL:'🏈',NBA:'🏀',MLB:'⚾',OTHER:'🃏'}[sp],
    color: {NHL:'#1E90FF',NFL:'#FF4D6D',NBA:'#FF6B35',MLB:'#00E676',OTHER:'#9B59B6'}[sp],
    count: cards.filter(c => c.sport === sp).length,
    value: cards.filter(c => c.sport === sp).reduce((s,c) => s + c.valueCad*c.quantity, 0),
  })).filter(s => s.count > 0);

  const totalSales   = sales.reduce((s,v) => s + v.salePriceCad, 0);
  const totalProfit  = sales.reduce((s,v) => s + v.profit, 0);
  const { byDay, byMonth, today, month } = groupSalesByPeriod(sales);

  return (
    <SafeAreaView style={[s.safe, {backgroundColor: bg}]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={bg} />

      {/* Header */}
      <View style={[s.header, {backgroundColor: surf, borderBottomColor: border}]}>
        <Text style={[s.pageTitle, {color: text}]}>{t.stats_title}</Text>
      </View>

      {/* Tabs */}
      <View style={[s.tabs, {backgroundColor: surf, borderBottomColor: border}]}>
        {[t.stats_collection, t.stats_sales].map((tb, i) => (
          <TouchableOpacity key={i} style={[s.tab, tab===i && {borderBottomWidth:2.5, borderBottomColor: accent}]} onPress={() => setTab(i)}>
            <Text style={[s.tabTxt, {color: tab===i ? accent : sub}]}>{tb}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={[s.scroll, {paddingHorizontal: width*0.04}]} showsVerticalScrollIndicator={false}>

        {tab === 0 && (<>
          {!cards.length ? (
            <View style={s.empty}>
              <Text style={{fontSize:48}}>📊</Text>
              <Text style={[s.emptyTxt, {color: sub}]}>{t.stats_no_cards}</Text>
            </View>
          ) : (<>
            {/* Stats rapides */}
            <View style={[s.quickRow, {backgroundColor: card, borderColor: border}]}>
              {[
                {icon:'🃏', val: String(totalCards),    label: t.overview_cards,  color:'#7C4DFF'},
                {icon:'📂', val: String(sports.length), label: t.overview_cats,   color:'#00C2FF'},
                {icon:'💰', val: formatCAD(totalValue), label: t.overview_value,  color:'#00E676'},
              ].map((item,i) => (
                <View key={i} style={[s.quickItem, i<2 && {borderRightWidth:1, borderRightColor:border}]}>
                  <View style={[s.quickIcon, {backgroundColor: item.color+'22'}]}>
                    <Text style={{fontSize:16}}>{item.icon}</Text>
                  </View>
                  <Text style={[s.quickVal, {color: text}]}>{item.val}</Text>
                  <Text style={[s.quickLabel, {color: muted}]}>{item.label}</Text>
                </View>
              ))}
            </View>

            {/* Valeur totale avec période */}
            <View style={[s.valueBox, {backgroundColor: card, borderColor: border}]}>
              <View style={s.valueHeader}>
                <Text style={[s.valueLabel, {color: sub}]}>Valeur totale de la collection</Text>
                <View style={s.periodRow}>
                  {PERIODS.map(p => (
                    <TouchableOpacity key={p} style={[s.periodBtn, period===p && {backgroundColor: accent+'22'}]} onPress={() => setPeriod(p)}>
                      <Text style={[s.periodTxt, {color: period===p ? accent : muted}]}>{p}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <Text style={[s.bigValue, {color: text}]}>{formatCAD(totalValue)}</Text>
              <Text style={[s.bigSub, {color: '#00E676'}]}>+{formatUSD(avgValue)} avg</Text>

              {/* Graphique simplifié */}
              <View style={[s.chartArea, {borderTopColor: border}]}>
                <View style={s.chartBars}>
                  {[0.3,0.5,0.4,0.7,0.6,0.8,0.75,1.0].map((h,i) => (
                    <View key={i} style={[s.chartBar, {
                      height: h * 80,
                      backgroundColor: accent,
                      opacity: 0.3 + h*0.7,
                    }]} />
                  ))}
                </View>
                <View style={[s.chartLine, {borderColor: accent}]} />
              </View>
            </View>

            {/* Répartition par sport */}
            {sportStats.length > 0 && (<>
              <Text style={[s.sectionTitle, {color: text}]}>Répartition par catégorie</Text>
              <View style={[s.sportCard, {backgroundColor: card, borderColor: border}]}>
                <View style={s.donutWrap}>
                  {/* Donut simplifié */}
                  <View style={[s.donut, {borderColor: accent}]}>
                    <Text style={[s.donutCenter, {color: text}]}>{totalCards}</Text>
                    <Text style={[s.donutLabel, {color: muted}]}>Total</Text>
                  </View>
                </View>
                <View style={s.sportList}>
                  {sportStats.map((sp, i) => (
                    <View key={i} style={s.sportRow}>
                      <View style={[s.sportDot, {backgroundColor: sp.color}]} />
                      <Text style={[s.sportName, {color: sub}]}>{sp.sport}</Text>
                      <Text style={[s.sportPct, {color: muted}]}>
                        {Math.round(sp.count/totalCards*100)}%
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </>)}

            {/* Valeur par sport */}
            {sportStats.length > 0 && (<>
              <Text style={[s.sectionTitle, {color: text}]}>Valeur par sport</Text>
              <View style={[s.valueByCard, {backgroundColor: card, borderColor: border}]}>
                {sportStats.sort((a,b) => b.value-a.value).map((sp,i) => (
                  <View key={i} style={[s.vbRow, {borderBottomColor: border}]}>
                    <Text style={[s.vbName, {color: text}]}>{sp.emoji} {sp.sport}</Text>
                    <View style={s.vbBarWrap}>
                      <View style={[s.vbBar, {
                        width: `${sp.value/sportStats[0].value*100}%`,
                        backgroundColor: sp.color,
                      }]} />
                    </View>
                    <Text style={[s.vbVal, {color: sp.color}]}>{formatCAD(sp.value)}</Text>
                  </View>
                ))}
              </View>
            </>)}

            {/* Top 5 */}
            {top5.length > 0 && (<>
              <Text style={[s.sectionTitle, {color: text}]}>{t.stats_top}</Text>
              <View style={[s.topCard, {backgroundColor: card, borderColor: border}]}>
                {top5.map((c,i) => (
                  <View key={c.id} style={[s.topRow, {borderBottomColor: border}]}>
                    <Text style={[s.topRank, {color: accent}]}>#{i+1}</Text>
                    <View style={s.topInfo}>
                      <Text style={[s.topPlayer, {color: text}]} numberOfLines={1}>{c.player}</Text>
                      <Text style={[s.topMeta, {color: muted}]}>{c.set} · {c.condition}</Text>
                    </View>
                    <Text style={[s.topVal, {color: text}]}>{formatCAD(c.valueCad)}</Text>
                  </View>
                ))}
              </View>
            </>)}
          </>)}
        </>)}

        {tab === 1 && (<>
          {!sales.length ? (
            <View style={s.empty}>
              <Text style={{fontSize:48}}>💰</Text>
              <Text style={[s.emptyTxt, {color: sub}]}>{t.stats_no_sales}</Text>
              <Text style={[s.emptySub, {color: muted}]}>{t.stats_sell_hint}</Text>
            </View>
          ) : (<>
            <View style={[s.valueBox, {backgroundColor: card, borderColor: border}]}>
              <Text style={[s.valueLabel, {color: sub}]}>{t.stats_total_sales}</Text>
              <Text style={[s.bigValue, {color: text}]}>{formatCAD(totalSales)}</Text>
              <Text style={[s.bigSub, {color: totalProfit>=0 ? '#00E676' : '#FF4D6D'}]}>
                {totalProfit>=0?'+':''}{formatCAD(totalProfit)} profit net
              </Text>
            </View>

            <View style={s.periodRow3}>
              {[{l:t.stats_today,v:byDay[today]||0},{l:t.stats_month,v:Object.values(byMonth).reduce((a,b)=>a+b,0)/Math.max(Object.keys(byMonth).length,1)},{l:t.stats_year,v:totalSales}].map((p,i) => (
                <View key={i} style={[s.periodBox3, {backgroundColor: card, borderColor: border}]}>
                  <Text style={[s.p3Label, {color: sub}]}>{p.l}</Text>
                  <Text style={[s.p3Val, {color: '#00E676'}]}>{formatCAD(p.v)}</Text>
                </View>
              ))}
            </View>

            <Text style={[s.sectionTitle, {color: text}]}>{t.stats_history} ({sales.length})</Text>
            <View style={[s.topCard, {backgroundColor: card, borderColor: border}]}>
              {sales.map(sale => (
                <View key={sale.id} style={[s.saleRow, {borderBottomColor: border}]}>
                  <View style={[s.saleDot, {backgroundColor: sale.teamPrimary||accent}]} />
                  <View style={s.saleInfo}>
                    <Text style={[s.topPlayer, {color: text}]} numberOfLines={1}>{sale.player}</Text>
                    <Text style={[s.topMeta, {color: muted}]}>{new Date(sale.date).toLocaleDateString()}</Text>
                  </View>
                  <View style={s.salePrices}>
                    <Text style={[s.topVal, {color: '#00E676'}]}>{formatCAD(sale.salePriceCad)}</Text>
                    <Text style={{color: sale.profit>=0?'#00E676':'#FF4D6D', fontSize:11}}>
                      {sale.profit>=0?'+':''}{formatCAD(sale.profit)}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => Alert.alert(t.delete,'',[ {text:t.cancel,style:'cancel'}, {text:t.delete,style:'destructive',onPress:async()=>{ const {deleteSale}=require('../services/storage'); setSales(await deleteSale(sale.id)); }} ])}>
                    <Text style={{color:muted,fontSize:16,marginLeft:8}}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </>)}
        </>)}

        <View style={{height:32}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:        {flex:1},
  header:      {paddingHorizontal:20, paddingVertical:16, borderBottomWidth:1},
  pageTitle:   {fontSize:24, fontWeight:'800', letterSpacing:0.3},
  tabs:        {flexDirection:'row', borderBottomWidth:1},
  tab:         {flex:1, alignItems:'center', paddingVertical:14},
  tabTxt:      {fontSize:14, fontWeight:'700'},
  scroll:      {paddingVertical:20},
  empty:       {alignItems:'center', paddingVertical:60, gap:10},
  emptyTxt:    {fontSize:15},
  emptySub:    {fontSize:13, textAlign:'center', paddingHorizontal:32},
  quickRow:    {flexDirection:'row', borderRadius:20, borderWidth:1, overflow:'hidden', marginBottom:16},
  quickItem:   {flex:1, alignItems:'center', paddingVertical:16, gap:4},
  quickIcon:   {width:36, height:36, borderRadius:10, alignItems:'center', justifyContent:'center', marginBottom:2},
  quickVal:    {fontSize:14, fontWeight:'800'},
  quickLabel:  {fontSize:10},
  valueBox:    {borderRadius:20, borderWidth:1, padding:20, marginBottom:16},
  valueHeader: {flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:8},
  valueLabel:  {fontSize:12, letterSpacing:0.5},
  periodRow:   {flexDirection:'row', gap:4},
  periodBtn:   {paddingHorizontal:10, paddingVertical:4, borderRadius:20},
  periodTxt:   {fontSize:12, fontWeight:'600'},
  bigValue:    {fontSize:36, fontWeight:'900', marginBottom:4},
  bigSub:      {fontSize:13, marginBottom:16},
  chartArea:   {borderTopWidth:1, paddingTop:16},
  chartBars:   {flexDirection:'row', alignItems:'flex-end', gap:6, height:80},
  chartBar:    {flex:1, borderRadius:4, minHeight:4},
  chartLine:   {position:'absolute', bottom:0, left:0, right:0, height:1, borderTopWidth:1, borderStyle:'dashed'},
  sectionTitle:{fontSize:16, fontWeight:'700', marginBottom:10, marginTop:4},
  sportCard:   {borderRadius:20, borderWidth:1, padding:20, flexDirection:'row', alignItems:'center', marginBottom:16, gap:20},
  donutWrap:   {alignItems:'center', justifyContent:'center'},
  donut:       {width:90, height:90, borderRadius:45, borderWidth:8, alignItems:'center', justifyContent:'center'},
  donutCenter: {fontSize:18, fontWeight:'800'},
  donutLabel:  {fontSize:10},
  sportList:   {flex:1, gap:8},
  sportRow:    {flexDirection:'row', alignItems:'center', gap:8},
  sportDot:    {width:10, height:10, borderRadius:5},
  sportName:   {flex:1, fontSize:13},
  sportPct:    {fontSize:13, fontWeight:'600'},
  valueByCard: {borderRadius:20, borderWidth:1, overflow:'hidden', marginBottom:16},
  vbRow:       {flexDirection:'row', alignItems:'center', gap:10, paddingHorizontal:16, paddingVertical:12, borderBottomWidth:1},
  vbName:      {fontSize:13, fontWeight:'600', width:80},
  vbBarWrap:   {flex:1, height:6, borderRadius:3, backgroundColor:'#1E2D4D', overflow:'hidden'},
  vbBar:       {height:6, borderRadius:3},
  vbVal:       {fontWeight:'700', fontSize:12, width:70, textAlign:'right'},
  topCard:     {borderRadius:20, borderWidth:1, overflow:'hidden', marginBottom:16},
  topRow:      {flexDirection:'row', alignItems:'center', gap:12, paddingHorizontal:16, paddingVertical:14, borderBottomWidth:1},
  topRank:     {fontWeight:'800', fontSize:14, width:28},
  topInfo:     {flex:1},
  topPlayer:   {fontWeight:'700', fontSize:13},
  topMeta:     {fontSize:11, marginTop:2},
  topVal:      {fontWeight:'800', fontSize:13},
  periodRow3:  {flexDirection:'row', gap:8, marginBottom:16},
  periodBox3:  {flex:1, borderWidth:1, borderRadius:14, padding:12, alignItems:'center', gap:4},
  p3Label:     {fontSize:10, textTransform:'uppercase', letterSpacing:1},
  p3Val:       {fontSize:14, fontWeight:'800'},
  saleRow:     {flexDirection:'row', alignItems:'center', paddingHorizontal:16, paddingVertical:12, borderBottomWidth:1, gap:8},
  saleDot:     {width:10, height:10, borderRadius:5},
  saleInfo:    {flex:1},
  salePrices:  {alignItems:'flex-end'},
});
