import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  TextInput,
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
import { getAuth } from "firebase/auth";
import Icon from "react-native-vector-icons/FontAwesome";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDropdownVisible, setFilterDropdownVisible] = useState(false);
  const [filterType, setFilterType] = useState("All");
  const [displayedBirds, setDisplayedBirds] = useState<
    { species: string; url: string; scientificName: string; species_id: string }[]
  >([]);

  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  const resultsPerPage = 40;

  useEffect(() => {
    setIsLoading(true);
    if (userId){
      getCaughtBirdSpecies(userId).then((caughtBirds) => {
        setCaughtBirds(caughtBirds);
      });
    }
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
        setDisplayedBirds([...imageData, ...imageObjects]);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
        setIsLoading(false);
      }
    }
    getImages();
  }, []);

  const filterBirds = () => {
    return imageData.filter((bird) =>
      bird.species.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handleSearch = () => {
    const filteredBirds = filterBirds();
    const displayedBirds = filterType === "All"
      ? filteredBirds
      : filteredBirds.filter((bird) => caughtBirds.includes(bird.species));
    setDisplayedBirds(displayedBirds);
  };

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
    console.log(scientificNames);
  }


  function handlePress(species: string, url: string, scientificName: string, species_id: string) {
    navigation.navigate("Bird Page", {
      species,
      url,
      scientificName,
      species_id,
    });
  }

  if (isLoading) {
    return <ActivityIndicator style={{ marginVertical: 20 }} />;
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search birds..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Pressable onPress={handleSearch} style={styles.searchButton}>
          <Icon name="search" size={20} color="#fff" />
        </Pressable>
      </View>
      <View style={styles.filterButtonContainer}>
        <Pressable
          onPress={() => setFilterDropdownVisible(!filterDropdownVisible)}
          style={styles.filterButton}
        >
        <Text style={styles.filterButtonText}>{filterType} <Icon name="caret-down" size={12} /></Text>
        </Pressable>
        {filterDropdownVisible && (
          <View style={styles.dropdownMenu}>
            {filterType !== "All" && (
              <Pressable onPress={() => {
                setFilterType("All");
                setFilterDropdownVisible(false);
              }}>
              <Text style={styles.dropdownItem}>All</Text>
              </Pressable>
              )}
              {filterType !== "My Birds" && (
                <Pressable onPress={() => {
                  setFilterType("My Birds");
                  setFilterDropdownVisible(false);
                  }}>
                  <Text style={styles.dropdownItem}>My Birds</Text>
                </Pressable>
              )}
            </View>
          )}
          </View>
          <View style={styles.contentContainer}>
          {displayedBirds.length === 0 ? (
            <Text style={styles.noBirdsText}>
            You haven't caught any birds yet...
            Go catch them!
            </Text>
          ) : (
          <FlatList
          data={displayedBirds}
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
          numColumns={4}
          contentContainerStyle={styles.listContent}
          onEndReached={getMoreImages}
          onEndReachedThreshold={0.01}
          ListFooterComponent={() => (
          <ActivityIndicator style={{ marginVertical: 20 }} />
          )}
        />
        )}
      </View>
    </SafeAreaView>
  );
};

export default CaughtBirdsScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 10,
    margin: 20,
  },
  searchButton: {
    backgroundColor: "#4c8f60",
    borderRadius: 5,
    padding: 10,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
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
    padding: 5,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  grayscale: {
    opacity: 0.3,
  },
  filterButtonContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    zIndex: 10
  },
  filterButton: {
    backgroundColor: "#4c8f60",
    borderRadius: 5,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  filterButtonText: {
    color: "#fff",
    fontSize: 16,
    marginRight: 5,
  },
  dropdownMenu: {
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 50,
    right: 0,
    width: 100,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    zIndex: 20
  },
  dropdownItem: {
    padding: 10,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    textAlign: "center",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  noBirdsText: {
    fontSize: 16,
    color: "#777",
    marginTop: -50,
    textAlign: "center",
  },
});
