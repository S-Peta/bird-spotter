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


const Stack = createNativeStackNavigator<RootStackParamList>();
const InsideStack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    onAuthStateChanged(firebase_auth, (user) => {
      setUser(user);
    });
  }, []);
  return (


  <GestureHandlerRootView style={{ flex: 1 }}>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
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

        {/* <Stack.Screen
          name="Ranking"
          component={RankingScreen}
          options={{ headerShown: true }}
        />

        <Stack.Screen
          name="Caught Birds"
          component={CaughtBirdsScreen}
          options={{ headerShown: false }}
        /> */}
      </Stack.Navigator>
    </NavigationContainer>
    </GestureHandlerRootView>
  );
}
