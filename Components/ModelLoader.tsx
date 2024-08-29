import * as tf from "@tensorflow/tfjs";
import { Normalization } from "../assets/trained-model/EfficientNetB0_js_model/NormalizationLayer";
tf.serialization.registerClass(Normalization);
import { bundleResourceIO } from "@tensorflow/tfjs-react-native";
import React, { useState, useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function ModelLoader({ onModelLoad }) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadModel();
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

      onModelLoad(loadedModel);
    } catch (error) {
      console.log("error loading model", error);
    }
    setIsLoading(false);
  };

  return null;
}
