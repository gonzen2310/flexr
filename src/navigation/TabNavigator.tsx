import React, { useState, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HistoryScreen } from '../features/history/presentation/screens/HistoryScreen';
import { HomeScreen } from '../features/home/presentation/screens/HomeScreen';
import { NewScreen } from '../features/new/presentation/screens/NewScreen';
import { ProfileScreen } from '../features/profile/presentation/screens/ProfileScreen';
import { RoutinesScreen } from '../features/routines/presentation/screens/RoutinesScreen';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const BAR_COLOR    = '#111111';
const ACTIVE_COLOR = '#2D2008'; // dark warm brown — active non-center tab
const CENTER_COLOR = '#7CC82A'; // lime green   — center tab, always on
const BAR_HEIGHT   = 70;
const CIRCLE_SIZE  = 46;
const CENTER_INDEX = 2;
const DEFAULT_INDEX = 1; // Home

// Bar geometry: barWrapper paddingH 24*2 = 48, bar paddingH 8*2 = 16
const BAR_WIDTH = SCREEN_WIDTH - 48;
const TAB_WIDTH = (BAR_WIDTH - 16) / 5;

// translateX that centers a CIRCLE_SIZE circle on the given tab index
// (absolute children ignore padding, so we manually add the bar's paddingLeft: 8)
const getIndicatorTX = (index: number) =>
  8 + index * TAB_WIDTH + TAB_WIDTH / 2 - CIRCLE_SIZE / 2;

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const TABS: ReadonlyArray<{
  name: string;
  active: IoniconName;
  inactive: IoniconName;
  Screen: React.ComponentType;
}> = [
  { name: 'History',  active: 'notifications',  inactive: 'notifications-outline', Screen: HistoryScreen  },
  { name: 'Home',     active: 'happy',           inactive: 'happy-outline',         Screen: HomeScreen     },
  { name: 'New',      active: 'apps',            inactive: 'apps-outline',          Screen: NewScreen      },
  { name: 'Routines', active: 'trending-up',     inactive: 'trending-up-outline',   Screen: RoutinesScreen },
  { name: 'Profile',  active: 'person',          inactive: 'person-outline',        Screen: ProfileScreen  },
];

type TabItemProps = {
  active: IoniconName;
  inactive: IoniconName;
  isFocused: boolean;
  alwaysHighlight: boolean;
  onPress: () => void;
};

function TabItem({ active, inactive, isFocused, alwaysHighlight, onPress }: TabItemProps) {
  const lit = isFocused || alwaysHighlight;
  return (
    <TouchableOpacity activeOpacity={0.8} style={styles.tab} onPress={onPress}>
      <Ionicons
        name={lit ? active : inactive}
        size={22}
        color={lit ? '#fff' : 'rgba(255,255,255,0.45)'}
      />
    </TouchableOpacity>
  );
}

export function TabNavigator() {
  const insets = useSafeAreaInsets();
  const [activeIndex, setActiveIndex] = useState(DEFAULT_INDEX);

  const slideX          = useRef(new Animated.Value(-DEFAULT_INDEX * SCREEN_WIDTH)).current;
  const indicatorTX     = useRef(new Animated.Value(getIndicatorTX(DEFAULT_INDEX))).current;
  const indicatorOpacity = useRef(new Animated.Value(1)).current;

  const tabBarHeight = BAR_HEIGHT + insets.bottom + 16;

  const navigate = (newIndex: number) => {
    if (newIndex === activeIndex) return;
    const prevIndex = activeIndex;
    setActiveIndex(newIndex);

    // Slide screens horizontally
    Animated.timing(slideX, {
      toValue: -newIndex * SCREEN_WIDTH,
      duration: 320,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    const newTX  = getIndicatorTX(newIndex);
    const prevTX = getIndicatorTX(prevIndex);

    if (newIndex === CENTER_INDEX) {
      // Slide indicator into center then fade out
      Animated.parallel([
        Animated.timing(indicatorTX, {
          toValue: newTX,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(indicatorOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (prevIndex === CENTER_INDEX) {
      // Emerge from center: snap to center position (invisible), then fade in + slide
      indicatorTX.setValue(prevTX);
      Animated.parallel([
        Animated.timing(indicatorTX, {
          toValue: newTX,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(indicatorOpacity, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Non-center to non-center: slide horizontally
      Animated.timing(indicatorTX, {
        toValue: newTX,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <View style={styles.container}>
      {/* Sliding screen content */}
      <View style={styles.viewport}>
        <Animated.View
          style={[styles.screensRow, { transform: [{ translateX: slideX }] }]}
        >
          {TABS.map(({ name, Screen }) => (
            <View key={name} style={[styles.screenSlot, { paddingBottom: tabBarHeight }]}>
              <Screen />
            </View>
          ))}
        </Animated.View>
      </View>

      {/* Floating tab bar */}
      <View style={[styles.barWrapper, { paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.bar}>
          {/* Sliding active indicator — rendered first so center circle always sits on top */}
          <Animated.View
            style={[
              styles.indicator,
              {
                backgroundColor: ACTIVE_COLOR,
                opacity: indicatorOpacity,
                transform: [{ translateX: indicatorTX }],
              },
            ]}
          />

          {/* Center circle — rendered second so it is always above the sliding indicator */}
          <View
            style={[
              styles.indicator,
              {
                backgroundColor: CENTER_COLOR,
                transform: [{ translateX: getIndicatorTX(CENTER_INDEX) }],
              },
            ]}
          />

          {TABS.map((tab, index) => (
            <TabItem
              key={tab.name}
              active={tab.active}
              inactive={tab.inactive}
              isFocused={activeIndex === index}
              alwaysHighlight={index === CENTER_INDEX}
              onPress={() => navigate(index)}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  viewport: {
    flex: 1,
    overflow: 'hidden',
  },
  screensRow: {
    flex: 1,
    flexDirection: 'row',
    width: SCREEN_WIDTH * TABS.length,
  },
  screenSlot: {
    width: SCREEN_WIDTH,
  },
  barWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
  },
  bar: {
    height: BAR_HEIGHT,
    borderRadius: 20,
    backgroundColor: BAR_COLOR,
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
  indicator: {
    position: 'absolute',
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    top: (BAR_HEIGHT - CIRCLE_SIZE) / 2,
    left: 0,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
});
