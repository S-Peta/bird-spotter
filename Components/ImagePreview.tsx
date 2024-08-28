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
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
  },
  image: {
    width: width,
    height: height,
    resizeMode: "cover",
  },
});
