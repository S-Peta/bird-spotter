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

const Stack = createNativeStackNavigator();
const InsideStack = createNativeStackNavigator();

// function InsideLayout() {
//   return (
//     <InsideStack.Navigator>
//       <InsideStack.Screen name='Inside' component={FirstPage}/>
//     </InsideStack.Navigator>
//   )
// }

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    onAuthStateChanged(firebase_auth, (user) => {
      // console.log("user", user);
      setUser(user);
    });
  }, []);

  return (

    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {user ? (
          <Stack.Screen
            name="Tabs"
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
        <Stack.Screen name="Ranking" component={RankingScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Caught Birds" component={CaughtBirdsScreen} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
