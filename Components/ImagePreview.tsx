import React, { Image, View, StyleSheet } from "react-native";

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
    flex: 1,
    alignItems: "center",
    margin: 5,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 10,
  },
  image: {
    width: 200,
    height: 200,
  },
});
