import { View, Text, Button, StyleSheet, Pressable, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { firebase_auth } from '../index';
import { signOut, getAuth } from "firebase/auth";
import { getCaughtBirds, getPointsForUser } from '../utils/getData';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useContext } from 'react';
import { PointsContext } from '../Contexts/Points';
import Icon from 'react-native-vector-icons/Ionicons';

const UserProfileScreen = () => {
  const auth = firebase_auth;
  const userAuth = getAuth();
  const user = userAuth.currentUser;
  const navigation = useNavigation();
  const { points, setPoints } = useContext(PointsContext);
  const [totalCaughtBirds, setTotalCaughtBirds] = useState(0);

  const defaultImageUri = 'https://www.momscleanairforce.org/wp-content/uploads/2020/11/birds_sky.jpg';
  const defaultUser = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDJzEaxLN-jGRYYUO65pWu7Q9GXoNt4LUSSA&s';

  if (user) {
    getPointsForUser(user.uid).then((userPoints) => {
      setPoints(userPoints);
    });
  }

  const LogOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error);
      alert('Sign Out failed' + error.message);
    }
  };

  const goToRankingPage = () => {
    navigation.navigate('Ranking');
  };

  const goToSettings = () => {
    navigation.navigate('Settings');
  };

  const totalBirds = 521;
  useEffect(() => {
    if (user) {
      getCaughtBirds(user.uid).then((data) => {
        setTotalCaughtBirds(data.length);
      });
    }
  }, []);

  const progress = totalCaughtBirds / totalBirds;

  return (
    <View>
      <StatusBar backgroundColor='gray' />
      <View style={styles.headerContainer}>
        <Image source={{ uri: defaultImageUri }} resizeMode='cover' style={styles.headerImage} />
        <TouchableOpacity style={styles.settingsIcon} onPress={goToSettings}>
          <Icon name="settings-outline" size={30} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: user?.avatar || defaultUser }}
          resizeMode='contain'
          style={styles.avatar}
        />
        <Text style={styles.username}>{user?.username || 'Username'}</Text>
      </View>

      <Text style={styles.title}>Overview</Text>

      <View style={styles.cardsContainer}>
        <View style={styles.card}>
          <Icon name="flame" size={30} color="orange" />
          <Text>Overview 1</Text>
        </View>
        <View style={styles.card}>
          <Icon name="flash" size={30} color="orange" />
          <Text>Overview 2</Text>
        </View>
      </View>

      <View style={styles.bottomCardContainer}>
        <TouchableOpacity style={styles.bottomCard} onPress={goToRankingPage}>
          <Icon name="podium" size={30} color="orange"  style={styles.icon}/>
          <Text>Check the ranking</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Your most recent caught birds</Text>

      <View style={styles.bottomCardContainer}>
        <View style={styles.birdsCard}>
          <View style={styles.birdsList}>
            <Image style={styles.birdImage} source={{ uri: defaultImageUri }} />
            <Image style={styles.birdImage} source={{ uri: defaultImageUri }} />
            <Image style={styles.birdImage} source={{ uri: defaultImageUri }} />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    position: 'relative',
    width: '100%',
  },
  headerImage: {
    height: 150,
    width: '100%',
  },
  settingsIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: -90,
  },
  avatar: {
    height: 155,
    width: 155,
    borderRadius: 999,
    borderColor: 'green',
    borderWidth: 2,
  },
  username: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  title: {
    // textAlign: 'center',
    fontSize: 16,
    marginBottom: 5,
    marginTop: 25,
    marginLeft: 40,
    fontWeight: 'bold',
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#dcdcdc',
    width: 150,
    height: 80,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomCardContainer: {
    alignItems: 'center',
  },
  bottomCard: {
    backgroundColor: '#dcdcdc',
    width: 315,
    height: 80,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  birdsCard: {
    backgroundColor: '#dcdcdc',
    width: 315,
    height: 120,
    borderRadius: 5,
    justifyContent: 'center',
    padding: 10,
  },
  birdsList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  birdImage: {
    width: 90,
    height: 90,
    borderRadius: 5,
  },
  icon: {
    margin: 10,
  }
});

export default UserProfileScreen;
