import {
  View,
  Text,
  Button,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Pressable,
} from "react-native";
import React from "react";
import { useState } from "react";
import { updateUserTenPoints } from "../utils/updateUserPoints";
import { updateUserTwentyPoints } from "../utils/updateUserPoints";
import { Itim_400Regular } from "@expo-google-fonts/itim";

const GuessPage = ({ route, navigation }: { route: any; navigation: any }) => {
  const [guessBird, setGuessBird] = useState("");
  const [result, setResult] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const { predictedBird, imageUrl } = route.params;
  const onSubmit = () => {
    if (guessBird === predictedBird) {
      setResult(`Yaay, that's orrect! \n+10 Points`);
      setModalVisible(true);
      updateUserTenPoints();
    } else {
      setResult(`It is not a ${guessBird}...`);
      setModalVisible(true);
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <SafeAreaView style={styles.container}>
        <Text style={styles.headertext}>Guess the Bird</Text>
        <Image
          style={styles.img}
          source={{
            uri: imageUrl,
          }}
        />
        <TextInput
          style={styles.input}
          value={guessBird}
          onChangeText={setGuessBird}
          autoCorrect={false}
          autoCapitalize="characters"
        />
        <Pressable style={styles.buttonSubmit} onPress={onSubmit}>
          <Text style={styles.textStyle}>Guess</Text>
        </Pressable>
        <View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>{result}</Text>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                    navigation.navigate("Result Page", {
                      predictedBird,
                    });
                  }}
                >
                  <Text style={styles.textStyle}>Show Result</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
    backgroundColor: "#c6dec1",
  },

  input: {
    alignSelf: "center",
    width: 300,
    height: 50,
    margin: 20,
    padding: 10,
    borderWidth: 2,
    borderColor: "#729c7f",
    backgroundColor: "white",
    borderRadius: 10,
  },
  headertext: {
    fontSize: 40,
    fontWeight: "bold",
    fontFamily: "Itim_400Regular",

    marginBottom: 50,
    textAlign: "center",
  },
  text: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
    color: "#555",
  },
  img: {
    width: 300,
    height: 300,
    marginBottom: 50,
    alignSelf: "center",
    borderRadius: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 100,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: "#729c7f",
  },
  buttonSubmit: {
    alignSelf: "center",
    borderRadius: 20,
    marginTop: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: "#729c7f",
    width: 100,
  },

  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

export default GuessPage;
