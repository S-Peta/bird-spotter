import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import React, { useEffect } from "react";
import { getPageTitleAndId, getBirdSummary } from "../api";
import { useState } from "react";
import {formatString} from "../utils/formatString";
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
        setBirdDescription(summary);
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
          <Text style={styles.description}>Description</Text>
          <Text>{birdDescription}</Text>
          <Pressable
            style={styles.button}
            onPress={() => {
              navigation.navigate("Ranking");
            }}
          >
            <Text style={styles.textStyle}>Rankings</Text>
          </Pressable>
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
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  description: {
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginTop: 20,
  },
  image: {
    width: 300,
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
    backgroundColor: "#2196F3",
  },
});
