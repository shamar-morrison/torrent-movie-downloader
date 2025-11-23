import { Tabs } from "expo-router";
import { Film, Info, Search } from "lucide-react-native";
import React from "react";
import { Platform, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#e50914",
        tabBarInactiveTintColor: "#999999",
        headerShown: false,
        tabBarStyle: {
          ...styles.tabBar,
          height: Platform.select({
            ios: 60 + insets.bottom,
            android: 60 + insets.bottom,
            default: 60 + insets.bottom,
          }),
          paddingBottom: insets.bottom + 8,
        },
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Film color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color, size }) => <Search color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: "About",
          tabBarIcon: ({ color, size }) => <Info color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#1e1e1e",
    borderTopWidth: 1,
    borderTopColor: "#2a2a2a",
    paddingTop: 8,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: "600" as const,
  },
});
