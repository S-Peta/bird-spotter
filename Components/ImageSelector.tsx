import React from "react";
import { View, Button } from "react-native";
import * as ImagePicker from "expo-image-picker";
import requestPermissions from "../utils/requestPermissions";

export default function ImageSelector({ onImageSelect, disabled }) {
  const selectImage = async () => {
    await requestPermissions();
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const { uri } = result.assets[0];
      onImageSelect(uri);
    }
  };

  return (
    <View>
      <Button title="Select Image" onPress={selectImage} disabled={disabled} />
    </View>
  );
}
