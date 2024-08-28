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
    if (cameraRef.current && !isPredicting) {
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
          <View style={styles.buttonContainer}>
            {!isLoading && (
              <TouchableOpacity
                style={[styles.button, isPredicting ? { opacity: 0.5 } : {}]}
                onPress={takePicture}
                disabled={isPredicting}
              >
                <Feather name="camera" size={100} color={"#fff"} />
              </TouchableOpacity>
            )}
          </View>
        </Camera>
      ) : (
        <CameraPreview
          photo={capturedImage}
          savePhoto={savePhoto}
          retakePicture={retakePicture}
          isPredicting={isPredicting}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    height: height,
  },
  button: {
    width: 100,
    borderRadius: 40,
    borderColor: "#fff",
    flexDirection: "row",
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    bottom: 20,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    margin: 20,
    backgroundColor: "transparent",
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    padding: 8,
  },
  camera: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "blue",
  },
  preview: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
});
