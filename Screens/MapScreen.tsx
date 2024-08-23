import { View, Text, StyleSheet, Alert } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import MapView from 'react-native-maps';
import { getCaughtBirds } from '../utils/getData';
import CustomMarker from '../Components/CustomMarker';
import CaughtBirdMapCard from '../Components/CaughtBirdMapCard';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import * as Location from 'expo-location';


export default function MapScreen() {
  const [caughtBirds, setCaughtBirds] = useState([]);
  const [selectedBird, setSelectedBird] = useState(null)
  const [mapRegion, setMapRegion] = useState({
    latitude: 51.4093802,
    longitude: 0.0126596,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421
  })

  const getUserLocation = async () => {
    let {status} = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission to access location was denied', [{ text: 'OK' }]
      )
      return
    }

    setMapRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  }

  useEffect(() => {
    const fetchCaughtBirds = async () => {
      const caughtBirdsList = await getCaughtBirds();
      setCaughtBirds(caughtBirdsList);
    };
    fetchCaughtBirds();

    getUserLocation();
  }, []);

  const snapPoints = useMemo(() => ['10', '50%', '90%'], [])

  return (
    <View>
      <MapView
        style={styles.map}
        region={mapRegion}>
        {caughtBirds.map((caughtBird) => <CustomMarker key={caughtBird.id} caughtBird={caughtBird} onPress={() => setSelectedBird(caughtBird)} />)}
      </MapView>
      {selectedBird && (
        <View style={{
          position: 'absolute',
          bottom: 90,
          left: 10,
          right:10
        }}>
          <CaughtBirdMapCard key={selectedBird.species} caughtBird={selectedBird} />
      </View>)}


      <BottomSheet
        index={0}
        snapPoints={snapPoints}
        // ref={bottomSheetRef}
        // onChange={handleSheetChanges}
        >
        <View style={styles.bottomSheetcontainer}>
          <Text style={styles.listTitle}>Over {caughtBirds.length} birds nearby</Text>
          <BottomSheetFlatList
          data={caughtBirds}
          contentContainerStyle={{ gap: 10, padding: 10 }}
          renderItem={({item}) => ( <CaughtBirdMapCard caughtBird={item} /> )}/>
        </View>
      </BottomSheet>
    </View>
  )
}


const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%'
  },
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: 'grey',
  },
  bottomSheetcontainer: {
    flex: 1,
    // padding: 10
  },
  listTitle: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 20
  }
})
