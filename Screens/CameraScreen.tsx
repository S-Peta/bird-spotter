import {
  View,
  Text,
  Button,
  ActivityIndicator,
  Image,
  StyleSheet,
} from "react-native";
import React, { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import { decodeJpeg } from "@tensorflow/tfjs-react-native";
import * as FileSystem from "expo-file-system";
import ModelLoader from "../Components/ModelLoader";
import getBirdSpecies from "../utils/getBirdSpecies";
getBirdSpecies;
import ImageSelector from "../Components/ImageSelector";
import ImagePreview from "../Components/ImagePreview";
import PredictionDisplay from "../Components/PredictionDisplay";

const CameraScreen = () => {
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);

  const handleModelLoad = (loadedModel) => {
    setModel(loadedModel);
  };

  const handleImageSelect = (imageUri) => {
    setImage(imageUri);
    if (model) {
      predictImage(imageUri);
    }
  };

  const predictImage = async (imageUri: string) => {
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

      const { species } = getBirdSpecies(predictionFloat32);

      setPrediction(species);
      setIsPredicting(false);
    } catch (error) {
      console.error("error during prediction", error);
    }
  };
  return (
    <View style={styles.container}>
      <ModelLoader onModelLoad={handleModelLoad} />
      <ImageSelector onImageSelect={handleImageSelect} disabled={!model} />
      <ImagePreview imageUri={image} />
      <PredictionDisplay prediction={prediction} isPredicting={isPredicting} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
});

export default CameraScreen;
