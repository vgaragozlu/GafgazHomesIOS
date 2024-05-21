import React, { useState, useEffect, } from 'react';
import { Button, TouchableOpacity, Text, View, Dimensions, Image } from 'react-native'

import auth from '@react-native-firebase/auth';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SignIn from './Screens/SignIn';
import Home from './Screens/Home';
import DetailedHome from './Screens/DetailedHome';
import HomesList from './Screens/HomesList';
import InitialHome from './Screens/InitialHome';
import Room from './Room';
import PickLocation from './PickLocation';
import AddListing from './AddListing';
import Welcome from './Screens/Welcome';
import Icon from 'react-native-vector-icons/FontAwesome6';
import Icon2 from 'react-native-vector-icons/FontAwesome5';
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon9 from 'react-native-vector-icons/MaterialIcons';
import Icon4 from 'react-native-vector-icons/Ionicons';
import Icon5 from 'react-native-vector-icons/AntDesign';
import SignUp from './Screens/SignUp';
import Rezervations from './Rezervations';
import Orders from './Orders';
import MyListings from './MyListings';

const Stack = createNativeStackNavigator();

const App = () => {

  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;


  if (!user) {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="SignIn">
          <Stack.Screen name="SignIn" component={SignIn} options={{ title: 'Giris', headerShown: false }} />
          <Stack.Screen name="SignUp" component={SignUp} options={{ title: 'Qeydiyyat', headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }


  return (
    <NavigationContainer>
      <Stack.Navigator >
        {/*<Stack.Screen name="InitialHome" component={InitialHome} options={{ title: 'Secim', headerShown:false }} />*/}
        <Stack.Screen name="Home" component={Home}
          options={({ navigation }) => ({
            headerShown: false,
            title: 'Ana Seyfe',
            headerStyle: {
              backgroundColor: '#F4F4F4',
            },
            headerTitle: (props) =>
              <TouchableOpacity
                style={{ justifyContent: 'center', alignItems: 'center', marginRight: '7%' }}
                onPress={() => {
                  navigation.navigate('Room')
                }}
              ><Icon2 name="user" size={25} color='grey' />
              </TouchableOpacity>,
            headerRight: () => (
              <TouchableOpacity onPress={() => {
                navigation.navigate('AddListing')
              }} style={{ flexDirection: 'row', marginLeft: '7%', height: Dimensions.get('screen').width * 0.10, borderRadius: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                <Icon4 name="add" size={30} color='grey' />
              </TouchableOpacity>
            ),
          })} />




        <Stack.Screen name="Room" component={Room}
          options={({ navigation }) => ({
            headerStyle: {
              backgroundColor: '#F4F4F4',

            },
            headerTintColor: '#3b97ed',

            title: '  ',

            headerRight: () => (
              <TouchableOpacity
                style={{ justifyContent: 'center', alignItems: 'center', borderRadius: 50, height: Dimensions.get('screen').width * 0.10, width: Dimensions.get('screen').width * 0.10, }}
                onPress={() => {
                  auth()
                    .signOut()
                    .then(() => console.log('User signed out!'));
                }}
              >

                <Text style={{ fontSize: 12, color: '#df3e3e', }}>Çıxış</Text>
              </TouchableOpacity>
            ),
            headerLeft: (props) =>
              <TouchableOpacity
                style={{ justifyContent: 'center', alignItems: 'center', marginRight: '7%' }}
                onPress={() => {
                  navigation.navigate('Home')
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon4 name="menu" size={18} color='#667A70' />

                  <Text style={{ marginLeft: 7, fontWeight: 'bold', fontSize: 12, color: '#667A70' }}>Menyu</Text>
                </View>
              </TouchableOpacity>,
          })} />

        <Stack.Screen name="HomesList" component={HomesList} options={{
          headerTintColor: 'white', title: '', headerShown: false, headerStyle: {
            backgroundColor: '#F4F4F4',
          },
        }} />
        <Stack.Screen name="Rezervations" component={Rezervations} options={{
          title: 'Rezervasiyalar', headerShown: true, headerTitleStyle: { fontSize: 14 }, 
          headerRight: () => (
            <View style={{flexDirection:"row", alignItems:'center'}}>
              <Icon9 style={{ marginLeft: 10, marginRight: 5 }} name="circle" size={10} color="red" />
              <Text  style={{fontSize:10}}>Təxirə salınmışlar</Text>
              </View>
          ),
        }} />
        <Stack.Screen name="Orders" component={Orders} options={{
          headerRight: () => (
            <View style={{flexDirection:"row", alignItems:'center'}}>
              <Icon9 style={{ marginLeft: 10, marginRight: 5 }} name="circle" size={10} color="red" />
              <Text  style={{fontSize:10}}>Təxirə salınmışlar</Text>
              </View>
          ),
          title: 'Sifarişlərim', headerShown: true, headerTitleStyle: { fontSize: 14 } }} />
        <Stack.Screen name="MyListings" component={MyListings} options={{ title: 'Elanlarım', headerShown: true, headerTitleStyle: { fontSize: 14 } }} />
        <Stack.Screen name="AddListing" component={AddListing} options={{ title: 'Elan ver', headerShown: false, headerTitleStyle: { fontSize: 14 } }} />
        <Stack.Screen name="PickLocation" component={PickLocation} options={{ title: 'Yeri Seç', headerShown: false, headerTitleStyle: { fontSize: 14 } }} />
        <Stack.Screen name="DetailedHome" component={DetailedHome} options={{ title: 'DetailedHome' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}



export default App;
