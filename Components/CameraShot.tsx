import React, {
  Alert,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Button,
  Dimensions,
} from "react-native";
import { useEffect, useState, useRef } from "react";
import { Camera } from "expo-camera/legacy";
import CameraPreview from "./CameraPreview";
import * as MediaLibrary from "expo-media-library";
import Feather from "@expo/vector-icons/Feather";
const { width, height } = Dimensions.get("window");

export default function CameraShot({ onCapture, isPredicting, isLoading }) {
  const cameraRef = useRef<Camera>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [capturedImage, setCapturedImage] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No access to camera</Text>
      </View>
    );
  }
  const takePicture = async () => {
    if (cameraRef.current && !isPredicting && !isLoading) {
      try {
        const photo = await cameraRef.current.takePictureAsync();

        setShowPreview(true);
        setCapturedImage(photo);
        if (onCapture) {
          onCapture(photo.uri);
        }
      } catch (error) {
        console.error("error taking picture", error);
      }
    } else {
      console.log("predicting... ir camerref is null");
    }
  };

  const retakePicture = () => {
    setCapturedImage(null);
    setShowPreview(false);
  };

  const savePhoto = async () => {
    if (capturedImage) {
      try {
        console.log("saving photo");
        await MediaLibrary.saveToLibraryAsync(capturedImage.uri);
      } catch (error) {
        console.error(error, "error saving photo");
      }
    }
  };

  return (
    <View style={styles.container}>
      {!showPreview ? (
        <Camera style={[styles.camera]} ref={cameraRef}>
          <View style={styles.overlay}>
            {!isLoading && (
              <TouchableOpacity
                style={[styles.captureButton, isPredicting && { opacity: 0.5 }]}
                onPress={takePicture}
                disabled={isPredicting}
              >
                <View style={styles.captureButtonInner} />
              </TouchableOpacity>
            )}
          </View>
        </Camera>
      ) : (
        <CameraPreview photo={capturedImage} />
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
  },
  overlay: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  captureButton: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 5,
    borderColor: "#fff",
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    bottom: 20,
  },
  captureButtonInner: {
    width: 54,
    height: 54,
    borderColor: "#fff",
    borderRadius: 36,
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
});
