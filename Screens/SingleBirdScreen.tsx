import { View, Text, Image, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import formatString from '../utils/formatString';
import { getPageTitleAndId, getBirdSummary } from '../api';
type SingleBirdScreenRouteProp = RouteProp<RootStackParamList, 'Single Bird'>;

const SingleBirdScreen = () => {
    const route = useRoute<SingleBirdScreenRouteProp>()
    const { species, url} = route.params;
    const [birdDescription, setBirdDescription] = useState<string>("")
    useEffect(() => {
        getPageTitleAndId(species)
        .then(({pageId, title}) => {
            return getBirdSummary(title, pageId)
        })
        .then(({summary}) => {
            console.log(summary)
            setBirdDescription(summary)
        })
    }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{formatString(species)}</Text>
      <Image source={{uri: url}} style={styles.image}/>
      <Text style={styles.description}>Description</Text>
      <Text>{birdDescription}</Text>
    </View>
  )
}

export default SingleBirdScreen

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    text: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    description: {
        fontSize: 18,
        fontWeight: 'bold',
        alignSelf: "flex-start",
        marginTop: 20,
    },
    image: {
      width: 300,
      height: 300,
      borderRadius: 8,
    },
  });