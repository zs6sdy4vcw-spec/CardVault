import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  View, Text, Image, StyleSheet, useWindowDimensions,
  TouchableOpacity, Platform,
} from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import t from './src/i18n/translations';

import CollectionScreen  from './src/screens/CollectionScreen';
import AddCardScreen     from './src/screens/AddCardScreen';
import CardDetailScreen  from './src/screens/CardDetailScreen';
import ComparablesScreen from './src/screens/ComparablesScreen';
import StatsScreen       from './src/screens/StatsScreen';
import SettingsScreen    from './src/screens/SettingsScreen';
import MarketScreen      from './src/screens/MarketScreen';

const Tab   = createBottomTabNavigator();
const Stack = createStackNavigator();

// ── Icônes dark / light ───────────────────────────────────────────────────────
const ICONS_DARK = {
  collection: require('./assets/icons/collection_dark.png'),
  stats:      require('./assets/icons/stats_dark.png'),
  add:        require('./assets/icons/add_dark.png'),
  market:     require('./assets/icons/market_dark.png'),
  settings:   require('./assets/icons/settings_dark.png'),
};
const ICONS_LIGHT = {
  collection: require('./assets/icons/collection_light.png'),
  stats:      require('./assets/icons/stats_light.png'),
  add:        require('./assets/icons/add_light.png'),
  market:     require('./assets/icons/market_light.png'),
  settings:   require('./assets/icons/settings_light.png'),
};

// ── Stacks ────────────────────────────────────────────────────────────────────
function CollectionStack() {
  const { colors } = useTheme();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: colors.bg } }}>
      <Stack.Screen name="CollectionHome" component={CollectionScreen} />
      <Stack.Screen name="CardDetail"     component={CardDetailScreen} />
      <Stack.Screen name="Comparables"    component={ComparablesScreen} />
    </Stack.Navigator>
  );
}

function AddStack() {
  const { colors } = useTheme();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: colors.bg } }}>
      <Stack.Screen name="AddCardMain" component={AddCardScreen} />
    </Stack.Navigator>
  );
}

function MarketStack() {
  const { colors } = useTheme();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: colors.bg } }}>
      <Stack.Screen name="MarketHome"  component={MarketScreen} />
      <Stack.Screen name="Comparables" component={ComparablesScreen} />
    </Stack.Navigator>
  );
}

// ── Custom Tab Bar ────────────────────────────────────────────────────────────
function CustomTabBar({ state, navigation }) {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const ICONS = isDark ? ICONS_DARK : ICONS_LIGHT;

  const tabs = [
    { key: 'collection', label: t.nav_collection, icon: 'collection' },
    { key: 'stats',      label: t.nav_stats,      icon: 'stats' },
    { key: 'add',        label: t.nav_add,         icon: 'add',      isCenter: true },
    { key: 'market',     label: t.nav_market,      icon: 'market' },
    { key: 'settings',   label: t.nav_settings,    icon: 'settings' },
  ];

  const iconSize = width > 600 ? 40 : 32;

  return (
    <View style={[styles.tabBarOuter, { paddingBottom: insets.bottom || 8 }]}>
      <View style={[
        styles.tabBarInner,
        {
          backgroundColor: isDark ? colors.surface : '#FFFFFF',
          borderColor: isDark ? colors.borderGlow : colors.border,
          shadowColor: colors.accent,
        },
      ]}>
        {tabs.map((tab, index) => {
          const focused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: state.routes[index].key, canPreventDefault: true });
            if (!focused && !event.defaultPrevented) navigation.navigate(state.routes[index].name);
          };

          if (tab.isCenter) {
            return (
              <TouchableOpacity key={tab.key} style={styles.centerWrap} onPress={onPress} activeOpacity={0.85}>
                <View style={[styles.centerBtn, {
                  backgroundColor: isDark ? colors.accent : colors.accent,
                  shadowColor: colors.accentGlow,
                }]}>
                  <Image source={ICONS[tab.icon]} style={styles.centerIcon} resizeMode="contain" />
                </View>
                <Text style={[styles.tabLabel, { color: focused ? colors.accent : colors.tabInactive }]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity key={tab.key} style={styles.tabItem} onPress={onPress} activeOpacity={0.75}>
              {focused && (
                <View style={[styles.tabGlow, { backgroundColor: colors.accent + '18' }]} />
              )}
              <Image
                source={ICONS[tab.icon]}
                style={[{ width: iconSize, height: iconSize }, !focused && { opacity: 0.45 }]}
                resizeMode="contain"
              />
              <Text style={[styles.tabLabel, { color: focused ? colors.accent : colors.tabInactive }]}>
                {tab.label}
              </Text>
              {focused && <View style={[styles.tabDot, { backgroundColor: colors.accent }]} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ── Navigator ─────────────────────────────────────────────────────────────────
function AppNavigator() {
  const { colors, isDark } = useTheme();
  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor={colors.bg} />
      <Tab.Navigator
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <Tab.Screen name="Accueil"  component={CollectionStack} />
        <Tab.Screen name="Stats"    component={StatsScreen} />
        <Tab.Screen name="Ajouter"  component={AddStack} />
        <Tab.Screen name="Marché"   component={MarketStack} />
        <Tab.Screen name="Réglages" component={SettingsScreen} />
      </Tab.Navigator>
    </>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  tabBarOuter: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    paddingHorizontal: 12,
    paddingTop: 6,
    backgroundColor: 'transparent',
  },
  tabBarInner: {
    flexDirection: 'row',
    borderRadius: 28,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    gap: 3,
    position: 'relative',
  },
  tabGlow: {
    position: 'absolute',
    top: 0, left: 4, right: 4, bottom: 0,
    borderRadius: 14,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  tabDot: {
    width: 4, height: 4,
    borderRadius: 2,
  },
  centerWrap: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
    marginTop: -22,
  },
  centerBtn: {
    width: 58, height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 14,
  },
  centerIcon: {
    width: 36, height: 36,
  },
});
