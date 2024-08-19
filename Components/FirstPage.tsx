import { View, Text, Button } from 'react-native'
import React from 'react'
import { firebase_auth } from '../index';
import { signOut } from "firebase/auth";



const FirstPage = () => {
  const auth = firebase_auth;

  const LogOut = async () => {
    try {
      await signOut(auth)
    } catch (error: any) {
      console.log(error);
      alert('Sign Out failed' + error.message)
    }
  }
  return (
    <View>
      <Text>FirstPage</Text>
      <Button title='Log Out' onPress={LogOut}/>
    </View>
  )
}

export default FirstPage
