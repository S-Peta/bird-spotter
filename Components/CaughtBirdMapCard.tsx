import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'

const CaughtBirdMapCard = ({ caughtBird }) => {
  return (
    <View style={styles.card}>
      <Image style={styles.image}/>
      <View style={styles.rightContainer}>
        <Text style={styles.title}>caughtBird</Text>
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
    position: 'absolute',
    bottom: 50,
    padding: 10,
    left: 10,
    right:10,
    flexDirection: 'row',
    borderRadius: 15,
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
