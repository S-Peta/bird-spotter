import * as ImagePicker from "expo-image-picker";

const requestPermissions = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    alert("We need media library permissions to make this work!");
  }
};

export default requestPermissions;
