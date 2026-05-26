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

import { ThemeProvider, useTheme, glowShadow } from './src/context/ThemeContext';
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

function MarketStack() {
  const { colors } = useTheme();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: colors.bg } }}>
      <Stack.Screen name="MarketHome"  component={MarketScreen} />
      <Stack.Screen name="Comparables" component={ComparablesScreen} />
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

// ── Custom Tab Bar ────────────────────────────────────────────────────────────
function CustomTabBar({ state, descriptors, navigation }) {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const ICONS = isDark ? ICONS_DARK : ICONS_LIGHT;

  const tabLabels = ['Collection', 'Stats', 'Ajouter', 'Marché', 'Réglages'];
  const iconKeys  = ['collection', 'stats', 'add', 'market', 'settings'];
  const iconSize  = width > 600 ? 36 : 28;

  return (
    <View style={[
      styles.tabBarOuter,
      { paddingBottom: insets.bottom || 8 },
    ]}>
      {/* Fond floating avec glassmorphism */}
      <View style={[
        styles.tabBarInner,
        {
          backgroundColor: isDark ? colors.surface : colors.card,
          borderColor: isDark ? colors.borderGlow : colors.border,
          ...glowShadow(colors.accent, 20),
        },
      ]}>
        {state.routes.map((route, index) => {
          const focused  = state.index === index;
          const isCenter = index === 2; // bouton +

          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          if (isCenter) {
            return (
              <TouchableOpacity
                key={route.key}
                style={styles.tabCenterWrap}
                onPress={onPress}
                activeOpacity={0.85}
              >
                <View style={[
                  styles.tabCenterBtn,
                  {
                    backgroundColor: colors.accent,
                    ...glowShadow(colors.accentGlow, 16),
                  },
                ]}>
                  <Image
                    source={ICONS[iconKeys[index]]}
                    style={{ width: 32, height: 32 }}
                    resizeMode="contain"
                  />
                </View>
                <Text style={[styles.tabLabel, { color: focused ? colors.accent : colors.tabInactive }]}>
                  {tabLabels[index]}
                </Text>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={route.key}
              style={styles.tabItem}
              onPress={onPress}
              activeOpacity={0.75}
            >
              {/* Glow indicator actif */}
              {focused && (
                <View style={[styles.tabActiveGlow, { backgroundColor: colors.accent + '22' }]} />
              )}
              <Image
                source={ICONS[iconKeys[index]]}
                style={[
                  { width: iconSize, height: iconSize },
                  !focused && { opacity: 0.45 },
                ]}
                resizeMode="contain"
              />
              <Text style={[
                styles.tabLabel,
                { color: focused ? colors.accent : colors.tabInactive },
              ]}>
                {tabLabels[index]}
              </Text>
              {focused && (
                <View style={[styles.tabDot, { backgroundColor: colors.accent }]} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ── Navigation ────────────────────────────────────────────────────────────────
function AppNavigator() {
  const { colors, isDark } = useTheme();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor={colors.bg} />
      <Tab.Navigator
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <Tab.Screen name="Accueil"   component={CollectionStack} />
        <Tab.Screen name="Stats"     component={StatsScreen} />
        <Tab.Screen name="Ajouter"   component={AddStack} />
        <Tab.Screen name="Marché"    component={MarketStack} />
        <Tab.Screen name="Réglages"  component={SettingsScreen} />
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
  // Tab bar floating
  tabBarOuter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingTop: 8,
    backgroundColor: 'transparent',
  },
  tabBarInner: {
    flexDirection: 'row',
    borderRadius: 28,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 4,
    alignItems: 'center',
  },

  // Tab items
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 4,
    position: 'relative',
  },
  tabActiveGlow: {
    position: 'absolute',
    top: 0, left: 4, right: 4, bottom: 0,
    borderRadius: 16,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  tabDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },

  // Bouton central +
  tabCenterWrap: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    marginTop: -20,
  },
  tabCenterBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
