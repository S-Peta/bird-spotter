import { View, Text, StyleSheet, Alert } from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import MapView from "react-native-maps";
import {
  getCaughtAllBirds,
  getUsername,
  getBirdsImageUrls,
} from "../utils/getData";
import CustomMarker from "../Components/CustomMarker";
import CaughtBirdMapCard from "../Components/CaughtBirdMapCard";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import * as Location from "expo-location";

export default function MapScreen() {
  const [caughtBirds, setCaughtBirds] = useState<
    {
      species: string;
      image: string;
      username: string;
      location: string;
      uid: string;
    }[]
  >([]);
  const [selectedBird, setSelectedBird] = useState<{
    species: string;
    image: string;
    username: string;
    location: string;
    uid: string;
  } | null>(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 51.4093802,
    longitude: 0.0126596,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const getUserLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission to access location was denied", "OK");
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    setMapRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  };

  useEffect(() => {
    const fetchCaughtBirds = async () => {
      const caughtBirdsList = await getCaughtAllBirds();
      const allSpecies = caughtBirdsList.map((bird) => {
        return bird.species;
      });
      const allUserIds = caughtBirdsList.map((bird) => {
        return bird.user_id;
      });
      const urls = await getBirdsImageUrls(allSpecies);
      const allUsernames = await Promise.all(
        allUserIds.map(async (user) => {
          const username = await getUsername(user);
          return username;
        })
      );
      const allLocations = caughtBirdsList.map((bird) => {
        return bird.location;
      });
      const allCaughtBirdsData = allSpecies.map((species, index) => ({
        species,
        image: urls[index],
        username: allUsernames[index],
        location: allLocations[index],
        uid: `${new Date().getTime()}-${Math.random()}`,
      }));
      setCaughtBirds(allCaughtBirdsData);
    };
    fetchCaughtBirds();

    getUserLocation();
  }, []);
  const snapPoints = useMemo(() => ["10", "50%", "90%"], []);
  return (
    <View>
      <MapView style={styles.map} region={mapRegion}>
        {caughtBirds.map((caughtBird) => {
          const uniqueKey = caughtBird.uid;
          return (
            <CustomMarker
              key={uniqueKey}
              caughtBird={caughtBird}
              onPress={() => setSelectedBird(caughtBird)}
            />
          );
        })}
      </MapView>
      {selectedBird && (
        <View
          style={{
            position: "absolute",
            bottom: 90,
            left: 10,
            right: 10,
          }}
        >
          <CaughtBirdMapCard
            key={selectedBird.uid}
            caughtBird={selectedBird}
            setSelectedBird={setSelectedBird}
          />
        </View>
      )}

      <BottomSheet index={0} snapPoints={snapPoints}>
        <View style={styles.bottomSheetcontainer}>
          <Text style={styles.listTitle}>
            View the birds spotted by other players
          </Text>
          <BottomSheetFlatList
            data={caughtBirds}
            keyExtractor={(item) => item.uid}
            contentContainerStyle={{ gap: 10, padding: 10 }}
            renderItem={({ item }) => (
              <CaughtBirdMapCard key={item.uid} caughtBird={item} />
            )}
          />
        </View>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "grey",
  },
  bottomSheetcontainer: {
    flex: 1,
    marginTop: 10,
  },
  listTitle: {
    textAlign: "center",
    fontSize: 16,
    marginBottom: 20,
  },
});
