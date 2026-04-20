import React, { useState, useRef, useEffect } from 'react';
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

const BAR_COLOR = '#111111';
const BAR_HEIGHT = 70;
const ACCENT_COLOR = '#7CC82A';
const CENTER_INDEX = 2;
const DEFAULT_INDEX = 1;

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const TABS: ReadonlyArray<{
  name: string;
  active: IoniconName;
  inactive: IoniconName;
  Screen: React.ComponentType;
}> = [
  { name: 'History',  active: 'notifications',   inactive: 'notifications-outline', Screen: HistoryScreen },
  { name: 'Home',     active: 'happy',            inactive: 'happy-outline',         Screen: HomeScreen    },
  { name: 'New',      active: 'apps',             inactive: 'apps-outline',          Screen: NewScreen     },
  { name: 'Routines', active: 'trending-up',      inactive: 'trending-up-outline',   Screen: RoutinesScreen},
  { name: 'Profile',  active: 'person',           inactive: 'person-outline',        Screen: ProfileScreen },
];

type TabItemProps = {
  active: IoniconName;
  inactive: IoniconName;
  isFocused: boolean;
  alwaysHighlight: boolean;
  onPress: () => void;
};

function TabItem({ active, inactive, isFocused, alwaysHighlight, onPress }: TabItemProps) {
  const progress = useRef(
    new Animated.Value((isFocused || alwaysHighlight) ? 1 : 0)
  ).current;

  useEffect(() => {
    if (alwaysHighlight) return;
    Animated.timing(progress, {
      toValue: isFocused ? 1 : 0,
      duration: 280,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [isFocused]);

  const scale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1],
  });

  const lit = isFocused || alwaysHighlight;

  return (
    <TouchableOpacity activeOpacity={0.8} style={styles.tab} onPress={onPress}>
      <Animated.View
        style={[
          styles.activeCircle,
          {
            backgroundColor: ACCENT_COLOR,
            opacity: progress,
            transform: [{ scale }],
          },
        ]}
      />
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
  const slideX = useRef(new Animated.Value(-DEFAULT_INDEX * SCREEN_WIDTH)).current;

  const tabBarHeight = BAR_HEIGHT + insets.bottom + 16;

  const navigate = (newIndex: number) => {
    if (newIndex === activeIndex) return;
    setActiveIndex(newIndex);
    Animated.timing(slideX, {
      toValue: -newIndex * SCREEN_WIDTH,
      duration: 320,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
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

      <View style={[styles.barWrapper, { paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.bar}>
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
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  activeCircle: {
    position: 'absolute',
    width: 46,
    height: 46,
    borderRadius: 23,
  },
});
