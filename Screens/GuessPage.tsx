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

const GuessPage = ({ route, navigation }: { route: any; navigation: any }) => {
  const [guessBird, setGuessBird] = useState("");
  const [result, setResult] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const { predictedBird, uri } = route.params;

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
        <Image style={styles.img} source={uri} />

        <TextInput
          style={styles.input}
          value={guessBird}
          onChangeText={setGuessBird}
          autoCorrect={false}
          autoCapitalize="characters"
        />
        <Pressable style={styles.buttonSubmit} onPress={onSubmit}>
          <Text style={styles.textStyle}>Submit</Text>
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
    backgroundColor: "#f5f5f5",
  },
  input: {
    height: 50,
    margin: 20,
    padding: 10,
    borderWidth: 1,
  },
  headertext: {
    fontSize: 30,
    fontWeight: "bold",

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
    alignSelf: "center",
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
    padding: 35,
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
    backgroundColor: "#2196F3",
  },
  buttonSubmit: {
    alignSelf: "center",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: "#2196F3",
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
