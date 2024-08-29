import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { firebase_auth } from "./index";
import { Screen } from "react-native-screens";
import Tabs from "./navigation/Tabs";
import LoginScreen from "./Screens/LoginScreen";
import RankingScreen from "./Screens/RankingScreen";
import CaughtBirdsScreen from "./Screens/CaughtBirdsScreen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import SingleBirdScreen from "./Screens/SingleBirdScreen";
import { RootStackParamList } from "./types";
import * as Font from "expo-font";
import { Text } from "react-native";

const Stack = createNativeStackNavigator<RootStackParamList>();
const InsideStack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  useEffect(() => {
    onAuthStateChanged(firebase_auth, (user) => {
      setUser(user);
    });

    const loadFonts = async () => {
      await Font.loadAsync({
        Itim_400Regular: require("@expo-google-fonts/itim/Itim_400Regular.ttf"),
      });
      setFontsLoaded(true);
    };

    loadFonts();
  }, []);

  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.style = { fontFamily: "Itim_400Regular" };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login"
          screenOptions={{
          headerTitleStyle: {
            fontFamily: "Itim_400Regular",
          },
        }}
        >
          {user ? (
            <Stack.Screen
              name="Main"
              component={Tabs}
              options={{ headerShown: false }}
            />
          ) : (
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
