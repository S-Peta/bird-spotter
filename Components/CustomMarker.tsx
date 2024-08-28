import React from "react";
import { Marker } from "react-native-maps";

const CustomMarker = ({ caughtBird, onPress }) => {
  return (
    <Marker
      onPress={onPress}
      coordinate={{
        latitude: caughtBird.location.latitude,
        longitude: caughtBird.location.longitude,
      }}
      title={caughtBird.species}
      // description="Bird Description"
    ></Marker>
  );
};

export default CustomMarker;
