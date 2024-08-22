import { View, Text, ScrollView, SafeAreaView, FlatList, Image, StyleSheet} from 'react-native'
import React, { useEffect } from 'react'
import { RouteProp } from '@react-navigation/native'
import { getCaughtBirds, getBirds, getBirdsImageUrls} from '../utils/getData'
import { useState } from 'react'

// interface CaughtBirdsParams {
//     totalBirds: number,
//     totalCaughtBirds: number
// }
// type CaughtBirdsScreenRouteProps = RouteProp<{'Caught Birds': CaughtBirdsParams}, 'Caught Birds'> 
// type CaughtBirdsScreenProps = {
//     route: CaughtBirdsScreenRouteProps
// }
// : React.FC<CaughtBirdsScreenProps>
const CaughtBirdsScreen = ({route}:{ route: any }) => {
    const [imageData, setImageData] = useState<string[]>([]);
    const {totalBirds, totalCaughtBirds} = route.params
    useEffect(() => {
        async function getImages(){
            try{
                const birds = await getBirds()
                const formattedBirdNames = birds.map((bird) => {
                    return bird.species.replace(/\s+/g, ' ')
                })
                const urls = await getBirdsImageUrls(formattedBirdNames)
                setImageData(urls)
            } catch(err){
                console.log(err);
            }
        }
        getImages()
    }, [])
    console.log(imageData)
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerText}>{totalCaughtBirds}/{totalBirds} birds caught</Text>
      <FlatList
        data={imageData}
        renderItem={({ item }) => (
          <View style={styles.imageContainer}>
            <Image source={{ uri: item }} style={styles.image} />
          </View>
        )}
        keyExtractor={item => item}
        numColumns={2} // To render in a grid format
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
    
  )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 10,
      paddingVertical: 20,
    },
    headerText: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    listContent: {
      justifyContent: 'center',
    },
    imageContainer: {
      flex: 1,
      alignItems: 'center',
      margin: 5,
      backgroundColor: '#f0f0f0',
      borderRadius: 10,
      padding: 10,
    },
    image: {
      width: 150,  
      height: 150,
      borderRadius: 8,
    },
  });
 export default CaughtBirdsScreen
