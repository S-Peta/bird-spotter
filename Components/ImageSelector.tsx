import React, { StyleSheet, View, Button, Pressable } from "react-native";
import * as ImagePicker from "expo-image-picker";
import requestPermissions from "../utils/requestPermissions";
import Feather from "@expo/vector-icons/Feather";

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
      <Pressable
        onPress={selectImage}
        disabled={disabled}
        style={[disabled ? { opacity: 0.5 } : {}]}
      >
        <Feather name="film" size={30} color={"#fff"} />
      </Pressable>
    </View>
  );
}
