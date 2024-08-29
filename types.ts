import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import * as Location from "expo-location";

export type RootStackParamList = {
  "Caught Birds": {
    totalBirds: number;
    totalCaughtBirds: number;
    userId: string;
  };
  "Bird Page": {
    species: string;
    url: string;
    scientificName: string;
    species_id?: string;
  };
  Login: undefined;
  Main: undefined;
  Ranking: undefined;
};

export interface LocationCoords {
  latitude: number;
  longitude: number;
}
