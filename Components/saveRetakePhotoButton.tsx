import React, { View, StyleSheet, TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";

export default function saveRetakePhotoButtons({
  savePhoto,
  retakePicture,
  isPredicting,
}: any) {
  return (
    <View>
      <View style={styles.saveButton}>
        <TouchableOpacity
          onPress={savePhoto}
          style={[styles.button, isPredicting ? { opacity: 0.5 } : {}]}
          disabled={isPredicting}
        >
          <Feather name="image" />
          <Feather name="download" />
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity
          onPress={retakePicture}
          style={[styles.cameraButton, isPredicting ? { opacity: 0.5 } : {}]}
        >
          <Feather name="camera" size={50} color={"#fff"} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
