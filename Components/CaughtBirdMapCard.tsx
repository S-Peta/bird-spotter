import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";

import React from "react";

const CaughtBirdMapCard = ({ caughtBird, setSelectedBird }) => {
  const defaultImageUri =
    "https://t4.ftcdn.net/jpg/01/77/47/67/360_F_177476718_VWfYMWCzK32bfPI308wZljGHvAUYSJcn.jpg";
  const userUsername = caughtBird.username;
  const formattedUsername =
    userUsername.charAt(0).toUpperCase() + userUsername.slice(1);
  return (
    <View style={styles.card}>
      <Image
        style={styles.image}
        source={{ uri: caughtBird.image || defaultImageUri }}
      />
      <View style={styles.rightContainer}>
        <TouchableOpacity
          onPress={() => setSelectedBird(null)}
          style={styles.closeButton}
        >
          <AntDesign name="closecircleo" size={18} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>{caughtBird.species}</Text>

        {/* <Text style={styles.description}>caughtBird.info</Text> */}
        <View style={styles.footer}>
          {/* <Text style={styles.description}>caughtBird user avatar</Text> */}
          <Text style={styles.description}>
            Spotted by: {formattedUsername}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    flexDirection: "row",
    borderRadius: 20,
    overflow: "hidden",
  },
  image: {
    width: 150,
    aspectRatio: 1,
  },
  rightContainer: {
    padding: 10,
    flex: 1,
  },
  title: {
    fontSize: 16,
    marginBottom: 10,
  },
  description: {
    color: "gray",
  },
  footer: {
    flexDirection: "row",
    marginTop: "auto",
  },
  closeButton: {
    borderRadius: 10,
    alignSelf: "flex-end",
    marginTop: 0,
  },
});

export default CaughtBirdMapCard;
