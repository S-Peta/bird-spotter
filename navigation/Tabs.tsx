import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MapScreen from "../Screens/MapScreen";
import CameraScreen from "../Screens/CameraScreen";
import UserProfileScreen from "../Screens/UserProfileScreen";
import { PointsProvider } from "../Contexts/Points";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RankingScreen from "../Screens/RankingScreen";
import CaughtBirdsScreen from "../Screens/CaughtBirdsScreen";
import Ionicons from "@expo/vector-icons/Ionicons";
import { View, Text } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function Tabs() {
  return (
    <PointsProvider>
      <Tab.Navigator>
        {/* <Tab.Screen
          name="User Profile"
          component={UserProfileScreen}
          options={{ headerShown: true }}
        /> */}
        <Tab.Screen
          name="Home"
          options={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarIcon: ({ focused }) => {
              return (
                <View
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
                  <AntDesign name="home" size={24} color="black" />
                  <Text style={{ fontSize: 12, color: "#162478" }}>Home</Text>
                </View>
              );
            },
          }}
        >
          {() => (
            <Stack.Navigator>
              <Stack.Screen name="Home" component={UserProfileScreen} />
              <Stack.Screen name="Ranking" component={RankingScreen} />
              <Stack.Screen name="Caught Birds" component={CaughtBirdsScreen} />
            </Stack.Navigator>
          )}
        </Tab.Screen>
        <Tab.Screen
          name="Map"
          component={MapScreen}
          options={{
            tabBarShowLabel: false,
            tabBarIcon: ({ focused }) => {
              return (
                <View
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
                  <Feather name="map-pin" size={24} color="black" />
                  <Text style={{ fontSize: 12, color: "#162478" }}>Map</Text>
                </View>
              );
            },
          }}
        />
        <Tab.Screen
          name="Camera"
          component={CameraScreen}
          options={{
            tabBarShowLabel: false,
            tabBarIcon: ({ focused }) => {
              return (
                <View
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
                  <AntDesign name="camerao" size={24} color="black" />{" "}
                  <Text style={{ fontSize: 12, color: "#162478" }}>Camera</Text>
                </View>
              );
            },
          }}
        />


        {/* <Tab.Screen name="User Profile" component={UserProfileScreen} /> */}
      </Tab.Navigator>
    </PointsProvider>
  );
}
