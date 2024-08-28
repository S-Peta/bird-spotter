import {
  View,
  Text,
  Button,
  ActivityIndicator,
  Image,
  StyleSheet,
  Dimensions,
  Pressable,
  Modal,
  SafeAreaView,
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
import {
  updateUserTwentyPoints,
  updateUserTenPoints,
} from "../utils/updateUserPoints";
import { LocationCoords } from "../types";
import postCaughtBird from "../utils/postCaughtBird";
import Feather from "@expo/vector-icons/Feather";
import getCurrentLocation from "../utils/getCurrentLocation";

const PredictionPage = ({ navigation }) => {
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPredicting, setIsPredicting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const { width, height } = Dimensions.get("window");

  useEffect(() => {
    if (prediction) {
      setModalVisible(true);
      postCaughtBird(prediction, location.latitude, location.longitude);
    }
  }, [prediction]);

  const handleModelLoad = (loadedModel) => {
    setModel(loadedModel);
    setIsLoading(false);
  };

  const handleImageSelect = (imageUri) => {
    setImage(imageUri);
    getCurrentLocation().then((currLocation) => {
      setLocation(currLocation);
    });
    setShowPreview(true);
  };

  const handleCapture = (imageUri) => {
    setImage(imageUri);
    getCurrentLocation().then((currLocation) => {
      setLocation(currLocation);
    });
    setShowPreview(true);
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
      } catch (error) {
        console.error("error during prediction", error);
      }
    },
    [model]
  );

  const handleDiscardImage = () => {
    setImage(null);
    setShowPreview(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoading && <ActivityIndicator size="large" />}
      <View style={styles.contentContainer}>
        {image && showPreview ? (
          <>
            <Pressable style={styles.closeButton} onPress={handleDiscardImage}>
              <Feather name="x-circle" size={32} color="#fff" />
            </Pressable>
            <ImagePreview imageUri={image} />
          </>
        ) : (
          <CameraShot
            onCapture={handleCapture}
            isPredicting={isPredicting}
            isLoading={isLoading}
          />
        )}
      </View>

      <View style={styles.controlsContainer}>
        <ModelLoader onModelLoad={handleModelLoad} />
        <ImageSelector
          onImageSelect={handleImageSelect}
          disabled={!model || isPredicting}
        />

        {image && !isPredicting && (
          <Pressable onPress={handlePredict} style={styles.predictButton}>
            <Feather name="eye" size={100} color={"#fff"} />
            <Text style={styles.predictButtonText}>Predict</Text>
          </Pressable>
        )}
      </View>
      {isPredicting && (
        <View style={styles.activityOverlay}>
          <ActivityIndicator size="large" />
          <Text style={styles.text}>Predicting...</Text>
        </View>
      )}
      <PredictionDisplay prediction={prediction} isPredicting={isPredicting} />
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
                setImage(null);
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#f0f0f0",
  },
  closeButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 10,
  },
  predictButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#729c7f",
    padding: 10,
    borderRadius: 5,
  },
  predictButtonText: {
    color: "#fff",
    marginLeft: 5,
    fontWeight: "bold",
  },
  prediction: {
    fontSize: 18,
    marginVertical: 16,
  },
  activityOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
    color: "#fff",
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
    zIndex: 40,
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

export default PredictionPage;
