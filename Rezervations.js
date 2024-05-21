import { View, Text, ScrollView, Dimensions, TouchableOpacity, Modal, Image, Linking } from 'react-native'
import React, { useState, useEffect } from 'react'
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon5 from 'react-native-vector-icons/MaterialCommunityIcons';
import { Popup } from 'react-native-map-link';


import LottieView from 'lottie-react-native';
import { SliderBox } from "react-native-image-slider-box";

export default function Rezervations() {
    const user = auth().currentUser;

    const [isPopupVisable, setIsPopupVisable] = useState(false)

    const [mapNavOption, setMapNavOption] = useState(
        {
            latitude: selectedRezervedListing && selectedRezervedListing.lat ? selectedRezervedListing.lat : 0,
            longitude: selectedRezervedListing && selectedRezervedListing.lon ? selectedRezervedListing.lon : 0,
            // title: 'The White House',
            dialogTitle: 'Navigation to -',
            dialogMessage: ' :Select the app to navigate to the sampling point',
            cancelText: 'Cancel',
        }
    )

    const options = {
        latitude: selectedRezervedListing && selectedRezervedListing.lat ? selectedRezervedListing.lat : 0,
        longitude: selectedRezervedListing && selectedRezervedListing.lon ? selectedRezervedListing.lon : 0,
        // title: 'The White House',
        dialogTitle: 'Navigation to -',
        dialogMessage: ' :Select the app to navigate to the sampling point',
        cancelText: 'Cancel',
    };
    const [isLoading, setIsLoading] = useState(false)
    const [isModalVisable, setIsModalVisable] = useState(false)
    const [isDateModalVisable, setIsDateModalVisable] = useState(false)
    const [rezervationsList, setRezervationsList] = useState([])
    const [selectedRezervation, setSelectedRezervation] = useState()
    const [selectedRezervedListing, setSelectedRezervedListing] = useState(null)


    const [selectedRezervant, setSelectedRezervant] = useState()
    const [selectedRelatedLandlord, setSelectedRelatedLandlord] = useState()


    const [selectedRelatedCustomer, setSelectedRelatedCustomer] = useState()




    const fetchData = async (arg) => {
        console.log('FETCH REZERVATIONS DATA STARTED....')
        setIsLoading(true)

        firestore().collection(arg).where('rezervantEmail', '==', user.email).get().then(querySnapshot => {
            let tempRezervationsList = []

            console.log('INSIDE FETCH DATA....', querySnapshot.size)

            querySnapshot.forEach(documentSnapshot => {

                documentSnapshot.data()['rezervationId'] = documentSnapshot.id
                tempRezervationsList.push(documentSnapshot.data())
                //setHomesList(documentSnapshot.data())

            });
            // console.log('EEEEEEEEEEEE',tempRezervationsList[1].date )
            setRezervationsList(tempRezervationsList)

            const sorted = [...tempRezervationsList].sort((a, b) => {
                const one = new Date(a.date)
                const two = new Date(b.date)
                return two - one;
            });



            //tempRezervationsList.sort()
            setRezervationsList(sorted)



        }).finally(() => {
            setIsLoading(false)
            setIsModalVisable(false)


        });


    }



    const cancelRezervation = (selectedRezervation) => {

        console.log('--->>>>', selectedRezervation.rezervationNumber)

        setIsLoading(true)
        console.log('CANCEL REZERVATION STARTED.....****', selectedRezervation.categoryName)


        firestore().collection('Rezervations').where('rezervationNumber', '==', selectedRezervation.rezervationNumber).get().then(querySnapshot => {

            let tempRezervationDocumentID = null
            let listingNumber = null;
            let listingDocId = null
            let bookedDatesofListing = []
            let bookedDatesOfRezervation = []
            let date = new Date().toISOString().slice(0, 10)

            querySnapshot.forEach(documentSnapshot => {
                tempRezervationDocumentID = documentSnapshot.id
                listingNumber = documentSnapshot.data().listingNumber;
                bookedDatesOfRezervation = documentSnapshot.data().bookedDate
                console.log('---------XXX', listingNumber)
            })
            firestore().collection('Rezervations').doc(tempRezervationDocumentID)
                .update({
                    cancelled: true,
                    cancelledBy: selectedRelatedCustomer && selectedRelatedCustomer.landLordName ? selectedRelatedCustomer.landLordName : 'null',
                    cancelledAt: date,
                })
                .then(() => {
                    console.log('Rezervation Cancelled!');
                    setIsLoading(false)

                    firestore().collection('Listings').where('listingNumber', '==', listingNumber).get().then(querySnapshot => {
                        querySnapshot.forEach(documentSnapshot => {
                            listingDocId = documentSnapshot.id

                            bookedDatesofListing = documentSnapshot.data().bookedDates

                            console.log('1=============>', bookedDatesofListing)
                            console.log('2=============>', bookedDatesOfRezervation)

                            let tempBookedDates = bookedDatesofListing.filter(n => !bookedDatesOfRezervation.includes(n))

                            console.log('3=============>', tempBookedDates)

                            console.log('-----------CCCCCCC', documentSnapshot.id)
                            firestore().collection('Listings').doc(listingDocId).update({
                                bookedDates: tempBookedDates
                            }).then(() => {
                                setIsLoading(false)
                                setIsDateModalVisable(false)

                                alert('Rezervasiyanız ləğv olundu')
                            })
                        })
                    }).catch(e => {
                        setIsLoading(false)
                        alert('error is ', e)
                    });




                    // fetchData('Listings')
                }).catch(e => {
                    setIsLoading(false)
                    alert('error is ', e)
                });


        }).catch(e => {

            setIsLoading(false)
            alert('error is ', e)
        });



    }

    const fetchRezervantDetails = async (rezervantEmail) => {
        console.log('FETCH REZERVANT DETAILS DATA STARTED....')
        setIsLoading(true)

        firestore().collection('LandLords').where('landLordEmail', '==', rezervantEmail).get().then(querySnapshot => {
            let tempRezervantList = []

            console.log('INSIDE FETCH DATA REZERVANTTT....', querySnapshot.size)

            querySnapshot.forEach(documentSnapshot => {
                //   console.log('WWWWWWWWWWWW', documentSnapshot.data())
                //documentSnapshot.data()['rezervationId'] = documentSnapshot.id
                //  tempRezervationsList.push(documentSnapshot.data())
                //setHomesList(documentSnapshot.data())
                setSelectedRezervant(documentSnapshot.data())
            });


            //  setRezervationsList(tempRezervationsList)



        }).finally(() => {
            setIsLoading(false)
            setIsDateModalVisable(true)


        });


    }

    const fetchRelatedLandlordDetails = async (landLordEmail) => {
        console.log('fetchRelatedLandlordDetails STARTED....')
        setIsLoading(true)

        firestore().collection('LandLords').where('landLordEmail', '==', landLordEmail).get().then(querySnapshot => {


            console.log('INSIDE FETCH DATA related landlor....', querySnapshot.size)

            querySnapshot.forEach(documentSnapshot => {
                //  console.log('WWWWWWWWWWWW', documentSnapshot.data())
                //documentSnapshot.data()['rezervationId'] = documentSnapshot.id
                //  tempRezervationsList.push(documentSnapshot.data())
                //setHomesList(documentSnapshot.data())
                setSelectedRelatedLandlord(documentSnapshot.data())
            });


            //  setRezervationsList(tempRezervationsList)



        }).finally(() => {
            setIsLoading(false)
            setIsDateModalVisable(true)


        });


    }

    const fetchRelatedCustomerDetails = async (customerEmail) => {
        console.log('***FETCH RELATED REZERVANT DETAILS DATA STARTED....', customerEmail)
        setIsLoading(true)

        firestore().collection('LandLords').where('landLordEmail', '==', customerEmail).get().then(querySnapshot => {

            console.log('INSIDE FETCH DATA REZERVANTTT....', querySnapshot.docs)
            setSelectedRelatedCustomer(querySnapshot.docs[0].data())







            //  setRezervationsList(tempRezervationsList)



        }).finally(() => {
            setIsLoading(false)
            setIsDateModalVisable(true)


        });


    }


    const [noImage, setNoImage] = useState(false)
    const fetchSelectedRezervedListing = async (listingNumber) => {
        console.log('fetchSelectedRezervedListing  STARTED....', listingNumber)
        setIsLoading(true)

        firestore().collection('Listings').where('listingNumber', '==', listingNumber).get().then(querySnapshot => {

            console.log('INSIDE FETCH DATA....', querySnapshot.size)

            setTimeout(() => {
                // alert('time up')
                //console.log('UP', querySnapshot)
                if (!querySnapshot[0] || !querySnapshot[0].data()) {
                    setNoImage(true)
                }
            }, 9000)


            querySnapshot.forEach(documentSnapshot => {
                console.log('ZZZZZZZZZZZZZZZZZZZ', documentSnapshot.data())
                //documentSnapshot.data()['rezervationId'] = documentSnapshot.id
                //  tempRezervationsList.push(documentSnapshot.data())
                //setHomesList(documentSnapshot.data())


                setSelectedRezervedListing(documentSnapshot.data())
                setMapNavOption(
                    {
                        latitude: documentSnapshot.data() && documentSnapshot.data().lat ? documentSnapshot.data().lat : 0,
                        longitude: documentSnapshot.data() && documentSnapshot.data().lon ? documentSnapshot.data().lon : 0,
                        // title: 'The White House',
                        dialogTitle: 'Ünvana get',
                        dialogMessage: ' Telefonunuzda qurulu olan naviqasiya tədbiqini seçin:',
                        cancelText: 'Bağla',
                    }
                )
            });


            //  setRezervationsList(tempRezervationsList)



        }).finally(() => {
            setIsLoading(false)
            setIsDateModalVisable(true)
        });


    }

    useEffect(() => {
        fetchData('Rezervations')
    }, [])

    if (!isLoading)

        return (
            <View style={{ width: '100%', height: '100%', alignItems: 'center', }}>

                <Modal visible={isDateModalVisable}>

                    <View style={{ width: '100%', height: '100%', alignItems: 'center', backgroundColor: '#e6e6e6', borderColor: 'red', borderWidth: 0 }}>

                        <View style={{ borderRadius: 10, elevation: 4, width: '95%', height: '90%', borderColor: 'grey', borderWidth: 0, backgroundColor: 'white', alignItems: 'center', marginTop: '2%' }}>


                            <View style={{ width: '100%', borderColor: 'orange', borderWidth: 0, height: '70%' }}>


                                <View style={{ height: '45%', width: '100%', borderColor: 'blue', borderWidth: 0 }}>
                                    <View style={{ borderTopLeftRadius: 5, borderTopRightRadius: 5, width: '100%', backgroundColor: '#4B9C77', justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ color: 'white' }}>{selectedRezervedListing != null && selectedRezervedListing.title ? selectedRezervedListing != null && selectedRezervedListing.title : 'Elan yüklənir ...'}</Text>
                                    </View>

                                    <View style={{ borderColor: 'red', borderWidth: 0, width: '100%', height: '90%', alignItems: 'center' }}>

                                        {
                                            selectedRezervedListing != null && selectedRezervedListing.imgArray[0] ?
                                                <SliderBox style={{ height: '100%', width: '90%', borderRadius: 10, alignSelf: 'center' }} images={selectedRezervedListing.imgArray} />
                                                :
                                                noImage ?
                                                    <View style={{ marginTop: 60, }}>
                                                        <Icon style={{ alignSelf: 'center', }} name="error" size={24} color="#D4D4D4" />

                                                        <Text style={{ alignSelf: 'center', color: '#D4D4D4' }}>Şəkil yoxdur</Text>

                                                    </View>
                                                    :
                                                    <LottieView style={{ alignSelf: 'center', width: 90, height: 90 }} source={require('./lottie/loading2.json')} autoPlay loop />
                                        }

                                        <View style={{ position: 'absolute', top: 0, left: 0, backgroundColor: '#4fc4c2', padding: 5, borderColor: 'red', borderWidth: 0, flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={{ color: 'white', marginLeft: 10, fontSize: 12, fontStyle: 'italic' }}>Rezervasiya No:</Text>
                                            <Text style={{ color: 'white', marginLeft: 5, fontWeight: 'bold' }}>#{selectedRezervedListing != null && selectedRezervation.rezervationNumber ? selectedRezervation.rezervationNumber : null}</Text>
                                        </View>

                                        <View style={{ backgroundColor: '#0EC463', borderColor: 'red', borderWidth: 0, position: 'absolute', top: 0, right: '15%', justifyContent: 'center', alignItems: 'center', width: Dimensions.get('screen').width * 0.12, height: Dimensions.get('screen').width * 0.1, }}>
                                            <Text style={{ color: 'white', fontSize: 11, }}>{selectedRezervedListing != null && selectedRezervation.priceBookedAt ? selectedRezervation.priceBookedAt : null} ₼</Text>

                                        </View>


                                        <View style={{ borderColor: 'red', borderWidth: 0, position: 'absolute', top: 0, right: 0, justifyContent: 'center', alignItems: 'center', width: Dimensions.get('screen').width * 0.12, height: Dimensions.get('screen').width * 0.1, }}>
                                            <TouchableOpacity onPress={() => {
                                                setIsPopupVisable(true)
                                            }}
                                                style={{ backgroundColor: '#0EC463', borderRadius: 0, width: '100%', height: '100%', alignItems: 'center', height: '100%', justifyContent: 'center' }}>
                                                <Icon5 name="directions" size={24} color="white" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>


                                <View style={{ height: '55%', width: '100%', borderColor: 'red', borderWidth: 0 }}>

                                    <View style={{ borderTopRightRadius: 5, backgroundColor: 'grey', width: '100%', paddingLeft: '5%', marginTop: 5, }}>
                                        <Text style={{ color: 'white', }}>Rezerv olunma tarixləri</Text>
                                    </View>

                                    <View style={{
                                        height: '35%', borderColor: 'blue', borderWidth: 0
                                    }}>
                                        <ScrollView>
                                            <View style={{}}>
                                                {
                                                    selectedRezervation ? selectedRezervation.bookedDate.map((arrayItem, index) => {
                                                        // console.log('!!!!!!!!!!!!', arrayItem)
                                                        return (
                                                            <Text style={{ color: 'grey', marginLeft: '2%', marginTop: 5, }} key={index}>{arrayItem}</Text>
                                                        )

                                                    }) : null
                                                }
                                            </View>
                                        </ScrollView>
                                    </View>

                                    <View style={{ backgroundColor: 'grey', width: '100%', paddingLeft: '5%', borderColor: 'yellow', borderWidth: 0 }}>
                                        <Text style={{ color: 'white', }}>Ev sahibi:</Text>
                                    </View>

                                    <View style={{ borderColor: 'purple', borderColor: 'purple', borderWidth: 0 }}>

                                        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', borderWidth: 0, borderColor: 'blue', }}>

                                            <Text style={{ borderWidth: 0, borderColor: 'red', marginLeft: 10 }}>{selectedRelatedLandlord && selectedRelatedLandlord.landLordName ? selectedRelatedLandlord.landLordName : 'null'}</Text>

                                            <TouchableOpacity style={{ flexDirection: 'row', borderColor: 'red', borderWidth: 0, justifyContent: 'center', alignItems: 'center' }} onPress={() => {
                                                Linking.openURL(`tel:${selectedRelatedLandlord.contactNumber}`)
                                            }}>
                                                <Text style={{ marginLeft: '2%', marginTop: 0, color: 'blue' }}>{selectedRelatedLandlord && selectedRelatedLandlord.contactNumber ? selectedRelatedLandlord.contactNumber : 'null'}</Text>
                                                <Icon style={{ marginLeft: 10, }} name="phone" size={15} color="green" />
                                            </TouchableOpacity>

                                            <Popup
                                                isVisible={isPopupVisable}
                                                onCancelPressed={() => setIsPopupVisable(false)}
                                                onAppPressed={() => {
                                                    console.log('SS', selectedRezervedListing)
                                                    setIsPopupVisable(false)
                                                }

                                                }
                                                onBackButtonPressed={() => setIsPopupVisable(false)}
                                                modalProps={{
                                                    animationIn: 'slideInUp',
                                                }}
                                                appsWhiteList={['waze', 'google-maps']}
                                                options={mapNavOption}
                                                style={{ position: 'absolute' }}
                                            />



                                        </View>

                                    </View>

                                    <View style={{ backgroundColor: 'grey', width: '100%', paddingLeft: '5%', marginTop: 0, borderColor: 'red', borderWidth: 0 }}>
                                        <Text style={{ color: 'white', }}>Qonaq:</Text>
                                    </View>

                                    <View style={{ borderColor: 'purple', borderWidth: 0, flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 10, paddingRight: 15 }}>
                                        <Text style={{ marginLeft: 0 }}>
                                            {selectedRelatedCustomer && selectedRelatedCustomer.landLordName ? selectedRelatedCustomer.landLordName : 'null'}

                                        </Text>
                                        <Text>
                                            {selectedRelatedCustomer && selectedRelatedCustomer.contactNumber ? selectedRelatedCustomer.contactNumber : 'null'}

                                        </Text>
                                    </View>


                                </View>


                            </View>

                            <View style={{ flexDirection: 'row', width: '100%', height: '30%', borderWidth: 0, borderColor: 'red', flexDirection: 'row' }}>
                                <View style={{ width: '70%', paddingLeft: '5%', marginTop: '5%' }}>
                                    <Text style={{ color: 'grey' }}>
                                        Əziz qonaq! Sizin  {selectedRezervation ? selectedRezervation.bookedDate[0] : null}
                                        ... tarix(lər)ində Qəbələ şəhərində yerləşən #{selectedRezervedListing != null && selectedRezervation.rezervationNumber ? selectedRezervation.rezervationNumber : null} nömrəli rezervasiyanız qeydə alındı. Bizi seçdiyiniz ücün təşəkkür edirik!</Text>
                                </View>
                                <View style={{ width: '30%' }}>
                                    <Image source={require('./images/cert.png')} style={{ width: 90, height: 90, position: 'absolute', right: 10, top: 0, }}></Image>

                                </View>

                            </View>


                        </View>

                        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', }}>
                            <TouchableOpacity style={{ backgroundColor: '#47a641', width: '30%', justifyContent: 'center', alignItems: 'center', padding: '1%', borderRadius: 8, marginTop: '3%', alignSelf: 'flex-end', marginLeft: '3%' }} onPress={() => {
                                console.log('@@@@', selectedRezervedListing)
                                setNoImage(false)
                                fetchData('Rezervations')
                                setSelectedRezervedListing(null)
                                setIsDateModalVisable(false)
                            }}>
                                <Text style={{ color: 'white' }}>Oldu</Text>
                            </TouchableOpacity>


                            <TouchableOpacity style={{ backgroundColor: selectedRezervation && selectedRezervation.cancelled ? 'yellow' : 'red', paddingLeft: 10, paddingRight: 10, justifyContent: 'center', alignItems: 'center', padding: '1%', borderRadius: 8, marginTop: '3%', alignSelf: 'flex-end', marginRight: '3%' }} onPress={() => {
                                // console.log('@@@@', selectedRezervedListing)
                                if (selectedRezervation && !selectedRezervation.cancelled) {
                                    cancelRezervation(selectedRezervation)
                                }
                                else {
                                    alert('Rezervasiyanız ləğv edilmişdir. Əlavə məlumat üçün qaynar xəttimizə zəng vurun')
                                }
                            }}>
                                {selectedRezervation && selectedRezervation.cancelled ? <Text style={{ color: 'grey' }}>Ləğv edilmişdir</Text> : <Text style={{ color: 'white' }}>Rezervasiyanı ləğv et</Text>}
                            </TouchableOpacity>


                        </View>



                    </View>
                </Modal>

                <View style={{ width: '100%', height: '5%', backgroundColor: '#ffbf00', justifyContent: 'center', alignItems: 'center', borderRadius: 0 }}>
                    <Text style={{ color: 'white' }}>Rezervasiyalarım</Text>
                </View>

                <ScrollView >

                    <ScrollView horizontal={true} style={{ borderWidth: 0, borderColor: 'red', }}>
                        <View style={{ borderColor: 'green', borderWidth: 0, height: '100%', paddingBottom: 35, }}>


                            <View style={{ width: Dimensions.get('screen').width * 1.7, flexDirection: 'row', borderColor: '#ffbf00', borderWidth: 0, marginTop: 20 }}>

                                <View style={{ borderColor: 'red', borderWidth: 0, flexDirection: 'row', width: Dimensions.get('window').width * 0.4, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ fontWeight: 'bold', color: '#3b2201', fontFamily: 'Croogla 4F', fontSize: 12 }}>Elan Başlığı</Text>
                                </View>

                                <View style={{ borderColor: 'red', borderWidth: 0, flexDirection: 'row', width: Dimensions.get('window').width * 0.4, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ fontWeight: 'bold', color: '#3b2201', fontFamily: 'Croogla 4F', fontSize: 12 }}>Rezervasiya Nömrəsi</Text>
                                </View>



                                {/*<View style={{ borderColor: 'red', borderWidth: 0, flexDirection: 'row', width: Dimensions.get('window').width * 0.4, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ fontWeight: 'bold', color: '#3b2201', fontFamily: 'Croogla 4F' }}>Elan Nömrəsi</Text>
                                </View>*/}

                                <View style={{ borderColor: 'red', borderWidth: 0, flexDirection: 'row', width: Dimensions.get('window').width * 0.4, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ fontWeight: 'bold', color: '#3b2201', fontSize: 12 }}>Ev Sahibi Tel No</Text>
                                </View>




                                <View style={{ borderColor: 'red', borderWidth: 0, flexDirection: 'row', width: Dimensions.get('window').width * 0.4, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ fontWeight: 'bold', color: '#3b2201', fontSize: 12 }}>Rezervasiya Tarixləri</Text>
                                </View>


                            </View>

                            {
                                rezervationsList.map((arrayItem, index) => {
                                    //if(arrayItem.date)
                                    return (
                                        <TouchableOpacity
                                            onPress={() => {
                                                //  setNoImage(false)
                                                console.log('AAAAAAAAAAAAA', arrayItem)
                                                setSelectedRezervation(arrayItem)
                                                fetchRezervantDetails(arrayItem.rezervantEmail)
                                                fetchRelatedLandlordDetails(arrayItem.landLordEmail)
                                                fetchSelectedRezervedListing(arrayItem.listingNumber)
                                                fetchRelatedCustomerDetails(arrayItem.rezervantEmail)
                                                console.log('LLLLLLLLLLL', arrayItem)
                                            }} key={index} style={{ width: Dimensions.get('screen').width * 1.7, flexDirection: 'row', borderColor: 'purple', borderWidth: 0, paddingTop: 5, paddingBottom: 5, backgroundColor: arrayItem && arrayItem.cancelled ? null : null, }}>

                                            <View style={{ borderColor: 'red', borderWidth: 0, width: Dimensions.get('window').width * 0.4, alignItems: 'center', marginLeft: 0, flexDirection: 'row' }}>
                                                {arrayItem.cancelled ? <Icon style={{ marginLeft: 10, marginRight: 5 }} name="circle" size={10} color="red" />
                                                    : null}
                                                <Text style={{ color: '#3b2201', fontFamily: 'Croogla4F.ttf' }}>{arrayItem.title}</Text>
                                            </View>

                                            <View style={{ borderColor: 'red', borderWidth: 0, flexDirection: 'row', width: Dimensions.get('window').width * 0.4, alignItems: 'center', justifyContent: 'center' }}>
                                                <Text style={{ color: '#013b0d', fontFamily: 'Croogla4F.ttf' }}>#{arrayItem.rezervationNumber}</Text>
                                            </View>

                                            {/*
                                            <View style={{ borderColor: 'red', borderWidth: 0, flexDirection: 'row', width: Dimensions.get('window').width * 0.4, alignItems: 'center', justifyContent: 'center' }}>
                                                <Text style={{ color: '#013b0d', fontFamily: 'Croogla4F.ttf' }}>#{arrayItem.listingNumber}</Text>
                                            </View>*/}

                                            <TouchableOpacity
                                                onPress={() => {
                                                    Linking.openURL(`tel:${arrayItem.landlordPhone}`)
                                                }}
                                                style={{ zIndex: 20, borderColor: 'red', borderWidth: 0, flexDirection: 'row', width: Dimensions.get('window').width * 0.4, alignItems: 'center', justifyContent: 'center' }}>
                                                <Text style={{ color: '#01458c' }}>{arrayItem.landlordPhone}</Text>
                                            </TouchableOpacity>



                                            <View
                                                onPress={() => {
                                                    console.log('LLLLLLLLLLL', arrayItem)
                                                    setSelectedRezervation(arrayItem)
                                                    setIsDateModalVisable(true)
                                                }}
                                                style={{ borderColor: 'red', borderWidth: 0, flexDirection: 'row', width: Dimensions.get('window').width * 0.4, alignItems: 'center', justifyContent: 'center' }}>
                                                <Text style={{}}>{arrayItem.bookedDate[0]}{arrayItem.bookedDate.length > 1 ? '...' : null}</Text>
                                            </View>


                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </View>
                    </ScrollView>


                </ScrollView>

            </View>
        )
    else return (
        <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <LottieView style={{ width: 90, height: 90 }} source={require('./lottie/loading2.json')} autoPlay loop />
        </View>
    )
}