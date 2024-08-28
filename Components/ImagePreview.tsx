import React, { Image, View, StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export default function ImagePreview({ imageUri }) {
  if (!imageUri) {
    return null;
  }

  return (
    <View style={styles.imageContainer}>
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    width: width,
    height: height * 0.7,
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
    backgroundColor: "#f0f0f0",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
});
