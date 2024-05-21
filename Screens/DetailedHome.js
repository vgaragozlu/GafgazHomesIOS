import { View, Text, Image, Dimensions, TouchableOpacity, ScrollView, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SliderBox } from "react-native-image-slider-box";

import { Calendar, LocaleConfig } from 'react-native-calendars';

export default function DetailedHome({ route, navigation }) {

  console.log('hhhhhhhhhhhhhhh', route.params.home.bookedDates)


  const images = [
    route.params.home.img,
    route.params.home.img,
    route.params.home.img,
    route.params.home.img,

  ];

  const [bookedDates, setBookedDates] = useState(route.params.home.bookedDates)

  let tempObj = {}
  route.params.home.bookedDates.map((arrayItem, index) => {
    tempObj[arrayItem] = {
      selected: true, marked: true, selectedColor: 'green', customStyles: {
        container: {
          backgroundColor: 'red'
        }
      }
    }


  })


  const [markedDates, setMarkedDates] = useState(
    {

    }
  )


  const [stateShouldUpdate, setStateShouldUpdate] = useState(false)
  const [isModalVisable, setIsModalVisable] = useState(false)



  useEffect(() => {
    setMarkedDates(tempObj)
  }, [])


  return (
    <ScrollView style={{ flex: 1, borderColor: 'red', borderWidth: 0, }}>
      <View style={{ borderWidth: 0, borderColor: 'red', height: Dimensions.get('window').width / 5, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'grey' }}>{route.params.home.title}</Text>
      </View>
      <View style={{ borderWidth: 0, borderColor: 'green', height: Dimensions.get('window').width / 4, width: '100%', padding: '1%' }}>
        <Text style={{ fontSize: 16, color: 'grey' }}>{route.params.home.details}</Text>
      </View>

      <Modal style={{zIndex:5}} visible={isModalVisable}>
        <Calendar
          style={{
            borderWidth: 1,
            borderColor: 'grey',
            height: 350
          }}
          markingType={'custom'}
          minDate={new Date().toJSON().slice(0, 10)}
          onDayPress={day => {

            let equalNotFound = true;

            route.params.home.bookedDates.map((arrayItem, index)=>{
              if(equalNotFound !=true)
              {

              }
            })



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

        <TouchableOpacity onPress={() => { setIsModalVisable(false) }} style={{ width: '80%', backgroundColor: '#51A373', borderRadius: 10, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', marginBottom: Dimensions.get('window').width / 10, marginTop: Dimensions.get('window').width / 10, height: Dimensions.get('window').width / 10 }}>
          <Text style={{ alignSelf: 'center', fontSize: 20, color: 'white' }}>Testiq Et</Text>
        </TouchableOpacity>
      </Modal>



      <View style={{ borderWidth: 0, borderColor: 'blue', width: '100%', padding: '1%', height: Dimensions.get('window').width * 0.7, }}>
        <SliderBox style={{ height: '100%' }} images={images} />
      </View>
      <TouchableOpacity onPress={() => { setIsModalVisable(true) }} style={{ width: '80%', backgroundColor: '#51A373', borderRadius: 10, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', marginBottom: Dimensions.get('window').width / 10, marginTop: Dimensions.get('window').width / 10, height: Dimensions.get('window').width / 10 }}>
        <Text style={{ alignSelf: 'center', fontSize: 20, color: 'white' }}>Rezerv Et</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}