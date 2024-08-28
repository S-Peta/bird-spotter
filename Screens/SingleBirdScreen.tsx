import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Button,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../types";
import { formatString, convertHTMLToText } from "../utils/formatData";
import { getPageTitleAndId, getBirdSummary, getBirdSounds } from "../api";
import { Asset } from "expo-asset";
import { Audio } from "expo-av";
import AntDesign from "@expo/vector-icons/AntDesign";
type SingleBirdScreenRouteProp = RouteProp<RootStackParamList, "Single Bird">;

const SingleBirdScreen = () => {
  const route = useRoute<SingleBirdScreenRouteProp>()
  const { species, url, scientificName} = route.params;
  const [birdDescription, setBirdDescription] = useState<string>("")
  const [birdSound, setBirdSound] = useState<Audio.Sound | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    getPageTitleAndId(species)
    .then(({pageId, title}) => {
        return getBirdSummary(title, pageId)
    })
    .then(({summary}) => {
        const plainText = convertHTMLToText(summary)
        setBirdDescription(plainText)
    })
    .catch((err) => {
      console.log('Could not get bird data: ', err)
      Alert.alert('Error', 'Failed to load bird description.')
    })
    getBirdSounds(scientificName)
    .then(({recording}) => {
      const soundAsset = Asset.fromURI(recording)
      return soundAsset.downloadAsync().then(() => soundAsset)
    })
    .then((soundAsset) => {
      return Audio.Sound.createAsync({uri: soundAsset.localUri || soundAsset.uri})
    })
    .then(({sound}) => {
      setBirdSound(sound)
    })
    .catch((err) => {
      console.log('Could not load bird sound: ', err)
      Alert.alert('Error', 'Failed to load bird sound.')
    })
    .finally(() => {
      setIsLoading(false)
    })
    return () => {
      if(birdSound) {
        birdSound.unloadAsync()
      }
    }
  }, [species, scientificName])

  const playSound = async () => {
    if (birdSound) {
      try {
          await birdSound.playAsync();
          setIsPlaying(true);
      } catch (error) {
          console.log('Error playing sound', error);
          Alert.alert('Error', 'Failed to play the sound.');
      }
    }
  };

  const stopSound = async () => {
    if (birdSound && isPlaying) {
      try {
          await birdSound.stopAsync()
          setIsPlaying(false);
      } catch (error) {
          console.log('Error stopping sound', error);
          Alert.alert('Error', 'Failed to stop the sound.');
      }
    }
  };
  
  const toggleSound = () => {
    if (isPlaying) {
        stopSound();
    } else {
        playSound();
    }
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardContent}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: url }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
        <Text style={styles.title}>{formatString(species)}</Text>
        <ScrollView style={styles.descriptionContainer}>
          {isLoading ? (
            <ActivityIndicator size="large" />
          ) : (
            <Text style={styles.description}>{birdDescription}</Text>
          )}
        </ScrollView>

        <View style={styles.soundContainer}>
          {isLoading ? (
            <ActivityIndicator size="large" />
            ) : (
              <TouchableOpacity
                style={styles.playPauseButton}
                onPress={toggleSound}
                disabled={!birdSound}
                >
                <AntDesign name={isPlaying ? 'pause' : 'sound'} size={24} color="black" />
              </TouchableOpacity>
            )}
        </View>
      </View>
    </View>)
  
}

export default SingleBirdScreen

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  cardContent: {
    backgroundColor: '#c6dec1',
    padding: 20,
    borderRadius: 15,
    elevation: 5,
    borderWidth: 10,
    borderColor: '#729c7f',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    width: 350,
    height: 630
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: "center",
    fontFamily: 'Itim_400Regular',
  },
  imageContainer: {
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    marginVertical: 10,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 5,
  },
  playPauseButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#729c7f',
    justifyContent: 'center',
    alignItems: 'center',
    right: 10,
    alignSelf: 'flex-end',
    marginRight: 10,
  },
  descriptionContainer: {
    maxHeight: 240,
  },
  description: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
    fontFamily: 'Itim_400Regular',
  },
  soundContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  soundText: {
    marginTop: 10,
  },
});
