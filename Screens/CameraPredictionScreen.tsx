import * as tf from "@tensorflow/tfjs";
import { Normalization } from "../assets/trained-model/EfficientNetB0_js_model/NormalizationLayer";
tf.serialization.registerClass(Normalization);
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  Image,
  StyleSheet,
  Pressable,
  Modal,
} from "react-native";
import { bundleResourceIO, decodeJpeg } from "@tensorflow/tfjs-react-native";
import { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import getBirdSpecies from "../utils/getBirdSpecies";
import requestPermissions from "../utils/requestPermissions";
import {
  updateUserTwentyPoints,
  updateUserTenPoints,
} from "../utils/updateUserPoints";
import postCaughtBird from "../utils/postCaughtBird";
import React from "react";

export default function PredictionPage({ navigation }) {
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    (async () => {
      await requestPermissions();
      await loadModel();
    })();
  }, []);

  const loadModel = async () => {
    setIsLoading(true);
    try {
      await tf.ready();

      const modelJson = require("../assets/trained-model/EfficientNetB0_js_model/model.json");
      const modelWeights = require("../assets/trained-model/EfficientNetB0_js_model/group1-shard.bin");

      const loadedModel = await tf.loadLayersModel(
        bundleResourceIO(modelJson, modelWeights)
      );

      setModel(loadedModel);
    } catch (error) {
      console.log("error loading model", error);
    }
    setIsLoading(false);
  };

  const selectImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const { uri } = result.assets[0];
      setImage(uri);
      if (model) {
        predictImage(result.assets[0].uri);
      }
    }
  };

  async function predictImage(imageUri: string) {
    setIsPredicting(true);
    try {
      const fileInfo = await FileSystem.getInfoAsync(imageUri);
      if (!fileInfo.exists) {
        console.error("Image file does not exist.");
        return;
      }

      const imageData = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const arrayBufferImageData = Uint8Array.from(atob(imageData), (c) =>
        c.charCodeAt(0)
      ).buffer;

      const imageTensor = decodeJpeg(new Uint8Array(arrayBufferImageData));

      const resizedImage = tf.image
        .resizeBilinear(imageTensor, [224, 224])
        .reshape([1, 224, 224, 3]);

      const predictionTensor = (await model!.predict(
        resizedImage
      )) as tf.Tensor;
      const predictionArray = await predictionTensor.data();

      const predictionFloat32 = Float32Array.from(predictionArray);
      // const birdSpecies = getBirdSpecies(predictionFloat32);
      const { species, confidence, predictionArrayIndex } =
        getBirdSpecies(predictionFloat32);
      console.log({
        species: species,
        confidence: confidence,
        predictionArrayIndex: predictionArrayIndex,
      });

      setPrediction(species);
      setIsPredicting(false);
    } catch (error) {
      console.error("error during prediction", error);
    }
  }

  return (
    <View style={styles.container}>
      <Text>Bird Predictor</Text>
      <Button
        title="Select Image"
        onPress={selectImage}
        disabled={isLoading || !model}
      />
      {image && (
        <Image
          source={{ uri: image }}
          style={{ width: 200, height: 200, margin: 20 }}
        />
      )}
      {isLoading && <ActivityIndicator />}
      {isPredicting && <ActivityIndicator />}
      {prediction && (
        <>
          <Text style={styles.prediction}> Prediction is finished! </Text>
          <Pressable
            style={[styles.button, styles.buttonOpen]}
            onPress={() => {
              setModalVisible(true);
              postCaughtBird(prediction, 0, 0);
            }}
          >
            <Text style={styles.textStyle}>Continue</Text>
          </Pressable>
        </>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Guess the bird?</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                setModalVisible(!modalVisible);
                navigation.navigate("Guess Page", {
                  predictedBird: prediction,
                  imageUrl: image,
                });
                updateUserTwentyPoints();
              }}
            >
              <Text style={styles.textStyle}>Yes</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                setModalVisible(!modalVisible);
                navigation.navigate("Result Page", {
                  predictedBird: prediction,
                });
                updateUserTwentyPoints();
              }}
            >
              <Text style={styles.textStyle}>No</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  prediction: {
    fontSize: 18,
    marginVertical: 16,
  },

  text: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
    color: "#555",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 50,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    paddingHorizontal: 20,
    elevation: 2,
    margin: 5,
  },
  buttonOpen: {
    backgroundColor: "#729c7f",
  },
  buttonClose: {
    backgroundColor: "#729c7f",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
});
