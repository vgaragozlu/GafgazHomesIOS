import { View, Text, FlatList, TouchableOpacity, Dimensions, Image, TextInput, SafeAreaView, ScrollView, BackHandler } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useIsFocused } from "@react-navigation/native";
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Modal from "react-native-modal";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DropDownPicker from 'react-native-dropdown-picker';
import RadioGroup from 'react-native-radio-buttons-group';
import LottieView from 'lottie-react-native';
import { BackAndroid } from 'react-native';
import MapView, { MapMarker } from 'react-native-maps';
import { Calendar } from 'react-native-calendars';

export default function MyListings({ route, navigation }) {

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


    const [fullDatesCalendarViewVisable, setFullDatesCalendarViewVisable] = useState(false)
    const [isLoading, setIsLoading] = useState(false)


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

        firestore().collection(arg).where('landLordEmail', '==', user.email).where('deactivated', '==', false).get().then(querySnapshot => {
            let tempHomesList = []

            console.log('INSIDE FETCH DATA....', querySnapshot.size)

            querySnapshot.forEach(documentSnapshot => {

                documentSnapshot.data()['listingId'] = documentSnapshot.id
                tempHomesList.push(documentSnapshot.data())
                //setHomesList(documentSnapshot.data())

            });


            setHomesList(tempHomesList)



        }).finally(() => {
            setIsLoading(false)
            setIsModalVisable(false)


        });


    }

    const [datesArray, setDatesArray] = useState([])

    const populateCalendar = async (datesArray) => {


        console.log('POPULATING CALENDAR')
        let temp = markedDates;

        datesArray.map((item, index) => {
            console.log('@', item)
            temp[item] = {
                selected: true, marked: true, selectedColor: 'red', customStyles: {
                    container: {
                        backgroundColor: 'red'
                    }
                }
            }
        })


        setMarkedDates(temp)
    }


    const borderWidth = 0;

    const uploadListing = (title, price, imgArray, details, wifi, bbq, ac, roomCount) => {
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
                fetchData('Listings')
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

    useEffect(() => {
        console.log('THIS IS USE EFFECT')
        fetchData('Listings')
    }, [])

    useEffect(() => {
        if (focus == true) { // if condition required here because it will call the function even when you are not focused in the screen as well, because we passed it as a dependencies to useEffect hook
            console.log('THIS IS ITTT!!!!!!')
            fetchData('Listings')

        }
    }, [focus])



    let _pickedLocation = route.params && route.params.pickedLocation ? route.params.pickedLocation : null

    const [markedDates, setMarkedDates] = useState(
        {

        }
    )

    useEffect(() => {

        //console.log("BACK HANDLER USE EFFECT")
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
            <SafeAreaView style={{ flex: 1, alignItems: 'center' }}>


                <Modal coverScreen avoidKeyboard animationIn={'slideInUp'} style={{ backgroundColor: 'white', flex: 1 }} visible={isViewModalVisable}>

                    <View style={{ alignItems: 'center', width: '100%', height: '100%', borderColor: 'red', borderWidth: 0, }}>

                        <View style={{ height: '20%', width: '100%', flexDirection: 'row', borderColor: 'red', borderWidth: 0, }}>
                            <View>
                                <Image
                                    style={{
                                        width: Dimensions.get('screen').width * 0.35,
                                        height: '100%',
                                        borderTopRightRadius: 5,
                                        borderTopLeftRadius: 5,
                                        borderLeftWidth: 0,
                                        borderRightWidth: 0,
                                        borderColor: 'red'
                                    }}
                                    source={{ uri: selectedListingForViewing && selectedListingForViewing.imgArray[0] ? selectedListingForViewing.imgArray[0] : 'https://picsum.photos/id/237/200/300' }} />

                            </View>



                            <View style={{ paddingLeft: 20 }}>
                                <Text style={{ fontWeight: 'bold' }}>{selectedListingForViewing ? selectedListingForViewing.title : null}</Text>

                                <Text style={{ fontWeight: 'bold' }}>Elan no:</Text>
                                <Text>#{selectedListingForViewing && selectedListingForViewing.listingNumber}</Text>
                            </View>
                        </View>



                        <View style={{ height: '70%', marginTop: '3%' }}>
                            <Text>Dolu tarixlər:</Text>
                            <Calendar
                                style={{ borderWidth: 0, borderColor: 'red' }}
                                markedDates={
                                    markedDates
                                }>

                            </Calendar>
                        </View>

                        {/*  <ScrollView>

                            <View style={{ borderColor: 'red', borderWidth: 0 }}>
                                {selectedListingForViewing ? selectedListingForViewing.bookedDates.map((arrayItem, index) => {
                                    if (arrayItem != '00-00-0000')
                                        return (
                                            <Text key={index} style={{ color: 'blue' }}>{arrayItem}   </Text>
                                        )
                                }) : null}
                            </View>
                        </ScrollView>
*/}
                        <TouchableOpacity style={{ backgroundColor: 'red', width: '60%', justifyContent: 'center', alignItems: 'center', borderRadius: 5, paddingTop: '1%', paddingBottom: '1%', marginTop: '0%' }} onPress={() => {
                            //console.log(selectedListingForViewing)
                            setMarkedDates({})
                            setIsViewModalVisable(false)
                        }}>
                            <Text style={{ color: 'white' }}>Tamam</Text>
                        </TouchableOpacity>
                    </View>



                </Modal>



                <View style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'flex-start', borderWidth: borderWidth, borderColor: 'red' }}>
                    <View style={{alignSelf:'center', width: '100%', backgroundColor: '#6eba73', marginBottom: '3%',marginTop:'3%', paddingTop: '1%', paddingBottom: '1%',  borderRadius: 0, alignItems: 'center' }}>
                        <Text style={{ color: 'white', fontSize:12 }}>Elanlarım</Text>

                    </View>

                    <FlatList numColumns={2} contentContainerStyle={{ alignItems: 'center', borderWidth: borderWidth, borderColor: 'red' }} extraData={homesList} keyExtractor={(item, index) => String(index)}
                        data={homesList}
                        renderItem={
                            (arrayItem) =>
                                <View
                                    style={{
                                        width: Dimensions.get('window').width * 0.5,
                                        height: Dimensions.get('window').width * 0.5,
                                        borderWidth: 0,
                                        borderColor: 'red',
                                        alignItems: 'center',
                                        marginBottom: 30
                                    }}>

                                    <Image
                                        style={{
                                            width: '90%',
                                            height: "70%",
                                            borderTopRightRadius: 5,
                                            borderTopLeftRadius: 5,
                                            borderLeftWidth: 0,
                                            borderRightWidth: 0,
                                            borderColor: 'red'
                                        }}
                                        source={{ uri: arrayItem.item.imgArray[0] }} />


                                    <View
                                        style={{
                                            width: '90%',
                                            height: '30%',
                                            backgroundColor: 'white',
                                            borderColor: 'red',
                                            borderWidth: 0,
                                            paddingLeft: '3%',
                                            paddingTop: '3%'

                                        }}>
                                        <Text
                                            style={{
                                                fontSize: 15,
                                                fontWeight: 'bold',
                                                color: 'black'
                                            }}>
                                            {arrayItem.item.price + ' ₼'}
                                        </Text>

                                        <Text
                                            style={{
                                                fontSize: 15,
                                                fontWeight: 'regular',
                                                color: 'black'
                                            }}>
                                            {arrayItem.item.title}
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => {
                                            // console.log('$$$$$$$$$$$$', arrayItem.item.title)
                                            //console.log('$$$$$$$$$$$$', arrayItem.item.imgArray)
                                            // console.log('$$$$$$$$$$$$', arrayItem.item)
                                            {/*setTitle(arrayItem.item.title)
                                            setPrice(arrayItem.item.price)
                                            setRoomCount(arrayItem.item.roomCount)
                                            setDetails(arrayItem.item.details)
                                            setSelectedACId(arrayItem.item.isACAvailable ? '1' : '0')
                                            setSelectedBBQId(arrayItem.item.isBBQAvailable ? '1' : '0')
                                            setSelectedWifiId(arrayItem.item.isWiFiAvailable ? '1' : '0')
                                            setSelectedListing(arrayItem)
                                            setSelectedImagesArray(arrayItem.item.imgArray)
                                            setIsModalVisable(true)*/}


                                            navigation.navigate('AddListing', { 'itemToEdit': arrayItem.item })
                                        }}
                                        style={{   position: 'absolute', right: '10%', top: '5%', backgroundColor: 'rgba(255, 159, 19, 0.7)', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: '1%', borderRadius: 5 }}>
                                        <Icon name="pencil" size={20} color="white" />
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => {
                                            console.log('4444', arrayItem.item.bookedDates)
                                            setDatesArray(arrayItem.item.bookedDates)
                                            populateCalendar(arrayItem.item.bookedDates)
                                            console.log("marked dates:", markedDates)
                                            setSelectedListingForViewing(arrayItem.item)
                                            //setMarkedDates(arrayItem.item.)
                                            setIsViewModalVisable(true)
                                        }}
                                        style={{ position: 'absolute', left: '10%', top: '5%', backgroundColor: '#eba857', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: '1%', borderRadius: 5 }}>
                                        <Icon name="eye" size={20} color="white" />
                                    </TouchableOpacity>
                                </View>
                        } />
                </View>


            </SafeAreaView>
        )
    else return (
        <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <LottieView style={{ width: 50, height: 50 }} source={require('./lottie/loading.json')} autoPlay loop />
        </View>
    )
}