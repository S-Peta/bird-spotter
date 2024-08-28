import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, ActivityIndicator } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { getUsers } from '../utils/getData';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useFonts, Itim_400Regular } from '@expo-google-fonts/itim';
const RankingScreen = () => {
  const [users, setUsers] = useState<
  { avatar: string; points: number, username: string}[]
>([])
  const [loading, setLoading] = useState(true);
  const currentUser = 'currentUsername';
  const defaultAvatar = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCFoiI5GIjAzBXk4FCP0PhikiWkT5cbBQi492KoVj6hXm1W2zppE3hBQ6fdL07Wv-PYjU&usqp=CAU';

  useEffect(() => {
    const fetchUsers = async () => {
      const userList = await getUsers();
      userList.sort((a, b) => b.points - a.points);
      setUsers(userList);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingOverlay}>
        <ActivityIndicator size="large" color="#729c7f" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false}>
          {users.map((user, index) => (
            <View
              key={user.username}
              style={[
                styles.userCard,
                user.username === currentUser && styles.currentUserCard,
              ]}
            >

              <Image source={{ uri: user.avatar || defaultAvatar }} style={styles.avatar} />
              <View style={styles.textContainer}>
                <View style={styles.userInfo}>
                  <Text style={styles.username}>{user.username}</Text>
                  {index === 0 && <FontAwesome6 name="medal" size={20} color="#FFD700" style={styles.medal} />}
                  {index === 1 && <FontAwesome6 name="medal" size={20} color="#C0C0C0" style={styles.medal} />}
                  {index === 2 && <FontAwesome6 name="medal" size={20} color="#CD7F32" style={styles.medal} />}
                </View>
                <Text style={styles.points}>{user.points}
                <AntDesign name="dingding" style={styles.dingdingIcon} />
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  cardContainer: {
    flex: 1,
    backgroundColor: '#c6dec1',
    padding: 20,
    borderRadius: 15,
    elevation: 5,
    borderWidth: 10,
    borderColor: '#729c7f',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  scrollView: {
    paddingBottom: 20,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 3,
  },
  currentUserCard: {
    borderWidth: 6,
    borderColor: 'black',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 5,
    fontFamily: 'Itim_400Regular',
  },
  medal: {},
  points: {
    fontFamily: 'Itim_400Regular',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'right',
  },
  dingdingIcon: {
    color: 'gold',
    padding: 3
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    marginTop: 10,
    fontFamily: 'Itim_400Regular',
  },
});

export default RankingScreen;
