import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HistoryScreen } from '../features/history/presentation/screens/HistoryScreen';
import { HomeScreen } from '../features/home/presentation/screens/HomeScreen';
import { NewScreen } from '../features/new/presentation/screens/NewScreen';
import { ProfileScreen } from '../features/profile/presentation/screens/ProfileScreen';
import { RoutinesScreen } from '../features/routines/presentation/screens/RoutinesScreen';
import { TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();

const BAR_BG_COLOR     = '#FFFFFF';
const BAR_BORDER_COLOR = '#606060';
const ACTIVE_COLOR     = '#F1E5D1'; // cream pill behind focused non-center tab
const CENTER_COLOR     = '#8FA968'; // muted olive for center tab
const ACTIVE_ICON      = '#3E2D14'; // dark brown icon on cream pill
const CENTER_ICON      = '#FFFFFF'; // icon inside the olive circle
const INACTIVE_ICON    = '#2A2A2A'; // default icon on white bar
const BAR_HEIGHT       = 70;
const CIRCLE_SIZE      = 46;
const CENTER_ROUTE     = 'New';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const TAB_ICONS: Record<string, { active: IoniconName; inactive: IoniconName }> = {
  History:  { active: 'notifications', inactive: 'notifications-outline' },
  Home:     { active: 'happy',         inactive: 'happy-outline' },
  New:      { active: 'apps',          inactive: 'apps-outline' },
  Routines: { active: 'trending-up',   inactive: 'trending-up-outline' },
  Profile:  { active: 'person',        inactive: 'person-outline' },
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

  return (
    <View style={[styles.barWrapper, { paddingBottom: insets.bottom }]}>
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const isCenter = route.name === CENTER_ROUTE;
          const lit = isFocused || isCenter;
          const icons = TAB_ICONS[route.name];

          return (
            <TouchableOpacity
              key={route.key}
              activeOpacity={0.8}
              style={styles.tab}
              onPress={() => navigate(route.name, route.key, index)}
            >
              <View
                style={[
                  styles.circle,
                  isCenter && styles.centerCircle,
                  isFocused && !isCenter && styles.activeCircle,
                ]}
              >
                <Ionicons
                  name={lit ? icons.active : icons.inactive}
                  size={22}
                  color={isCenter ? CENTER_ICON : isFocused ? ACTIVE_ICON : INACTIVE_ICON}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props: BottomTabBarProps) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
      initialRouteName="Home"
    >
      <Tab.Screen name="History"  component={HistoryScreen} />
      <Tab.Screen name="Home"     component={HomeScreen} />
      <Tab.Screen name="New"      component={NewScreen} />
      <Tab.Screen name="Routines" component={RoutinesScreen} />
      <Tab.Screen name="Profile"  component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  barWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
  },
  bar: {
    height: BAR_HEIGHT,
    borderRadius: 29,
    backgroundColor: BAR_BG_COLOR,
    borderWidth: 0.2,
    borderColor: BAR_BORDER_COLOR,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
      android: { elevation: 12 },
    }),
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerCircle: {
    backgroundColor: CENTER_COLOR,
  },
  activeCircle: {
    backgroundColor: ACTIVE_COLOR,
  },
});
