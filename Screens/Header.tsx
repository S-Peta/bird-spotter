import { Link } from "@react-navigation/native";
import { View, Text } from "react-native";

export default function Header() {
    return (
        <View>
            <Link to={{screen: 'Map'}}>
                Map
            </Link>
            <Link to={{screen: 'Camera'}}>
            Camera
            </Link>
            <Link to={{screen: 'User Profile'}}>
            User Profile
            </Link>
        </View>
    )
}

