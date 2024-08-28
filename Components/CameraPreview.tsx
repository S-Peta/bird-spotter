import React, {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";

export default function CapturePreview({
  photo,
  retakePicture,
  savePhoto,
  isPredicting,
}: any) {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: photo && photo.uri }}
        style={styles.background}
      />
      <View>
        <TouchableOpacity
          onPress={retakePicture}
          style={[styles.cameraButton, isPredicting ? { opacity: 0.5 } : {}]}
        >
          <Feather name="camera" size={50} color={"#fff"} />
        </TouchableOpacity>
        <View style={styles.saveButton}>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              onPress={savePhoto}
              style={[styles.button, isPredicting ? { opacity: 0.5 } : {}]}
              disabled={isPredicting}
            >
              <Feather name="image" />
              <Feather name="download" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    flex: 1,
    width: "100%",
    height: "100%",
  },
  background: {
    flex: 1,
  },
  button: {
    backgroundColor: "rgba(0,128,128,0.4)",
    width: "10%",
    height: "100%",
    alignItems: "center",
    borderRadius: 4,
    justifyContent: "center",
    marginHorizontal: 10,
    marginBottom: 10,
  },
  buttonsContainer: {
    flexDirection: "column",
    padding: 12,
    justifyContent: "flex-end",
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
  },
  saveButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    bottom: 40,
  },
  cameraButton: {
    position: "absolute",
    bottom: 100,
    alignSelf: "center",
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});
