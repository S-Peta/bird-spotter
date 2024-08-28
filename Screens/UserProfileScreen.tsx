import { View, Text, Button, StyleSheet, Pressable, Image, TouchableOpacity, Alert, SectionList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { firebase_auth, db, storage } from '../index';
import { signOut, getAuth, updateProfile } from "firebase/auth";
import { getCaughtBirds, getCaughtBirdSpecies, getPointsForUser, getBirds, getBirdsImageUrls, getCaughtBirdScientificName, getStreaksForUser, getGuessesForUser} from '../utils/getData';
import { useNavigation, NavigationProp} from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useContext } from 'react';
import { PointsContext } from '../Contexts/Points';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFonts } from 'expo-font';
import { Itim_400Regular } from '@expo-google-fonts/itim';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import * as Progress from 'react-native-progress';
import AntDesign from '@expo/vector-icons/AntDesign';
import { FlatList } from 'react-native-gesture-handler';
import { RootStackParamList } from '../types';
import { Log } from '@tensorflow/tfjs';
const UserProfileScreen = () => {
  const auth = firebase_auth;
  const userAuth = getAuth();
  const user = userAuth.currentUser!;
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const defaultUser = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCFoiI5GIjAzBXk4FCP0PhikiWkT5cbBQi492KoVj6hXm1W2zppE3hBQ6fdL07Wv-PYjU&usqp=CAU';

  const defaultImageUri = 'https://www.momscleanairforce.org/wp-content/uploads/2020/11/birds_sky.jpg';

  const { points, setPoints } = useContext(PointsContext);
  const [totalCaughtBirds, setTotalCaughtBirds] = useState(0);
  const [avatar, setAvatar] = useState(user?.photoURL || defaultUser);
  const [uploading, setUploading] = useState(false);
  const[mostRecentBirds, setMostRecentBirds] = useState<
  { species: string; url: string, scientificName: string}[]
>([]);
const [daysStreak, setDaysStreak] = useState(0)
const [correctGuesses, setCorrectGuesses] = useState(0)

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

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const selectedImage = result.assets[0];
      setUploading(true);
      setAvatar(selectedImage.uri);

      try {
        const avatarRef = ref(storage, `avatars/${user.uid}`);
        const blob = await uriToBlob(selectedImage.uri);
        await uploadBytes(avatarRef, blob);
        const avatarUrl = await getDownloadURL(avatarRef);

        await updateProfile(user, { photoURL: avatarUrl });

        const userDoc = doc(db, 'Users', user.uid);
        await updateDoc(userDoc, { avatar: avatarUrl });

        Alert.alert('Success', 'Avatar updated successfully!');
      } catch (error) {
        Alert.alert('Failed to upload avatar', error.message);
        console.error(error);
      } finally {
        setUploading(false);
      }
    } else {
      console.log('Image pick was canceled or no image was selected');
    }
  };

  const uriToBlob = (uri:string): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });
  };

  const totalBirds = 521;
  useEffect(() => {
    async function getImages() {
      if (user){
        try {
          const caughtBirds = await getCaughtBirds(user.uid)
          setTotalCaughtBirds(caughtBirds.length)
          const recentCaughtBirds = await getCaughtBirds(user.uid, 3)
          const formattedBirdNames = recentCaughtBirds.map((bird) => {
            return bird.species
          })
        const scientificNames = await Promise.all(formattedBirdNames.map(async (bird) => {
          const scientificName = await getCaughtBirdScientificName(bird)
          return scientificName
        }))
          const urls = await getBirdsImageUrls(formattedBirdNames);
          const imageObjects = formattedBirdNames.map((species, index) => ({
            species,
            url: urls[index],
            scientificName: scientificNames[index]
          }))
          setMostRecentBirds(imageObjects)
        } catch (err) {
          console.log(err)
        }
      } 
     
    }
    getImages()
    getStreaksForUser(user.uid)
    .then((streak) => {
      setDaysStreak(streak)
    })
    getGuessesForUser(user.uid)
    .then((guesses) => {
      setCorrectGuesses(guesses)
    })
  }, [daysStreak, correctGuesses])
  const progress = totalCaughtBirds / totalBirds
  function handlePress(species: string, url:string, scientificName: string) {
    navigation.navigate('Single Bird', { species, url, scientificName})
  }
  const userUsername = user.email?.split('@')[0];
  const formattedUsername = userUsername ? userUsername.charAt(0).toUpperCase() + userUsername.slice(1) : 'User';
  return (
    <View>
      <StatusBar backgroundColor='gray' />
      <View style={styles.headerContainer}>
        <Image source={{ uri: defaultImageUri }} resizeMode='cover' style={styles.headerImage} />
        <View style={styles.pointsContainer}>
          <AntDesign name="dingding" style={styles.dingdingIcon} />
        <Text style={styles.pointsText}>{points}</Text>
      </View>
      </View>

      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: avatar || defaultUser }}
          resizeMode='contain'
          style={styles.avatar}
        />
        <TouchableOpacity style={styles.cameraIcon} onPress={pickImage} disabled={uploading}>
          <FontAwesome name="camera" size={16} color="white" />
        </TouchableOpacity>
        <Text style={styles.username}>
        @{formattedUsername}
        </Text>
      </View>

      <Progress.Bar style={styles.progressBar} progress={progress} width={300} color="#4caf50"/>
      <Text style={styles.progressText}>{totalCaughtBirds}/{totalBirds} birds caught</Text>

      <Text style={styles.title}>Overview</Text>

      <View style={styles.cardsContainer}>
        <View style={styles.card}>
          <Icon name="flame" size={30} color="orange" />
          <Text style={styles.textCard}>{daysStreak} days</Text>
        </View>
        <View style={styles.card}>
          <Icon name="flash" size={30} color="orange" />
          <Text style={styles.textCard}>{correctGuesses} correct guesses</Text>
        </View>
      </View>

      <View style={styles.bottomCardContainer}>
        <TouchableOpacity style={styles.bottomCard} onPress={goToRankingPage}>
          <Icon name="podium" size={30} color="orange"  style={styles.icon}/>
          <Text style={styles.textCard}>Check the ranking</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Your most recent caught birds</Text>
      <View style={styles.bottomCardContainer}>
        <View style={styles.birdsCard}>
          <View style={styles.birdsList}>
            <FlatList 
            data={mostRecentBirds}
            horizontal
            renderItem={({item}) => (
                <Pressable  onPress={() => handlePress(item.species, item.url, item.scientificName)}>
                <Image style={styles.birdImage} source={{ uri: item.url }} />
              </Pressable>
            )}
            keyExtractor={(item) => item.species}
            showsHorizontalScrollIndicator={false}>
            </FlatList>
          </View>
        </View>
      </View>
      <Pressable onPress={LogOut} style={styles.button}>
        <Text style={styles.buttonText}>Log Out</Text>
      </Pressable>
    </View>

  );
};

