import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";

export type RootStackParamList = {
    "Caught Birds": {
        totalBirds: number;
        totalCaughtBirds: number;
        userId: string;
    };
    "Single Bird": {
        species: string;
    };
    "Login": undefined;
    "Main": undefined;
    "Ranking": undefined;
};



// export type UserProfileScreenProps = NativeStackScreenProps<RootStackParamList, "Caught Birds">
// export type RootStackParamList = {
//     "Caught Birds": {
//         totalBirds: number,
//         totalCaughtBirds: number
//     }
// }
