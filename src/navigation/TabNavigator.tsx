import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HistoryScreen } from '../features/history/presentation/screens/HistoryScreen';
import { HomeScreen } from '../features/home/presentation/screens/HomeScreen';
import { NewScreen } from '../features/new/presentation/screens/NewScreen';
import { ProfileScreen } from '../features/profile/presentation/screens/ProfileScreen';
import { RoutinesScreen } from '../features/routines/presentation/screens/RoutinesScreen';
import { TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();

const BAR_COLOR = '#111111';
const ACCENT_COLOR = '#7C3AED';
const HOME_SIZE = 72;
const PILL_HEIGHT = 62;

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const TAB_ICONS: Record<string, { active: IoniconName; inactive: IoniconName }> = {
  History:  { active: 'pie-chart',    inactive: 'pie-chart-outline' },
  New:      { active: 'add',          inactive: 'add' },
  Routines: { active: 'trending-up',  inactive: 'trending-up-outline' },
  Profile:  { active: 'person',       inactive: 'person-outline' },
};

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  const navigate = (routeName: string, routeKey: string, index: number) => {
    const event = navigation.emit({
      type: 'tabPress',
      target: routeKey,
      canPreventDefault: true,
    });
    if (state.index !== index && !event.defaultPrevented) {
      navigation.navigate(routeName);
    }
  };

  const homeRoute = state.routes[0];
  const isHomeFocused = state.index === 0;

  return (
    <View style={[styles.wrapper, { paddingBottom: insets.bottom + 12 }]}>
      <View style={styles.barRow}>
        {/* Home — standalone circle that overlaps the pill */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.homeCircle}
          onPress={() => navigate(homeRoute.name, homeRoute.key, 0)}
        >
          <View style={[styles.homeIconRing, isHomeFocused && styles.homeIconRingActive]}>
            <Ionicons
              name={isHomeFocused ? 'home' : 'home-outline'}
              size={22}
              color={isHomeFocused ? BAR_COLOR : 'rgba(255,255,255,0.6)'}
            />
          </View>
        </TouchableOpacity>

        {/* Pill — contains the remaining 4 tabs */}
        <View style={styles.pill}>
          {state.routes.slice(1).map((route, i) => {
            const tabIndex = i + 1;
            const isFocused = state.index === tabIndex;
            const isNew = route.name === 'New';
            const icons = TAB_ICONS[route.name];

            return (
              <TouchableOpacity
                key={route.key}
                activeOpacity={0.8}
                style={styles.tab}
                onPress={() => navigate(route.name, route.key, tabIndex)}
              >
                {isNew ? (
                  <View style={[styles.newBubble, isFocused && styles.newBubbleFocused]}>
                    <Ionicons name={icons.active} size={26} color="#fff" />
                  </View>
                ) : (
                  <Ionicons
                    name={isFocused ? icons.active : icons.inactive}
                    size={22}
                    color={isFocused ? '#fff' : 'rgba(255,255,255,0.45)'}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    // shadow
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
      },
      android: { elevation: 12 },
    }),
  },
  homeCircle: {
    width: HOME_SIZE,
    height: HOME_SIZE,
    borderRadius: HOME_SIZE / 2,
    backgroundColor: BAR_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    marginRight: -14,
  },
  homeIconRing: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeIconRingActive: {
    backgroundColor: '#fff',
  },
  pill: {
    flex: 1,
    height: PILL_HEIGHT,
    borderRadius: PILL_HEIGHT / 2,
    backgroundColor: BAR_COLOR,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 18,
    paddingRight: 6,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  newBubble: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(124, 58, 237, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  newBubbleFocused: {
    backgroundColor: ACCENT_COLOR,
  },
});

export function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home"     component={HomeScreen} />
      <Tab.Screen name="History"  component={HistoryScreen} />
      <Tab.Screen name="New"      component={NewScreen} />
      <Tab.Screen name="Routines" component={RoutinesScreen} />
      <Tab.Screen name="Profile"  component={ProfileScreen} />
    </Tab.Navigator>
  );
}
