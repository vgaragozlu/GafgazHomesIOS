import { View, Text, FlatList, TouchableOpacity, Dimensions, Image, TextInput, SafeAreaView, ScrollView } from 'react-native'
import React, { useEffect, useState, } from 'react'
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Modal from "react-native-modal";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DropDownPicker from 'react-native-dropdown-picker';
import RadioGroup from 'react-native-radio-buttons-group';
import LottieView from 'lottie-react-native';
import MapView, { MapMarker } from 'react-native-maps';
import { useIsFocused } from "@react-navigation/native";
import { Calendar, LocaleConfig } from 'react-native-calendars';
import storage from '@react-native-firebase/storage';

export default function AddListing({ route, navigation }) {


    const focus = useIsFocused();


    const borderWidth = 0;
    const user = auth().currentUser;

    const [isModalVisable, setIsModalVisable] = useState(false)
    const [uriArrayState, setUriArrayState] = useState([])


    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedListing, setSelectedListing] = useState();

    const [selectedImagesArray, setSelectedImagesArray] = useState([null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,]);
    const [title, setTitle] = useState('')
    const [price, setPrice] = useState('')
    const [details, setDetails] = useState('')
    const [roomCount, setRoomCount] = useState('')
    const [openType, setOpenType] = useState(false);
    const [openType2, setOpenType2] = useState(false);
    const [valueType, setValueType] = useState(null);
    const [valueType2, setValueType2] = useState(null);
    const [pickedLocation, setPickedLocation] = useState(null)
    //const [uriArray, setUriArray] = useState([])

    let uriArray = []

    const [typeItems, setTypeItems] = useState([
        { label: 'Sadə', value: 'simple' },
        { label: 'Hovuzlu', value: 'pool' },
        { label: 'Kotec', value: 'cottage' },
        { label: 'VIP', value: 'vip' },
        { label: 'A Frame', value: 'aframe' },
        { label: 'Hoteller', value: 'hotel' },
        // { label: 'Mənzillər', value: 'apt' },
    ]);


    const [typeItems2, setTypeItems2] = useState([
        { label: 'Qəbələ', value: 'Qəbələ' },
        { label: 'Quba', value: 'Quba' },
        { label: 'Şəki', value: 'Şəki' },
        { label: 'Qax', value: 'Qax' },
        { label: 'İsmayilli', value: 'İsmayıllı' },
        { label: 'Lənkəran', value: 'Lənkəran' },
        { label: 'Lerik', value: 'Lerik' },
        { label: 'Şamaxı', value: 'Şamaxı' },
        { label: 'Oğuz', value: 'Oğuz' },
        { label: 'Zaqatala', value: 'Zaqatala' },
        { label: 'Balakən', value: 'Balakən' },
        { label: 'Gəncə', value: 'Gəncə' },
        { label: 'Bakı', value: 'Bakı' },
        { label: 'Masallı', value: 'Masallı' },
        { label: 'Qusar', value: 'Qusar' },
        { label: 'Astara', value: 'Astara' },
        { label: 'Xaçmaz', value: 'Xaçmaz' },
        // { label: 'Mənzillər', value: 'apt' },
    ]);



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
    const openImagePicker = (indexToStart) => {

        const options = {
            selectionLimit: 9,
            quality: 0.7,
            mediaType: 'photo',
            // includeBase64: true,
            maxHeight: 900,
            maxWidth: 900,
        };

        launchImageLibrary(options, (response) => {
            console.log('response.length: ', response.assets.length)

            if (response.assets.length < 19) {
                let tempSelectedImagesArray = [...selectedImagesArray];

                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else if (response.error) {
                    console.log('Image picker error: ', response.error);
                } else {
                    // console.log('WWWWWWWWW1', response)
                    //   let imageUri = response.uri || response.assets[0].uri;
                    // let imageUri = response.uri || response.assets[0].base64;
                    // imageUri = 'data:image/jpeg;base64,' + imageUri
                    //setSelectedImage(imageUri);


                    console.log('INDEX TO START IS ', indexToStart,)
                    // console.log('tempselectedimagesarray:  ', tempSelectedImagesArray)
                    let tempNumber = 0;

                    if (tempSelectedImagesArray[indexToStart] == null || !tempSelectedImagesArray[indexToStart]) {
                        console.log('THIS IS IF', tempNumber,)

                        for (let i = indexToStart; i < 18; i++) {
                            console.log('inside for loop ', i)

                            if ((tempSelectedImagesArray[i] == null && response.assets[tempNumber]) || (!tempSelectedImagesArray[i] && response.assets[tempNumber])) {
                                console.log('THIS IS inside nested IF', tempNumber)

                                tempSelectedImagesArray[i] = response.assets[tempNumber].uri
                                tempNumber++
                            }
                        }
                    }
                    else {
                        for (let i = indexToStart; i < 18; i++) {
                            console.log('THIS IS ELSE', i)

                            if ((tempSelectedImagesArray[i] != null && response.assets[tempNumber]) || (!tempSelectedImagesArray[i] && response.assets[tempNumber])) {
                                tempSelectedImagesArray[i] = response.assets[tempNumber].uri
                                tempNumber++
                            }
                        }
                    }


                    //  tempSelectedImagesArray[index] = imageUri
                    setSelectedImagesArray(tempSelectedImagesArray)
                }
            }
            else {
                alert('Elan şəkillərinin sayı  maksimum 18 olmalı')
            }

            //console.log('RESPONSE', response.assets[0].base64)
            //console.log('RESPONSE ARAY', selectedImagesArray[0])

        });
    };





    const [markedDates, setMarkedDates] = useState(
        {

        }
    )




    const [selectedDatesForProp, setSelectedDatesForProp] = useState([])
    const [stateShouldUpdate, setStateShouldUpdate] = useState(false)

    const [isLoading, setIsLoading] = useState(false)
    // let counter = 0;

    async function randomWait() {
        await new Promise((resolve) => setTimeout(() => {
            console.log('This is random wait')
        }, 5000));

        console.log('This is after random wait')

        return 5;
    }


    const uploadData = async (imgArray, listingNumber, bookedDatesByOwner, title, price, details, wifi, bbq, ac, roomCount, location, phoneNumber) => {
        console.log('PUTFILE START', selectedImagesArray, uriArray)
        let promises = []

        for (let i = 0; i < imgArray.length; i++) {

            console.log('NOW COUNTING i...', i, imgArray.length)

            // let x =  await randomWait()

            console.log('INSIDE FOR LOOP', imgArray[i])

            console.log('NOW COUNTING i 2nd time...', i)


            if (imgArray[i] == null || !imgArray[i]) {
                console.log('NULLLLLLLLL')
            }
            else {
                console.log('INSIDE IF', i)

                const task = storage().ref(`/${listingNumber + '_' + title + '_' + i}.jpg`).putFile(imgArray[i])

                promises.push(task)

                task.on('state_changed', (snapshot) => {

                    // console.log('SNAPSHOTS ARE ', snapshot.metadata)
                    const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
                    // setProgress(progress)
                }, (error) => {
                    console.log('INSIDE ERROR', i)

                })

                task.then(async () => {
                    console.log('Task uploaded....!')

                    // const item = imgArray[i];
                    const imageUrl = await storage().ref(`/${listingNumber + '_' + title + '_' + i}.jpg`).getDownloadURL()

                    // console.log('DOWNLOAD R', r)
                    uriArray.push(imageUrl)
                    // setUriArrayState([...uriArrayState, imageUrl])
                    console.log('URL ARRAY IS NOW', uriArray)
                    //console.log('URL ARRAY STATE IS NOW', uriArrayState)
                    //imageData.push({ image: imageUrl! }); 
                    console.log('i AND IMGARRAY.LENGTH', i, imgArray.length)

                    if (imgArray[i + 1] == null) {
                        let tempDate = date.toISOString()
                        console.log('------------->>>.', uriArray)


                        console.log('EQUAL TO URI ARRAY LENGTH...', uriArray)
                        await firestore()
                            .collection('Listings')
                            .add({
                                deactivated: false,
                                date: tempDate,
                                title: title,
                                price: parseInt(price),
                                imgArray: uriArray,
                                details: details,
                                landLordEmail: user.email,
                                categoryName: valueType,
                                city: valueType2,
                                bookedDates: bookedDatesByOwner ? bookedDatesByOwner : ['00-00-0000'],
                                // page: 1,
                                isWiFiAvailable: wifi == '1' ? true : false,
                                isACAvailable: ac == '1' ? true : false,
                                isBBQAvailable: bbq == '1' ? true : false,
                                roomCount: roomCount,
                                lat: location.latitude,
                                lon: location.longitude,
                                listingNumber: listingNumber,
                                landlordPhone: phoneNumber

                            })
                            .then(async (addedListing) => {
                                console.log('Listing added!', user.email);
                                //console.log('IMAGES ARRAY:', imgArray)
                                //await putFile(imgArray)

                                //setIsModalVisable(false)
                                firestore()
                                    .collection('LandLords')
                                    .where('landLordEmail', '==', user.email).get().then((querySnapshot) => {
                                        //console.log('ID IS', querySnapshot._docs[0])
                                        console.log('IIIIID IS', querySnapshot._docs[0]._data)

                                        let tempToBeModified = querySnapshot._docs[0]._data.listings
                                        tempToBeModified.push(addedListing.id)
                                        firestore().collection('LandLords').doc(querySnapshot._docs[0].id)
                                            .update({
                                                listings: tempToBeModified
                                            }).then(() => {
                                                alert('Elanınız əlavə olundu')
                                                uriArray = []
                                                setPrice('')
                                                setTitle('')
                                                setValueType(null)
                                                setRoomCount('')
                                                setSelectedBBQId(null)
                                                setSelectedACId(null)
                                                setSelectedWifiId(null)
                                                setDetails('')
                                                setPickedLocation(null)
                                                // setIsBeingEdited(false)
                                                setSelectedDatesForProp([])
                                                setSelectedListing()
                                                setSelectedImagesArray([null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null])
                                                setIsModalVisable(false)
                                                setPickedLocation(null)
                                                setIsLoading(false)
                                            }).catch(e => {
                                                setIsLoading(false)
                                                console.log('EEEE is ', e)
                                                alert('error is ', e)
                                            })


                                    })




                                navigation.navigate('Room', { 'comingFrom': 'AddListing', 'pickedLocation': undefined })
                            })
                            .catch((e) => {
                                console.log('EEEEEE3', e)
                                alert('error is ', e)
                            });

                    }
                    else {
                        console.log('NOT EQUAL TO 6...', uriArray)
                    }

                })

            }

            //imgArray.map((arrayItem, index) => {




            //})


        }

        console.log('!!!!!!!!!!!!!!!!', uriArray)






        {/* await Promise.all(promises).then(r => {
            console.log('PROMISE R IS ', r)
            console.log('URI ARRAY HERE IS ', uriArray)
            console.log('URI ARRAYSTATE HERE IS ', uriArrayState)
            // Create a reference to the file in Firebase Storage


        


            //   uploadListing(title, price, selectedImagesArray, details, selectedWifiId, selectedBBQId, selectedACId, roomCount, route.params.pickedLocation, selectedDatesForProp)

            alert('ALL DONE')
            setIsLoading(false)
        })*/}




        console.log('URI ARRAY BEFORE FETCH ', uriArray)






    }

    const uploadData2 = async (imgArray, fireBImgArray, listingNumber, title, price, details, wifi, bbq, ac, roomCount, categoryName, location) => {

        console.log('UPLOAD DATA2', fireBImgArray.concat(uriArray))
        console.log('imgArray.length', imgArray.length)
        console.log('11111', location)
        console.log('22222', selectedListing.lat)
        let promises = []

        if (imgArray.length >= 0 && imgArray[0]) {
            console.log('here 1')
            for (let i = 0; i <= imgArray.length; i++) {

                console.log('NOW COUNTING i...', i, imgArray.length)

                console.log('INSIDE FOR LOOP', imgArray)

                console.log('INSIDE IF', i)
                console.log('000000', imgArray[i])

                if (imgArray[i] != null && imgArray[i]) {
                    const task = storage().ref(`/${listingNumber + '_' + title + '_' + i}.jpg`).putFile(imgArray[i])

                    promises.push(task)

                    task.on('state_changed', (snapshot) => {

                        // console.log('SNAPSHOTS ARE ', snapshot.metadata)
                        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
                        // setProgress(progress)
                    }, (error) => {
                        console.log('INSIDE ERROR', i)

                    })

                    task.then(async () => {
                        console.log('Task uploaded....!')

                        // const item = imgArray[i];
                        const imageUrl = await storage().ref(`/${listingNumber + '_' + title + '_' + i}.jpg`).getDownloadURL()

                        // console.log('DOWNLOAD R', r)
                        uriArray.push(imageUrl)
                        // setUriArrayState([...uriArrayState, imageUrl])
                        console.log('URL ARRAY IS NOW', uriArray)
                        //console.log('URL ARRAY STATE IS NOW', uriArrayState)
                        //imageData.push({ image: imageUrl! }); 
                        console.log('i AND IMGARRAY.LENGTH', i, imgArray.length)

                        if (imgArray[i + 1] == null) {
                            let tempDate = date.toISOString()

                            console.log('---->>>>>', imgArray)
                            console.log('---->>>>>', fireBImgArray,)
                            console.log('---->>>>>', uriArray)


                            console.log('EQUAL TO URI ARRAY LENGTH...', uriArray)
                            firestore().collection('Listings').doc(selectedListing.listingId)
                                .update({
                                    city: valueType2,
                                    bookedDates: selectedListing.bookedDates.sort(),
                                    categoryName: categoryName,
                                    details: details,

                                    imgArray: fireBImgArray.concat(uriArray),

                                    isACAvailable: ac,
                                    isBBQAvailable: bbq,
                                    isWifiAvailable: wifi,
                                    lat: location != null && location.lat ? location.lat : selectedListing.lat,
                                    lon: location != null && location.lon ? location.lon : selectedListing.lon,
                                    title: title,
                                    price: parseInt(price),
                                    roomCount: roomCount,

                                })
                                .then(() => {
                                    console.log('Listing updated!');
                                    uriArray = []
                                    setPrice('')
                                    setTitle('')
                                    setValueType(null)
                                    setRoomCount('')
                                    setSelectedBBQId(null)
                                    setSelectedACId(null)
                                    setSelectedWifiId(null)
                                    setDetails('')
                                    setPickedLocation(null)
                                    setSelectedDatesForProp([])
                                    // setIsBeingEdited(false)
                                    setSelectedListing()
                                    setSelectedImagesArray([null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null])
                                    setIsModalVisable(false)
                                    setPickedLocation(null)

                                    // fetchData('Listings')
                                }).catch(e => {
                                    setIsLoading(false)
                                    console.log('ERROR DD', e)
                                    alert('error is ', e)
                                });

                        }
                        else {
                            console.log('NOT EQUAL TO 6...', uriArray)
                        }

                    })
                }





            }
        }

        else {

            console.log('here 2')

            firestore().collection('Listings').doc(selectedListing.listingId)
                .update({
                    city: valueType2,
                    bookedDates: selectedListing.bookedDates.sort(),
                    categoryName: categoryName,
                    details: details,

                    // imgArray: fireBImgArray.concat(uriArray),

                    isACAvailable: ac,
                    isBBQAvailable: bbq,
                    isWifiAvailable: wifi,
                    lat: location != null && location.lat ? location.lat : selectedListing.lat,
                    lon: location != null && location.lon ? location.lon : selectedListing.lon,
                    title: title,
                    price: parseInt(price),
                    roomCount: roomCount,

                })
                .then(() => {
                    console.log('Listing updated!');
                    uriArray = []
                    setPrice('')
                    setTitle('')
                    setValueType(null)
                    setRoomCount('')
                    setSelectedBBQId(null)
                    setSelectedACId(null)
                    setSelectedWifiId(null)
                    setDetails('')
                    setPickedLocation(null)
                    setSelectedDatesForProp([])
                    // setIsBeingEdited(false)
                    setSelectedListing()
                    setSelectedImagesArray([null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null])
                    setIsModalVisable(false)
                    setPickedLocation(null)

                    // fetchData('Listings')
                }).catch(e => {
                    setIsLoading(false)
                    console.log('ERROR DD', e)
                    alert('error is ', e)
                });
        }


        navigation.navigate('Room', { 'comingFrom': 'AddListing', 'pickedLocation': undefined })


        setIsLoading(false)



        {/* await Promise.all(promises).then(r => {
            console.log('PROMISE R IS ', r)
            console.log('URI ARRAY HERE IS ', uriArray)
            console.log('URI ARRAYSTATE HERE IS ', uriArrayState)
            // Create a reference to the file in Firebase Storage


        


            //   uploadListing(title, price, selectedImagesArray, details, selectedWifiId, selectedBBQId, selectedACId, roomCount, route.params.pickedLocation, selectedDatesForProp)

            alert('ALL DONE')
            setIsLoading(false)
        })*/}




        console.log('URI ARRAY BEFORE FETCH ', uriArray)






    }


    const editImagesUploadData = async (imgArray, selectedListing) => {
        console.log('edit PUTFILE START', imgArray)

        //  console.log('edit idddddddddddd', selectedListing.listingId)
        let promises = []
        let tempUriArray = []


        for (let i = 0; i < imgArray.length; i++) {
            //   console.log('INSIDE IF', i, selectedListing.listingId)

            const task = storage().ref(`/${selectedListing.listingNumber + '_' + i}.jpg`).putFile(imgArray[i])

            promises.push(task)

            task.on('state_changed', (snapshot) => {

                // console.log('SNAPSHOTS ARE ', snapshot.metadata)
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
                // setProgress(progress)
            }, (error) => {
                console.log('INSIDE ERROR', i)

            })

            task.then(async () => {
                console.log('Task uploaded....!')

                const imageUrl = await storage().ref(`/${selectedListing.listingNumber + '_' + i}.jpg`).getDownloadURL()


                uriArray.push(imageUrl)
                console.log('URI ARRAY NOW: ', uriArray)

                // let tempDate = date.toISOString()





                firestore()
                    .collection('LandLords')
                    .where('landLordEmail', '==', user.email).get().then((querySnapshot) => {
                        //console.log('IIIIID IS', querySnapshot._docs[0]._data)


                        firestore().collection('Listings').doc(selectedListing.listingId)
                            .update({
                                city: valueType2,
                                bookedDates: selectedListing.bookedDates.sort(),
                                categoryName: selectedListing.categoryName,
                                details: selectedListing.details,

                                imgArray: tempUriArray,

                                isACAvailable: selectedListing.isACAvailable,
                                isBBQAvailable: selectedListing.isBBQAvailable,
                                isWifiAvailable: selectedListing.isWifiAvailable,
                                lat: selectedListing.lat,
                                lon: selectedListing.lon,
                                title: selectedListing.title,
                                price: parseInt(selectedListing.price),
                                roomCount: selectedListing.roomCount,

                            })
                            .then(() => {
                                console.log('Listing updated!');
                                uriArray = []
                                setPrice('')
                                setTitle('')
                                setValueType(null)
                                setRoomCount('')
                                setSelectedBBQId(null)
                                setSelectedACId(null)
                                setSelectedWifiId(null)
                                setDetails('')
                                setPickedLocation(null)
                                setSelectedDatesForProp([])
                                // setIsBeingEdited(false)
                                setSelectedListing()
                                setSelectedImagesArray([null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null])
                                setIsModalVisable(false)
                                setPickedLocation(null)
                                setIsLoading(false)
                                navigation.navigate('Room', { 'comingFrom': 'AddListing', 'pickedLocation': undefined })

                                // fetchData('Listings')
                            }).catch(e => {
                                setIsLoading(false)
                                console.log('ERROR DD', e)
                                alert('error is ', e)
                            });










                    }).catch((e) => {
                        alert('errorr', e)
                    })







            })
        }





        console.log('URI ARRAY BEFORE FETCH ', uriArray)


    }


    const uploadListing = async (title, price, imgArray, details, wifi, bbq, ac, roomCount, location, bookedDatesByOwner) => {
        console.log('SSSSSSSSSSSSSSSS ', bookedDatesByOwner)

        setIsLoading(true)





        firestore().collection('LandLords').where('landLordEmail', '==', user.email).get().then(async (querySnapshot) => {

            let phoneNumber = ''
            querySnapshot.forEach(documentSnapshot => {
                console.log('CONTACTTTTT', documentSnapshot.data()['contactNumber'])

                phoneNumber = documentSnapshot.data()['contactNumber']

            });
            let tempListingNumber = Math.floor(Math.random() * 10000000).toString().substring(0, 7)

            await uploadData(imgArray, tempListingNumber, bookedDatesByOwner, title, parseInt(price), details, wifi, bbq, ac, roomCount, location, phoneNumber).then((r) => {
                console.log('uri Array IS ', uriArray)

            })
            console.log('URI ARRAY', uriArray)
        }).finally(() => {
        })


    }

    const updateListing = (selectedListing) => {
        console.log('*************', selectedImagesArray.location)

        setIsLoading(true)

        let tempFireBImgArray = []
        let tempImgArray = []


        for (let i = 0; i < 19; i++) {
            if (selectedImagesArray[i] != null) {
                if (!selectedImagesArray[i].startsWith('https://firebase')) {
                    console.log('PUSHING....', selectedImagesArray[i])
                    tempImgArray.push(selectedImagesArray[i])
                }
                if (selectedImagesArray[i].startsWith('https://firebase')) {
                    tempFireBImgArray.push(selectedImagesArray[i])
                }
            }

        }


        console.log('UPDATE LISTING STARTED.....', tempImgArray)
        //  console.log('----....', selectedListing)


        uploadData2(tempImgArray, tempFireBImgArray, selectedListing.listingNumber, selectedListing.title, selectedListing.price, selectedListing.details, selectedListing.isWiFiAvailable, selectedListing.isBBQAvailable, selectedListing.isACAvailable, selectedListing.roomCount, selectedListing.categoryName, selectedListing.location)


    }

    const deleteListing = (selectedListing) => {
        //console.log('HHHHHHHHHHHHHHHH', selectedListing)
        setIsLoading(true)

        firestore().collection('Listings').doc(selectedListing.listingId)
            .update({
                deactivated: true
            })
            .then(() => {
                setIsLoading(false)
                alert('Elan silindi!')
                console.log('Listing deactivated !');
                //  setPrice('')
                //setTitle('')
                navigation.navigate('Room')
                // fetchData('Listings')
            }).catch(e => {
                setIsLoading(false)
                alert('error is ', e)
            });
        {/*firestore().collection('Listings').doc(selectedListing.listingId)
            .delete()
            .then(() => {
                setIsLoading(false)
                console.log('Listing deleted!');
                //  setPrice('')
                //setTitle('')
                navigation.navigate('Room')
                // fetchData('Listings')
            }).catch(e => {
                setIsLoading(false)
                alert('error is ', e)
            });*/}
    }

    let _pickedLocation = route.params && route.params.pickedLocation ? route.params.pickedLocation : null
    useEffect(() => {
        if (route.params && route.params.selectedListing)
            setSelectedListing(route.params.selectedListing)
        //console.log('THIS IS ROUTE: ', route.params)
        // setPickedLocation(route.params && route.params.pickedLocation ? route.params.pickedLocation : null)
    }, [])

    useEffect(() => {
        // console.log('!!!!!!!!!!!!!!!!######1', route.params)
        if (focus == true && route.params && route.params.comingFrom != 'pickLocation') { // if condition required here because it will call the function even when you are not focused in the screen as well, because we passed it as a dependencies to useEffect hook
            console.log('FOCUS ')
            setPrice('')
            setTitle('')
            setValueType(null)
            setRoomCount('')
            setSelectedBBQId(null)
            setSelectedACId(null)
            setSelectedWifiId(null)
            setDetails('')
            setPickedLocation(null)
            _pickedLocation = null
            // setIsBeingEdited(false)
            setSelectedListing()
            setSelectedImagesArray([null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null])
            setIsModalVisable(false)
        }
    }, [focus])


    useEffect(() => {
        // console.log('%%%%%%%%%%%%%%%%%%%%%', route.params.itemToEdit)
        if (route.params && route.params.itemToEdit) {
            //alert('inside here')
            setValueType2(route.params.itemToEdit.city)
            setTitle(route.params.itemToEdit.title)
            setPrice(route.params.itemToEdit.price)
            setRoomCount(route.params.itemToEdit.roomCount)
            setDetails(route.params.itemToEdit.details)
            setSelectedACId(route.params.itemToEdit.isACAvailable ? '1' : '0')
            setSelectedBBQId(route.params.itemToEdit.isBBQAvailable ? '1' : '0')
            setSelectedWifiId(route.params.itemToEdit.isWiFiAvailable ? '1' : '0')
            setSelectedListing(route.params.itemToEdit)
            let tempArray = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,];
            route.params.itemToEdit.imgArray.map((item, index) => {
                // console.log('index and item ', index, item)
                tempArray[index] = item
            })
            {/*if (tempArray.length < 9) {
                for (i = 0; i < 9 - tempArray.length; i++) {
                    tempArray[i] = null;
                }
            }*/}
            setSelectedImagesArray(tempArray)
            setValueType(route.params.itemToEdit.categoryName)

            console.log('selectedImagesArray at UseEffect', tempArray)


            let tempDates = []
            let tempp = {}
            route.params.itemToEdit.bookedDates.map((item, index) => {
                tempDates.push(item)
                tempp[item] = {
                    selected: true, marked: true, selectedColor: 'red', customStyles: {
                        container: {
                            backgroundColor: 'red'
                        }
                    }
                }
            })
            setSelectedDatesForProp(tempDates)
            setMarkedDates(tempp)
        }
        else {
            //alert('else')
            setSelectedDatesForProp([])
            setMarkedDates({})
            setValueType2(null)
        }

    }, [focus])

    const [isCityModalVisible, setIsCityModalVisible] = useState(false)
    const [isTypeModalVisible, setIsTypeModalVisible] = useState(false)
    let date = new Date()

    date.setDate(date.getDate() - 1);


    if (isLoading)
        return (
            <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <LottieView style={{ width: 50, height: 50 }} source={require('./lottie/loading2.json')} autoPlay loop />
            </View>
        )
    else
        return (
            <View style={{ flex: 1 }}>

                <Modal isVisible={isCityModalVisible}>
                    <View style={{ width: '100%', height: 200 }}>

                        <DropDownPicker
                            onSelectItem={() => {
                                setIsCityModalVisible(false)
                            }}
                            dropDownContainerStyle={{ backgroundColor: 'white', }}
                            style={{ borderWidth: 0.8, borderColor: '#CCCCCC' }}
                            containerStyle={{
                                borderWidth: 0,
                                width: '100%',
                            }}
                            placeholder='Şəhər seçin'
                            open={openType2}
                            value={valueType2}
                            items={typeItems2}
                            setOpen={setOpenType2}
                            setValue={setValueType2}
                            setItems={setTypeItems2}
                        />
                        <TouchableOpacity onPress={() => {
                            setIsCityModalVisible(false)
                        }}><Text>BBBB</Text></TouchableOpacity>
                    </View>
                </Modal>

                <Modal isVisible={isTypeModalVisible}>
                    <View style={{ width: '100%', height: 200 }}>
                        <DropDownPicker
                            onSelectItem={() => {
                                setIsTypeModalVisible(false)
                            }}
                            dropDownContainerStyle={{ backgroundColor: 'white', }}
                            style={{ borderWidth: 0.8, borderColor: '#CCCCCC' }}
                            containerStyle={{
                                borderWidth: 0,
                                width: '100%',
                            }}
                            placeholder='Ev Tipi'
                            open={openType}
                            value={valueType}
                            items={typeItems}
                            setOpen={setOpenType}
                            setValue={setValueType}
                            setItems={setTypeItems}
                        />

                        <TouchableOpacity onPress={() => {
                            setIsCityModalVisible(false)
                        }}></TouchableOpacity>
                    </View>
                </Modal>
                <View style={{ width: '100%', height: '100%', alignItems: 'center', borderColor: 'red', borderWidth: borderWidth, justifyContent: 'space-between', backgroundColor: 'white', }}>

                    <ScrollView style={{ borderColor: 'red', borderWidth: 0, zIndex: 0 }} nestedScrollEnabled={true} contentContainerStyle={{ width: Dimensions.get('screen').width, paddingTop: Dimensions.get('screen').width * 0.05, paddingBottom: 80, paddingLeft: 10, paddingRight: 10 }}>


                        <View style={{ width: '100%', height: Dimensions.get('screen').height * 0.1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderColor: 'red', borderWidth: borderWidth, }}>
                            <Text style={{ color: 'black' }}>Yer</Text>
                            <TouchableOpacity onPress={() => {
                                if(route.params&&route.params.itemToEdit)
                                {
                               // alert('yes')

                            navigation.navigate('PickLocation', { 'comingFrom': 'editListing', 'listingAsAParameter': selectedListing })

                                }
                            else {
                            navigation.navigate('PickLocation')
                                
                                //alert('no')
                            }
                            return    
                            navigation.navigate('PickLocation', { 'comingFrom': 'editListing', 'listingAsAParameter': selectedListing })
                            }} style={{ width: '75%', height: '100%', backgroundColor: 'white', borderColor: '#CCCCCC', borderWidth: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                                <MapView
                                    region={{
                                        latitude: route.params && route.params.pickedLocation ? route.params.pickedLocation.latitude : 40.98187485456937,
                                        longitude: route.params && route.params.pickedLocation ? route.params.pickedLocation.longitude : 47.841374315321445,
                                        latitudeDelta: 0.0922,
                                        longitudeDelta: 0.0421,
                                    }}
                                    style={{ height: '100%', width: '100%' }}
                                    minZoomLevel={11}
                                    maxZoomLevel={10}
                                    initialRegion={{
                                        latitude: route.params && _pickedLocation != null ? _pickedLocation.latitude : 40.98187485456937,
                                        longitude: route.params && _pickedLocation != null ? _pickedLocation.longitude : 47.841374315321445,
                                        latitudeDelta: 0.0922,
                                        longitudeDelta: 0.0421,
                                    }}

                                >
                                    <MapMarker
                                        onPress={() => {
                                        }}
                                        coordinate={{

                                            latitude:
                                                route.params && route.params.pickedLocation
                                                    ?
                                                    route.params.pickedLocation.latitude
                                                    :
                                                    route.params && route.params.itemToEdit && route.params.itemToEdit.lat
                                                        ?
                                                        route.params.itemToEdit.lat
                                                        : 0,

                                            longitude:
                                                route.params && route.params.pickedLocation
                                                    ?
                                                    route.params.pickedLocation.longitude
                                                    :
                                                    route.params && route.params.itemToEdit && route.params.itemToEdit.lon
                                                        ?
                                                        route.params && route.params.itemToEdit.lon
                                                        : 0
                                        }}>

                                        <View style={{ height: 45, width: 45, borderRadius: 30, borderWidth: 0, borderColor: '#998d8d', justifyContent: 'center', alignItems: 'center' }}>
                                            <Image source={require('./images/pin4.png')} style={{ height: 43, width: 43, borderRadius: 30, borderWidth: 0, borderColor: 'white' }} />

                                        </View>
                                    </MapMarker>
                                </MapView>
                            </TouchableOpacity>
                        </View>

                        <View style={{ width: '100%', height: Dimensions.get('screen').height * 0.06, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: '5%', borderColor: 'red', borderWidth: borderWidth, }}>
                            <Text style={{ color: 'black' }}>Başlıq</Text>
                            <TextInput value={title} onChangeText={setTitle} style={{ width: '75%', height: '100%', borderColor: '#CCCCCC', borderWidth: 1, borderRadius: 5 }} />
                        </View>

                        <View style={{ width: '100%', height: Dimensions.get('screen').height * 0.06, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: '5%', borderColor: 'red', borderWidth: borderWidth, zIndex: 5 }}>
                            <Text style={{ color: 'black' }}>Şəhər</Text>
                            <TouchableOpacity onPress={() => {
                                setOpenType2(true)
                                setIsCityModalVisible(true)
                            }} style={{ width: '75%' }}><Text>{valueType2 == null ? 'seçin' : valueType2}</Text></TouchableOpacity>
                        </View>

                        <View style={{ width: '100%', height: Dimensions.get('screen').height * 0.06, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: '5%', borderColor: 'red', borderWidth: borderWidth, zIndex: 4 }}>
                            <Text style={{ color: 'black' }}>Tipi</Text>
                            <TouchableOpacity onPress={() => {
                                setOpenType(true)
                                setIsTypeModalVisible(true)
                            }} style={{ width: '75%' }}><Text>{valueType == 'simple' ? 'Sadə' : valueType == 'pool' ? 'Hovuzlu' : valueType == 'aframe' ? 'A frame' : valueType == 'vip' ? 'VIP' : valueType == 'cottage' ? 'Kotec' : 'seçin'}</Text></TouchableOpacity>
                        </View>

                        <View style={{ width: '100%', height: Dimensions.get('screen').height * 0.06, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: '5%', borderColor: 'red', borderWidth: borderWidth, }}>
                            <Text style={{ color: 'black' }}>Qiymət</Text>
                            <TextInput value={price.toString()} onChangeText={setPrice} style={{ width: '75%', height: '100%', borderColor: '#CCCCCC', borderWidth: 1, borderRadius: 5 }} />

                        </View>

                        <View style={{ width: '100%', height: Dimensions.get('screen').height * 0.06, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: '5%', borderColor: 'red', borderWidth: borderWidth, }}>
                            <Text style={{ color: 'black' }}>Otaq Sayı</Text>
                            <TextInput value={roomCount} onChangeText={setRoomCount} style={{ width: '75%', height: '100%', borderColor: '#CCCCCC', borderWidth: 1, borderRadius: 5 }} />

                        </View>


                        <View style={{ width: '100%', height: Dimensions.get('screen').height * 0.08, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: '5%', borderColor: 'red', borderWidth: borderWidth, }}>
                            <Text style={{ color: 'black' }}>Açıqlama</Text>
                            <TextInput value={details} onChangeText={setDetails} multiline={true} style={{ width: '75%', height: '100%', borderColor: '#CCCCCC', borderWidth: 1, borderRadius: 5, }} />
                        </View>

                        <View style={{ width: '100%', height: Dimensions.get('screen').height * 0.55, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: '5%', borderColor: 'red', borderWidth: borderWidth, }}>
                            <Text style={{ color: 'black' }}>Dolu tarixlər:</Text>
                            <Calendar
                                style={{
                                    borderWidth: 0,
                                    borderColor: 'grey',
                                    height: 350,
                                    borderRadius: 15
                                }}
                                markingType={'custom'}
                                minDate={date.toJSON().slice(0, 10)}

                                onDayPress={day => {

                                    let tempSelectedDatesForProp = [...selectedDatesForProp];


                                    if (!tempSelectedDatesForProp.includes(day.dateString, 0)) {
                                        console.log('DOES NOT INCLUDE...', tempSelectedDatesForProp, day.dateString)

                                        tempSelectedDatesForProp.push(day.dateString)
                                        setSelectedDatesForProp(tempSelectedDatesForProp)

                                        let temp = markedDates;
                                        temp[day.dateString] = {
                                            selected: true, marked: true, selectedColor: 'red', customStyles: {
                                                container: {
                                                    backgroundColor: 'red'
                                                }
                                            }
                                        }
                                        setMarkedDates(temp)

                                        { /* setMarkedDates({...markedDates, [day.dateString]:{
                                                selected: false, marked: false, selectedColor: 'green', customStyles: {
                                                    container: {
                                                        backgroundColor: 'white'
                                                    }
                                                }
                                            }})*/}

                                        setStateShouldUpdate(!stateShouldUpdate)

                                        console.log('AFTER DOES NOT INCLUDE...', tempSelectedDatesForProp)

                                    }
                                    else if (tempSelectedDatesForProp.includes(day.dateString, 0)) {

                                        console.log('INCLUDES', tempSelectedDatesForProp)
                                        alert('Diqqət! Boş qeyd etdiyiniz bütün günlər üçün mövcud rezervasiyalar ləğv ediləcək.')



                                        tempSelectedDatesForProp = tempSelectedDatesForProp.filter(item => item !== day.dateString)



                                        console.log('AFTER CONTAINS', tempSelectedDatesForProp)


                                        let temp = markedDates;

                                        temp[day.dateString] = {
                                            selected: false, marked: false, selectedColor: 'red', customStyles: {
                                                container: {
                                                    backgroundColor: 'white'
                                                }
                                            }
                                        }

                                        {/*setMarkedDates({...markedDates, [day.dateString]:{
                                                selected: false, marked: false, selectedColor: 'green', customStyles: {
                                                    container: {
                                                        backgroundColor: 'white'
                                                    }
                                                }
                                            }})*/}

                                        setSelectedDatesForProp(tempSelectedDatesForProp)
                                        setMarkedDates(temp)
                                        setStateShouldUpdate(!stateShouldUpdate)
                                    }

                                    console.log('_________________________')
                                }}
                                // Mark specific dates as marked
                                markedDates={
                                    markedDates
                                }
                            />
                        </View>

                        <View style={{ width: '100%', height: Dimensions.get('screen').height * 0.15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: '5%', flexWrap: 'wrap', borderWidth: borderWidth, borderColor: 'red', borderWidth: borderWidth, }}>
                            <View style={{ width: '30%', height: '100%', borderColor: 'red', borderWidth: 0, alignItems: 'center', }}>
                                <Text style={{ color: 'black' }}>WiFi</Text>
                                <RadioGroup
                                    containerStyle={{ borderWidth: 0, borderColor: 'red', marginTop: '10%', }}
                                    radioButtons={wifiRadioButtons}
                                    onPress={setSelectedWifiId}
                                    selectedId={selectedWifiId}

                                />
                            </View>
                            <View style={{ height: '50%', borderWidth: 0.7, borderColor: 'grey' }}></View>

                            <View style={{ width: '30%', height: '100%', borderColor: 'red', borderWidth: 0, alignItems: 'center', }}>
                                <Text style={{ color: 'black' }}>Kondisioner</Text>

                                <RadioGroup
                                    containerStyle={{ borderWidth: 0, borderColor: 'red', marginTop: '10%' }}
                                    radioButtons={ACRadioButtons}
                                    onPress={setSelectedACId}
                                    selectedId={selectedACId}
                                />
                            </View>
                            <View style={{ height: '50%', borderWidth: 0.7, borderColor: 'grey' }}></View>

                            <View style={{ width: '30%', height: '100%', borderColor: 'red', borderWidth: 0, alignItems: 'center', }}>
                                <Text style={{ color: 'black' }}>Manqal</Text>

                                <RadioGroup
                                    containerStyle={{ borderWidth: 0, borderColor: 'red', marginTop: '10%' }}

                                    radioButtons={BBQRadioButtons}
                                    onPress={setSelectedBBQId}
                                    selectedId={selectedBBQId}
                                />
                            </View>


                        </View>

                        <View style={{ width: '100%', borderColor: 'blue', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', borderColor: 'red', borderWidth: 0, }}>
                            {
                                selectedImagesArray.map((arrayItem, index) => {
                                    //console.log('QQQQ!!!!!!!!!!!!', arrayItem)
                                    return (
                                        <TouchableOpacity onPress={() => {
                                            openImagePicker(index)
                                        }} style={{ width: Dimensions.get('window').width * 0.25, height: Dimensions.get('window').width * 0.25, borderColor: 'red', borderWidth: borderWidth, justifyContent: 'center', alignItems: 'center' }} key={index}>
                                            <Image source={arrayItem ? { uri: arrayItem } : require('./images/placeholder.png')} style={{ width: '60%', height: '50%', borderRadius: 10 }} />
                                        </TouchableOpacity>

                                    )
                                })
                            }
                        </View>
                        <View style={{ width: '100%', height: Dimensions.get('screen').height * 0.04, borderColor: 'purple', borderWidth: 0, flexDirection: 'row', paddingLeft: '1%', paddingRight: '1%', marginTop: '5%', justifyContent: 'space-between', borderColor: 'red', borderWidth: borderWidth, }}>
                            {
                                route.params && route.params.itemToEdit ?
                                    <TouchableOpacity
                                        onPress={() => {
                                            deleteListing(selectedListing)
                                        }}
                                        style={{ width: '30%', height: '100%', backgroundColor: '#c95151', justifyContent: 'center', alignItems: 'center', borderRadius: 7 }}>
                                        <Icon name="delete" size={20} color="white" />

                                    </TouchableOpacity> : null}

                            <TouchableOpacity onPress={() => {
                                setPrice('')
                                setTitle('')
                                setValueType(null)
                                setRoomCount('')
                                setSelectedBBQId(null)
                                setSelectedACId(null)
                                setSelectedWifiId(null)
                                setDetails('')
                                uriArray = []
                                setPickedLocation(null)
                                // setIsBeingEdited(false)
                                setSelectedListing()
                                setSelectedImagesArray([null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,])
                                setIsModalVisable(false)
                                navigation.navigate('Room')
                            }} style={{ width: '30%', height: '100%', backgroundColor: '#c95151', justifyContent: 'center', alignItems: 'center', borderRadius: 7 }}>
                                <Text style={{ color: 'white' }}>Geri</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => {

                                console.log('--------######', selectedImagesArray)
                                console.log('PPPPPPPP', selectedDatesForProp, title, valueType, price, roomCount, details, selectedImagesArray[0], selectedImagesArray.length)
                                if (selectedACId == null || selectedBBQId == null || selectedWifiId == null || title == '' || valueType == null || price == '' || roomCount == '' || details == '' || !selectedImagesArray[0] || !selectedImagesArray[1] || !selectedImagesArray[2] || !selectedImagesArray[3] || !selectedImagesArray[4] || !route.params || valueType2 == null) {
                                    alert('Elan məlumatları boş buraxılmamalıdır!')
                                    console.log('ELAN MELUMATLARI BOS', valueType2)
                                }
                                else {
                                    //console.log('PICKED LOC:', route.params.pickedLocation)
                                    if (valueType == 'hotel') {
                                        //  alert('Hotel')
                                    }

                                    if ((route.params && route.params.itemToEdit && route.params.flag)||route.params && route.params.itemToEdit || route.params.flag) {
                                        //console.log('EDITTING!!!!', selectedListing)


                                        console.log('EDITTING!!!!', selectedDatesForProp)


                                        let tempSelectedListing = route.params.itemToEdit

                                        console.log('======>>>>>!!!', route.params.flag
                                        )
                                        tempSelectedListing.lon = route.params && route.params.flag ? route.params.pickedLocation.longitude : selectedListing.lon
                                        tempSelectedListing.lat = route.params && route.params.flag ? route.params.pickedLocation.latitude : selectedListing.lat




                                        tempSelectedListing.title = title;
                                        tempSelectedListing.categoryName = valueType;
                                        tempSelectedListing.price = price
                                        tempSelectedListing.details = details;
                                        tempSelectedListing.roomCount = roomCount;
                                        tempSelectedListing.bookedDates = selectedDatesForProp;
                                        tempSelectedListing.categoryName = valueType;
                                        tempSelectedListing.isACAvailable = selectedACId == '1' ? true : false
                                        tempSelectedListing.isBBQAvailable = selectedBBQId == '1' ? true : false
                                        tempSelectedListing.isWifiAvailable = selectedWifiId == '1' ? true : false
                                        tempSelectedListing.location = route.params.pickedLocation



                                        console.log('EDITTING!!!!', tempSelectedListing.categoryName)

                                        updateListing(tempSelectedListing)
                                    }
                                    else {
                                        console.log('NOT EDITTING!!!!', route.params.flag)
                                        uploadListing(title, parseInt(price), selectedImagesArray, details, selectedWifiId, selectedBBQId, selectedACId, roomCount, route.params.pickedLocation, selectedDatesForProp)
                                    }


                                }

                            }} style={{ width: '35%', height: '100%', backgroundColor: '#56b373', justifyContent: 'center', alignItems: 'center', borderRadius: 7 }}>
                                <Text style={{ color: 'white' }}>Yüklə</Text>
                            </TouchableOpacity>

                        </View>

                    </ScrollView>



                </View>
            </View>
        )
}