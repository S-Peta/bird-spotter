import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from "react-native";
import React, { useEffect } from "react";
import {useNavigation } from "@react-navigation/native";
import {
  getBirds,
  getBirdsImageUrls,
  getMoreBirds,
  getCaughtBirdSpecies,
} from "../utils/getData";
import { useState } from "react";
import { RootStackParamList } from "../types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Progress from "react-native-progress";
type CaughtBirdsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Caught Birds"
>;

const CaughtBirdsScreen = ({ route }: { route: any }) => {
  const navigation = useNavigation<CaughtBirdsScreenNavigationProp>();
  const [imageData, setImageData] = useState<
    { species: string; url: string, scientificName: string, species_id: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [startAfter, setStartAfter] = useState({});
  const [caughtBirds, setCaughtBirds] = useState<string[]>([]);
  const { totalBirds, totalCaughtBirds, userId, progress } = route.params;
  const resultsPerPage = 10;
  useEffect(() => {
    setIsLoading(true);
    getCaughtBirdSpecies(userId).then((caughtBirds) => {
      setCaughtBirds(caughtBirds);
    });
    async function getImages() {
      try {
        const birdsData = await getBirds(resultsPerPage);
        const formattedBirdNames = birdsData.birdsList.map((bird) => {
          return bird.species.replace(/\s+/g, " ");
        });
        const scientificNames = birdsData.birdsList.map((bird) => {
            return bird.scientific_name
        })
        const speciesId = birdsData.birdsList.map((bird) => {
          return bird.species_id
      })
        
        setStartAfter(birdsData.lastVisible);
        const urls = await getBirdsImageUrls(formattedBirdNames);
        const imageObjects = formattedBirdNames.map((species, index) => ({
          species,
          url: urls[index],
          scientificName: scientificNames[index],
          species_id: speciesId[index].toString()
        }));

        setImageData([...imageData, ...imageObjects]);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
        setIsLoading(false);
      }
    }
    getImages();
  }, []);
  async function getMoreImages() {
    const birdsData = await getMoreBirds(startAfter, resultsPerPage);
    const formattedBirdNames = birdsData.birdsList.map((bird) => {
      return bird.species.replace(/\s+/g, " ");
    });
    setStartAfter(birdsData.lastVisible);
    const scientificNames = birdsData.birdsList.map((bird) => {
        return bird.scientific_name
    })
    const speciesId = birdsData.birdsList.map((bird) => {
      return bird.species_id
  })
    const urls = await getBirdsImageUrls(formattedBirdNames);
    const imageObjects = formattedBirdNames.map((species, index) => ({
      species,
      url: urls[index],
      scientificName: scientificNames[index],
      species_id: speciesId[index].toString()
    }));

    setImageData([...imageData, ...imageObjects]);
  }

  function handlePress(species: string, url:string, scientificName:string, species_id:string) {
    navigation.navigate("Single Bird", { species, url, scientificName, species_id});
  }
  if (isLoading) {
    return <ActivityIndicator style={{ marginVertical: 20 }} />;
  }
  return (
    <SafeAreaView style={styles.container}>
        <Progress.Bar progress={progress} width={300} color="#4caf50" />
        <Text style={styles.headerText}>
          {totalCaughtBirds}/{totalBirds} birds caught
        </Text>
      <FlatList
        data={imageData}
        renderItem={({ item }) => (
          <Pressable onPress={() => handlePress(item.species, item.url, item.scientificName, item.species_id)}>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: item.url }}
                style={[
                  styles.image,
                  !caughtBirds.includes(item.species) && styles.grayscale,
                ]}
              />
            </View>
          </Pressable>
        )}
        keyExtractor={(item) => item.species_id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        onEndReached={getMoreImages}
        onEndReachedThreshold={0.01}
        ListFooterComponent={() => (
          <ActivityIndicator style={{ marginVertical: 20 }} />
        )}
      />
    </SafeAreaView>
  );
};

export default CaughtBirdsScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center"
  },
  progressContainer: {
    flex: 1,
    flexDirection: "row",
    margin: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  listContent: {
    justifyContent: "center",
  },
  imageContainer: {
    flex: 1,
    alignItems: "center",
    margin: 5,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 10,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 8,
  },
  grayscale: {
    opacity: 0.2,
  },
});