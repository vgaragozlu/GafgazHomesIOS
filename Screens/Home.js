import { View, ScrollView, Dimensions, Text, TouchableOpacity, Image, Modal, Linking, ToastAndroid, TextInput } from 'react-native'
import React, { useState, useEffect } from 'react'

import firestore from '@react-native-firebase/firestore';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useIsFocused } from "@react-navigation/native";
import auth from '@react-native-firebase/auth';
import LottieView from 'lottie-react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import Icon2 from 'react-native-vector-icons/FontAwesome5';
import Icon8 from 'react-native-vector-icons/AntDesign';
import Icon3 from 'react-native-vector-icons/Entypo';

export default function Home({ route, navigation }) {

  const focus = useIsFocused();


  const [isLoading, setIsLoading] = useState(false)
  const [isModalVisable, setIsModalVisable] = useState(false)

  //const usersCollection = firestore().collection('Houses');

  //const userDocument = firestore().collection('Users').doc('ABC');


  const [markedDates, setMarkedDates] = useState(
    {

    }
  )


  const [onSaleHomesList, setOnSaleHomesList] = useState([])
  const [allLandlordList, setallLandlordList] = useState([])
  const [allRezervationsList, setAllRezervationsList] = useState([])


  let tempOnSaleHomesList = []
  let tempallLandlordList = []


  const exampleAdArray = [

    {
      title: 'Reklam 2',
      price: '30 AZN',
      color: '#F53535',
      img: require('../images/azercell.png')

    },

    {
      title: 'Reklam 3',
      price: '40 AZN',
      color: '#56E057',
      img: require('../images/kapital.png')

    },
    {
      title: 'Reklam 1',
      price: '20 AZN',
      color: '#E1745D',
      img: require('../images/foodSale.png'),
      lottie: require('../lottie/50.json'),
      lottie2: require('../lottie/snow.json'),
    },
    {
      title: 'Reklam 4',
      price: '50 AZN',
      color: '#64BBEF',
      img: require('../images/samsung.jpg')

    },
  ]
  const categoryBackgroundColor = 'white';
  const categoryTextColor = '#2e2323';


  const exampleCategories = [
    {
      title: 'Sadə',
      categoryName: 'simple',
      color: categoryBackgroundColor,
      background: require('../images/simple2.jpg'),
      // lottie: require(`../lottie/home.json`)
    },
    {
      title: 'Hovuzlu',
      categoryName: 'pool',
      color: categoryBackgroundColor,
      background: require('../images/pool.jpg'),
      //lottie: require(`../lottie/pool.json`)
    },
    {
      title: 'VIP',
      categoryName: 'vip',
      color: categoryBackgroundColor,
      background: require('../images/vip.jpg'),
      lottie: require(`../lottie/diamond.json`)
    },

    {
      title: 'A Frame',
      categoryName: 'aframe',
      color: categoryBackgroundColor,
      background: require('../images/aframe.jpeg'),
      //lottie: require(`../lottie/star.json`)
    },


    {
      title: 'Hotellər',
      categoryName: 'tour',
      color: categoryBackgroundColor,
      background: require('../images/tour.jpg'),

      // lottie: require(`../lottie/aframe.json`)

    },

    {
      title: 'Turlar',
      categoryName: 'tour',
      color: categoryBackgroundColor,
      background: require('../images/tourCopy.jpg'),

      // lottie: require(`../lottie/aframe.json`)

    },







  ]



  {/*
{
      title: 'Ucuzvari Evlər',
      categoryName: 'hotel',
      color: categoryBackgroundColor,
      background: require('../images/tour.jpg'),
      lottie: require(`../lottie/aframe.json`)

    },
*/}


  const [selectedDatesForProp, setSSelectedDatesForProp] = useState([])
  const [allRezervations, setAllRezervations] = useState([])
  const [stateShouldUpdate, setStateShouldUpdate] = useState(false)


  const [selectedCategoryName, setSelectedCategoryName] = useState()
  const [isTuqayModalVisible, setisTuqayModalVisible] = useState(false)
  const [emailToSetReferalCode, setEmailToSetReferalCode] = useState('')
  const [newRefCode, setNewRefCode] = useState('')
  const [refCodeEditable, setRefCodeEditable] = useState(false)
  const [listingNumber, setListingNumber] = useState('')
  const [lookedUpListing, setLookedUpListing] = useState('')



  const borderWidth = 0;

  const fetchAllUsers = async () => {
    console.log('ONSALE FETCH START')
    setIsLoading(true)

    firestore().collection('LandLords').get().then(querySnapshot => {
      querySnapshot.forEach(documentSnapshot => {
        // console.log('###########', documentSnapshot.data().imgArray[0])



        tempallLandlordList.push(documentSnapshot.data())

      });

      setallLandlordList(tempallLandlordList)

    }).finally(() => {
      setIsLoading(false)

    });


  }

  const fetchAllRezervations = async () => {

    let tempAllRezervations = []
    console.log('ONSALE FETCH all rezer')
    setIsLoading(true)

    firestore().collection('Rezervations').get().then(querySnapshot => {
      querySnapshot.forEach(documentSnapshot => {
        console.log('###########3333', documentSnapshot.data())



        tempAllRezervations.push(documentSnapshot.data())
        tempAllRezervations.sort((a,b) => {
          return new Date(b.date) - new Date(a.date)
        })

      });

      setAllRezervationsList(tempAllRezervations)

    }).finally(() => {
      setIsLoading(false)

    });


  }




  const fetchListing = async () => {
    console.log('listing FETCH START')
    setIsLoading(true)

    firestore().collection('Listings').where('listingNumber', '==', listingNumber).get().then(querySnapshot => {
      if (querySnapshot.empty) {
        alert('Elan tapilmadi')
      }
      querySnapshot.forEach(documentSnapshot => {
        // console.log('###########', documentSnapshot.data().imgArray[0])
        // alert(documentSnapshot.id())

        console.log('------->', documentSnapshot.data())
        setLookedUpListing(documentSnapshot.data())


      });

      setallLandlordList(tempallLandlordList)

    }).finally(() => {
      setIsLoading(false)

    });


  }


  const addRefCode = async () => {
    console.log('add ref START')
    setIsLoading(true)



    firestore().collection('LandLords').where('landLordEmail', '==', emailToSetReferalCode).get().then(querySnapshot => {

      if (querySnapshot.empty) {
        alert('yanlisliq')
      }
      querySnapshot.forEach(documentSnapshot => {

        // alert(documentSnapshot.id)

        firestore().collection('LandLords').doc(documentSnapshot.id)
          .update({
            refCode: newRefCode

          })
          .then(() => {
            alert('OLDU')

          }).catch(e => {
            setIsLoading(false)
            alert('xeta ', e)
          });

      });


    })
      .catch((e) => {
        alert('xetaa', e)
      })
      .finally(() => {
        setIsLoading(false)
        setNewRefCode('')
        setEmailToSetReferalCode('')
        setisTuqayModalVisible(false)
      });





  }


  const user = auth().currentUser;


  useEffect(() => {
    if (user.email == 'vgaragozlu@gmail.com' || user.email == 'mahmudlutuqay@gmail.com') {
      // alert('Tuqay')
      fetchAllUsers()
      fetchAllRezervations()

    }
  }, [])

  useEffect(() => {
    if (focus == true) { // if condition required here because it will call the function even when you are not focused in the screen as well, because we passed it as a dependencies to useEffect hook
      console.log('FOCUS IN USEEFECT')
      setSSelectedDatesForProp([])


    }
  }, [focus])

  if (!isLoading)
    return (
      <View style={{ backgroundColor: 'white', width: '100%', height: "100%", alignItems: 'center', paddingTop: '1%', justifyContent: 'space-between' }}>

        <Modal visible={isTuqayModalVisible}>
          <View style={{ height: '100%', borderColor: 'red', borderWidth: 0, }}>
            <TextInput placeholder='email' placeholderTextColor={'grey'} value={emailToSetReferalCode} onChangeText={setEmailToSetReferalCode} style={{ paddingLeft: 15, alignSelf: 'center', width: '80%', height: Dimensions.get('screen').height * 0.06, borderColor: 'grey', borderWidth: 0.6, borderRadius: 10, color: 'grey', marginTop: 5 }} />
            <TextInput editable={emailToSetReferalCode != '' ? true : false} placeholder='referal kod qoş' placeholderTextColor={'grey'} value={newRefCode} onChangeText={setNewRefCode} style={{ paddingLeft: 15, alignSelf: 'center', width: '80%', height: Dimensions.get('screen').height * 0.06, borderColor: 'grey', borderWidth: 0.6, borderRadius: 10, color: 'grey', marginTop: 5 }} />
            <TouchableOpacity onPress={() => {
              addRefCode()
            }}><Text style={{ color: 'green', alignSelf: 'center', marginTop: 5 }}>Ref kod qoş</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => {
              setEmailToSetReferalCode('')
              setListingNumber('')
              setNewRefCode('')
              setisTuqayModalVisible(false)
            }}><Text style={{ color: 'red', alignSelf: 'center', marginTop: 0 }}>Bagla</Text></TouchableOpacity>
            <View style={{ height: 200, borderWidth: 1, borderColor: "green", paddingTop: 10, paddingBottom: 10 }}>
              <ScrollView>
                {allLandlordList.map((item, index) => {
                  return (
                    <View style={{ flexDirection: 'row', alignItems: 'center', }} key={index}>
                      <Text >{item.landLordEmail}</Text>
                      <Text style={{ marginLeft: 10, fontWeight: 'bold', color: 'green' }}>{item.referalCode ? ('#' + item.referalCode) : null}</Text>
                      <Text style={{ margin: 5, color: item.refCode == '000036' ? 'red' : 'orange' }} >* {item.refCode}</Text>
                    </View>

                  )
                })}
              </ScrollView>
            </View>
            <View>
              <TextInput placeholder='elan no' placeholderTextColor={'grey'} value={listingNumber} onSubmitEditing={() => {
                fetchListing()
              }} onChangeText={setListingNumber} style={{ paddingLeft: 15, alignSelf: 'center', width: '80%', height: Dimensions.get('screen').height * 0.06, borderColor: 'grey', borderWidth: 0.6, borderRadius: 10, color: 'grey', marginTop: 10 }} />

            </View>
            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 5, paddingRight: 5, borderColor: 'red', borderWidth: 0, }}>
              <Text>
                {lookedUpListing && lookedUpListing.listingNumber ? lookedUpListing.title : null}
              </Text>
              <Text>
                {lookedUpListing && lookedUpListing.landlordPhone ? lookedUpListing.landlordPhone : null}
              </Text>

              <Text>
                {lookedUpListing && lookedUpListing.roomCount ? lookedUpListing.roomCount : null}
              </Text>
            </View>
            <View style={{ height: 200, borderWidth: 1, borderColor: "green", paddingTop: 10, paddingBottom: 10 }}>
              <ScrollView>
                {allRezervationsList.map((item, index) => {
                  return (
                    <View style={{ flexDirection: 'column', alignItems: 'center', marginBottom: 15, borderColor:'red', borderWidth:2, marginLeft:10 }} key={index}>
                      <Text style={{ fontWeight: 'bold' }} >{item.title} </Text>
                      <Text style={{ fontWeight: 'bold', color:item.cancelled? 'red':'green' }} >#{item.rezervationNumber}</Text>
                      <Text >Ev sahibi: {item.landLordEmail}  {item.landlordPhone}</Text>
                      <Text >Müştəri: {item.rezervantEmail}  {item.customerPhone}</Text>
                      {item.bookedDate.map((item2, index2) => {
                        return (
                          <Text key={index2}>{item2}</Text>
                        )
                      })}

                      <Text >Əməlyat tarixi: {item.date}  </Text>


                    </View>

                  )
                })}
              </ScrollView>
            </View>
          </View>





        </Modal>

        <Modal visible={isModalVisable}>
          <Calendar
            style={{
              borderWidth: 1,
              borderColor: 'grey',
              height: 350
            }}
            markingType={'custom'}
            minDate={new Date().toJSON().slice(0, 10)}

            onDayPress={day => {
              console.log('pressed')
              let tempSelectedDatesForProp = selectedDatesForProp;
              if (!tempSelectedDatesForProp.includes(day.dateString, 0)) {
                console.log('DOES NOT CONTAIN', tempSelectedDatesForProp,)
                tempSelectedDatesForProp.push(day.dateString)
                let temp = markedDates;
                temp[day.dateString] = {
                  selected: true, marked: true, selectedColor: 'green', customStyles: {
                    container: {
                      backgroundColor: 'green'
                    }
                  }
                }
                setSSelectedDatesForProp(tempSelectedDatesForProp)
                setMarkedDates(temp)
                setStateShouldUpdate(!stateShouldUpdate)
              }
              console.log('DOES NOT CONTAIN222', tempSelectedDatesForProp,)




              {/*route.params.home.bookedDates.some((arrayItem, index) => {
              if (arrayItem == day.dateString) {
                alert('booked');
                return
              }
              else {
                alert('available')
                let temp = markedDates;
                temp[day.dateString] = {
                  selected: true, marked: true, selectedColor: 'green', customStyles: {
                    container: {
                      backgroundColor: 'green'
                    }
                  }
                }
                setMarkedDates(temp)
                setStateShouldUpdate(!stateShouldUpdate)
                //console.log('markedDates', markedDates);
              }
            })*/}


            }}
            // Mark specific dates as marked
            markedDates={
              markedDates
            }
          />

          <TouchableOpacity onPress={() => {
            console.log('######################', selectedDatesForProp)
            setIsModalVisable(false)
            navigation.navigate('HomesList', {
              categoryName: selectedCategoryName,
              selectedDatesForProp: selectedDatesForProp
            })
          }} style={{ width: '80%', backgroundColor: '#51A373', borderRadius: 10, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', marginTop: Dimensions.get('window').width / 10, height: Dimensions.get('window').width / 10 }}>
            <Text style={{ alignSelf: 'center', fontSize: 20, color: 'white' }}>Təsdiq Et</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {
            console.log('######################', selectedDatesForProp)
            setIsModalVisable(false)
            setSSelectedDatesForProp([])
          }} style={{ width: '80%', backgroundColor: '#51A373', borderRadius: 10, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', marginTop: Dimensions.get('window').width / 30, height: Dimensions.get('window').width / 10 }}>
            <Text style={{ alignSelf: 'center', fontSize: 20, color: 'white' }}>Geri</Text>
          </TouchableOpacity>
        </Modal>
        {/*
        <View style={{ height: Dimensions.get('screen').width * 0.25, borderColor: "black", borderWidth: borderWidth, width: '96%', }}>

          <ScrollView horizontal={true} style={{ borderWidth: 0, borderColor: 'red', }}>
            {
              exampleAdArray.map((arrayItem, index) => {
                return (
                  <View key={index} style={{
                    backgroundColor: arrayItem.color, borderColor: 'green', borderWidth: 0, borderRadius: 10, width: Dimensions.get('window').width * 0.8, marginRight: Dimensions.get('window').width * 0.05,
                  }}>
                    <Image style={{
                      borderRadius: 10,
                      flex: 1,
                      width: undefined,
                      height: undefined,
                      resizeMode: 'cover',
                    }} source={arrayItem.img} />
                    <LottieView style={{ width: 80, height: 80, position: 'absolute', left: 0 }} source={arrayItem.lottie} autoPlay loop />
                  </View>
                )
              })
            }
          </ScrollView>

        </View>
*/}

        <View style={{ marginTop: Dimensions.get('screen').width * 0.1, width: '100%', height: '6%', borderColor: 'red', borderWidth: 0, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', paddingLeft: '5%', paddingRight: '5%', paddingTop: 0 }}>
          <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 50, borderWidth: 0 }} onPress={() => {
            navigation.navigate('Room')
          }}>
            <Image style={{ width: 20, height: 20, }} source={require('../images/user2.png')} />

          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            navigation.navigate('AddListing')
          }}>
            <LottieView style={{ width: 32, height: 32, }} source={require('../lottie/add.json')} autoPlay loop />


          </TouchableOpacity>

        </View>
        <View style={{ flexDirection: 'row' }}>
          <Icon8 style={{}} name="star" size={12} color="#F9C806" />
          <Icon8 style={{}} name="star" size={12} color="#F9C806" />
          <Icon8 style={{}} name="star" size={12} color="#F9C806" />
          <Icon8 style={{}} name="star" size={12} color="#F9C806" />

        </View>

        <Text style={{ fontWeight: 'bold' }}>Qafqaz Homes</Text>
        <Text style={{ fontWeight: 'bold', fontSize: 6 }}>Real Estate Company of Azerbaijan</Text>
        <Icon3 name="dots-three-horizontal" size={17} color="grey" />

        <View style={{ marginTop: 0, width: '100%', height: '91%', borderColor: 'red', borderWidth: 0, justifyContent: 'center', flexDirection: 'row', flexWrap: 'wrap', }}>

          {
            exampleCategories.map((arrayItem, index) => {
              return (
                <TouchableOpacity key={index} onPress={() => {
                  if (arrayItem.categoryName != 'tour') {
                    setMarkedDates({})
                    setSelectedCategoryName(arrayItem.categoryName)
                    // setIsModalVisable(true)
                    navigation.navigate('HomesList', {
                      categoryName: arrayItem.categoryName,
                      //selectedDatesForProp: selectedDatesForProp
                    })
                  }
                  else {
                    ToastAndroid.show('Tezliklə xidmətinizdə olacağıq!', ToastAndroid.SHORT);
                  }
                }}
                  style={{ height: arrayItem.categoryName == 'hotel' || arrayItem.categoryName == 'tour' ? Dimensions.get('window').height * 0.10 : Dimensions.get('screen').height * 0.28, width: arrayItem.categoryName == 'hotel' || arrayItem.categoryName == 'tour' ? Dimensions.get('window').width * 0.93 : Dimensions.get('window').width * 0.45, justifyContent: 'space-between', alignItems: 'space-between', marginBottom: '1%', marginRight: '0.5%', marginLeft: '0.5%', }}>
                  {/*<LottieView style={{ width: 50, height: 50 }} source={arrayItem.lottie} autoPlay loop />*/}

                  <Image source={arrayItem.background} style={{ borderRadius: 0, width: '100%', height: '100%', resizeMode: 'cover', borderTopLeftRadius: index == 0 ? 20 : 0, borderTopRightRadius: index == 1 ? 20 : 0, borderBottomRightRadius: exampleCategories.length - index == 1 ? 20 : 0, borderBottomLeftRadius: exampleCategories.length - index == 1 ? 20 : 0 }} />
                  <View style={{ justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: 7, left: arrayItem.title == 'Turlar' ? 10 : 0, backgroundColor: arrayItem.title == 'Turlar' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.4)', width: '100%' }}>
                    <Text style={{ color: arrayItem.title == 'Turlar' ? 'white' : 'white', fontWeight: 'bold', fontSize: 11.5, fontFamily: 'Croogla4F.ttf', marginLeft: arrayItem.title == 'Turlar' ? '0%' : 0 }}>{arrayItem.title}</Text>
                  </View>
                  {/*<LottieView style={{ width: 30, height: 30, position: 'absolute', top: 10, right: 10 }} source={arrayItem.lottie} autoPlay loop />*/}

                </TouchableOpacity>

              )
            })
          }

        </View>


        {user.email == 'vgaragozlu@gmail.com'
          || user.email == 'mahmudlutuqay@gmail.com' ?
          <TouchableOpacity onPress={() => {
            setisTuqayModalVisible(true)
          }} style={{ position: 'absolute', top: 10 }}><Text style={{ color: 'red' }}>TUQAY</Text></TouchableOpacity>
          : null}

      </View>
    )
  else
    return (
      <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <LottieView style={{ width: 50, height: 50 }} source={require('../lottie/loading.json')} autoPlay loop />

      </View>

    )
}