import { View, Text, TouchableOpacity, TextInput, Image, Dimensions, ImageBackground } from 'react-native'
import React, { useState } from 'react'
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useSafeAreaFrame } from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
import Modal from "react-native-modal";


GoogleSignin.configure({
  webClientId: '367763978556-0oa45f7ht5354lal0d4rqr8jpsnaj4ju.apps.googleusercontent.com',
});

export default function SignIn({ navigation }) {

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


  async function onEmailAndPasswordButtonPress(username, password) {
    setIsLoading(true)
    auth()
      .signInWithEmailAndPassword(username, password)
      .then((user) => {
       // console.log(user);
        setIsLoading(false)
        // If server response message same as Data Matched
      })
      .catch((error) => {
        setIsLoading(false)

        if(error.code=='auth/wrong-password')
        {
          alert('Şifrə yanlışdır')
        }
         else if(error.code=='auth/network-request-failed')
        {
          alert('İnternet bağlantınızı yoxlayın')
        }

        console.log(error.code);

      }).finally(()=>{
        setIsLoading(false)
        
      });
  }

  const resetPassword = (email) => {
    auth().sendPasswordResetEmail(email).then(() => {
      alert('Şifrə yeniləmə bağlantısı email adresinizə göndərildi!')
      setIsPasswordResetModalVisable(false)
    })

  }

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isPasswordResetModalVisable, setIsPasswordResetModalVisable] = useState(false)

  if (isLoading)
    return (
      <ImageBackground source={require('../images/bg.jpg')} style={{ flex: 1, alignItems: 'center', backgroundColor: '#000000', paddingTop: '20%', justifyContent: 'center', }}>
        <LottieView style={{ width: 50, height: 50 }} source={require('../lottie/loading.json')} autoPlay loop />
      </ImageBackground>
    )
  else
    return (
      <ImageBackground source={require('../images/aframe2.jpg')} style={{ flex: 1, alignItems: 'center', backgroundColor: '#000000', paddingTop: '20%', }}>

        <Modal visible={isPasswordResetModalVisable}>
          <View style={{ height: '100%', width: '100%', backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>

            <TextInput  placeholder='e-mail' placeholderTextColor={'white'} value={username} onChangeText={setUsername} style={{ paddingLeft: '5%', alignSelf: 'center', width: '80%', height: Dimensions.get('screen').height * 0.06, borderColor: 'grey', borderWidth: 0, borderRadius: 10, color: 'white', backgroundColor: 'rgba(143,134,123,0.6)', marginTop: '0%',}} />

            <TouchableOpacity
              style={{ flexDirection: 'row', width: '80%', height: Dimensions.get('screen').height * 0.06, backgroundColor: 'rgba(139,90,64,0.6)', justifyContent: 'center', alignItems: 'center', borderRadius: 10, marginTop: '5%' }}
              onPress={() => {
                //onGoogleButtonPress().then(() => console.log('Signed in with Google!'))
                if (username) {
                  resetPassword(username)

                }
                else alert('Email boşdur')
              }}>
              {/*<Image style={{ width: '7%', height: '55%', borderColor: 'black', borderWidth: 0, marginRight: '5%' }} source={require('../images/google.png')} />*/}
              <Text style={{ color: 'white', borderColor: 'black', borderWidth: 0, marginRight: '5%' }}>Şifrəmi yenilə</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ flexDirection: 'row', width: '80%', height: Dimensions.get('screen').height * 0.06, backgroundColor: 'rgba(139,90,64,0.6)', justifyContent: 'center', alignItems: 'center', borderRadius: 10, marginTop: '5%' }}
              onPress={() => {
                setIsPasswordResetModalVisable(false)
              }}>
              <Text style={{ color: 'white', borderColor: 'black', borderWidth: 0, marginRight: '5%' }}>Bağla</Text>
            </TouchableOpacity>

          </View>
        </Modal>
        <View style={{ height: '25%', marginTop: '5%' }}>
          <Image style={{ width: 60, height: 60, borderWidth: 0, borderColor: 'red' }} source={require('../images/logo.png')} />

        </View>
        {/*<LottieView style={{ width: 150, height: 150, position: 'absolute', top: '14%' }} source={require('../lottie/santa.json')} autoPlay loop />*/}
        { /*<LottieView style={{ width: 350, height: 250, position: 'absolute', top: '3%' }} source={require('../lottie/snow.json')} autoPlay loop />*/}

        <TextInput placeholder='e-mail' placeholderTextColor={'white'} value={username} onChangeText={setUsername} style={{ paddingLeft: '5%', alignSelf: 'center', width: '80%', height: Dimensions.get('screen').height * 0.06, borderColor: 'grey', borderWidth: 0, borderRadius: 2, color: 'black', backgroundColor: 'rgba(237, 237, 237, 0.2)', borderColor: 'grey', borderWidth: 0.3, marginTop: '0%', color:'white' }} />
        <TextInput secureTextEntry={true} placeholder='şifrə' placeholderTextColor={'white'} value={password} onChangeText={setPassword} style={{ paddingLeft: '5%', alignSelf: 'center', width: '80%', height: Dimensions.get('screen').height * 0.06, borderColor: 'grey', borderWidth: 0, borderRadius: 2, color: 'black', marginTop: '5%', backgroundColor: 'rgba(237, 237, 237, 0.4)', borderWidth: 0.3, color:'white' }} />

        {/*<View style={{ height: '7%', width: '70%', backgroundColor: 'white', borderRadius: 10, marginTop: "5%" }}>
        <TextInput style={{ paddingLeft: '7%' }} />
      </View>*/}
        <TouchableOpacity
          style={{ flexDirection: 'row', width: '80%', height: Dimensions.get('screen').height * 0.06, backgroundColor: 'rgba(92, 92, 92, 0.7)', justifyContent: 'center', alignItems: 'center', borderRadius: 10, marginTop: '5%' }}
          onPress={() => {
            //onGoogleButtonPress().then(() => console.log('Signed in with Google!'))
            if (username && password) {
              onEmailAndPasswordButtonPress(username, password)

            }
            else alert('Şifrə və ya Email boşdur')
          }}>
          {/*<Image style={{ width: '7%', height: '55%', borderColor: 'black', borderWidth: 0, marginRight: '5%' }} source={require('../images/google.png')} />*/}
          <Text style={{ color: 'white', borderColor: 'black', borderWidth: 0, marginRight: '5%' }}>Giriş</Text>
        </TouchableOpacity>

        {/*<TouchableOpacity
        style={{ flexDirection: 'row', width: '80%', height: Dimensions.get('screen').height * 0.05, backgroundColor: '#e8e8e8', justifyContent: 'center', alignItems: 'center', borderRadius: 10, marginTop: '5%' }}
        onPress={() => {
          onGoogleButtonPress().then(() => console.log('Signed in with Google!'))
          //onEmailAndPasswordButtonPress(username, password)
        }}>
        <Image style={{ width: '7%', height: '65%', borderColor: 'black', borderWidth: 0, marginRight: '3%', }} source={require('../images/google.png')} />
        <Text style={{ color: 'black', fontWeight: 'bold', borderColor: 'black', borderWidth: 0, marginRight: '10%' }}>Google ilə giriş</Text>
      </TouchableOpacity>*/}

        <TouchableOpacity
          style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: '2%' }}
          onPress={() => {
            navigation.navigate('SignUp')
          }}>
          <Text style={{ color: 'white', borderColor: 'black', borderWidth: 0, marginRight: '5%' }}>Hesabınız yoxdur?  <Text style={{ color: '#f4be8b' }}>Hesab oluşdurun</Text></Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: '2%' }}
          onPress={() => {
            setIsPasswordResetModalVisable(true)
          }}>
          <Text style={{ color: 'white', borderColor: 'black', borderWidth: 0, marginRight: '5%' }}>Şifrəni unutmusunuz?</Text>
        </TouchableOpacity>
      </ImageBackground>
    )
}