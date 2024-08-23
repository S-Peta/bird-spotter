import { View, Text } from 'react-native'
import React from 'react'
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import formatString from '../utils/formatString';
type SingleBirdScreenRouteProp = RouteProp<RootStackParamList, 'Single Bird'>;
type Props = {
    route: SingleBirdScreenRouteProp;
};
const SingleBirdScreen: React.FC<Props> = ({ route }) => {
    const { species } = route.params;
    const formattedSpeciesName = species.split('')
  return (
    <View>
      <Text>Bird Name: {formatString(species)}</Text>
    </View>
  )
}

export default SingleBirdScreen