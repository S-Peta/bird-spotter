import {
  View,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Button,
  KeyboardAvoidingView,
  Pressable,
  Text,
  ImageBackground,
  Platform,
  ScrollView
} from "react-native";
import React, { useState } from "react";
import { firebase_auth } from "../index";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { db } from "../index";
import { collection, setDoc, doc } from 'firebase/firestore';

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = firebase_auth;
  const [errorMessage, setErrorMessage] = useState("")

  const signIn = async () => {
    setLoading(true)
    setErrorMessage("")
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      if (error.code === 'auth/user-not-found'){
        setErrorMessage("User does not exist")
      } else if (error.code === 'auth/invalid-credential'){
        setErrorMessage('Incorrect password')
      } else if (error.code === 'auth/invalid-email'){
        setErrorMessage("Please provide an email")
      } else if (error.code === 'auth/missing-password'){
        setErrorMessage('Please provide a password')
      } else if (error.code === 'auth/missing-email') {
        setErrorMessage('Please provide an email')
      } else {
        setErrorMessage('Log in failed: ' + error.message)
      }
    } finally {
      setLoading(false);
    }
  };

  const signUp = async () => {
    setLoading(true);
    setErrorMessage("")
    try {
      const response = await createUserWithEmailAndPassword (
        auth,
        email,
        password
      );
      console.log(response.user.email)
      if (response.user.email !== null) {
        const userName = response.user.email.split('@')[0]
        await setDoc(doc(db,'Users', response.user.uid), {
          points: 0,
          username: userName
        })
      }
      alert("Check your email");
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use'){
        setErrorMessage("This email is already in use")
      } else if (error.code === 'auth/weak-password'){
        setErrorMessage('Password must be at least 6 characters')
      } else if (error.code === 'auth/invalid-email'){
        setErrorMessage("Invalid email")
      } else if (error.code === 'auth/missing-password'){
        setErrorMessage('Please provide a password')
      } else if (error.code === 'auth/missing-email') {
        setErrorMessage('Please provide an email')
      } else {
       setErrorMessage("Sign Up failed: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
    source={require("../assets/Background5.png")}
    resizeMode="cover"
    style={styles.backgroundImage}
  >
    <KeyboardAvoidingView
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.fieldsContainer}>
          <TextInput
            value={email}
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#888"
            autoCapitalize="none"
            onChangeText={(text) => setEmail(text)}
          />
          <TextInput
            secureTextEntry={true}
            value={password}
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#888"
            autoCapitalize="none"
            onChangeText={(text) => setPassword(text)}
          />
          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <>
              <Pressable style={styles.button} onPress={signIn}>
                <Text style={styles.buttonText}>Log In</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.signUpButton]}
                onPress={signUp}
              >
                <Text style={styles.buttonText}>Create Account</Text>
              </Pressable>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    marginTop: 100
  },
  fieldsContainer: {
    marginHorizontal: 30,
  },
  input: {
    marginVertical: 8,
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#4caf50",
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  signUpButton: {
    backgroundColor: "#2196f3",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
    fontSize: 14,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
});
