import { View, Text, Image, ScrollView, Dimensions, TouchableOpacity, FlatList, Modal, Linking, PermissionsAndroid } from 'react-native'
import React, { useState, useEffect } from 'react'
import firestore from '@react-native-firebase/firestore';
import LottieView from 'lottie-react-native';
import MapView, { MapMarker, Geojson } from 'react-native-maps';
import { SliderBox } from "react-native-image-slider-box";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon3 from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/Ionicons';
import Icon4 from 'react-native-vector-icons/FontAwesome5';
import Geolocation from 'react-native-geolocation-service';

import DropDownPicker from 'react-native-dropdown-picker';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import auth from '@react-native-firebase/auth';
import axios from 'axios'
import messaging from '@react-native-firebase/messaging';
import { Popup } from 'react-native-map-link';

export default function Test({ route, navigation }) {

    //let homesList = []

    // console.log('SSSSSSSSSSSSS', route.params.selectedDatesForProp)

    const [selectedDatesForProp, setSelectedDatesForProp] = useState([])
    const [stateShouldUpdate, setStateShouldUpdate] = useState(false)
    const [currentLocation, setCurrentLocation] = useState({ "latitude": 0, "longitude": 0 })


    const [homesList, setHomesList] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [pageNumber, setPageNumber] = useState(1)
    let tempHomesList = []

    let date = new Date()

    const [openType, setOpenType] = useState(false);
    const [openType2, setOpenType2] = useState(false);
    const [openRoomNumber, setOpenRoomNumber] = useState(false);
    const [openPrice, setOpenPrice] = useState(false);
    let x = route.params.categoryName
    const [valueType, setValueType] = useState('');
    const [valueType2, setValueType2] = useState(route.params.categoryName);
    const [valueType3, setValueType3] = useState();
    const [refresh, setRefresh] = useState(false);


    setTimeout(() => {
        setRefresh(true)
    }, 1000)


    const [valueRoomNumber, setValueRoomNumber] = useState();
    const [valuePrice, setValuePrice] = useState(null);

    const [typeItems, setTypeItems] = useState([
        { label: 'Qəbələ', value: 'qebele' },
        { label: 'Şəki', value: 'seki' },
        { label: 'İsmayıllı', value: 'ismayilli' },
        { label: 'Qax', value: 'qax' },
        { label: 'Quba', value: 'quba' },
        { label: 'Gəcncə', value: 'gebce' },
        { label: 'Lənkəran', value: 'lenkeran' },
        { label: 'Masallı', value: 'masalli' },
        { label: 'Balakən', value: 'balaken' },
        { label: 'Ağstafa', value: 'agstafa' },
        { label: 'Astara', value: 'astara' },
        { label: 'Şuşa', value: 'susa' },
        { label: 'Naxçıvan', value: 'naxcivan' },
        { label: 'Zaqatala', value: 'zaqatala' },
        { label: 'Qusa', value: 'qusar' },
        { label: 'Xaçmaz', value: 'xacmaz' },

    ]);


    const [typeItems2, setTypeItems2] = useState([
        { label: 'Sadə', value: 'simple' },
        { label: 'Hovuzlu', value: 'pool' },
        { label: 'VIP', value: 'vip' },
        { label: 'A Frame', value: 'aframe' },


    ]);

    const [roomCountItems, setRoomCountItems] = useState([
        { label: '1', value: '1' },
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' },
        { label: '5', value: '5' },
        { label: '6', value: '6' },
        { label: '6', value: '7' },
        { label: '6', value: '8' },
        { label: '6', value: '9' },
    ]);

    const [priceItems, setPriceItems] = useState([
        { label: '20-100', value: '20-100' },
        { label: '100-150', value: '100-150' },
        { label: '150-200', value: '150-200' },

    ]);



    const customStyle = [
        {
            "featureType": "administrative",
            "elementType": "geometry",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "administrative.land_parcel",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "administrative.neighborhood",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "poi",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "labels.icon",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "transit",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "labels.text",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        }
    ]



    function findCommonElements3(arr1, arr2) {
        console.log('^^^^^^^^^^^^^^^^', arr1)
        return arr1.some(item => arr2.includes(item))
    }

    const user = auth().currentUser;


    const [region, setRegion] = useState({ "latitude": 40.679201923093586, "latitudeDelta": 7.789952744491806, "longitude": 47.2005483135581, "longitudeDelta": 6.522861421108232 })

    const [isModalVisable, setIsModalVisable] = useState(false)
    const [isReceiptModalVisable, setIsReceiptModalVisable] = useState(false)
    const [isConfirmModalVisable, setIsConfirmModalVisable] = useState(false)
    const [isFilterModalVisable, setIsFilterModalVisable] = useState(false)


    const [token, setToken] = useState(null)

    const [landlordPhone, setLandLordPhone] = useState()



    const fetchData = async (arg, pageNumber, selectedDatesArray, roomCount) => {
        console.log('START FETCH....', valueType2, valueType, arg)
        //alert(pageNumber)
        setIsLoading(true)

        //console.log('RRRRRRRRRRRRRRRRRRRRR', selectedDatesArray)
        firestore().collection('Listings').where('categoryName', '==', arg).where('city', '==', valueType).where('roomCount', '==', roomCount).get().then(querySnapshot => {
            console.log('Size is: ', querySnapshot.size);
            querySnapshot.forEach(documentSnapshot => {

                {/*documentSnapshot.data().bookedDates.map((arrayItem, index) => {
                    //console.log('-------->', arrayItem, route.params.selectedDatesForProp)
                    let doesInclude = false
                    doesInclude = route.params.selectedDatesForProp.includes(arrayItem, 0)
                    if (doesInclude == false) {
                        console.log('--------->>>>>', doesInclude, arrayItem)
                        if (homesList[0]) {
                            tempHomesList = homesList;
                        }
                        if (!tempHomesList.includes(documentSnapshot.data(), 0)) {
                            tempHomesList.push(documentSnapshot.data())
                        }
                    }

                })*/}

                let foundCommon = findCommonElements3(selectedDatesForProp, documentSnapshot.data().bookedDates)
                console.log('DATE ARRAYS TO BE COMPARED: ', selectedDatesForProp, documentSnapshot.data().bookedDates)
                console.log('FOUND COMMON DATE: ', foundCommon)
                if (!foundCommon) {
                    console.log('THIS IS inside !FOUNDCOMMON', foundCommon)

                    {/*if (homesList[0]) {
                        tempHomesList = homesList;
                    }*/}

                    tempHomesList.push(documentSnapshot.data())


                }

                // tempHomesList.push(documentSnapshot.data())

                //console.log('User ID: ', documentSnapshot.id);
                //console.log('Data is: ', documentSnapshot.data() )

            });
            //tempHomesList = [...homesList]
            //console.log('HEREEEEEEEEEE', tempHomesList)
            setHomesList(tempHomesList)
            tempHomesList = []
            //console.log('THE ARRAY IS ', homesList)
        }).finally(() => {
            setIsLoading(false)
            console.log('END FETCH...')

        });

        //console.log('!!!!!!!!!!!!', data)
        //const user = await firestore().collection('Users').doc('ABC').get();
    }


    async function requestUserPermission() {
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
            console.log('Authorization status:', authStatus);
        }
    }



    const checkToken = async (img) => {
        const fcmToken = await messaging().getToken();

        if (fcmToken) {
            console.log('TOKEN IS READY....', fcmToken);
            return
            await axios.post('http://2.59.117.59:5555/Send', {
                img: img,
                title: "Yeni Sifarisiniz Var",
                UserToken: fcmToken
            })
        }
    }




    const SendMessasge = async () => {
        try {
            const token = await messaging().getToken(
                firebase.app().options.messagingSenderId,
            );
            setToken(token);
            console.log('token', token);
        } catch (error) {
            console.log(error);
        }
    };

    const bookListing = async (listingId, bookDate, img) => {

        console.log('*******************', date)
        console.log('*******************', date.toISOString())
        //   console.log('******************',img)
        await requestUserPermission()
        //await SendMessasge()
        await checkToken(img)






        console.log('XXXXXXXXXXX', x)
        //return
        setIsLoading(true)
        console.log('LISTING ID: ', listingId)
        console.log('BOOK DATE: ', bookDate)
        firestore().collection('LandLords').where('landLordEmail', '==', user.email).get().then((r) => {
            let customerPhone = r._docs[0]._data.contactNumber;
            console.log('CUSTOMER PHONE  ', customerPhone);

            firestore().collection('Listings').where('listingNumber', '==', listingId).get().then(querySnapshot => {
                // console.log('data is', querySnapshot._docs[0]._data)
                console.log('DOC ID IS: ', querySnapshot.docs[0].id)
                console.log('!!LANDLORD PHONE IS: ', querySnapshot._docs[0]._data.landlordPhone)

                let landLordPhone = querySnapshot._docs[0]._data.landlordPhone;
                let tempBookedDates = querySnapshot._docs[0]._data.bookedDates;
                let newArray = tempBookedDates.concat(bookDate)
                let currentPrice = querySnapshot._docs[0]._data.price;
                //console.log('concat array is ', newArray)


                firestore().collection('Listings').doc(querySnapshot.docs[0].id)
                    .update({
                        bookedDates: newArray
                    })
                    .then((r) => {
                        console.log('Booked Dates updated!', r);
                        let tempDate = date.toISOString()

                        firestore().collection('Rezervations')
                            .add({
                                coverImage: img,
                                date: tempDate,
                                paid: false,
                                priceBookedAt: currentPrice,
                                listingId: querySnapshot.docs[0].id,
                                rezervantEmail: user.email,
                                title: selectedHome.title,
                                landLordEmail: selectedHome.landLordEmail,
                                listingNumber: selectedHome.listingNumber,
                                bookedDate: selectedDatesForProp,
                                landlordPhone: landLordPhone ? landLordPhone : '0000',
                                customerPhone: customerPhone,
                                rezervationNumber: Math.floor(Math.random() * 10000000).toString().substring(0, 7),
                            })
                            .then(() => {
                                console.log('Rezervation added!');
                                populateCalendar(selectedDatesForProp)
                                setIsReceiptModalVisable(true)

                                //setPrice('')
                                //setTitle('')
                                // fetchData('Listings')
                                setIsModalVisable(false)
                                setIsLoading(false)
                            });




                    });

            })

        })

    }



    const fetchRelatedLandlordDetails = async (landLordEmail) => {
        console.log('FETCH RELATEDLANDLORD DETAILS DATA STARTED....')
        setIsLoading(true)

        firestore().collection('LandLords').where('landLordEmail', '==', landLordEmail).get().then(querySnapshot => {


            console.log('INSIDE FETCH DATA related landlor....', querySnapshot.size)

            querySnapshot.forEach(documentSnapshot => {
                // console.log('WWWWWWWWWWWW', documentSnapshot.data())
                //documentSnapshot.data()['rezervationId'] = documentSnapshot.id
                //  tempRezervationsList.push(documentSnapshot.data())
                //setHomesList(documentSnapshot.data())
                setSelectedRelatedLandlord(documentSnapshot.data())
            });


            //  setRezervationsList(tempRezervationsList)



        }).finally(() => {
            setIsLoading(false)
            // setIsDateModalVisable(true)


        });


    }


    useEffect(() => {
        setValueType2(route.params.categoryName)
        //fetchData(route.params.categoryName, pageNumber, route.params.selectedDatesForProp, '1')
        setSelectedInitialRegion({

        })
    }, []);



    // console.log('CCCCCCCCCCC', route.params.categoryName)

    const [isFavourite, setIsFavourite] = useState(false)


    const [isPopupVisable, setIsPopupVisable] = useState(false)
    const [selectedHomeImages, setSelectedHomeImages] = useState([])
    const [buttonColor, setButtonColor] = useState('rgba(214, 61, 61,0.4)')

    const features = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "coordinates": [
                        [
                            [
                                50.35902758774506,
                                40.30220693339763
                            ],
                            [
                                50.30960578035888,
                                40.422708042182904
                            ],
                            [
                                50.102039060095365,
                                40.54299369597166
                            ],
                            [
                                49.99331320571207,
                                40.58804512895614
                            ],
                            [
                                49.627592722148734,
                                40.573029426408965
                            ],
                            [
                                49.4990854071753,
                                40.678050526561265
                            ],
                            [
                                49.31128547244123,
                                40.91001491932437
                            ],
                            [
                                49.15315704377278,
                                41.16350712946607
                            ],
                            [
                                49.083976123242564,
                                41.37894928314881
                            ],
                            [
                                48.86652513654005,
                                41.61584636877623
                            ],
                            [
                                48.60953495647041,
                                41.84450799589658
                            ],
                            [
                                48.00541214594159,
                                41.489811336696334
                            ],
                            [
                                47.946132280548596,
                                41.32655733025308
                            ],
                            [
                                47.81769904580318,
                                41.20773204772112
                            ],
                            [
                                47.62998989591199,
                                41.2448801540952
                            ],
                            [
                                47.442250507126346,
                                41.28948549296763
                            ],
                            [
                                47.205099436956914,
                                41.423017446144314
                            ],
                            [
                                47.106333200189,
                                41.622691822250204
                            ],
                            [
                                46.9778582594553,
                                41.60057470356438
                            ],
                            [
                                46.76057119368312,
                                41.87326842818163
                            ],
                            [
                                46.38484373269276,
                                41.90297793429124
                            ],
                            [
                                46.27590972375549,
                                41.79277061657817
                            ],
                            [
                                46.12756079698369,
                                41.785488098213136
                            ],
                            [
                                46.18679899576094,
                                41.69704205100115
                            ],
                            [
                                46.324390649374806,
                                41.57233168994432
                            ],
                            [
                                46.30467355432188,
                                41.46869375322123
                            ],
                            [
                                46.64067382536126,
                                41.327859242763765
                            ],
                            [
                                46.62092760137105,
                                41.13458569589886
                            ],
                            [
                                46.443026994660926,
                                41.097353850290574
                            ],
                            [
                                46.29480609038154,
                                41.21639808660561
                            ],
                            [
                                46.02792598785501,
                                41.186667814818264
                            ],
                            [
                                45.74139587443918,
                                41.27582170686557
                            ],
                            [
                                45.751261466770046,
                                41.372317147432796
                            ],
                            [
                                45.55365870071648,
                                41.387120751159216
                            ],
                            [
                                45.316430591193495,
                                41.44642473423281
                            ],
                            [
                                45.088990393354436,
                                41.387176171635105
                            ],
                            [
                                45.000179792397944,
                                41.268385861612074
                            ],
                            [
                                45.16825709514757,
                                41.12707796462823
                            ],
                            [
                                44.97080320605966,
                                41.10469468544517
                            ],
                            [
                                45.06962647337551,
                                41.0227338372996
                            ],
                            [
                                45.17842185218643,
                                40.97050535487503
                            ],
                            [
                                45.30675910225759,
                                40.97053238206402
                            ],
                            [
                                45.48466430653011,
                                40.895869429122854
                            ],
                            [
                                45.54407128972116,
                                40.8136289745936
                            ],
                            [
                                45.28754237090499,
                                40.67908050037818
                            ],
                            [
                                45.356775022118455,
                                40.5965969992952
                            ],
                            [
                                45.50506925141124,
                                40.46141199857374
                            ],
                            [
                                45.67304861871463,
                                40.30335698971166
                            ],
                            [
                                45.851020388914264,
                                40.10717273615987
                            ],
                            [
                                45.55460316965679,
                                40.05425321167408
                            ],
                            [
                                45.6041606070103,
                                39.88012278584995
                            ],
                            [
                                46.24612463788779,
                                39.51515227373818
                            ],
                            [
                                46.38434096809712,
                                39.270738539168065
                            ],
                            [
                                46.44362582722789,
                                38.941030915368
                            ],
                            [
                                46.15751692658927,
                                39.09484943639359
                            ],
                            [
                                45.979479501587065,
                                39.3778717896528
                            ],
                            [
                                45.90047625505912,
                                39.45421592181279
                            ],
                            [
                                45.78200517225548,
                                39.62187112362247
                            ],
                            [
                                45.41612892450172,
                                39.54562787269518
                            ],
                            [
                                45.08931550196465,
                                39.8521417052593
                            ],
                            [
                                44.653687392158446,
                                39.71537294877996
                            ],
                            [
                                44.92051934254735,
                                39.38008216290561
                            ],
                            [
                                45.068688475036936,
                                39.318929913377815
                            ],
                            [
                                45.157728263280745,
                                39.10455833665321
                            ],
                            [
                                45.43443436471168,
                                39.004795457151005
                            ],
                            [
                                45.77060254494444,
                                38.7972272609195
                            ],
                            [
                                46.25481603467202,
                                38.77412345233134
                            ],
                            [
                                46.61067502630422,
                                38.84350385376797
                            ],
                            [
                                46.86724112509049,
                                39.11214590464826
                            ],
                            [
                                47.16375790922996,
                                39.1658210661158
                            ],
                            [
                                47.62556831732928,
                                39.493041696507305
                            ],
                            [
                                47.96160955870877,
                                39.60734546993319
                            ],
                            [
                                48.24824072122465,
                                39.33267989266497
                            ],
                            [
                                48.01103285747428,
                                39.233256236831664
                            ],
                            [
                                48.20869351799939,
                                39.04932065407377
                            ],
                            [
                                47.94186659239705,
                                38.96494494483312
                            ],
                            [
                                48.06044946523369,
                                38.703278457141636
                            ],
                            [
                                48.2877266791194,
                                38.51021221747271
                            ],
                            [
                                48.49523587837595,
                                38.39415079833796
                            ],
                            [
                                48.811599468573576,
                                38.33958550385489
                            ],
                            [
                                48.89071720139498,
                                38.61804624430394
                            ],
                            [
                                48.87094892196254,
                                38.88783161838734
                            ],
                            [
                                48.979674458839895,
                                38.972410599791345
                            ],
                            [
                                48.94013789997504,
                                39.13359936845964
                            ],
                            [
                                49.0093268779886,
                                39.21022656576599
                            ],
                            [
                                49.108168275150945,
                                39.079910660138836
                            ],
                            [
                                49.28608279004311,
                                39.12593205685536
                            ],
                            [
                                49.276198650326904,
                                39.2944200145694
                            ],
                            [
                                49.43434488578549,
                                39.2944200145694
                            ],
                            [
                                49.375040047488085,
                                39.43960685205869
                            ],
                            [
                                49.26631451061073,
                                39.52352437805868
                            ],
                            [
                                49.404690817608525,
                                39.69866123259263
                            ],
                            [
                                49.45817613788438,
                                40.11573868353631
                            ],
                            [
                                49.5986485761727,
                                40.24502579586499
                            ],
                            [
                                49.81443231470992,
                                40.31678034514297
                            ],
                            [
                                50.114969672484115,
                                40.33821981000301
                            ],
                            [
                                50.35902758774506,
                                40.30220693339763
                            ]
                        ]
                    ],
                    "type": "Polygon"
                }
            }
        ]
    }
    const requestUserLocation = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
                {
                    title: 'Cool Photo App Camera Permission',
                    message:
                        'Cool Photo App needs access to your camera ' +
                        'so you can take awesome pictures.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('You can use the location');

                Geolocation.getCurrentPosition(
                    (position) => {
                        console.log(position);
                        setCurrentLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude })
                    },
                    (error) => {
                        // See error code charts below.
                        console.log(error.code, error.message);
                    },
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
                );

            } else {
                alert('Konum icazəsi yoxdur. Zəhmət olmazsa ayarları yoxlayın')
                console.log('Camera permission denied');
            }
        } catch (err) {
            console.warn(err);
        }
    };
    //console.log(route)

    const exampleHomesList = [
        { title: '3 Metrebeli Villa', price: '100 azn', img: require('../images/testHom.jpg'), details: 'Daglar qoynunda evzsiz istirahet etmek steyenlerin nezerine. bundan yaxsi ev tapa bilmezsiz... buyurun gelin beyendiyiniz yerden oturun' },
        { title: 'Menzil', price: '200 azn', img: require('../images/testHom2.jpg') },

    ]

    const [markedDates, setMarkedDates] = useState(
        {

        }
    )
    const [selectedHome, setSelectedHome] = useState()

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

    const [selectedRelatedLandlord, setSelectedRelatedLandlord] = useState(null)


    const [selectedCity, setSelectedCity] = useState({
        name: 'Qəbələ',
        location: {
            latitude: 40.98187485456937,
            longitude: 47.841374315321445,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        }
    })

    const [selectedInitialRegion, setSelectedInitialRegion] = useState({
        location: { "latitude": 39.865265277542065, "latitudeDelta": 6.1198731662127415, "longitude": 47.74687774479389, "longitudeDelta": 5.059211477637291 }
    })


    const [heartColor, setHeartColor] = useState('white')


    const [width1, setWidth1] = useState(50)
    const [width2, setWidth2] = useState(50)
    const [width3, setWidth3] = useState(120)
    const [borderRadius, setBorderRadius] = useState(50)
    const [borderRadius2, setBorderRadius2] = useState(50)
    const [borderRadius3, setBorderRadius3] = useState(5)

    const [defaultRegionLatitude, setDefaultRegionLatitude] = useState(40.98187485456937)
    const [defaultRegionLongitude, setDefaultRegionLongitude] = useState(47.841374315321445)
    const [defaultRegionLatitudeDelta, setDefaultRegionLatitudeDelta] = useState(0.09218795154106374)
    const [defaultRegionLongitudeDelta, setDefaultRegionLongitudeDelta] = useState(0.07620055228472467)


    const options = {
        latitude: selectedHome ? selectedHome.lat : 0,
        longitude: selectedHome ? selectedHome.lon : 0,
        // title: 'The White House',
        dialogTitle: 'Məkana get',
        dialogMessage: ' :Cihazınızda yüklü olan naviqasiya proqramlarından birini seçin',
        cancelText: 'Geri',
    };

    //const markers = [latlng:{ latitude: 40.9982, longitude: 47.8700 }]
    const markers = [{ latlng: { latitude: 40.9982, longitude: 47.8700 } }]

    if (!isLoading)
        return (
            <View style={{ height: '100%', width: '100%', backgroundColor: 'white' }}>
                <Modal coverScreen avoidKeyboard animationIn={'slideInUp'} style={{ backgroundColor: 'white', flex: 1 }} visible={true}>

                    <View style={{ alignItems: 'center', width: '100%', height: '100%', borderColor: 'red', borderWidth: 1, backgroundColor: 'grey' }}>



                            <DropDownPicker
                                dropDownContainerStyle={{ backgroundColor: 'green', }}
                                onSelectItem={e => {
                                    if (e.value == 'qebele') {
                                        console.log('##########@@@@@@$%%%%', e)
                                        setRegion({ "latitude": 40.9784139240519, "latitudeDelta": 0.4856045657889183, "longitude": 47.83605633303523, "longitudeDelta": 0.40767867118119483 })
                                    }
                                    else if (e.value == 'ismayilli') {
                                        console.log('##########@@@@@@$%%%%', e)
                                        setRegion({ "latitude": 40.87780748371316, "latitudeDelta": 0.4863444805538393, "longitude": 48.12051197513938, "longitudeDelta": 0.40767867118120193 })
                                    }

                                    else if (e.value == 'samaxi') {
                                        console.log('##########@@@@@@$%%%%', e)
                                        setRegion({ "latitude": 40.62483504541607, "latitudeDelta": 0.3108953710491136, "longitude": 48.633444886654615, "longitudeDelta": 0.2596173807978559 })
                                    }

                                    else if (e.value == 'quba') {
                                        console.log('##########@@@@@@$%%%%', e)
                                        setRegion({ "latitude": 41.27621325063815, "latitudeDelta": 0.4609764958427931, "longitude": 48.476893063634634, "longitudeDelta": 0.38876306265592575 })
                                    }

                                    else if (e.value == 'seki') {
                                        console.log('##########@@@@@@$%%%%', e)
                                        setRegion({ "latitude": 41.197659271249066, "latitudeDelta": 0.46153083554221297, "longitude": 47.18480659648776, "longitudeDelta": 0.38876306265592575 })
                                    }

                                    else if (e.value == 'qax') {
                                        console.log('##########@@@@@@$%%%%', e)
                                        setRegion({ "latitude": 41.34205120801623, "latitudeDelta": 0.46051122306906933, "longitude": 46.92324260249734, "longitudeDelta": 0.38876306265592575 })
                                    }



                                    else if (e.value == 'gence') {
                                        console.log('##########@@@@@@$%%%%', e)
                                        setRegion({ "latitude": 40.6575222289126, "latitudeDelta": 0.4256787723348978, "longitude": 46.322240866720676, "longitudeDelta": 0.3556441515684128 })
                                    }

                                    else if (e.value == 'lenkeran') {
                                        console.log('##########@@@@@@$%%%%', e)
                                        setRegion({ "latitude": 38.71357894899165, "latitudeDelta": 0.13032592560367107, "longitude": 48.788418900221586, "longitudeDelta": 0.10586041957139969 })
                                    }
                                }}
                                containerStyle={{
                                    borderWidth: 0,
                                    //  zIndex:30
                                }}
                                onOpen={() => {
                                    console.log('NOT OPEN1.. OPENING..')
                                    //setWidth3(120)
                                    setOpenRoomNumber(false)
                                    setWidth2(50)
                                    setBorderRadius2(50)
                                    setBorderRadius3(5)
                                    setWidth1(120)
                                    setBorderRadius(50)
                                    setWidth3(120)
                                }}
                                onClose={() => {
                                    console.log('OPEN.. CLOSING..')
                                    setWidth2(50)
                                    setWidth3(50)
                                    setBorderRadius3(50)
                                    setBorderRadius2(50)
                                    setWidth1(50)
                                    setBorderRadius(50)
                                    setOpenType2(false)
                                }}
                                onPress={() => {
                                }}
                                labelStyle={{ color: '#455669' }}
                                textStyle={{ color: '#455669', }}
                                arrowIconStyle={{ tintColor: '#455669' }}
                                // onPress={()=>setButtonColor('red')}
                                style={{ borderWidth: 5, }}
                                placeholder='Şəhər seç'
                                placeholderStyle={{ color: '#455669' }}
                                open={openType}
                                value={valueType}
                                items={typeItems}
                                setOpen={setOpenType}
                                setValue={setValueType}
                                setItems={setTypeItems}
                            />
                        </View>






                </Modal>

                <MapView
                    mapType='satellite'
                    showsMyLocationButton={false}
                    showsUserLocation={true}
                    followsUserLocation
                    moveOnMarkerPress={false}
                    onPress={(e) => {
                        //console.log(e.nativeEvent.coordinate)
                        //alert('!!', e.nativeEvent.coordinate)
                    }}
                    onRegionChangeComplete={(e) => {
                        //setDefaultRegionLatitude(e.latitude)
                        // setDefaultRegionLongitude(e.longitude)
                        //setDefaultRegionLatitudeDelta(e.latitudeDelta)
                        //setDefaultRegionLongitudeDelta(e.longitudeDelta)
                        setRegion({
                            latitude: e.latitude,
                            longitude: e.longitude,
                            latitudeDelta: e.latitudeDelta,
                            longitudeDelta: e.longitudeDelta,
                        })
                        //alert('SSSS', e.nativeEvent.coordinate)
                        //  console.log('SSSSSSS', region)
                    }}
                    region={region}
                    style={{ height: '100%', width: '100%' }}
                    customMapStyle={customStyle}
                    minZoomLevel={5}
                    maxZoomLevel={17}
                    initialRegion={selectedInitialRegion.location}
                >

                    <Geojson
                        geojson={features} // geojson of the countries you want to highlight
                        strokeColor="rgba(49, 191, 68, 0.4)"
                        fillColor="rgba(49, 191, 68, 0.05)"
                        strokeWidth={2}
                    />

                    {
                        <MapMarker
                            onPress={() => {
                                console.log('here')

                            }}
                            title={''}
                            coordinate={{ latitude: currentLocation.latitude, longitude: currentLocation.longitude }}>
                            <View style={{ height: 45, width: 45, borderRadius: 30, borderWidth: 0, borderColor: '#998d8d', justifyContent: 'center', alignItems: 'center' }}>
                                <LottieView style={{ width: 70, height: 70 }} source={require('../lottie/location.json')} autoPlay loop />
                            </View>


                        </MapMarker>

                    }
                    <MapMarker
                        onPress={() => {
                            console.log('pressed')
                            //setRegion({ "latitude": 40.804966855258655, "latitudeDelta": 0.09504057903349405, "longitude": 48.16556956619024, "longitudeDelta": 0.0783386081457138 })
                        }}
                        title={null}
                        coordinate={{ latitude: 40.790505, longitude: 48.163332 }}>
                        <View style={{ borderWidth: 0, borderColor: 'yellow', }}>
                            <LottieView style={{ width: 15, height: 15, alignSelf: 'center' }} source={require('../lottie/pin.json')} loop autoPlay />
                            <Text style={{ color: 'white', fontSize: 9, fontWeight: 'bold', alignSelf: 'center' }}>İsmayıllı</Text>
                        </View>
                    </MapMarker>

                    <MapMarker
                        onPress={() => {
                            console.log('pressed')
                            // setValueType('qebele')
                            //setRegion({ "latitude": 40.97644117371152, "latitudeDelta": 0.09220764062408904, "longitude": 47.84313568845391, "longitudeDelta": 0.07620055228471756 })
                        }}
                        title={null}
                        coordinate={{ latitude: 40.97644117371152, longitude: 47.84313568845391 }}>
                        <View style={{ borderWidth: 0, borderColor: 'yellow', }}>

                            <LottieView style={{ width: 15, height: 15, alignSelf: 'center' }} source={require('../lottie/pin.json')} loop autoPlay />
                            <Text style={{ color: 'white', fontSize: 9, fontWeight: 'bold', alignSelf: 'center' }}>Qəbələ</Text>

                        </View>
                    </MapMarker>


                    <MapMarker
                        onPress={() => {
                            console.log('pressed')
                            // setValueType('quba')

                            // setRegion({ "latitude": 41.37024802756099, "latitudeDelta": 0.08495011846368072, "longitude": 48.52892758324742, "longitudeDelta": 0.07062625139952416 })
                        }}
                        title={null}
                        coordinate={{ latitude: 41.151093, longitude: 48.550339 }}>
                        <View style={{ borderWidth: 0, borderColor: 'yellow', padding: 5 }}>
                            <LottieView style={{ width: 15, height: 15, alignSelf: 'center' }} source={require('../lottie/pin.json')} loop autoPlay />

                            <Text style={{ color: 'white', fontSize: 9, fontWeight: 'bold' }}>Quba</Text>
                        </View>
                    </MapMarker>


                    <MapMarker
                        style={{}}
                        onPress={() => {
                            console.log('pressed')
                            //setValueType('qax')

                            //  setRegion(
                            // { "latitude": 41.42101136833839, "latitudeDelta": 0.13941521306858817, "longitude": 46.92533338442445, "longitudeDelta": 0.1159984990954328 }
                            ///)
                        }}
                        title={null}
                        coordinate={{ latitude: 41.422736, longitude: 46.931833 }}>
                        <View style={{ borderWidth: 0, borderColor: 'yellow' }}>
                            <LottieView style={{ width: 15, height: 15, alignSelf: 'center' }} source={require('../lottie/pin.json')} loop autoPlay />

                            <Text style={{ color: 'white', fontSize: 9, fontWeight: 'bold' }}>Qax</Text>
                        </View>
                    </MapMarker>


                    <MapMarker
                        onPress={() => {
                            console.log('pressed')
                            //setRegion(
                            //     { "latitude": 41.20252914021577, "latitudeDelta": 0.1186270835861265, "longitude": 47.15447785332799, "longitudeDelta": 0.0983716920018054 }
                            // )
                        }}
                        title={null}
                        coordinate={{ latitude: 41.197691, longitude: 47.171856 }}>
                        <View style={{ borderWidth: 0, borderColor: 'yellow' }}>
                            <LottieView style={{ width: 15, height: 15, alignSelf: 'center' }} source={require('../lottie/pin.json')} loop autoPlay />

                            <Text style={{ color: 'white', fontSize: 9, fontWeight: 'bold' }}>Şəki</Text>
                        </View>
                    </MapMarker>




                    <MapMarker
                        onPress={() => {
                            console.log('pressed')
                            // setRegion(
                            //   { "latitude": 39.758504, "latitudeDelta": 0.04135469093915134, "longitude": 46.748542, "longitudeDelta": 0.03310013562441583 })
                        }}
                        title={null}
                        coordinate={{ latitude: 39.758504, longitude: 46.748542 }}>
                        <View style={{ borderWidth: 0, borderColor: 'yellow' }}>
                            <LottieView style={{ width: 15, height: 15, alignSelf: 'center' }} source={require('../lottie/pin.json')} loop autoPlay />
                            <Text style={{ color: 'white', fontSize: 9, fontWeight: 'bold' }}>Şuşa</Text>
                        </View>
                    </MapMarker>


                    <MapMarker
                        onPress={() => {
                            console.log('pressed')
                            //setRegion(
                            //  { "latitude": 40.688326, "latitudeDelta": 0.04135469093915134, "longitude": 46.356658, "longitudeDelta": 0.03310013562441583 })
                        }}
                        title={null}
                        coordinate={{ latitude: 40.688326, longitude: 46.356658 }}>
                        <View style={{ borderWidth: 0, borderColor: 'yellow' }}>
                            <LottieView style={{ width: 15, height: 15, alignSelf: 'center' }} source={require('../lottie/pin.json')} loop autoPlay />
                            <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 9, fontWeight: 'bold' }}>Gəncə</Text>
                        </View>
                    </MapMarker>


                    <MapMarker
                        style={{ zIndex: -10, position: 'absolute' }}
                        onPress={() => {
                            console.log('pressed')

                            // setRegion(
                            //    { "latitude": 41.117265, "latitudeDelta": 0.04135469093915134, "longitude": 45.447371, "longitudeDelta": 0.03310013562441583 })
                        }}
                        title={null}
                        coordinate={{ latitude: 41.117265, longitude: 45.447371 }}>
                        <View style={{ borderWidth: 0, borderColor: 'yellow' }}>
                            <LottieView style={{ width: 15, height: 15, alignSelf: 'center' }} source={require('../lottie/pin.json')} loop autoPlay />
                            <Text style={{ color: 'white', fontSize: 9, fontWeight: 'bold' }}>Ağstafa</Text>
                        </View>
                    </MapMarker>


                    <MapMarker
                        onPress={() => {
                            console.log('pressed')
                            // setRegion(
                            //     { "latitude": 38.756955, "latitudeDelta": 0.04135469093915134, "longitude": 48.844045, "longitudeDelta": 0.03310013562441583 })
                        }}
                        title={null}
                        coordinate={{ latitude: 38.756955, longitude: 48.844045 }}>
                        <View style={{ borderWidth: 0, borderColor: 'yellow' }}>
                            <LottieView style={{ width: 15, height: 15, alignSelf: 'center' }} source={require('../lottie/pin.json')} loop autoPlay />
                            <Text style={{ color: 'white', fontSize: 9, fontWeight: 'bold' }}>Lənkəran</Text>
                        </View>
                    </MapMarker>



                    <MapMarker
                        onPress={() => {
                            //  console.log('pressed')
                            // setRegion(
                            //   { "latitude": 39.192787, "latitudeDelta": 0.04135469093915134, "longitude": 45.387417, "longitudeDelta": 0.03310013562441583 })
                        }}
                        title={null}
                        coordinate={{ latitude: 39.192787, longitude: 45.387417 }}>
                        <View style={{ borderWidth: 0, borderColor: 'yellow' }}>
                            <LottieView style={{ width: 15, height: 15, alignSelf: 'center' }} source={require('../lottie/pin.json')} loop autoPlay />
                            <Text style={{ color: 'white', fontSize: 9, fontWeight: 'bold' }}>Naxçıvan</Text>
                        </View>
                    </MapMarker>



                    <MapMarker
                        onPress={() => {
                            console.log('pressed')
                            // setRegion(
                            //   { "latitude": 40.633028, "latitudeDelta": 0.04135469093915134, "longitude": 48.639156, "longitudeDelta": 0.03310013562441583 })
                        }}
                        title={null}
                        coordinate={{ latitude: 40.633028, longitude: 48.639156 }}>
                        <View style={{ borderWidth: 0, borderColor: 'yellow' }}>
                            <LottieView style={{ width: 15, height: 15, alignSelf: 'center' }} source={require('../lottie/pin.json')} loop autoPlay />
                            <Text style={{ color: 'white', fontSize: 9, fontWeight: 'bold' }}>Şamaxı</Text>
                        </View>
                    </MapMarker>

                    <MapMarker
                        onPress={() => {
                            console.log('pressed')
                            // setRegion(
                            //   { "latitude": 40.633028, "latitudeDelta": 0.04135469093915134, "longitude": 48.639156, "longitudeDelta": 0.03310013562441583 })
                        }}
                        title={null}
                        coordinate={{ latitude: 41.411829, longitude: 48.300573 }}>
                        <View style={{ borderWidth: 0, borderColor: 'yellow' }}>
                            <LottieView style={{ width: 15, height: 15, alignSelf: 'center' }} source={require('../lottie/pin.json')} loop autoPlay />
                            <Text style={{ color: 'white', fontSize: 9, fontWeight: 'bold' }}>Qusar</Text>
                        </View>
                    </MapMarker>


                    <MapMarker
                        onPress={() => {
                            console.log('pressed')
                            // setRegion(
                            //   { "latitude": 40.633028, "latitudeDelta": 0.04135469093915134, "longitude": 48.639156, "longitudeDelta": 0.03310013562441583 })
                        }}
                        title={null}
                        coordinate={{ latitude: 41.367012, longitude: 48.865429, }}>
                        <View style={{ borderWidth: 0, borderColor: 'yellow' }}>
                            <LottieView style={{ width: 15, height: 15, alignSelf: 'center' }} source={require('../lottie/pin.json')} loop autoPlay />
                            <Text style={{ color: 'white', fontSize: 9, fontWeight: 'bold' }}>Xaçmaz</Text>
                        </View>
                    </MapMarker>


                    <MapMarker
                        onPress={() => {
                            console.log('pressed')
                            // setRegion(
                            //   { "latitude": 40.633028, "latitudeDelta": 0.04135469093915134, "longitude": 48.639156, "longitudeDelta": 0.03310013562441583 })
                        }}
                        title={null}
                        coordinate={{ latitude: 41.063344, longitude: 47.459567, }}>
                        <View style={{ borderWidth: 0, borderColor: 'yellow' }}>
                            <LottieView style={{ width: 15, height: 15, alignSelf: 'center' }} source={require('../lottie/pin.json')} loop autoPlay />
                            <Text style={{ color: 'white', fontSize: 9, fontWeight: 'bold' }}>Oğuz</Text>
                        </View>
                    </MapMarker>

                    <MapMarker
                        onPress={() => {
                            console.log('pressed')
                            // setRegion(
                            //   { "latitude": 40.633028, "latitudeDelta": 0.04135469093915134, "longitude": 48.639156, "longitudeDelta": 0.03310013562441583 })
                        }}
                        title={null}
                        coordinate={{ latitude: 38.450205, longitude: 48.830848 }}>
                        <View style={{ borderWidth: 0, borderColor: 'yellow' }}>
                            <LottieView style={{ width: 15, height: 15, alignSelf: 'center' }} source={require('../lottie/pin.json')} loop autoPlay />
                            <Text style={{ color: 'white', fontSize: 9, fontWeight: 'bold' }}>Astara</Text>
                        </View>
                    </MapMarker>



                    <MapMarker
                        onPress={() => {
                            console.log('pressed')
                            // setRegion(
                            //   { "latitude": 40.633028, "latitudeDelta": 0.04135469093915134, "longitude": 48.639156, "longitudeDelta": 0.03310013562441583 })
                        }}
                        title={null}
                        coordinate={{ latitude: 39.051319, longitude: 48.631323 }}>
                        <View style={{ borderWidth: 0, borderColor: 'yellow' }}>
                            <LottieView style={{ width: 15, height: 15, alignSelf: 'center' }} source={require('../lottie/pin.json')} loop autoPlay />
                            <Text style={{ color: 'white', fontSize: 9, fontWeight: 'bold' }}>Masallı</Text>
                        </View>
                    </MapMarker>


                    <MapMarker
                        onPress={() => {
                            console.log('pressed')
                            // setRegion(
                            //   { "latitude": 40.633028, "latitudeDelta": 0.04135469093915134, "longitude": 48.639156, "longitudeDelta": 0.03310013562441583 })
                        }}
                        title={null}
                        coordinate={{ latitude: 40.334790, longitude: 49.704726 }}>
                        <View style={{ borderWidth: 0, borderColor: 'yellow' }}>
                            <LottieView style={{ width: 15, height: 15, alignSelf: 'center' }} source={require('../lottie/pin.json')} loop autoPlay />
                            <Text style={{ color: 'white', fontSize: 9, fontWeight: 'bold' }}>Bakı</Text>
                        </View>
                    </MapMarker>


                    <MapMarker
                        onPress={() => {
                            console.log('pressed')
                            // setRegion(
                            //   { "latitude": 40.633028, "latitudeDelta": 0.04135469093915134, "longitude": 48.639156, "longitudeDelta": 0.03310013562441583 })
                        }}
                        title={null}
                        coordinate={{ latitude: 41.456225, longitude: 46.615179 }}>
                        <View style={{ borderWidth: 0, borderColor: 'yellow' }}>
                            <LottieView style={{ width: 15, height: 15, alignSelf: 'center' }} source={require('../lottie/pin.json')} loop autoPlay />
                            <Text style={{ color: 'white', fontSize: 9, fontWeight: 'bold' }}>Zaqatala</Text>
                        </View>
                    </MapMarker>

                    <MapMarker
                        onPress={() => {
                            console.log('pressed')
                            // setRegion(
                            //   { "latitude": 40.633028, "latitudeDelta": 0.04135469093915134, "longitude": 48.639156, "longitudeDelta": 0.03310013562441583 })
                        }}
                        title={null}
                        coordinate={{ latitude: 41.607503, longitude: 46.335370 }}>
                        <View style={{ borderWidth: 0, borderColor: 'yellow' }}>
                            <LottieView style={{ width: 15, height: 15, alignSelf: 'center' }} source={require('../lottie/pin.json')} loop autoPlay />
                            <Text style={{ color: 'white', fontSize: 9, fontWeight: 'bold' }}>Balakən</Text>
                        </View>
                    </MapMarker>









                    {
                        homesList.map((arrayItem, index) => {

                            if (arrayItem.lon && arrayItem.lat) {
                                return (
                                    <MapMarker
                                        key={index}
                                        onPress={() => {
                                            console.log('SELECTED HOME IS ', arrayItem)
                                            setSelectedHome(arrayItem)
                                            setSelectedHomeImages(arrayItem.imgArray)
                                            fetchRelatedLandlordDetails(arrayItem.landLordEmail)
                                            setIsModalVisable(true)
                                        }}
                                        title={null}
                                        coordinate={{ latitude: homesList[0] ? arrayItem.lat : 0, longitude: homesList[0] ? arrayItem.lon : 0 }}>
                                        <View style={{ borderWidth: 0, borderColor: 'yellow' }}>

                                            <Image source={require('../images/pin4.png')} style={{ height: 40, width: 40, borderWidth: 0, borderColor: 'red', }} />

                                            <View style={{ backgroundColor: '#FFED8B', justifyContent: 'center', alignItems: 'center', borderRadius: 3, borderColor: 'blue', borderWidth: 0 }}>
                                                <Text style={{ color: 'black', fontSize: 11, }}>{arrayItem.price}<Text style={{ fontWeight: 'bold' }}> ₼</Text></Text>
                                            </View>

                                            <Image source={homesList[0] ? { uri: arrayItem.imgArray[0] } : null} style={{ height: 28, width: 28, borderRadius: 30, borderWidth: 1, borderColor: 'white', position: 'absolute', top: 3, left: 6 }} />


                                        </View>



                                    </MapMarker>


                                )
                            }

                        })
                    }
                </MapView>

                <View style={{ position: 'absolute', top: 0, zIndex: 50 }}>
                    <DropDownPicker
                        dropDownContainerStyle={{ backgroundColor: 'red', zIndex: 100 }}
                        onSelectItem={e => {
                            if (e.value == 'qebele') {
                                console.log('##########@@@@@@$%%%%', e)
                                setRegion({ "latitude": 40.9784139240519, "latitudeDelta": 0.4856045657889183, "longitude": 47.83605633303523, "longitudeDelta": 0.40767867118119483 })
                            }
                            else if (e.value == 'ismayilli') {
                                console.log('##########@@@@@@$%%%%', e)
                                setRegion({ "latitude": 40.87780748371316, "latitudeDelta": 0.4863444805538393, "longitude": 48.12051197513938, "longitudeDelta": 0.40767867118120193 })
                            }

                            else if (e.value == 'samaxi') {
                                console.log('##########@@@@@@$%%%%', e)
                                setRegion({ "latitude": 40.62483504541607, "latitudeDelta": 0.3108953710491136, "longitude": 48.633444886654615, "longitudeDelta": 0.2596173807978559 })
                            }

                            else if (e.value == 'quba') {
                                console.log('##########@@@@@@$%%%%', e)
                                setRegion({ "latitude": 41.27621325063815, "latitudeDelta": 0.4609764958427931, "longitude": 48.476893063634634, "longitudeDelta": 0.38876306265592575 })
                            }

                            else if (e.value == 'seki') {
                                console.log('##########@@@@@@$%%%%', e)
                                setRegion({ "latitude": 41.197659271249066, "latitudeDelta": 0.46153083554221297, "longitude": 47.18480659648776, "longitudeDelta": 0.38876306265592575 })
                            }

                            else if (e.value == 'qax') {
                                console.log('##########@@@@@@$%%%%', e)
                                setRegion({ "latitude": 41.34205120801623, "latitudeDelta": 0.46051122306906933, "longitude": 46.92324260249734, "longitudeDelta": 0.38876306265592575 })
                            }



                            else if (e.value == 'gence') {
                                console.log('##########@@@@@@$%%%%', e)
                                setRegion({ "latitude": 40.6575222289126, "latitudeDelta": 0.4256787723348978, "longitude": 46.322240866720676, "longitudeDelta": 0.3556441515684128 })
                            }

                            else if (e.value == 'lenkeran') {
                                console.log('##########@@@@@@$%%%%', e)
                                setRegion({ "latitude": 38.71357894899165, "latitudeDelta": 0.13032592560367107, "longitude": 48.788418900221586, "longitudeDelta": 0.10586041957139969 })
                            }
                        }}
                        containerStyle={{
                            borderWidth: 0,
                            //  zIndex:30
                        }}
                        onOpen={() => {
                            console.log('NOT OPEN1.. OPENING..')
                            //setWidth3(120)
                            setOpenRoomNumber(false)
                            setWidth2(50)
                            setBorderRadius2(50)
                            setBorderRadius3(5)
                            setWidth1(120)
                            setBorderRadius(50)
                            setWidth3(120)
                        }}
                        onClose={() => {
                            console.log('OPEN.. CLOSING..')
                            setWidth2(50)
                            setWidth3(50)
                            setBorderRadius3(50)
                            setBorderRadius2(50)
                            setWidth1(50)
                            setBorderRadius(50)
                            setOpenType2(false)
                        }}
                        onPress={() => {
                        }}
                        labelStyle={{ color: '#455669' }}
                        textStyle={{ color: '#455669', }}
                        arrowIconStyle={{ tintColor: '#455669' }}
                        // onPress={()=>setButtonColor('red')}
                        style={{ borderWidth: 5, }}
                        placeholder='Şəhər seç'
                        placeholderStyle={{ color: '#455669' }}
                        open={openType}
                        value={valueType}
                        items={typeItems}
                        setOpen={setOpenType}
                        setValue={setValueType}
                        setItems={setTypeItems}
                    />
                </View>
            </View>
        )
    else
        return (
            <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <LottieView style={{ width: 50, height: 50 }} source={require('../lottie/loading2.json')} autoPlay loop />
            </View>)
}