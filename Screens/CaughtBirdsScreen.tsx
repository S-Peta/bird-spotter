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
import { RouteProp, useNavigation } from "@react-navigation/native";
import {
  getCaughtBirds,
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
    { species: string; url: string }[]
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
        setStartAfter(birdsData.lastVisible);
        const urls = await getBirdsImageUrls(formattedBirdNames);
        const imageObjects = formattedBirdNames.map((species, index) => ({
          species,
          url: urls[index],
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
    const urls = await getBirdsImageUrls(formattedBirdNames);
    const imageObjects = formattedBirdNames.map((species, index) => ({
      species,
      url: urls[index],
    }));

    setImageData([...imageData, ...imageObjects]);
  }
  function handlePress(species: string, url:string) {
    navigation.navigate("Single Bird", { species, url });
  }
  if (isLoading) {
    return <ActivityIndicator style={{ marginVertical: 20 }} />;
  }
  return (
    <SafeAreaView style={styles.container}>
        <Progress.Bar progress={progress} width={300} />
        <Text style={styles.headerText}>
          {totalCaughtBirds}/{totalBirds} birds caught
        </Text>
      <FlatList
        data={imageData}
        renderItem={({ item }) => (
          <Pressable onPress={() => handlePress(item.species, item.url)}>
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
        keyExtractor={(item) => item.url}
        numColumns={2} // To render in a grid format
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
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 20,
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
export default CaughtBirdsScreen;
