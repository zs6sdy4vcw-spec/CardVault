import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, Text, Image, StyleSheet, useWindowDimensions, Platform } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import CollectionScreen  from './src/screens/CollectionScreen';
import AddCardScreen     from './src/screens/AddCardScreen';
import CardDetailScreen  from './src/screens/CardDetailScreen';
import ComparablesScreen from './src/screens/ComparablesScreen';
import StatsScreen       from './src/screens/StatsScreen';
import SettingsScreen    from './src/screens/SettingsScreen';
import MarketScreen      from './src/screens/MarketScreen';

const Tab   = createBottomTabNavigator();
const Stack = createStackNavigator();

const ICONS = {
  collection: require('./assets/icons/collection.png'),
  stats:      require('./assets/icons/stats.png'),
  add:        require('./assets/icons/add.png'),
  market:     require('./assets/icons/market.png'),
  settings:   require('./assets/icons/settings.png'),
};

// ── Stacks ────────────────────────────────────────────────────────────────────
function CollectionStack() {
  const { colors } = useTheme();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: colors.bg } }}>
      <Stack.Screen name="CollectionHome" component={CollectionScreen} />
      <Stack.Screen name="CardDetail"     component={CardDetailScreen} />
      <Stack.Screen name="Comparables"    component={ComparablesScreen} />
      <Stack.Screen name="AddCard"        component={AddCardScreen} />
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

// ── Tab Icon ──────────────────────────────────────────────────────────────────
function TabIcon({ iconKey, label, focused, colors, iconSize }) {
  return (
    <View style={[styles.tabIcon, { width: Math.max(iconSize + 20, 60) }]}>
      <Image
        source={ICONS[iconKey]}
        style={{ width: iconSize, height: iconSize, opacity: focused ? 1 : 0.45 }}
        resizeMode="contain"
      />
      <Text
        style={[styles.tabLabel, { color: focused ? colors.tabActive : colors.tabInactive, fontSize: iconSize > 30 ? 11 : 10 }]}
        numberOfLines={1}
      >
        {label}
      </Text>
      {focused && <View style={[styles.dot, { backgroundColor: colors.accent }]} />}
    </View>
  );
}

// ── Main navigator ────────────────────────────────────────────────────────────
function AppNavigator() {
  const { colors, isDark } = useTheme();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isLandscape = width > height;

  // Taille icône adaptative — tablette paysage = plus petit
  const iconSize = isLandscape
    ? (width > 900 ? 28 : 24)
    : (width > 600 ? 34 : width > 400 ? 28 : 24);

  const tabHeight = iconSize + 36 + insets.bottom;

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor={colors.bg} />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: colors.tabBg,
            borderTopWidth: 1,
            borderTopColor: colors.tabBorder,
            height: tabHeight,
            paddingBottom: insets.bottom + 4,
            paddingTop: 6,
            elevation: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -3 },
            shadowOpacity: 0.12,
            shadowRadius: 8,
          },
        }}
      >
        <Tab.Screen
          name="Accueil"
          component={CollectionStack}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon iconKey="collection" label="Collection" focused={focused} colors={colors} iconSize={iconSize} />
            ),
          }}
        />
        <Tab.Screen
          name="Stats"
          component={StatsScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon iconKey="stats" label="Stats" focused={focused} colors={colors} iconSize={iconSize} />
            ),
          }}
        />
        <Tab.Screen
          name="Ajouter"
          component={AddStack}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon iconKey="add" label="Ajouter" focused={focused} colors={colors} iconSize={iconSize} />
            ),
          }}
        />
        <Tab.Screen
          name="Marché"
          component={MarketStack}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon iconKey="market" label="Marché" focused={focused} colors={colors} iconSize={iconSize} />
            ),
          }}
        />
        <Tab.Screen
          name="Réglages"
          component={SettingsScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon iconKey="settings" label="Réglages" focused={focused} colors={colors} iconSize={iconSize} />
            ),
          }}
        />
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
  tabIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 4,
    gap: 3,
  },
  tabLabel: {
    fontWeight: '600',
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 1,
  },
});
