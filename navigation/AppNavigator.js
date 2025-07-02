import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "../screens/HomeScreen";
import FavoritesScreen from "../screens/FavoritesScreen";
import WatchLaterScreen from "../screens/WatchLaterScreen";
import MovieDetailsScreen from "../screens/MovieDetailsScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TAB_SCREENS = [
  {
    name: "Home",
    component: HomeScreen,
    icon: "home",
  },
  {
    name: "Favorites",
    component: FavoritesScreen,
    icon: "heart",
  },
  {
    name: "Watch Later",
    component: WatchLaterScreen,
    icon: "time",
  },
];

const getTabScreenOptions = (iconName) => ({
  tabBarIcon: ({ color, size }) => (
    <Ionicons name={iconName} color={color} size={size} />
  ),
});

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: "#cc0000",
        tabBarInactiveTintColor: "#b3b3b3",
        tabBarStyle: {
          backgroundColor: "#141414",
          borderTopColor: "#333",
        },
        tabBarPressColor: "transparent", // removes ripple
      }}
    >
      {TAB_SCREENS.map(({ name, component, icon }) => (
        <Tab.Screen
          key={name}
          name={name}
          component={component}
          options={getTabScreenOptions(icon)}
        />
      ))}
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer theme={DarkTheme}>
      <Stack.Navigator>
        <Stack.Screen
          name="MainTabs"
          component={Tabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MovieDetails"
          component={MovieDetailsScreen}
          options={{
            title: "Movie Details",
            headerStyle: { backgroundColor: "#141414" },
            headerTintColor: "#fff",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
