import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MapScreen from "../Screens/MapScreen";
import CameraScreen from "../Screens/CameraScreen";
import UserProfileScreen from "../Screens/UserProfileScreen";
import { PointsProvider } from "../Contexts/Points";

const Tab = createBottomTabNavigator();

export default function Tabs() {
  
  return (
    <PointsProvider>
      <Tab.Navigator>
        <Tab.Screen name="User Profile" component={UserProfileScreen} options={{ headerShown: false }} /> 
        <Tab.Screen name="Map" component={MapScreen} />
        <Tab.Screen name="Camera" component={CameraScreen} />
        {/* <Tab.Screen name="User Profile" component={UserProfileScreen} /> */}
      </Tab.Navigator>
    </PointsProvider>
  );
}
