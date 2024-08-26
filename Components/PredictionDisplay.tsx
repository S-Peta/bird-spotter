import React, { View, Text, StyleSheet, ActivityIndicator } from "react-native";

export default function PredictionDisplay({ isPredicting, prediction }) {
  return (
    <View>
      {isPredicting && <ActivityIndicator />}
      {!isPredicting && prediction && (
        <Text style={styles.prediction}>Predicted Bird: {prediction}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  prediction: {
    fontSize: 18,
    marginVertical: 16,
  },
});
