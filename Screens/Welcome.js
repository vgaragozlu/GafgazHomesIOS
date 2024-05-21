import { View, Text, TouchableOpacity, TextInput, Image } from 'react-native'
import React, { useState } from 'react'
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useSafeAreaFrame } from 'react-native-safe-area-context';


GoogleSignin.configure({
  webClientId: '367763978556-0oa45f7ht5354lal0d4rqr8jpsnaj4ju.apps.googleusercontent.com',
});

export default function Welcome({ navigation }) {

  async function onGoogleButtonPress() {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
 
    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  }


  async function onEmailAndPasswordButtonPress() {
    
    auth()
    .signInWithEmailAndPassword('lala@gmail.com', 'password')
    .then((user) => {
      console.log(user);
      // If server response message same as Data Matched
      
    })
    .catch((error) => {
      console.log(error);
      
    });
  }


  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')



  return (
    <View style={{ width: '100%', height: "100%", justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f0b01' }}>
      <Image style={{ width: 160, height: 160 }} source={require('../images/icon_Logo.png')} />
      {/*
      <TextInput value={username} onChangeText={setUsername} style={{ width: '80%', height: '10%', borderColor: 'grey', borderWidth: 2, borderRadius: 5, color:'white'}} placeholder='username' placeholderTextColor={'grey'} />
      <TextInput value={password} onChangeText={setPassword} style={{ width: '80%', height: '10%', borderColor: 'grey', borderWidth: 2, borderRadius: 5, marginTop:30, color:'white', }} placeholder='password' placeholderTextColor={'grey'} />
*/}
      {/*<View style={{ height: '7%', width: '70%', backgroundColor: 'white', borderRadius: 10, marginTop: "5%" }}>
        <TextInput style={{ paddingLeft: '7%' }} />
      </View>*/}
      <TouchableOpacity
        style={{ flexDirection: 'row',  width: '60%', height: '5%', backgroundColor: '#e8e8e8', justifyContent: 'center', alignItems: 'center', borderRadius: 10, marginTop: '10%' }}
        onPress={() => {
         // onGoogleButtonPress().then(() => console.log('Signed in with Google!'))
         onEmailAndPasswordButtonPress()
        }}>
        <Image style={{ width: '7%', height: '55%', borderColor:'black', borderWidth:0, marginRight:'5%' }} source={require('../images/google.png')} />
        <Text style={{ color: 'black', fontWeight: 'bold', borderColor:'black', borderWidth:0,marginRight:'5%' }}>Giris</Text>
      </TouchableOpacity>
    </View>
  )
}