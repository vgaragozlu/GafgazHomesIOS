import { View, Text, ScrollView, Dimensions, TouchableOpacity, Modal, Image, Linking } from 'react-native'
import React, { useState, useEffect } from 'react'
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome';

import LottieView from 'lottie-react-native';

export default function Orders() {
    const user = auth().currentUser;



    const [isLoading, setIsLoading] = useState(false)
    const [isModalVisable, setIsModalVisable] = useState(false)
    const [isDateModalVisable, setIsDateModalVisable] = useState(false)
    const [rezervationsList, setRezervationsList] = useState([])
    const [selectedRezervation, setSelectedRezervation] = useState()
    const [selectedRezervedListing, setSelectedRezervedListing] = useState(null)


    const [selectedRezervant, setSelectedRezervant] = useState()
    const [selectedRelatedLandlord, setSelectedRelatedLandlord] = useState()
    const [selectedRelatedCustomer, setSelectedRelatedCustomer] = useState()



    useEffect(() => {

    }, [])
    const fetchData = async (arg) => {
        console.log('FETCH REZERVATIONS DATA STARTED....')
        setIsLoading(true)
        firestore().collection(arg).where('landLordEmail', '==', user.email).get().then(querySnapshot => {
            let tempRezervationsList = []

            console.log('INSIDE FETCH DATA....', querySnapshot.size)

            querySnapshot.forEach(documentSnapshot => {

                documentSnapshot.data()['rezervationId'] = documentSnapshot.id
                tempRezervationsList.push(documentSnapshot.data())
                //setHomesList(documentSnapshot.data())

            });

            // tempRezervationsList.reverse()
            //  console.log('***!!!***', temp)
            setRezervationsList(tempRezervationsList)

            const sorted = [...tempRezervationsList].sort((a, b) => {
                const one = new Date(a.date)
                const two = new Date(b.date)
                return two - one;
            });

            setRezervationsList(sorted)



        }).finally(() => {
            setIsLoading(false)
            setIsModalVisable(false)


        });


    }


    const cancelRezervation = (selectedRezervation) => {

        console.log('--->>>>', selectedRelatedLandlord.landLordName)

        setIsLoading(true)


        firestore().collection('Rezervations').where('rezervationNumber', '==', selectedRezervation.rezervationNumber).get().then(querySnapshot => {

            let tempRezervationDocumentID = null
            let date = new Date().toISOString().slice(0, 10)

            querySnapshot.forEach(documentSnapshot => {
                tempRezervationDocumentID = documentSnapshot.id
            })
            firestore().collection('Rezervations').doc(tempRezervationDocumentID)
                .update({
                    cancelled: true,
                    cancelledBy: selectedRelatedLandlord && selectedRelatedLandlord.landLordName ? selectedRelatedLandlord.landLordName : null,
                    cancelledAt: date,


                })
                .then(() => {
                    console.log('Rezervation Cancelled!');
                    alert('Rezervasiyanız ləğv olundu')
                    setIsDateModalVisable(false)
                    setIsLoading(false)
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

    const fetchRelatedRezervantDetails = async (rezervantEmail) => {
        console.log('!!!!!FETCH RELATED REZERVANT DETAILS DATA STARTED....', rezervantEmail)
        setIsLoading(true)

        firestore().collection('LandLords').where('landLordEmail', '==', rezervantEmail).get().then(querySnapshot => {

            console.log('INSIDE FETCH DATA REZERVANTTT....', querySnapshot.docs[0])
            setSelectedRelatedCustomer(querySnapshot.docs[0].data())







            //  setRezervationsList(tempRezervationsList)



        }).finally(() => {
            setIsLoading(false)
            setIsDateModalVisable(true)


        });


    }

    const fetchRelatedLandlordDetails = async (landLordEmail) => {
        console.log('FETCH REZERVANT DETAILS DATA STARTED....')
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
            setIsDateModalVisable(true)


        });


    }


    const makeSeen = async (arg) => {

        console.log('TTTTTTTTTTTT', arg)
        firestore().collection('Rezervations').doc(arg.rezervationId)
            .update({
                seen: true
            })
            .then(() => {
                // alert('ok')
            }).catch(e => {
                setIsLoading(false)
                console.log('ERRORR I ', e)
                alert('Xəta baş verdi ', e)
            });
    }


    const fetchSelectedRezervedListing = async (listingNumber) => {
        console.log('FETCH REZERVATION DETAILS DATA STARTED....')
        setIsLoading(true)

        firestore().collection('Listings').where('listingNumber', '==', listingNumber).get().then(querySnapshot => {
            let tempRezervationsList = []
            console.log('INSIDE FETCH DATA....', querySnapshot.size)

            querySnapshot.forEach(documentSnapshot => {
                // console.log('!!WWWWWWWWWWWW', documentSnapshot.data())
                //documentSnapshot.data()['rezervationId'] = documentSnapshot.id
                //  tempRezervationsList.push(documentSnapshot.data())
                //setHomesList(documentSnapshot.data())
                setSelectedRezervedListing(documentSnapshot.data())
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
            <View style={{ width: '100%', height: '100%', alignItems: 'center', marginTop: 20 }}>

                <View style={{ width: '100%', height: '5%', backgroundColor: 'orange', justifyContent: 'center', alignItems: 'center', borderRadius: 0 }}>
                    <Text style={{ color: 'white' , fontSize:12}}>Evlərimə olan sifarişlər</Text>
                </View>
                <Modal visible={isDateModalVisable}>
                    <View style={{ width: '100%', height: '100%', alignItems: 'center', backgroundColor: '#e6e6e6' }}>


                        <View style={{ borderRadius: 10, elevation: 4, width: '95%', borderColor: 'grey', borderWidth: 0.5, backgroundColor: 'white', alignItems: 'center', marginTop: '2%' }}>
                            <View style={{ width: '100%', flexDirection: 'row' }}>


                                <View style={{ height: '100%', width: '40%', borderColor: 'grey', borderRightWidth: 0.5 }}>
                                    <View style={{ borderTopLeftRadius: 5, width: '100%', backgroundColor: '#216665', justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ color: 'white' }}>{selectedRezervedListing != null && selectedRezervedListing.title ? selectedRezervedListing != null && selectedRezervedListing.title : 'başlıq'}</Text>
                                    </View>
                                    {selectedRezervedListing != null && selectedRezervedListing.imgArray[0] ?


                                        <Image
                                            style={{
                                                width: '100%',
                                                height: '40%',
                                                borderLeftWidth: 0,
                                                borderRightWidth: 0,
                                                borderColor: 'red'
                                            }}
                                            source={{ uri: selectedRezervedListing != null && selectedRezervedListing.imgArray[0] ? selectedRezervedListing.imgArray[0] : 'https://picsum.photos/id/237/200/300' }} />

                                        : <LottieView style={{ width: 70, height: 70, alignSelf: 'center' }} source={require('./lottie/loading2.json')} autoPlay loop />

                                    }

                                    <View style={{ width: '100', backgroundColor: '#4fc4c2', paddingBottom: 5, paddingTop: 5 }}>
                                        <Text style={{ color: 'white', marginLeft: 10 }}>Rezervasiya No:</Text>
                                        <Text style={{ color: 'white', marginLeft: 10, fontWeight: 'bold' }}>#{selectedRezervedListing && selectedRezervation.rezervationNumber ? selectedRezervation.rezervationNumber : null}</Text>

                                    </View>
                                </View>

                                <View style={{ height: '100%', width: '60%', borderColor: 'red', borderWidth: 0 }}>
                                    <View style={{ borderTopRightRadius: 5, backgroundColor: '#7d5a23', width: '100%', paddingLeft: '5%' }}>
                                        <Text style={{ color: 'white', }}>Rezerv olunma tarixləri</Text>
                                    </View>
                                    {
                                        selectedRezervation && selectedRezervation.bookedDate[0] ? selectedRezervation.bookedDate.map((arrayItem, index) => {
                                            //console.log('!!!!!!!!!!!!', arrayItem)
                                            return (
                                                <Text style={{ color: 'blue', marginLeft: '2%', marginTop: 5, }} key={index}>{arrayItem}</Text>
                                            )

                                        }) : null
                                    }
                                    {/*<View style={{ backgroundColor: 'grey', width: '100%', paddingLeft: '5%', marginTop: 10 }}>
                                        <Text style={{ color: 'white', }}>Müştəri məlumatları</Text>
                                    </View>

                                    <Text style={{ marginLeft: '2%', marginTop: 5, fontWeight: 'bold' }}>{selectedRezervant && selectedRezervant.landLordName ? selectedRezervant.landLordName : 'null'}</Text>
                                    <Text style={{ marginLeft: '2%', marginTop: 5, }}>{selectedRezervant && selectedRezervant.contactNumber ? selectedRezervant.contactNumber : 'null'}</Text>
*/}

                                    <View style={{ backgroundColor: 'grey', width: '100%', paddingLeft: '5%', marginTop: 10 }}>
                                        <Text style={{ color: 'white', }}>Ev sahibi məlumatları</Text>
                                    </View>

                                    <Text style={{ marginLeft: '2%', marginTop: 5, fontWeight: 'bold' }}>{selectedRelatedLandlord && selectedRelatedLandlord.landLordName ? selectedRelatedLandlord.landLordName : 'null'}</Text>
                                    <Text style={{ marginLeft: '2%', marginTop: 5, }}>{selectedRelatedLandlord && selectedRelatedLandlord.contactNumber ? selectedRelatedLandlord.contactNumber : 'null'}</Text>



                                    <View style={{ backgroundColor: 'grey', width: '100%', paddingLeft: '5%', marginTop: 10 }}>
                                        <Text style={{ color: 'white', }}>Müştəri məlumatları</Text>
                                    </View>

                                    <Text style={{ marginLeft: '2%', marginTop: 5, fontWeight: 'bold' }}>{selectedRelatedCustomer && selectedRelatedCustomer.landLordName ? selectedRelatedCustomer.landLordName : 'null'}</Text>

                                    <TouchableOpacity style={{ flexDirection: 'row' }}
                                        onPress={() => {
                                            Linking.openURL(`tel:${selectedRelatedCustomer.contactNumber}`)

                                        }}
                                    >
                                        <Text style={{ marginLeft: '2%', marginTop: 5, color: 'blue' }}>{selectedRelatedCustomer && selectedRelatedCustomer.contactNumber ? selectedRelatedCustomer.contactNumber : 'null'}</Text>
                                        <Icon style={{ marginLeft: 10 }} name="phone" size={23} color="green" />

                                    </TouchableOpacity>




                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', width: '100%', borderWidth: 0, borderColor: 'red', flexDirection: 'row' }}>
                                <View style={{ width: '70%', paddingLeft: '5%' }}>
                                    <Text style={{ color: 'grey' }}>Əziz qonaq! Sizin

                                        {selectedRezervation ? selectedRezervation.bookedDate[0] : null}
                                        …
                                        tarix(lər)ində Qəbələ şəhərində yerləşən <Text style={{ fontWeight: 'bold' }}>
                                            #{selectedRezervation && selectedRezervation.rezervationNumber != null ? selectedRezervation.rezervationNumber : null} </Text>nömrəli rezervasiyanız qeydə alındı. Dəstək üçün 24/7 qaynar xəttimizdən bizə ulaşa bilərsiniz. Bizi seçdiyiniz üçün təşəkkür edirik!</Text>
                                </View>
                                <View style={{ width: '30%' }}>
                                    <Image source={require('./images/cert.png')} style={{ width: 90, height: 90, position: 'absolute', left: '15%' }}></Image>

                                </View>

                            </View>
                        </View>
                        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity style={{ backgroundColor: selectedRezervation && selectedRezervation.cancelled ? 'yellow' : 'red', paddingLeft: 10, paddingRight: 10, justifyContent: 'center', alignItems: 'center', padding: '1%', borderRadius: 8, marginTop: '3%', alignSelf: 'flex-end', marginLeft: '2%' }} onPress={() => {
                                // console.log('@@@@', selectedRezervedListing)
                                if (selectedRezervation && !selectedRezervation.cancelled) {

                                    cancelRezervation(selectedRezervation)

                                }
                                else {
                                    alert('Rezervasiyanız təxirə salınmışdır. Əlavə məlumat üçün qaynar xəttimizə zəng vurun')
                                }
                            }}>

                                {selectedRezervation && selectedRezervation.cancelled ? <Text>Təxirə salınmışdır</Text> : <Text style={{ color: 'white' }}>Rezervasiyanı ləğv et</Text>}
                            </TouchableOpacity>
                            <TouchableOpacity style={{ paddingLeft: 10, paddingRight: 10, backgroundColor: '#47a641', width: '30%', justifyContent: 'center', alignItems: 'center', padding: '1%', borderRadius: 8, marginTop: '5%', alignSelf: 'flex-end', marginRight: '2%' }}
                                onPress={() => {
                                    fetchData('Rezervations')
                                    setIsDateModalVisable(false)
                                }}>
                                <Text style={{ color: 'white' }}>Oldu</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </Modal>
                <ScrollView contentContainerStyle={{}}>


                    <ScrollView horizontal={true} style={{ borderWidth: 0, borderColor: 'red', height: '100%', paddingBottom: 35, }}>
                        <View style={{ borderColor: 'green', borderWidth: 0, height: '100%' }}>


                            <View style={{ width: Dimensions.get('screen').width * 1.7, flexDirection: 'row', borderColor: 'orange', borderWidth: 0, marginTop: 20 }}>
                                <View style={{ borderColor: 'red', borderWidth: 0, flexDirection: 'row', width: Dimensions.get('window').width * 0.4, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ fontWeight: 'bold', color: '#3b2201', fontFamily: 'Croogla 4F', fontSize:12 }}>Elan Başlığı</Text>
                                </View>

                                <View style={{ borderColor: 'red', borderWidth: 0, flexDirection: 'row', width: Dimensions.get('window').width * 0.4, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ fontWeight: 'bold', color: '#3b2201', fontFamily: 'Croogla 4F' ,fontSize:12}}>Rezervasiya Nömrəsi</Text>
                                </View>



                                <View style={{ borderColor: 'red', borderWidth: 0, flexDirection: 'row', width: Dimensions.get('window').width * 0.4, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ fontWeight: 'bold', color: '#3b2201',fontSize:12 }}>Müştəri Tel Nö</Text>
                                </View>

                                <View style={{ borderColor: 'red', borderWidth: 0, flexDirection: 'row', width: Dimensions.get('window').width * 0.4, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ fontWeight: 'bold', color: '#3b2201' ,fontSize:12}}>Rezervasiya Tarixləri</Text>
                                </View>




                            </View>

                            {
                                rezervationsList.map((arrayItem, index) => {
                                    if (arrayItem.date) {
                                        // console.log('YYYYYYYYYYYYYYYYYY', arrayItem.date.substring(10, 11))

                                    }
                                    return (
                                        <TouchableOpacity
                                            onPress={() => {
                                                makeSeen(arrayItem)
                                                setSelectedRezervation(arrayItem)
                                                // console.log('aaaaaaaaaaa', arrayItem)
                                                setSelectedRezervation(arrayItem)
                                                fetchRelatedRezervantDetails(arrayItem.rezervantEmail)
                                                fetchRelatedLandlordDetails(arrayItem.landLordEmail)
                                                fetchSelectedRezervedListing(arrayItem.listingNumber)

                                                // console.log('LLLLLLLLLLL', arrayItem)
                                            }} key={index}
                                            style={{ width: Dimensions.get('screen').width * 1.7, flexDirection: 'row', borderColor: 'purple', borderWidth: 0, paddingTop: 5, paddingBottom: 5, backgroundColor: arrayItem.seen ? '#D4D4D4' : '#85CF87', marginTop: 2, }}>

                                            <View style={{ borderColor: 'red', borderWidth: 0, flexDirection: 'row', width: Dimensions.get('window').width * 0.4, alignItems: 'center',  }}>
                                                <View style={{ borderWidth: 0, borderColor: 'red',   }} >
                                                    {
                                                        !arrayItem.seen ?
                                                            <View >
                                                                <Icon name="envelope" size={20} color="white" />
                                                            </View>
                                                            : <View style={{ }}></View>
                                                    }
                                                </View>

                                                {arrayItem && arrayItem.cancelled ? 
                                                
                                                <Icon style={{ marginLeft: 10, marginRight: 5 }} name="circle" size={10} color="red" />
                                                : null}

                                                <Text style={{ color: '#3b2201', fontFamily: 'Croogla4F.ttf', }}>{arrayItem.title}</Text>
                                            </View>

                                            <View style={{ borderColor: 'red', borderWidth: 0, flexDirection: 'row', width: Dimensions.get('window').width * 0.4, alignItems: 'center', justifyContent: 'center' }}>
                                                <Text style={{ color: '#013b0d', fontFamily: 'Croogla4F.ttf' }}>#{arrayItem.rezervationNumber}</Text>
                                            </View>



                                            <View style={{ borderColor: 'red', borderWidth: 0, flexDirection: 'row', width: Dimensions.get('window').width * 0.4, alignItems: 'center', justifyContent: 'center' }}>
                                                <Text style={{ color: '#01458c' }}>{arrayItem.customerPhone}</Text>
                                            </View>

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



                        {/*
                    rezervationsList.map((arrayItem, index) => {
                        console.log('aaaaaaaaaaa', arrayItem)
                        return (
                            <View key={index} style={{ width: Dimensions.get('screen').width*1.5,  flexDirection: 'row', borderColor: 'purple', borderWidth: 0, }}>
                                <View style={{ borderColor: 'red', borderWidth: 0, flexDirection: 'row', width: '25%', alignItems: 'center', justifyContent: 'center' }}>
                                    <Text>{arrayItem.title}</Text>
                                </View>

                                <View style={{ borderColor: 'red', borderWidth: 0, flexDirection: 'row', width: '25%', alignItems: 'center', justifyContent: 'center' }}>
                                    <Text>{arrayItem.listingNumber}</Text>
                                </View>

                                <View style={{ borderColor: 'red', borderWidth: 0, flexDirection: 'row', width: '25%', alignItems: 'center', justifyContent: 'center' }}>
                                    <Text>{arrayItem.landlordPhone}</Text>
                                </View>

                                <View style={{ borderColor: 'red', borderWidth: 0, flexDirection: 'row', width: '25%', alignItems: 'center', justifyContent: 'center' }}>
                                    <Text>{arrayItem.bookedDate[0]}</Text>
                                </View>


                            </View>
                        )
                    })
                */}


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