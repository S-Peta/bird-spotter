import { View, Text, StyleSheet } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import MapView from 'react-native-maps';
import { getCaughtBirds } from '../utils/getData';
import CustomMarker from '../Components/CustomMarker';
import CaughtBirdMapCard from '../Components/CaughtBirdMapCard';


export default function MapScreen() {
  const [caughtBirds, setCaughtBirds] = useState([]);
  const [selectedBird, setSelectedBird] = useState(null)

  useEffect(() => {
    const fetchCaughtBirds = async () => {
      const caughtBirdsList = await getCaughtBirds();
      setCaughtBirds(caughtBirdsList);
    };
    fetchCaughtBirds();
  }, []);

  console.log(caughtBirds);
  
  return (
    <View>
      <Text>Map</Text>
      <MapView
      style={styles.map}>
        {caughtBirds.map((caughtBird) => <CustomMarker key={caughtBird.id} caughtBird={caughtBird} onPress={() => setSelectedBird(caughtBird)} />)}
      </MapView>
      {selectedBird && <CaughtBirdMapCard key={selectedBird.id} caughtBird={setSelectedBird}/>}
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
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  }
})
