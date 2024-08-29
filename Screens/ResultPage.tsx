import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect } from "react";
import { getPageTitleAndId, getBirdSummary } from "../api";
import { useState } from "react";

import { formatString, convertHTMLToText } from "../utils/formatData";
import { AntDesign } from "@expo/vector-icons";

import { getABirdImageUrl } from "../utils/getData";
import { ScrollView } from "react-native-gesture-handler";


const ResultPage = ({ route, navigation }) => {
  const [url, setUrl] = useState<string>("");
  const { predictedBird } = route.params;

  const [birdDescription, setBirdDescription] = useState<string>("");
  useEffect(() => {
    getPageTitleAndId(predictedBird)
      .then(({ pageId, title }) => {
        return getBirdSummary(title, pageId);
      })
      .then(({ summary }) => {
        const plainText = convertHTMLToText(summary);
        setBirdDescription(plainText);
      });
  }, []);

  useEffect(() => {
    getABirdImageUrl(predictedBird).then((imageUrl: any) => setUrl(imageUrl));
  }, []);


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cardContainer}>
        <View style={styles.cardContent}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: url }} style={styles.image} />
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Caught Birds");
              }}
              style={styles.closeButton}
            >
              <AntDesign name="closecircleo" size={18} color="black" />
            </TouchableOpacity>
          </View>
          <Text style={styles.title}>{formatString(predictedBird)}</Text>
          <ScrollView style={styles.descriptionContainer}>
            <Text style={styles.description}>{birdDescription}</Text>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  )
};

export default ResultPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    width: '90%',
    height: '95%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: "center",
    fontFamily: 'Itim_400Regular',
    marginVertical: 10,
  },
  imageContainer: {
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    marginVertical: 10,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  descriptionContainer: {
    maxHeight: 290,
  },
  description: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
    fontFamily: 'Itim_400Regular',
  },
});
