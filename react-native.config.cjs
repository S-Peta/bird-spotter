module.exports = {
  project: {
    ios: {},
    android: {},
  },
  assets: ["./src/assets/"],
  dependencies: {
    'react-native-tensorflow': {
      platforms: {
        ios: null, // Disable iOS platform if you're linking manually or using CocoaPods
        android: null, // Disable Android platform if linking manually
  }}
}
}