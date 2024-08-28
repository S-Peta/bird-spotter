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
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Entypo from '@expo/vector-icons/Entypo';

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
          name="User Profile"
          options={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarIcon: ({ focused }) => {
              return (
                <View
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
                  <FontAwesome name="user" size={24}
                    color={focused ? "orange" : "black"}
                  />
                  {/* <Text style={{ fontSize: 12, color: "#162478" }}>Home</Text> */}
                </View>
              );
            },
          }}
        >
          {() => (
            <HomeStack.Navigator>
              <HomeStack.Screen
                name="Profile"
                component={UserProfileScreen}
              />
              <HomeStack.Screen name="Ranking" component={RankingScreen} />
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
                  <Ionicons name="map" size={24}
                    color={focused ? "orange" : "black"}
                  />
                  {/* <Text style={{ fontSize: 12, color: "#162478" }}>Map</Text> */}
                </View>
              );
            },
          }}
        />

        <Tab.Screen
<<<<<<< HEAD
          name="Caught Birds"
          // component={CaughtBirdsScreen}
=======
          name="Birds Collection"
          component={CaughtBirdsScreen}
>>>>>>> main
          options={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarIcon: ({ focused }) => {
              return (
                <View
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
                  <Entypo name="book" size={24}
                    color={focused ? "orange" : "black"}
                  />
                  {/* <Text style={{ fontSize: 12, color: "#162478" }}>Map</Text> */}
                </View>
              );
            },
          }}
          >
          {() => (
            <HomeStack.Navigator>
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

        {/* <Tab.Screen
          name="Guess Page"
          component={GuessPage}
          options={{
            tabBarShowLabel: false,
            tabBarIcon: ({ focused }) => {
              return (
                <View
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
                  <Entypo name="book" size={24}
                    color={focused ? "orange" : "black"}
                  />
                  {/* <Text style={{ fontSize: 12, color: "#162478" }}>Map</Text> */}
                {/* </View>
              );
            },
          }}
        /> */}

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
                    color={focused ? "orange" : "black"}
                  />
                  {/* <Text style={{ fontSize: 12, color: "#162478" }}>Camera</Text> */}
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
                options={{ headerShown: true }}
              />
            </CameraStack.Navigator>
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </PointsProvider>
  );
}
