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
const BORDER_WIDTH     = 0.4;
const BAR_BORDER_COLOR = '#606060';
const ACTIVE_COLOR     = '#F1E5D1'; // cream pill behind focused non-center tab
const FAB_COLOR        = '#8FA968'; // muted olive for FAB
const FAB_COLOR_FOCUSED = '#6E8A4A'; // darker olive when the New screen is focused
const ACTIVE_ICON      = '#3E2D14'; // dark brown icon on cream pill
const FAB_ICON         = '#FFFFFF'; // icon inside the FAB
const INACTIVE_ICON    = '#2A2A2A'; // default icon on white bar
const BAR_HEIGHT       = 70;
const CIRCLE_SIZE      = 52;
const FAB_SIZE         = 60;
const FAB_LIFT         = 65; // visual vertical offset used to position the middle FAB relative to the tab bar
const ICON_SIZE        = 28;
const FAB_ICON_SIZE    = 32;
const CENTER_ROUTE     = 'New';

const FAB_LABELS = ['New', 'Add', 'Create', 'Start', 'Track'];

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const TAB_ICONS: Record<string, { active: IoniconName; inactive: IoniconName }> = {
  Home:     { active: 'home',          inactive: 'home-outline' },
  History:  { active: 'calendar',      inactive: 'calendar-outline' },
  New:      { active: 'barbell',       inactive: 'barbell-outline' },
  Routines: { active: 'star',          inactive: 'star-outline' },
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

  const centerIndex = state.routes.findIndex((r) => r.name === CENTER_ROUTE);
  const centerRoute = centerIndex >= 0 ? state.routes[centerIndex] : undefined;

  const handleFabPress = () => {
    // TODO: replace with navigation to a dedicated creation page.
    const currentRoute = state.routes[state.index];
    const currentLabel =
      (currentRoute?.name === CENTER_ROUTE &&
        (currentRoute.params as { label?: string } | undefined)?.label) ||
      FAB_LABELS[0];
    const nextIndex = (FAB_LABELS.indexOf(currentLabel) + 1) % FAB_LABELS.length;
    navigation.navigate(CENTER_ROUTE, { label: FAB_LABELS[nextIndex] });
  };

  return (
    <View style={[styles.barWrapper, { paddingBottom: insets.bottom }]}>
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          if (route.name === CENTER_ROUTE) {
            return <View key={route.key} style={styles.tab} />;
          }

          const isFocused = state.index === index;
          const icons = TAB_ICONS[route.name];

          return (
            <TouchableOpacity
              key={route.key}
              activeOpacity={0.8}
              style={styles.tab}
              onPress={() => navigate(route.name, route.key, index)}
            >
              <View style={[styles.circle, isFocused && styles.activeCircle]}>
                <Ionicons
                  name={isFocused ? icons.active : icons.inactive}
                  size={ICON_SIZE}
                  color={isFocused ? ACTIVE_ICON : INACTIVE_ICON}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {centerRoute && (() => {
        const isFabFocused = state.index === centerIndex;
        const centerIcons = TAB_ICONS[CENTER_ROUTE];
        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Create"
            accessibilityState={{ selected: isFabFocused }}
            activeOpacity={0.85}
            onPress={handleFabPress}
            style={[
              styles.fab,
              isFabFocused && styles.fabFocused,
              { bottom: insets.bottom + BAR_HEIGHT - FAB_LIFT },
            ]}
          >
            <Ionicons
              name={isFabFocused ? centerIcons.active : centerIcons.inactive}
              size={FAB_ICON_SIZE}
              color={FAB_ICON}
            />
          </TouchableOpacity>
        );
      })()}
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
      <Tab.Screen name="Home"     component={HomeScreen} />
      <Tab.Screen name="History"  component={HistoryScreen} />
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
    borderWidth: BORDER_WIDTH,
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
  activeCircle: {
    backgroundColor: ACTIVE_COLOR,
  },
  fab: {
    position: 'absolute',
    alignSelf: 'center',
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    backgroundColor: FAB_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
      },
      android: { elevation: 16 },
    }),
  },
  fabFocused: {
    backgroundColor: FAB_COLOR_FOCUSED,
  },
});
