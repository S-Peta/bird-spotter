import { View, Text, Button, StyleSheet, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { firebase_auth } from '../index';
import { signOut, getAuth } from "firebase/auth";
import * as Progress from 'react-native-progress';
import {getCaughtBirds, getCaughtBirdSpecies } from '../utils/getData';
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
  const totalBirds = 521
  useEffect(() => {
    if(user){
      getCaughtBirds(user.uid).then((data) => {
        setTotalCaughtBirds(data.length)
      })
    }
  }, [])
  

  const progress = totalCaughtBirds / totalBirds

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>User Profile</Text>
      <Text style={styles.text}>Your Progress</Text>
      <Progress.Bar style={styles.progressBar} progress={progress} width={300} color="#4caf50"/>
      <Text style={styles.progressText}>{totalCaughtBirds}/{totalBirds} birds caught</Text>
      <Text style={styles.pointsText}>Total Points: {points}</Text>
      <Link to={{screen: 'Ranking'}} style={styles.link}>
        <Text style={styles.button}>View Rankings</Text>
      </Link>
      <Link to={{screen: 'Caught Birds', params: {totalCaughtBirds, totalBirds, userId: user?.uid, progress}}} style={styles.link}>
        <Text style={styles.button}>Your Caught Birds</Text>
      </Link>
     <Pressable style={styles.logoutButton} onPress={LogOut}>
        <Text style={styles.logoutButtonText}>Log out</Text>
      </Pressable>
    
    </View>
  
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: "#333",
  },
  text: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
    color: "#555",
  },
  progressBar: {
    alignSelf: "center",
    marginBottom: 10,
  },
  progressText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#777",
  },
  pointsText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 30,
    color: "#333",
    fontWeight: "bold",
  },
  link: {
    margin: 20,
    alignItems: "center",
    alignSelf: "center"
  },
  button: {
    backgroundColor: "#4caf50",
    color: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    width: "80%",
    alignSelf: "center",
  },
  logoutButton: {
    backgroundColor: "#f44336",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: "center",
    marginTop: 20,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default UserProfileScreen

