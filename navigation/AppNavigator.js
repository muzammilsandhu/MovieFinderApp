import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import FavoritesScreen from "../screens/FavoritesScreen";
import WatchLaterScreen from "../screens/WatchLaterScreen";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer theme={DarkTheme}>
      <Tab.Navigator
        screenOptions={{
          headerShown: true,
          tabBarActiveTintColor: "#cc0000",
          tabBarInactiveTintColor: "#b3b3b3",
          tabBarStyle: {
            backgroundColor: "#141414",
            borderTopColor: "#333",
          },
          tabBarPressColor: "transparent",
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Favorites"
          component={FavoritesScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="heart" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Watch Later"
          component={WatchLaterScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="time" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
