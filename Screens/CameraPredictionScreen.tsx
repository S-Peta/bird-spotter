import {
  View,
  Text,
  Button,
  ActivityIndicator,
  Image,
  StyleSheet,
  Dimensions,
  Pressable,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import * as tf from "@tensorflow/tfjs";
import { decodeJpeg } from "@tensorflow/tfjs-react-native";
import * as FileSystem from "expo-file-system";
import ModelLoader from "../Components/ModelLoader";
import getBirdSpecies from "../utils/getBirdSpecies";
getBirdSpecies;
import ImageSelector from "../Components/ImageSelector";
import ImagePreview from "../Components/ImagePreview";
import PredictionDisplay from "../Components/PredictionDisplay";
import CameraShot from "../Components/CameraShot";
import Feather from "@expo/vector-icons/Feather";

const CameraScreen = () => {
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPredicting, setIsPredicting] = useState(false);

  const { width, height } = Dimensions.get("window");

  const handleModelLoad = (loadedModel) => {
    setModel(loadedModel);
    setIsLoading(false);
  };

  const handleImageSelect = (imageUri) => {
    setImage(imageUri);
    /*     if (model) {
      predictImage(imageUri);
    } */
  };

  const handleCapture = (imageUri) => {
    setImage(imageUri);
    /*     if (model) {
      predictImage(imageUri);
    } */
  };

  const handlePredict = () => {
    if (image) {
      predictImage(image);
    } else {
      console.error("No image found");
    }
  };

  const predictImage = useCallback(
    async (imageUri: string) => {
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
        setImage(null);
      } catch (error) {
        console.error("error during prediction", error);
      }
    },
    [model]
  );

  return (
    <View style={styles.container}>
      <View style={{ width, height }}>
        <CameraShot
          onCapture={handleCapture}
          isPredicting={isPredicting}
          isLoading={isLoading}
        />
      </View>
      {isLoading && <ActivityIndicator size="large" />}
      <View style={styles.imageSelectOverlay}>
        <ModelLoader onModelLoad={handleModelLoad} />
        <ImageSelector
          onImageSelect={handleImageSelect}
          disabled={!model || isPredicting}
        />
      </View>
      <ImagePreview imageUri={image} />
      {image && !isPredicting && (
        <View style={styles.overlay}>
          <Pressable onPress={handlePredict}>
            <Feather name="eye" size={100} color={"#fff"} />
            <PredictionDisplay
              prediction={prediction}
              isPredicting={isPredicting}
            />
          </Pressable>
        </View>
      )}
      {isPredicting && (
        <View style={styles.activityOverlay}>
          <ActivityIndicator size="large" />
          <Text style={styles.text}>Predicting...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    position: "absolute",
    bottom: 200,
    zIndex: 10,
    width: "100%",
    alignItems: "center",
    padding: 20,
  },
  imageSelectOverlay: {
    position: "absolute",
    bottom: 50,
    zIndex: 10,
    width: "100%",
    alignItems: "flex-end",
    padding: 20,
  },
  activityOverlay: {
    position: "absolute",
    top: "50%",
    left: "50%",
    zIndex: 20,
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    width: 10,
    borderRadius: 12,
    flexDirection: "column",
    height: 30,
    position: "absolute",
    top: "40%",
    left: "50%",
    zIndex: 20,
  },
});

export default CameraScreen;
