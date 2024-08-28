import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import React, { useEffect } from "react";
import { getPageTitleAndId, getBirdSummary } from "../api";
import { useState } from "react";

import { formatString, convertHTMLToText } from "../utils/formatData";

import { getABirdImageUrl } from "../utils/getData";
import { ScrollView } from "react-native-gesture-handler";
import { Itim_400Regular } from "@expo-google-fonts/itim";

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
    <View>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.text}>{formatString(predictedBird)}</Text>
          <Image source={{ uri: url }} style={styles.image} />
          <Text style={styles.descriptionTitle}>Description</Text>
          <Text style={styles.description}>{birdDescription}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default ResultPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    margin: 20,
    backgroundColor: "#c6dec1",
    borderRadius: 15,
    elevation: 5,
    borderWidth: 10,
    borderColor: "#729c7f",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  text: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    fontFamily: "Itim_400Regular",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    marginTop: 10,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
    fontFamily: "Itim_400Regular",
  },

  image: {
    width: "100%",
    height: 300,
    borderRadius: 8,
  },
  button: {
    alignSelf: "flex-end",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: 100,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#729c7f",
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#f5f4e4",
  },

  // title: {
  //   fontSize: 18,
  //   fontWeight: "bold",
  //   alignSelf: "center",
  // },
});
