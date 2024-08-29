import * as Location from "expo-location";
import { useState } from "react";
import { Alert } from "react-native";
import { LocationCoords } from "../types";

export default async function getCurrentLocation() {
  try {
    let { status } = await Location.requestBackgroundPermissionsAsync();
    if (status !== "granted") {
      const latitude = parseFloat((Math.random() * (90 - -90)).toFixed(6));
      const longitude = parseFloat((Math.random() * (180 - -180)).toFixed(6));
      return { latitude, longitude };
    }
    const lastLocation = await Location.getLastKnownPositionAsync();
    if (lastLocation) {
      const {
        coords: { latitude, longitude },
      } = lastLocation;

      return { latitude, longitude };
    }
    const currLocation = await Location.getCurrentPositionAsync();
    const {
      coords: { latitude, longitude },
    } = currLocation;
    return { latitude, longitude };
  } catch (error) {
    Alert.alert("cannot get location");
    return null;
  }
}
