import React from "react";
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
import SingleBirdScreen from "../Screens/SingleBirdScreen";
import GuessPage from "../Screens/GuessPage";
import ResultPage from "../Screens/ResultPage";
import PredictionPage from "../Screens/CameraPredictionScreen";

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const CameraStack = createNativeStackNavigator();

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
                  <AntDesign
                    name="home"
                    size={24}
                    color={focused ? "red" : "#162478"}
                  />
                  <Text style={{ fontSize: 12, color: "#162478" }}>Home</Text>
                </View>
              );
            },
          }}
        >
          {() => (
            <HomeStack.Navigator>
              <HomeStack.Screen
                name="User Profile"
                component={UserProfileScreen}
              />
              <HomeStack.Screen name="Ranking" component={RankingScreen} />
              <HomeStack.Screen
                name="Caught Birds"
                component={CaughtBirdsScreen}
              />
              <HomeStack.Screen
                name="Single Bird"
                component={SingleBirdScreen}
              />
            </HomeStack.Navigator>
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
                  <Feather
                    name="map-pin"
                    size={24}
                    color={focused ? "red" : "#162478"}
                  />
                  <Text style={{ fontSize: 12, color: "#162478" }}>Map</Text>
                </View>
              );
            },
          }}
        />
        <Tab.Screen
          name="Camera Page"
          options={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarIcon: ({ focused }) => {
              return (
                <View
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
                  <AntDesign
                    name="camera"
                    size={24}
                    color={focused ? "red" : "#162478"}
                  />
                  <Text style={{ fontSize: 12, color: "#162478" }}>Camera</Text>
                </View>
              );
            },
          }}
        >
          {() => (
            <CameraStack.Navigator>
              <CameraStack.Screen
                name="Camera"
                component={PredictionPage}
                options={{ headerShown: true }}
              />
              <CameraStack.Screen
                name="Guess Page"
                component={GuessPage}
                options={{ headerShown: true }}
              />
              <CameraStack.Screen
                name="Result Page"
                component={ResultPage}
                options={{ headerShown: false }}
              />
            </CameraStack.Navigator>
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </PointsProvider>
  );
}
