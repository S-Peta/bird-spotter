import React, {
  View,
  StyleSheet,
  TouchableOpacity,
  Button,
  Dimensions,
  Image,
} from "react-native";
import { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import Feather from "@expo/vector-icons/Feather";
const { width, height } = Dimensions.get("window");

export default function CameraShot({ onCapture, isPredicting, isLoading }) {
  const [capturedImage, setCapturedImage] = useState<any>(null);

  useEffect(() => {
    launchCamera();
  }, []);

  const launchCamera = async () => {
    if (!isPredicting && !isLoading) {
      try {
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
          presentationStyle: "FULL_SCREEN",
          allowsMultipleSelection: false,
        });
        if (!result.canceled) {
          handleCapture(result.assets[0].uri);
        } else {
          setCapturedImage(null);
        }
      } catch (error) {
        console.error("error launching camera", error);
      }
    }
  };

  const openGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        handleCapture(result.assets[0].uri);
      }
    } catch (error) {
      console.error("error opening gallery");
    }
  };

  const handleCapture = (uri) => {
    setCapturedImage(uri);
    if (onCapture) {
      onCapture(uri);
    }
  };

  return (
    <View style={styles.container}>
      {!capturedImage ? (
        <View style={styles.overlay}>
          {!isLoading && (
            <>
              <TouchableOpacity
                style={[styles.captureButton, isPredicting && { opacity: 0.5 }]}
                onPress={launchCamera}
                disabled={isPredicting || isLoading}
              >
                <Feather name="camera" size={180} color={"#fff"} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={openGallery}
                style={styles.galleryButton}
              >
                <Feather name="image" size={45} color={"#fff"} />
              </TouchableOpacity>
            </>
          )}
        </View>
      ) : (
        <View style={styles.previewContainer}>
          <Image source={{ uri: capturedImage }} style={styles.preview} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    height: height,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  overlay: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  captureButton: {
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: height * 0.3,
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    padding: 8,
  },
  camera: {
    flex: 1,
    width: width,
    height: height,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  preview: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: width,
    height: height,
  },
  previewContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  galleryButton: {
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: height * 0.1,
  },
});
