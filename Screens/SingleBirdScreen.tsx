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
  const route = useRoute<SingleBirdScreenRouteProp>();
  const { species, url, scientificName } = route.params;
  const [birdDescription, setBirdDescription] = useState<string>("");
  const [birdSound, setBirdSound] = useState<Audio.Sound | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
 
  useEffect(() => {
    getPageTitleAndId(species)
      .then(({ pageId, title }) => {
        return getBirdSummary(title, pageId);
      })
      .then(({ summary }) => {
        const plainText = convertHTMLToText(summary);
        setBirdDescription(plainText);
      })
      .catch((err) => {
        console.log("Could not get bird data: ", err);
        Alert.alert("Error", "Failed to load bird description.");
      });
    getBirdSounds(scientificName)
      .then(({ recording }) => {
        const soundAsset = Asset.fromURI(recording);
        return soundAsset.downloadAsync().then(() => soundAsset);
      })
      .then((soundAsset) => {
        return Audio.Sound.createAsync({
          uri: soundAsset.localUri || soundAsset.uri,
        });
      })
      .then(({ sound }) => {
        setBirdSound(sound);
      })
      .catch((err) => {
        console.log("Could not load bird sound: ", err);
        Alert.alert("Error", "Failed to load bird sound.");
      })
      .finally(() => {
        setIsLoading(false);
      });
    return () => {
      if (birdSound) {
        birdSound.unloadAsync();
      }
    };
  }, [species, scientificName]);
  const playSound = async () => {
    if (birdSound) {
      try {
        await birdSound.playAsync();
        setIsPlaying(true);
      } catch (error) {
        console.log("Error playing sound", error);
        Alert.alert("Error", "Failed to play the sound.");
      }
    }
  };
  const stopSound = async () => {
    if (birdSound && isPlaying) {
      try {
        await birdSound.stopAsync();
        setIsPlaying(false);
      } catch (error) {
        console.log("Error stopping sound", error);
        Alert.alert("Error", "Failed to stop the sound.");
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
  console.log(scientificName)
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>{formatString(species)}</Text>
        <Image
          source={{ uri: url }}
          style={styles.image}
          resizeMode="contain"
        />
        <View style={styles.soundContainer}>
          <Text style={styles.soundText}>Tap to hear the sound it makes:</Text>
          {isLoading ? (
            <ActivityIndicator size="large" />
          ) : (
            <TouchableOpacity
              style={styles.playPauseButton}
              onPress={toggleSound}
              disabled={!birdSound}
            >
              <AntDesign
                name={isPlaying ? "pausecircle" : "play"}
                size={24}
                color="black"
              />
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.descriptionTitle}>Description</Text>
        {isLoading ? (
          <ActivityIndicator size="large" />
        ) : (
          <Text style={styles.description}>{birdDescription}</Text>
        )}
      </View>
    </ScrollView>
  );
};

export default SingleBirdScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#f5f4e4",
  },
  container: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "center",
  },
  image: {
    width: "100%",
    height: 200,
    marginVertical: 10,
  },
  playPauseButton: {
    width: 50,
    height: 35,
    borderRadius: 30,
    backgroundColor: "#008080",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
  },
  description: {
    fontSize: 14,
    marginTop: 10,
  },
  soundContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#b2d7c2",
    borderRadius: 30,
    width: 250,
    height: 100,
    alignSelf: "center",
  },
  soundText: {
    marginTop: 10,
  },
});
