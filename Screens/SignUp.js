import { View, Text, TouchableOpacity, TextInput, Image, ScrollView, Dimensions, Modal } from 'react-native'
import React, { useState, } from 'react'
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import firestore from '@react-native-firebase/firestore';
import LottieView from 'lottie-react-native';
import Icon3 from 'react-native-vector-icons/Ionicons';


GoogleSignin.configure({
    webClientId: '367763978556-0oa45f7ht5354lal0d4rqr8jpsnaj4ju.apps.googleusercontent.com',
});

export default function SignUp({ navigation }) {

    const [isModalVisable, setIsModalVisable] = useState(false)

    const register = (email, password) => {
        auth()
            .createUserWithEmailAndPassword(email, password)
            .then((arg) => {
                uploadLandLord(phone, email.toLowerCase(), arg.user.uid, nameLastName)
                console.log('User account created & signed in!', arg);
            })
            .catch(error => {
                if (error.code === 'auth/email-already-in-use') {
                    console.log('That email address is already in use!');
                    alert('Siz artıq qeydiyyatdan keçmisiniz')
                }

                if (error.code === 'auth/invalid-email') {
                    console.log('That email address is invalid!');
                    alert('E-mail adres düzgün yazılmamışdır!')

                }

                console.error('Error WW', error);
                alert(error)
            });
    }

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


    const uploadLandLord = (phone, email, id, name) => {

        firestore()
            .collection('LandLords')
            .add({
                refCode: refCode ? refCode : '0',
                contactNumber: phone,
                landLordEmail: email,
                landLordId: id,
                landLordName: name,
                listings: []


            })
            .then(() => {
                console.log('Landlord added!');
                setIsModalVisable(false)
            });
    }


    const [email, setEmail] = useState('')
    const [refCode, setRefCode] = useState('')
    const [aggreed, setAggreed] = useState(false)
    const [password, setPassword] = useState('')
    const [passwordRepeat, setPasswordRepeat] = useState('')
    const [phone, setPhone] = useState('')
    const [nameLastName, setLastName] = useState('')
    // const [fatherName, setFatherName] = useState('')
    const [height, setHeight] = useState(100)



    return (
        <View style={{ width: '100%', height: '100%', backgroundColor: '#F2F2F2', borderColor: 'yellow', borderWidth: 0, justifyContent: 'space-between', alignItems: 'center' }}>

            <Modal visible={isModalVisable}>


                <LottieView style={{ width: 50, height: 50 }} source={require('../lottie/loading2.json')} autoPlay loop />

            </Modal>

            <View style={{ width: '100%', height: '89%', borderWidth: 0, borderColor: 'red', justifyContent: 'center' }}>

                <ScrollView style={{ paddingTop: 40, paddingBottom: 40, borderWidth: 0, borderColor: 'white', }} contentContainerStyleStyle={{ width: '100%', justifyContent: 'center', alignItems: 'center', }}>
                    <Image style={{ marginTop: 20, alignSelf: 'center', width: 60, height: 60, borderWidth: 0, borderColor: 'red' }} source={require('../images/logoBlack.png')} />

                    <TextInput placeholder='e-mail *' placeholderTextColor={'grey'} value={email} onChangeText={setEmail} style={{ paddingLeft: 15, alignSelf: 'center', width: '80%', height: Dimensions.get('screen').height * 0.06, borderColor: 'grey', borderWidth: 0.6, borderRadius: 10, color: 'grey', marginTop: 30 }} />
                    <TextInput placeholder='ad soyad *' placeholderTextColor={'grey'} value={nameLastName} onChangeText={setLastName} style={{ paddingLeft: 15, alignSelf: 'center', width: '80%', height: Dimensions.get('screen').height * 0.06, borderColor: 'grey', borderWidth: 0.6, borderRadius: 10, color: 'grey', marginTop: '5%' }} />
                    {/* <TextInput placeholder='ata adı *' placeholderTextColor={'grey'} value={fatherName} onChangeText={setFatherName} style={{ paddingLeft: 15, alignSelf: 'center', width: '80%', height: Dimensions.get('screen').height * 0.06, borderColor: 'grey', borderWidth: 0.6, borderRadius: 10, color: 'grey', marginTop: '5%' }} />*/}
                    <TextInput placeholder='əlaqə nömrəsi *' placeholderTextColor={'grey'} value={phone} onChangeText={setPhone} style={{ paddingLeft: 15, alignSelf: 'center', width: '80%', height: Dimensions.get('screen').height * 0.06, borderColor: 'grey', borderWidth: 0.6, borderRadius: 10, color: 'grey', marginTop: '5%' }} />
                    <TextInput secureTextEntry={true} placeholder='şifrə *' placeholderTextColor={'grey'} value={password} onChangeText={setPassword} style={{ paddingLeft: 15, alignSelf: 'center', width: '80%', height: Dimensions.get('screen').height * 0.06, borderColor: 'grey', borderWidth: 0.6, borderRadius: 10, color: 'grey', marginTop: '5%' }} />
                    <TextInput secureTextEntry={true} placeholder='təkrar şifrə *' placeholderTextColor={'grey'} value={passwordRepeat} onChangeText={setPasswordRepeat} style={{ paddingLeft: 15, alignSelf: 'center', width: '80%', height: Dimensions.get('screen').height * 0.06, borderColor: 'grey', borderWidth: 0.6, borderRadius: 10, color: 'white', marginTop: '5%' }} />
                    <TextInput placeholder='referal kod  (istəyə bağlı)' placeholderTextColor={'grey'} value={refCode} onChangeText={setRefCode} style={{ paddingLeft: 15, alignSelf: 'center', width: '80%', height: Dimensions.get('screen').height * 0.06, borderColor: 'grey', borderWidth: 0.6, borderRadius: 10, color: 'white', marginTop: '5%' }} />




                    <View style={{ marginTop: 15, marginBottom: 50, flexDirection: 'row', width: '100%', height: height, borderColor: 'red', borderWidth: 0, paddingLeft: 10, paddingRight: '7%' }}>

                        <TouchableOpacity
                            style={{ marginLeft: '7%', marginRight: 5 }}
                            onPress={() => {
                                setAggreed(!aggreed)
                            }}>
                            {
                                aggreed ? <Icon3 name="radio-button-on" size={30} color="green" /> : <Icon3 name="radio-button-off" size={30} color="red" />
                            }


                        </TouchableOpacity>

                        {height == 100 ?
                            <View style={{ width: '80%', borderWidth: 0, borderColor: 'orange' }}>
                                <Text style={{ color: 'grey', fontSize: 13 }}>
                                    Xidmət sahəsi.
                                    Qafqaz Homes, istifadəçilərinə səyahət, gecələmə (otellər, kirayə evlər və s.)  ...
                                </Text>

                                {height == 100 ?
                                    <TouchableOpacity style={{ alignSelf: 'flex-end', marginBottom: 0, borderColor: 'red', borderWidth: 0 }} onPress={() => setHeight(500)}>

                                        <Text style={{ color: 'blue' }}>Ətraflı Oxu</Text>
                                    </TouchableOpacity>
                                    : null
                                }
                            </View>


                            :
                            <View style={{ width: '100%', paddingLeft: 0, paddingRight: '15%', mpaddingBottom: 20, borderColor: 'red', borderWidth: 0, paddingBottom: 0 }}>

                                <Text style={{ color: 'grey', fontSize: 13 }}>

                                    Xidmət sahəsi.
                                    Qafqaz Homes, istifadəçilərinə səyahət, gecələmə (otellər, kirayə evlər və s.), turlar, transport və bütün səyahət xidmətlərinin təqdim edildiyi bir axtarış və rezervasiya platformasıdır.
                                    Xidmət şərtləri.
                                    1.1 Şərtlər vaxtaşırı dəyişdirilə bilər və bu təqdim edilən bütün xidmətlərimizə şamil edilir.
                                    1.2 Tətbiqimizi istifadə edərkən bu şərt və qaydaları, buna əlavə olaraq gizlilik siyasətini və şərtlərini oxuduğunuzu, başa düşdüyünüzü və qəbul etdiyinizi təsdiq etmiş edirsiniz.
                                    Xidmətlər və müqavilə.
                                    2.1 Qafqaz Homes tətbiqində, Qafqaz Homes sistemi üzərindən səyahət, gecələmə gecələmə (otellər, kirayə evlər və s.), turlar, transport və bütün səyahət xidmətlərini axtarmaq və rezerv etmək mümkündür.
                                    2.2 Əlavə olaraq istifadəçilərimiz otellər, kirayə evlər, turlar transport və bütün səyahət xidmətlərini rezervasiya etmə ilə birbaşa əlaqə saxlamaq imkanına sahibdirlər. Rezervasiya birbaşa Qafqaz Homes vasitəsi ilə edilir və bütün xidmətlər sizə təqdim edilir. İstifadəçilər, bütün səyahət xidmətlərini təqdim edən şəxslərin mərkəzlərini rezervasiya edərkən səyahət xidmətlərini təqdim edən şəxslərin bütün şərt və qaydalarına tabe olacaqlarını qəbul edirlər və bu səbəbdən İstifadəçi ilə Qafqaz Homes arasında heç bir müqavilə bağlanmaz.
                                </Text>
                                {height == 500 ?
                                    <TouchableOpacity style={{ alignSelf: 'flex-end', marginRight: '8%' }} onPress={() => setHeight(100)}>

                                        <Text style={{ color: 'blue' }}>Qısalt</Text>
                                    </TouchableOpacity>
                                    : null
                                }
                            </View>


                        }



                    </View>


                </ScrollView>

            </View>

            <View style={{ width: '100%', height: '10%', borderColor: 'red', borderWidth: 0 }}>




                <TouchableOpacity
                    style={{ borderColor: 'red', alignSelf: 'center', flexDirection: 'row', width: '80%', height: Dimensions.get('screen').height * 0.05, backgroundColor: '#e8e8e8', justifyContent: 'center', alignItems: 'center', borderRadius: 10, marginTop: 5, borderColor: 'red', borderWidth: 0 }}
                    onPress={() => {
                        //console.log(aggreed, email, nameLastName, fatherName, phone, password, passwordRepeat)
                        if (!aggreed || !email || !nameLastName || !phone || !password || !passwordRepeat)
                            alert('Bütün xanalar doldurulmalıdır')
                        else register(email, password)
                    }}>
                    <Text style={{ color: 'black', fontWeight: 'bold', borderColor: 'black', borderWidth: 0, marginRight: '5%' }}>Qeyd Ol</Text>
                </TouchableOpacity>



            </View>

        </View>
    )
}


