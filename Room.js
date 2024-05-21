import { View, Text, FlatList, TouchableOpacity, Dimensions, Image, TextInput, SafeAreaView, ScrollView, BackHandler } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useIsFocused } from "@react-navigation/native";
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Modal from "react-native-modal";
import Icon from 'react-native-vector-icons/Entypo';
import Icon2 from 'react-native-vector-icons/AntDesign';
import Icon4 from 'react-native-vector-icons/FontAwesome6';
import DropDownPicker from 'react-native-dropdown-picker';
import RadioGroup from 'react-native-radio-buttons-group';
import LottieView from 'lottie-react-native';
import { BackAndroid } from 'react-native';
import MapView, { MapMarker } from 'react-native-maps';
import Icon3 from 'react-native-vector-icons/Ionicons';
import Icon5 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon6 from 'react-native-vector-icons/MaterialIcons';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

export default function Room({ route, navigation }) {

    const focus = useIsFocused();


    const [selectedWifiId, setSelectedWifiId] = useState(null);
    const wifiRadioButtons = [
        {
            id: '1', // acts as primary key, should be unique and non-empty string
            label: 'Var',
            value: true
        },
        {
            id: '2',
            label: 'Yox',
            value: false
        }
    ];

    const [selectedACId, setSelectedACId] = useState(null);
    const ACRadioButtons = [
        {
            id: '1', // acts as primary key, should be unique and non-empty string
            label: 'Var',
            value: true
        },
        {
            id: '2',
            label: 'Yox',
            value: false
        }
    ];

    const [selectedBBQId, setSelectedBBQId] = useState(null);
    const BBQRadioButtons = [
        {
            id: '1', // acts as primary key, should be unique and non-empty string
            label: 'Var',
            value: true
        },
        {
            id: '2',
            label: 'Yox',
            value: false
        }
    ];


    const [isLoading, setIsLoading] = useState(false)
    const [customerBalance, setCustomerBalance] = useState(0)


    const [landLord, setLandLord] = useState('')
    const [homesList, setHomesList] = useState([])
    const [isModalVisable, setIsModalVisable] = useState(false)
    const [isViewModalVisable, setIsViewModalVisable] = useState(false)
    const [selectedImagesArray, setSelectedImagesArray] = useState([null, null, null, null, null, null]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedListingId, setSelectedListingId] = useState();
    const [selectedListing, setSelectedListing] = useState();
    const [selectedListingForViewing, setSelectedListingForViewing] = useState();

    const [isBeingEdited, setIsBeingEdited] = useState(false)
    const [title, setTitle] = useState('')
    const [price, setPrice] = useState('')
    const [details, setDetails] = useState('')
    const [roomCount, setRoomCount] = useState('')


    const [openType, setOpenType] = useState(false);
    const [valueType, setValueType] = useState(null);
    const [typeItems, setTypeItems] = useState([
        { label: 'Sadə', value: 'simple' },
        { label: 'Hovuzlu', value: 'triangle' },
        { label: 'VIP', value: 'vip' },
        { label: 'A Frame', value: 'aframe' },
        { label: 'Hoteller', value: 'hotel' },
        { label: 'Mənzillər', value: 'apt' },
    ]);


    const openImagePicker = (index) => {
        const options = {
            quality: 0.5,
            mediaType: 'photo',
            includeBase64: true,
            maxHeight: 300,
            maxWidth: 300,
        };

        launchImageLibrary(options, (response) => {
            let tempSelectedImagesArray = [...selectedImagesArray];
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('Image picker error: ', response.error);
            } else {
                let imageUri = response.uri || response.assets[0].base64;
                imageUri = 'data:image/jpeg;base64,' + imageUri
                setSelectedImage(imageUri);
                tempSelectedImagesArray[index] = imageUri
                setSelectedImagesArray(tempSelectedImagesArray)
            }
            //console.log('RESPONSE', response.assets[0].base64)
            //console.log('RESPONSE ARAY', selectedImagesArray[0])

        });
    };


    const user = auth().currentUser;


    const fetchData = async (arg) => {
        console.log('FETCH DATA STARTED....')
        setIsLoading(true)

        firestore().collection(arg).where('landLordEmail', '==', user.email).get().then(querySnapshot => {
            //let tempHomesList = []

            // console.log('INSIDE FETCH DATA....', querySnapshot.docs[0]._data)

            querySnapshot.forEach(documentSnapshot => {

                // documentSnapshot.data()['listingId'] = documentSnapshot.id
                //  tempHomesList.push(documentSnapshot.data())
                //setHomesList(documentSnapshot.data())

            });


            //  setHomesList(tempHomesList)



        }).finally(() => {
            setIsLoading(false)
            setIsModalVisable(false)


        });


    }
    const [balanceShown, setBalanceShown] = useState(false)

    const fetchLandLordData = async () => {
        console.log('FETCH LANDLORD DATA STARTED....')
        setIsLoading(true)

        firestore().collection('LandLords').where('landLordEmail', '==', user.email).get().then(querySnapshot => {

            querySnapshot.forEach(documentSnapshot => {
                console.log('FFFFFFFFFFFF....', documentSnapshot.data())

                setLandLord(documentSnapshot.data())
            });


        }).finally(() => {
            setIsLoading(false)
        });


    }


    const borderWidth = 0;

    {/* const uploadListing = (title, price, imgArray, details, wifi, bbq, ac, roomCount) => {
        console.log('HHHHHHHHHHHHHHHH')

        firestore()
            .collection('Listings')
            .add({
                title: title,
                price: price,
                imgArray: imgArray,
                details: details,
                landLordEmail: user.email,
                categoryName: valueType,
                bookedDates: '00-00-0000',
                lat: null,
                lon: null,
                page: 1,
                isWiFiAvailable: wifi == '1' ? true : false,
                isACAvailable: ac == '1' ? true : false,
                isBBQAvailable: bbq == '1' ? true : false,
                roomCount: roomCount

            })
            .then(() => {
                console.log('Listing added!');
               // fetchData('Listings')
                setIsModalVisable(false)
            });
    }

    const updateListing = (selectedListing) => {
        console.log('HHHHHHHHHHHHHHHH', selectedImagesArray.length)

        firestore().collection('Listings').doc(selectedListing.item.listingId)
            .update({
                title: selectedListing.item.title,
                price: selectedListing.item.price,
                imgArray: selectedImagesArray,
                details: selectedListing.item.details,
                landLordEmail: user.email
            })
            .then(() => {
                console.log('Listing updated!');
                setPrice('')
                setTitle('')
                fetchData('Listings')
            });
    }


    const deleteListing = (selectedListing) => {
        console.log('HHHHHHHHHHHHHHHH', selectedImagesArray.length)

        firestore().collection('Listings').doc(selectedListing.item.listingId)
            .delete()
            .then(() => {
                console.log('Listing deleted!');
                //  setPrice('')
                //setTitle('')
                fetchData('Listings')
            });
    }
*/}
    const [balanceIsLoading, setBalanceIsLoading] = useState(true)

    const calculateBalance = async () => {
        console.log('CALCULATE BALANCE STARTED.....')
        setBalanceIsLoading(true)
        let tempBalance = 0;
        firestore().collection('Rezervations').where('landLordEmail', '==', user.email).where('cancelled', '==', false).get().then(querySnapshot => {
            console.log('INSIDE CALCULATE BALANCE STARTED.....', querySnapshot.docs)

            querySnapshot.forEach(documentSnapshot => {
                console.log('BOOKED DATES...', documentSnapshot._data.bookedDate)
                console.log('PRICE BOOKED AT...', documentSnapshot._data.priceBookedAt)
                if (!documentSnapshot._data.paid && documentSnapshot._data.priceBookedAt) {
                    tempBalance = tempBalance + documentSnapshot._data.bookedDate.length * documentSnapshot._data.priceBookedAt

                }
                //documentSnapshot._data

            });

        }).finally(() => {
            let tempSevenPercentage = tempBalance * 6 / 100
            console.log('THIS IS BALANCE: ', tempSevenPercentage)
            setCustomerBalance(tempSevenPercentage)
            setBalanceIsLoading(false)

            setIsLoading(false)
            // setIsModalVisable(false)

        });
        return
        firestore().collection('Balances').where('landLordEmail', '==', user.email).get().then(querySnapshot => {

            querySnapshot.forEach(documentSnapshot => {
                console.log('TTTTTTTTTTTTTTTTTTTT', documentSnapshot._data.balance)
                setCustomerBalance(documentSnapshot._data.balance)
                //documentSnapshot._data
            });

        }).finally(() => {
            setIsLoading(false)
            // setIsModalVisable(false)

        });
    }




    const editProfile = async () => {
        setIsLoading(true)
        firestore()
            .collection('LandLords')
            .where('landLordEmail', '==', user.email).get().then((querySnapshot) => {
                //console.log('ID IS', querySnapshot._docs[0])
                console.log('IIIIID IS', querySnapshot._docs[0]._data)

                let tempToBeModified = querySnapshot._docs[0]._data.listings
                //  tempToBeModified.push(addedListing.id)
                firestore().collection('LandLords').doc(querySnapshot._docs[0].id)
                    .update({
                        landLordName: name,
                        contactNumber: phone,

                    }).then(() => {
                        setIsLoading(false)
                        alert('Profil dəyişiklikləri qeyd olundu')

                    }).catch(e => {
                        setIsLoading(false)
                        console.log('EEEE is ', e)
                        alert('error is ', e)
                    })


            })
    }

    const [profileEditModalVisible, setProfileEditModalVisible] = useState(false)
    const [email, setEmail] = useState(user ? user.email : '')
    const [name, setName] = useState(landLord && landLord.landLordName ? landLord.landLordName : 'jfdjf')
    const [phone, setPhone] = useState('')
    useEffect(() => {
        //console.log('THIS IS USE EFFECT')
        // fetchData('Listings')
    }, [])

    useEffect(() => {
        if (focus == true) { // if condition required here because it will call the function even when you are not focused in the screen as well, because we passed it as a dependencies to useEffect hook
            // console.log('THIS IS ITTT!!!!!!')
            // fetchData('Listings')
            fetchLandLordData()

        }
    }, [focus])

    useEffect(() => {
        if (focus == true) { // if condition required here because it will call the function even when you are not focused in the screen as well, because we passed it as a dependencies to useEffect hook
            console.log('THIS IS 3rd useeffect!!!!!!')
            setIsLoading(true)
            calculateBalance();


        }
    }, [focus])



    let _pickedLocation = route.params && route.params.pickedLocation ? route.params.pickedLocation : null


    useEffect(() => {
        console.log("BACK HANDLER USE EFFECT")
        //BackAndroid.addEventListener('hardwareBackPress', () => {return true});

    }, [])

    useEffect(() => {
        console.log('THIS IS USEEFFECT COMINGFROM ADDLISTING IN ROOM...', route.params,)
        if (route.params && route.params.comingFrom == 'AddListing') {
            route.params = null
            const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
            return () => backHandler.remove()
        }

    }, [])



    if (!isLoading)
        return (
            <SafeAreaView style={{ flex: 1, alignItems: 'center', backgroundColor: 'white' }}>
                <Modal coverScreen avoidKeyboard animationIn={'slideInUp'} style={{ backgroundColor: 'white', flex: 1 }} visible={isViewModalVisable}>

                    <View style={{ alignItems: 'center', width: '100%', height: '100%', borderColor: 'red', borderWidth: borderWidth, }}>

                        <Image
                            style={{
                                width: Dimensions.get('screen').width * 0.5,
                                height: Dimensions.get('screen').width * 0.5,
                                borderTopRightRadius: 5,
                                borderTopLeftRadius: 5,
                                borderLeftWidth: 0,
                                borderRightWidth: 0,
                                borderColor: 'red'
                            }}
                            source={{ uri: selectedListingForViewing && selectedListingForViewing.imgArray[0] ? selectedListingForViewing.imgArray[0] : 'https://picsum.photos/id/237/200/300' }} />


                        <Text style={{ fontWeight: 'bold' }}>{selectedListingForViewing ? selectedListingForViewing.title : null}</Text>
                        <View>
                            <Text>Rezerv olunmuş tarixlər:</Text>
                        </View>
                        <View style={{}}>
                            {selectedListingForViewing ? selectedListingForViewing.bookedDates.map((arrayItem, index) => {
                                if (arrayItem != '00-00-0000')
                                    return (
                                        <Text key={index} style={{ color: 'blue' }}>{arrayItem}   </Text>
                                    )
                            }) : null}
                        </View>


                        <TouchableOpacity style={{ backgroundColor: 'red', width: '60%', justifyContent: 'center', alignItems: 'center', borderRadius: 5, paddingTop: '1%', paddingBottom: '1%', marginTop: '5%' }} onPress={() => {
                            setIsViewModalVisable(false)
                        }}>
                            <Text style={{ color: 'white' }}>Tamam</Text>
                        </TouchableOpacity>
                    </View>



                </Modal>

                <Modal avoidKeyboard animationIn={'slideInUp'} style={{ backgroundColor: 'white', }} visible={profileEditModalVisible}>

                    <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', borderColor: 'red', borderWidth: borderWidth, }}>

                        <View style={{ width: '100%', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                            <Text>Email: </Text>
                            <View style={{ justifyContent: 'center', alignSelf: 'center', width: '80%', height: Dimensions.get('screen').height * 0.06, borderColor: 'grey', borderWidth: 0.2, borderRadius: 3, color: 'grey', backgroundColor: 'white', marginTop: '0%', }}>
                                <Text style={{ paddingLeft: '5%', }}>{user.email}</Text>

                            </View>
                        </View>

                        <View style={{ width: '100%', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                            <Text>Ad: </Text>
                            <TextInput value={name} onChangeText={setName} style={{ paddingLeft: '5%', alignSelf: 'center', width: '80%', height: Dimensions.get('screen').height * 0.06, borderColor: 'grey', borderWidth: 0.2, borderRadius: 3, color: 'grey', backgroundColor: 'white', marginTop: '0%', }} />
                        </View>

                        <View style={{ width: '100%', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                            <Text>Tel: </Text>
                            <TextInput value={phone} onChangeText={setPhone} style={{ paddingLeft: '5%', alignSelf: 'center', width: '80%', height: Dimensions.get('screen').height * 0.06, borderColor: 'grey', borderWidth: 0.2, borderRadius: 3, color: 'grey', backgroundColor: 'white', marginTop: '0%', }} />
                        </View>





                        <TouchableOpacity style={{ backgroundColor: 'green', width: '60%', justifyContent: 'center', alignItems: 'center', borderRadius: 5, paddingTop: '1%', paddingBottom: '1%', marginTop: '10%' }} onPress={() => {
                            editProfile()
                        }}>
                            <Text style={{ color: 'white' }}>Yadda saxla</Text>
                        </TouchableOpacity>


                        <TouchableOpacity style={{ backgroundColor: 'green', width: '60%', justifyContent: 'center', alignItems: 'center', borderRadius: 5, paddingTop: '1%', paddingBottom: '1%', marginTop: '10%' }} onPress={() => {
                            setProfileEditModalVisible(false)
                        }}>
                            <Text style={{ color: 'white' }}>Geri</Text>
                        </TouchableOpacity>
                    </View>



                </Modal>





                <View style={{ height: '100%', width: '100%', borderWidth: 0, borderColor: 'red', }}>

                    <View style={{ borderColor: 'grey', borderWidth: 0, height: '50%', paddingTop: 10, borderRadius: 10 }}>
                        <TouchableOpacity style={{ paddingBottom: 3, paddingTop: 3, marginBottom: 10, marginRight: 10, alignSelf: 'flex-end', backgroundColor: '#5FA65A', alignItems: 'center', paddingLeft: 5, paddingRight: 5, borderRadius: 5 }} onPress={() => {
                            navigation.navigate('AddListing')
                        }}>

                            <Text style={{ color: 'white', fontSize: 12 }}>Yeni elan +</Text>
                        </TouchableOpacity>
                        <View style={{ height: Dimensions.get('screen').width * 0.45, flexDirection: 'row', borderColor: 'orange', borderWidth: 0, width: Dimensions.get('screen').width }}>

                            <View style={{ width: Dimensions.get('screen').width * 0.4, height: Dimensions.get('screen').width * 0.4, justifyContent: 'center', alignItems: 'center', borderRadius: 5, borderTopRightRadius: 0, borderWidth: 1, borderColor: '#E0E0E0', backgroundColor: 'white' }}>
                                <Image style={{ width: 50, height: 50 }} source={require('./images/user.png')}></Image>
                                <View style={{ width: '100%', borderWidth: 0, borderColor: 'red', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginTop: 0, }}>
                                    <Icon2 style={{ marginBottom: 0 }} name="star" size={12} color="#feab00" />
                                    <Icon2 style={{ marginBottom: 0 }} name="star" size={12} color="#feab00" />
                                    <Icon2 style={{ marginBottom: 0 }} name="star" size={12} color="#feab00" />
                                    <Icon2 style={{ marginBottom: 0 }} name="star" size={12} color="#feab00" />
                                    <Icon2 style={{ marginBottom: 0 }} name="star" size={12} color="#feab00" />
                                </View>
                                <Text style={{ fontSize: 12, fontWeight: 'bold', textAlign: 'center', color: '#667A70' }}>{landLord && landLord.landLordName ? landLord.landLordName : null}</Text>
                                <Text style={{ marginLeft: 0, fontSize: 11, marginTop: 0, fontStyle: 'italic' }}>Ref kod: #<Text style={{ fontWeight: "bold" }}>{landLord && landLord.referalCode ? landLord.referalCode : null}</Text></Text>
                                <TouchableOpacity onPress={() => {
                                    setName(landLord && landLord.landLordName ? landLord.landLordName : '')
                                    setEmail(user ? user.email : '')
                                    setPhone(landLord && landLord.contactNumber ? landLord.contactNumber : '')
                                    setProfileEditModalVisible(true)
                                }} style={{ position: 'absolute', top: 5, right: 5 }}>
                                    <Icon style={{ marginBottom: 0 }} name="pencil" size={15} color="#feab00" />

                                </TouchableOpacity>
                            </View>


                            <View style={{ backgroundColor: null, width: Dimensions.get('screen').width * 0.6, }}>

                                {/*
                                 <View style={{ borderColor: 'red', borderWidth: 0, paddingLeft: 10, backgroundColor: '#A0A0A0',  alignItems: 'center', flexDirection: 'row', marginLeft: '0%', width: Dimensions.get('screen').width * 0.5, height: 25 }}>

                                    <Text style={{ color: 'white',  fontSize: 11 }}>Balans:  </Text>
                                    <View style={{ width: 100, borderColor: 'red', borderWidth: 0, }}>

                                        {balanceIsLoading ?
                                            <View style={{ width: '100%', borderWidth: 0, borderColor: 'red' }}>
                                                <LottieView style={{ width: '100%', height: 100 }}
                                                    source={require('./lottie/loading2.json')} autoPlay loop />
                                            </View>

                                            : <View style={{ width: '100%', borderWidth: 0, borderColor: 'red', justifyContent: 'center' }}>
                                                {
                                                    balanceShown ?
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <Text style={{ color: 'white',fontSize:11 }}> {customerBalance} ₼</Text>
                                                            <TouchableOpacity style={{ marginLeft: 20, borderColor: 'red', borderWidth: 0, justifyContent: 'center', alignItems: 'center' }} onPress={() => {
                                                                setBalanceShown(false)
                                                            }}>
                                                                <Icon style={{}} name="eye-with-line" size={11} color="white" />

                                                            </TouchableOpacity>

                                                        </View>

                                                        : <View
                                                            style={{ flexDirection: 'row', borderColor: 'red', borderWidth: 0}}
                                                        >
                                                            <Text style={{ color: 'white', fontSize:10 }}>*** ₼</Text>
                                                            <TouchableOpacity style={{ marginLeft: 30, justifyContent: 'center', alignItems: 'center' }} onPress={() => {
                                                                setBalanceShown(true)
                                                            }}>
                                                                <Icon style={{}} name="eye" size={11} color="white" />

                                                            </TouchableOpacity>

                                                        </View>
                                                }
                                            </View>
                                        }
                                    </View>

                                </View>
                                */}
                                <View style={{ borderColor: 'red', borderWidth: 0, backgroundColor: '#DBDBDB', alignItems: 'center', flexDirection: 'row', width: Dimensions.get('screen').width * 0.6, height: 25, paddingLeft: 10 }}>

                                    <Text style={{ color: 'grey', fontSize: 12, }}>Hesab durumu:  </Text>
                                    <Text style={{ color: '#00CE66', fontSize: 13, marginLeft: 5 }}>aktiv</Text>



                                </View>

                                <View style={{ borderColor: 'red', borderWidth: 0, paddingLeft: 10, alignItems: 'center', flexDirection: 'row', marginLeft: '0%', width: Dimensions.get('screen').width * 0.6, marginTop: 0 }}>
                                    <View style={{ borderColor: 'green', borderWidth: 0, flexDirection: 'row', marginTop: 5 }}>
                                        <Text style={{ color: 'grey', fontStyle: 'italic', fontSize: 12 }}>tel no:  </Text>

                                        <View style={{ width: 100, borderColor: 'red', borderWidth: 0, backgroundColor: '#EFE7AD', paddingLeft: 5, }}>

                                            <Text style={{ fontStyle: 'italic', color: '#7c9ab7', fontSize: 11 }}>
                                                {landLord && landLord.contactNumber ? landLord.contactNumber : null}
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={{ borderColor: 'red', borderWidth: 0, paddingLeft: 10, alignItems: 'center', flexDirection: 'row', marginLeft: '0%', width: Dimensions.get('screen').width * 0.6, marginTop: 0 }}>
                                    <View style={{ borderColor: 'green', borderWidth: 0, flexDirection: 'row', marginTop: 5 }}>
                                        <Text style={{ color: 'grey', fontStyle: 'italic', fontSize: 12 }}>email:  </Text>

                                        <View style={{ borderColor: 'red', borderWidth: 0, backgroundColor: '#EFE7AD', paddingLeft: 5, paddingRight: 5 }}>

                                            <Text style={{ fontStyle: 'italic', color: '#7c9ab7', fontSize: 11 }}>
                                                {landLord && landLord.landLordEmail ? landLord.landLordEmail : null}
                                            </Text>
                                        </View>
                                    </View>
                                </View>


                                {customerBalance > 0 ?
                                    <View style={{ paddingRight: 5, borderColor: 'red', borderWidth: 0, paddingLeft: 10, alignItems: 'center', justifyContent: 'flex-end', alignSelf: 'flex-end', flexDirection: 'row', marginLeft: '0%', width: Dimensions.get('screen').width * 0.5, height: 25, marginTop: 0 }}>

                                        <Text style={{ color: 'grey', fontStyle: 'italic', fontSize: 9, }}>komissiya:  </Text>
                                        <View style={{ borderColor: 'red', borderWidth: 0, }}>

                                            <Text style={{ color: 'grey', fontSize: 9 }}>
                                                {landLord ? customerBalance : '0'}
                                            </Text>
                                        </View>

                                    </View> : null

                                }

                                {customerBalance > 0 ?

                                    <View style={{ paddingRight: 5, borderColor: 'red', borderWidth: 0, paddingLeft: 10, alignItems: 'center', justifyContent: 'flex-end', alignSelf: 'flex-end', flexDirection: 'row', marginLeft: '0%', width: Dimensions.get('screen').width * 0.5, height: 25, marginTop: 0 }}>

                                        <Text style={{ color: 'green', fontStyle: 'italic', fontSize: 9 }}>endirim:  </Text>
                                        <View style={{ borderColor: 'red', borderWidth: 0, }}>

                                            <Text style={{ color: 'green', fontWeight: 'bold', fontSize: 9 }}>
                                                {landLord ? customerBalance : ''}
                                            </Text>
                                        </View>

                                    </View>
                                    : null}

                                {customerBalance > 0 ?

                                    <View style={{ paddingRight: 5, borderColor: 'red', borderWidth: 0, paddingLeft: 10, alignItems: 'center', justifyContent: 'flex-end', alignSelf: 'flex-end', flexDirection: 'row', marginLeft: '0%', width: Dimensions.get('screen').width * 0.5, height: 25, marginTop: 0 }}>

                                        <Text style={{ color: 'grey', fontStyle: 'italic', fontSize: 9, fontWeight: 'bold' }}>yekun borc:  </Text>
                                        <View style={{ borderColor: 'red', borderWidth: 0, }}>

                                            <Text style={{ color: 'grey', fontWeight: 'bold', fontSize: 9 }}>
                                                {landLord ? customerBalance - customerBalance : ''}
                                            </Text>
                                        </View>

                                    </View>
                                    : null}

                            </View>



                        </View>






                        <View style={{ height: Dimensions.get('screen').width * 0.7, borderWidth: 0, borderColor: 'green' }}>









                        </View>

                    </View>


                    <View style={{ borderColor: 'grey', borderWidth: 0.2, height: '30%', paddingTop: 5, borderRadius: 2, width: '95%', alignSelf: "center", paddingRight:8, paddingLeft:8 }}>
                        <Text style={{ alignSelf: 'center', fontSize: 12, fontWeight: 'bold', }}>Qafqaz Homes<Text style={{ fontWeight: 'normal' }}> tərəfindən göndərilən bildirişlər</Text></Text>
                        
                        
                        {/*<Text style={{ color: '#E5E5E5', fontSize: 19, alignSelf: "center", marginTop: 50 }}>Bildirişiniz yoxdur</Text>*/}
                        <Text style={{ color: 'grey', fontSize: 13, marginTop: 50 }}>Hal hazırki qiymətlər yay mövsümünə və bayram günlərinə aid deyil.</Text>
                        {landLord.listings && landLord.listings.length>0?<Text style={{ color: 'grey', fontSize: 13,   marginTop: 5 }}>Zəhmət olmasa, eviniz haqqında məlumatları dəqiqləşdirin.</Text>:null}


                    </View>

                    <View style={{ position: 'absolute', paddingTop: 5, paddingBottom: 5, backgroundColor: '#E8E8E8', width: Dimensions.get('screen').width, bottom: 0, flexDirection: 'row', justifyContent: 'space-between', }}>

                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate('Rezervations')
                            }} style={{ width: '33%', justifyContent: 'center', alignItems: 'center' }}>
                            <Icon5 style={{ marginBottom: 0 }} name="clipboard-list" size={20} color="#667A70" />
                            <Text style={{ fontSize: 12, color: '#667A70' }}>
                                Rezervasiyalarım
                            </Text>
                        </TouchableOpacity>
                        {landLord.listings && landLord.listings.length > 0 ?
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.navigate('Orders')
                                }} style={{ width: '33%', justifyContent: 'center', alignItems: 'center' }}>
                                <Icon3 style={{ marginBottom: 0 }} name="notifications" size={20} color="#667A70" />
                                <Text style={{ fontSize: 12, color: '#667A70' }}>
                                    Sifarişlərim
                                </Text>
                            </TouchableOpacity>
                            : null}

                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate('MyListings')
                            }}
                            style={{ width: '33%', justifyContent: 'center', alignItems: 'center' }}>
                            <Icon6 style={{ marginBottom: 0 }} name="featured-play-list" size={20} color="#667A70" />
                            <Text style={{ fontSize: 12, color: '#667A70' }}>
                                Elanlarım
                            </Text>
                        </TouchableOpacity>

                    </View>

                </View>



                <View style={{ height: '15%', width: '100%', borderWidth: 0, borderColor: 'red' }}>





                </View>







            </SafeAreaView>
        )
    else return (
        <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <LottieView style={{ width: 50, height: 50 }} source={require('./lottie/loading.json')} autoPlay loop />
        </View>
    )
}