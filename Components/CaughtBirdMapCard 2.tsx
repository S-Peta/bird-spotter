import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'

const CaughtBirdMapCard = ({ caughtBird }) => {
  const defaultImageUri = 'https://t4.ftcdn.net/jpg/01/77/47/67/360_F_177476718_VWfYMWCzK32bfPI308wZljGHvAUYSJcn.jpg'


  return (
    <View style={styles.card}>
      <Image
        style={styles.image}
        source={{ uri: caughtBird.image || defaultImageUri }}
      />
      <View style={styles.rightContainer}>
        <Text style={styles.title}>{caughtBird.species}</Text>
        <Text style={styles.description}>caughtBird.info</Text>
        <View style={styles.footer}>
          <Text style={styles.description}>caughtBird user avatar</Text>
          <Text style={styles.description}>caughtBird user usarname</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    flexDirection: 'row',
    borderRadius: 20,
    overflow: 'hidden'
  },
  image: {
    width: 150,
    aspectRatio: 1
  },
  rightContainer: {
    padding:10,
    flex: 1
  },
  title: {
    fontFamily: 'InterBold',
    fontSize: 16,
    marginBottom: 10
  },
  description: {
    color: 'gray'
  },
  footer: {
    flexDirection: 'row',
    marginTop: 'auto'
  }
})

export default CaughtBirdMapCard
