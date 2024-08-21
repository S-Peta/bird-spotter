import { View, Text } from "react-native";
import { Image } from "react-native";
import * as tf from "@tensorflow/tfjs";
import { bundleResourceIO } from "@tensorflow/tfjs-react-native";
import { useState, useEffect } from "react";
import { decodeJpeg } from "@tensorflow/tfjs-react-native";

export default function PredictionPage() {
  const [prediction, setPrediction] = useState<string | null>(null);
  const [birdDetector, setBirdDetector] = useState<tf.LayersModel | null>(null);

  const imageAssetPath = require("../assets/bird-species-images/ABBOTTS BABBLER/1.jpg");
  const modelWeightsPath =
    "../assets/trained-model/EfficientNetB0_js_model/group1-shard.bin";

  /*  async function loadModel(): Promise<tf.LayersModel | undefined> {
    console.log("application started");
    await tf.ready();
    console.log("loading custom model");

    try {
      const modelJson = require("../assets/trained-model/EfficientNetB0_js_model/model.json");
      const modelWeights = require("../assets/trained-model/EfficientNetB0_js_model/group1-shard.bin");

      const loadedModel = await tf.loadLayersModel(
        bundleResourceIO(modelJson, modelWeights)
      );

      console.log(loadedModel, "model loaded");

      // setBirdDetector(loadedModel);
      return loadedModel;
    } catch (error) {
      console.log("error loading model", error);
      return undefined;
    }
  }

  async function predictImage(birdDetector: tf.LayersModel) {
    try {
      const { uri } = Image.resolveAssetSource(imageAssetPath);

      const response = await fetch(uri);
      // const blobImageData = await response.blob();
      const arrayBufferImageData = await response.arrayBuffer();
      const imageTensor = decodeJpeg(new Uint8Array(arrayBufferImageData));

      const imageTensorResize = tf.image
        .resizeBilinear(imageTensor, [224, 224])
        .reshape([1, 224, 224, 3]);

      const predictionTensor = (await birdDetector.predict(
        imageTensorResize
      )) as tf.Tensor;

      const predictionArray = await predictionTensor.data();

      setPrediction(JSON.stringify(predictionArray));
    } catch (error) {
      console.error("error during prediction", error);
    }
  }

  useEffect(() => {
    loadModel().then((loadedModel) => {
      if (loadedModel) {
        console.log("setting bird detector");
        setBirdDetector(loadedModel);
      } else {
        console.error("error loading model");
      }
    });
  }, []);

  useEffect(() => {
    if (birdDetector) {
      console.log("predicting image");
      predictImage(birdDetector);
    }
  }, [birdDetector]); */

  // Load the model only once when the component mounts
  useEffect(() => {
    async function loadModel() {
      console.log("application started");
      await tf.ready();
      console.log("loading custom model");

      try {
        const modelJson = require("../assets/trained-model/EfficientNetB0_js_model/model.json");
        const modelWeights = require("../assets/trained-model/EfficientNetB0_js_model/group1-shard.bin");

        const loadedModel = await tf.loadLayersModel(
          bundleResourceIO(modelJson, modelWeights)
        );

        console.log("Model loaded successfully.");
        setBirdDetector(loadedModel); // Set the bird detector state
      } catch (error) {
        console.error("Error loading model:", error);
      }
    }

    loadModel();
  }, []); // Empty dependency array ensures this runs only once

  // Predict the image once the model is loaded
  useEffect(() => {
    if (birdDetector) {
      console.log("predicting image");
      predictImage(birdDetector);
    }
  }, [birdDetector]); // Runs only when birdDetector is updated

  async function predictImage(birdDetector: tf.LayersModel) {
    try {
      const { uri } = Image.resolveAssetSource(imageAssetPath);

      const response = await fetch(uri);
      const arrayBufferImageData = await response.arrayBuffer();
      const imageTensor = decodeJpeg(new Uint8Array(arrayBufferImageData));

      const imageTensorResize = tf.image
        .resizeBilinear(imageTensor, [224, 224])
        .reshape([1, 224, 224, 3]);

      const predictionTensor = birdDetector.predict(
        imageTensorResize
      ) as tf.Tensor;

      const predictionArray = await predictionTensor.data();
      console.log("Prediction array:", predictionArray);

      setPrediction(JSON.stringify(predictionArray));
    } catch (error) {
      console.error("Error during prediction:", error);
    }
  }

  return (
    <View>
      <Text>Bird Predictor</Text>
      <Image source={imageAssetPath}></Image>
      <Text>{prediction || "Loading prediction..."}</Text>
    </View>
  );
}
