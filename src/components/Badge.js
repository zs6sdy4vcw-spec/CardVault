import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SPORT_COLORS, SPORT_EMOJIS } from '../constants/theme';

export default function Badge({ sport }) {
  const color = SPORT_COLORS[sport] || '#888';
  return (
    <View style={[styles.badge, { backgroundColor: color + '22', borderColor: color + '55' }]}>
      <Text style={[styles.text, { color }]}>
        {SPORT_EMOJIS[sport]} {sport}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 4,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