const styles = StyleSheet.create({
  headerContainer: {
    position: 'relative',
    width: '100%',
  },
  headerImage: {
    height: 120,
    width: '100%',
  },
  pointsContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
},
pointsText: {
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold',
    position: 'absolute',
    bottom: 8,
    textAlign: 'center',
},
dingdingIcon: {
    position: 'absolute',
    top: 8,
    color: 'gold',
    fontSize: 16,
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
  cameraIcon: {
    position: 'absolute',
    bottom: 40,
    right: 120,
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    padding: 8,
  },
  username: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Itim_400Regular',
  },
  progressBar: {
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 5,
    borderRadius: 10,
    height: 20
  },
  progressText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15,
    color: "#777",
    fontFamily: 'Itim_400Regular'
  },
  title: {
    fontSize: 20,
    marginBottom: 5,
    marginLeft: 40,
    fontWeight: 'bold',
    fontFamily: 'Itim_400Regular',
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 30,
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#dcdcdc',
    width: 150,
    height: 80,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textCard: {
    fontFamily: 'Itim_400Regular',
    fontSize: 16
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
    marginBottom: 15
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
    marginHorizontal: 5,
  },
  icon: {
    margin: 10,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    marginTop: 10,
  },
  button: {
    backgroundColor: "#9c1c1c",
    paddingVertical: 7,
    borderRadius: 8,
    marginTop: 50,
    alignItems: "center",
    width: 90,
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default UserProfileScreen;
