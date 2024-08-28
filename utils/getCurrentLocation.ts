import * as Location from "expo-location";

export default async function getCurrentLocation() {
  let { status } = await Location.requestBackgroundPermissionsAsync();

  if (status !== "granted") {
    const latitude = parseFloat((Math.random() * (90 - -90)).toFixed(6));
    const longitude = parseFloat((Math.random() * (180 - -180)).toFixed(6));
    return { latitude: latitude, longitude: longitude };
  }

  let locationObj = await Location.getCurrentPositionAsync();
  const {
    coords: { latitude, longitude },
  } = locationObj;
  return { latitude, longitude };
}
