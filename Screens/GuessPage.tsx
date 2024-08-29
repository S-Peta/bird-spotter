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
  ScrollView,
} from "react-native";
import React from "react";
import { useState } from "react";
import { updateUserTenPoints } from "../utils/updateUserPoints";
import ConfettiCannon from "react-native-confetti-cannon";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const GuessPage = ({ route, navigation }: { route: any; navigation: any }) => {
  const [guessBird, setGuessBird] = useState("");
  const [result, setResult] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const { predictedBird, imageUrl } = route.params;
  const [showConfetti, setShowConfetti] = useState(false);

  const onSubmit = () => {
    if (guessBird.trim() === predictedBird) {
      setResult(`Yaay, that's correct! \n\n+10 Points`);
      setModalVisible(true);
      setShowConfetti(true);
      updateUserTenPoints();
    } else {
      // console.log(guessBird.length, "guessBird length");
      // console.log(predictedBird.length, "predictedBird length");
      setResult(
        `Oops! That's not quite right. Want to see the correct bird species?`
      );
      setModalVisible(true);
    }
  };

  return (
    <KeyboardAwareScrollView>
      <View style={styles.cardContainer}>
        <View style={styles.cardContent}>
          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              resizeMode="cover"
              source={{
                uri: imageUrl,
              }}
            />
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Take a guess! </Text>
              <Text style={styles.title}>
                What species do you think this bird is?
              </Text>
            </View>
          </View>
          <TextInput
            style={styles.input}
            value={guessBird}
            onChangeText={setGuessBird}
            autoCorrect={false}
            autoCapitalize="characters"
          />
          <Pressable style={styles.buttonSubmit} onPress={onSubmit}>
            <Text style={styles.textStyle}>Submit Guess</Text>
          </Pressable>
          <View>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(!modalVisible);
                setShowConfetti(false);
              }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  {result.startsWith("Oops!") && (
                    <Text style={styles.emojiStyle}>😕</Text>
                  )}
                  <Text style={styles.modalText}>{result}</Text>
                  <Pressable
                    style={[styles.buttonCorrectBird, styles.buttonClose]}
                    onPress={() => {
                      setModalVisible(!modalVisible);
                      setShowConfetti(false);
                      navigation.navigate("Result Page", {
                        predictedBird,
                      });
                    }}
                  >
                    <Text style={styles.textStyle}>Check Bird</Text>
                  </Pressable>
                  {showConfetti && (
                    <ConfettiCannon count={200} origin={{ x: -100, y: 0 }} />
                  )}
                </View>
              </View>
            </Modal>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  cardContent: {
    backgroundColor: "#c6dec1",
    padding: 30,
    borderRadius: 15,
    elevation: 5,
    borderWidth: 10,
    borderColor: "#729c7f",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    width: 350,
    height: 630,
  },
  titleContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "center",
    fontFamily: "Itim_400Regular",
    padding: 10,
    textAlign: "center",
  },
  imageContainer: {
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 5,
  },
  input: {
    alignSelf: "center",
    width: "100%",
    height: 50,
    margin: 20,
    padding: 10,
    borderWidth: 2,
    borderColor: "#729c7f",
    backgroundColor: "white",
    borderRadius: 5,
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
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "#e8f2e6",
    borderRadius: 10,
    padding: 40,
    alignItems: "center",
    shadowColor: "#000",
    borderWidth: 2,
    borderColor: "#729c7f",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 40,
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
    borderRadius: 5,
    marginTop: 10,

    paddingVertical: 0,
    elevation: 2,
    backgroundColor: "#729c7f",
    width: 150,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonCorrectBird: {
    alignSelf: "center",
    borderRadius: 5,
    marginTop: 10,
    paddingVertical: 0,
    elevation: 2,
    backgroundColor: "#729c7f",
    width: 200,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  emojiStyle: {
    fontSize: 50,
    textAlign: "center",
    marginBottom: 10,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

export default GuessPage;
