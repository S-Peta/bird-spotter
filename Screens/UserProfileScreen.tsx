import { View, Text, Button, StyleSheet, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { firebase_auth } from '../index';
import { signOut, getAuth } from "firebase/auth";
import * as Progress from 'react-native-progress';
import {getCaughtBirds } from '../utils/getData';
import { db } from '../index';
import { doc, getDoc } from 'firebase/firestore';
import { getPointsForUser } from '../utils/getData';
import { useContext } from 'react';
import { PointsContext } from '../Contexts/Points';
import { Link } from '@react-navigation/native';

const UserProfileScreen = () => {
  const auth = firebase_auth;
  const userAuth = getAuth();
  const user = userAuth.currentUser;
  const {points, setPoints} = useContext(PointsContext)
  // const [points, setPoints] = useState(0)
  if (user){
  getPointsForUser(user.uid)
  .then((userPoints) => {
    setPoints(userPoints)
  })
  }
  const [totalCaughtBirds, setTotalCaughtBirds] = useState(0)
  const LogOut = async () => {
    try {
      await signOut(auth)
    } catch (error: any) {
      console.log(error);
      alert('Sign Out failed' + error.message)
    }
  }
  const totalBirds = 525
  useEffect(() => {
    getCaughtBirds().then((data) => {
      setTotalCaughtBirds(data.length)
    })
  }, [])
  

  const progress = totalCaughtBirds / totalBirds

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Your Progress</Text>
      <Progress.Bar style={styles.progressBar} progress={progress} width={300}/>
      <Text style={styles.progressText}>{totalCaughtBirds}/{totalBirds} birds caught</Text>
      <Text>Total Points: {points}</Text>
      <Link to={{screen: 'Ranking'}}>
        <Text style={styles.button}>View Rankings</Text>
      </Link>
      <Link to={{screen: 'Caught Birds', params: {totalCaughtBirds, totalBirds}}}>
        <Text style={styles.button}>Your caught birds</Text>
      </Link>
      <Button title='Log out' onPress={LogOut}></Button>
    </View>

  )
}
const styles = StyleSheet.create({
  container: {
    margin: 100,
    gap: 20,
    flex: 1,
    justifyContent: "center",
  },
  text: {
   textAlign: "center"
  },
  progressBar: {
    alignSelf: "center"
  }, 
  progressText: {
    textAlign: "right"
  }, 
  button: {
    backgroundColor: "lightgreen",
    padding: 8,
    borderRadius: 20,
  }
});

export default UserProfileScreen
