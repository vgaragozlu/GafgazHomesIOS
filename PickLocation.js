import { View, Text, Image, Modal, TouchableOpacity, PermissionsAndroid } from 'react-native'
import React, { useState, useEffect } from 'react'
import MapView, { MapMarker } from 'react-native-maps';
import LottieView from 'lottie-react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import Geolocation from 'react-native-geolocation-service';

export default function PickLocation({ route, navigation }) {

    const [currentLocation, setCurrentLocation] = useState({ "latitude": 0, "longitude": 0 })
    const [pickedLocation, setPickedLocation] = useState(null)
    const [isModalVisable, setIsModalVisable] = useState(false)


    const [locationLoading, setLocationLoading] = useState(false)


    const requestCameraPermission = async () => {

        setLocationLoading(true)


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


    const requestUserLocation = async () => {
        setLocationLoading(true)
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

            }
            else {
                alert('Konum icazəsi yoxdur. Zəhmət olmazsa ayarları yoxlayın')
                console.log('Camera permission denied');
            }
        } catch (err) {
            console.warn(err);
            setLocationLoading(false)
        }
    };

    const [flag, setFlag]=useState(false)

    useEffect(() => {
        console.log('Usee ffect')
        if(route.params&&route.params.comingFrom=='editListing')
        {
          //  alert('yes')
            setFlag(true)
        }

    }, [])


    return (
        <View style={{ flex: 1 }}>

            <MapView
            mapType='satellite'
                showsMyLocationButton={false}
                showsUserLocation={true}
                onPress={(e) => {
                    console.log(e.nativeEvent.coordinate)
                    // alert('!!', e.nativeEvent.coordinate)
                    setPickedLocation(e.nativeEvent.coordinate)
                    setIsModalVisable(true)
                }}
                onRegionChangeComplete={(e) => {

                }}
                onRegionChange={() => {
                    // alert('SSSS')
                }}
                region={{
                    latitude: route.params && route.params.pickedLocation ? route.params.pickedLocation.latitude : 40.98187485456937,
                    longitude: route.params && route.params.pickedLocation ? route.params.pickedLocation.longitude : 47.841374315321445,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                style={{ flex: 1 }}
                minZoomLevel={13}
                maxZoomLevel={17}
                initialRegion={{
                    latitude: 40.9982,
                    longitude: 47.8700,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}

            >

                <View

                    style={{ height: 65, width: 65, borderRadius: 30, justifyContent: 'center', alignItems: 'center', }}>

                    <MapMarker
                        onPress={() => {

                        }}
                        title={''}
                        coordinate={{ latitude: pickedLocation != null ? pickedLocation.latitude : 0, longitude: pickedLocation != null ? pickedLocation.longitude : 0 }}>
                        <View style={{ height: 45, width: 45, borderRadius: 30, borderWidth: 0, borderColor: '#998d8d', justifyContent: 'center', alignItems: 'center' }}>
                            <Image source={require('./images/pin4.png')} style={{ height: 43, width: 43, borderRadius: 30, borderWidth: 0, borderColor: 'white' }} />

                        </View>


                    </MapMarker>
                   

                </View>
            </MapView>

            <View style={{ position: 'absolute', bottom: '5%', right: '5%',  justifyContent: 'center', alignItems: 'center', }}>


                <TouchableOpacity onPress={() => {
                    if (pickedLocation != null) {
console.log('^^^^^^', pickedLocation)
if(route.params &&route.params.listingAsAParameter)
navigation.navigate('AddListing', { 'pickedLocation': pickedLocation, 'comingFrom': 'pickLocation' , 'flag':flag, 'selectedListing':route.params.listingAsAParameter})
else {
navigation.navigate('AddListing', { 'pickedLocation': pickedLocation, 'comingFrom': 'pickLocation' , 'flag':flag, })
    
}

return
                        navigation.navigate('AddListing', { 'pickedLocation': pickedLocation, 'comingFrom': 'pickLocation' , 'flag':flag, 'selectedListing':route.params.listingAsAParameter})

                    }
                    else (
                        alert('Konum seçmədiniz')
                    )
                }
                }>
                    <Icon2 name="check" size={40} color='white'/>
                </TouchableOpacity>
            </View>

            <View style={{ position: 'absolute', bottom: '5%', left: '5%', justifyContent: 'center', alignItems: 'center', borderRadius: 5 }}>


                <TouchableOpacity onPress={() => {
                    requestUserLocation()
                }
                }>
                    <Icon name="my-location" size={35} color="grey" />

                </TouchableOpacity>
            </View>
        </View>
    )
}