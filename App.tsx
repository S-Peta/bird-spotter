import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Login from './Components/Login';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { firebase_auth } from './index';
import FirstPage from './Components/FirstPage';

const Stack = createNativeStackNavigator()
const InsideStack = createNativeStackNavigator()

function InsideLayout() {
  return (
    <InsideStack.Navigator>
      <InsideStack.Screen name='Inside' component={FirstPage}/>
    </InsideStack.Navigator>
  )
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(firebase_auth, (user) => {
      console.log('user', user);
      setUser(user)
    })
  })

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        {user ? (
          <Stack.Screen name='Inside' component={InsideLayout} options={{headerShown: true}} />
        ) : (
          <Stack.Screen name='Login' component={Login} options={{headerShown: false}}/>
        )}

      </Stack.Navigator>
    </NavigationContainer>
  );
}
