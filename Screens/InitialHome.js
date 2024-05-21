import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


export default function InitialHome({route, navigation}) {


    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor:'black' }}>
            <TouchableOpacity onPress={()=>{
                navigation.navigate('Home')
            }} style={{ width: '70%', height: '7%', backgroundColor: '#ebebeb', justifyContent: 'center', alignItems: 'center', borderRadius: 10, flexDirection:'row' }}>
                <Icon name="home-roof" size={30} color="#d44a4a" />
                <Text style={{ color: 'black', marginLeft:'5%', marginRight:'15%' }}>Kirayə</Text>
            </TouchableOpacity>

           {/* <TouchableOpacity onPress={()=>{
                navigation.navigate('Home')
            }} style={{ width: '70%', height: '7%', backgroundColor: '#ebebeb', justifyContent: 'center', alignItems: 'center', marginTop: '10%', borderRadius: 10,flexDirection:'row' }}>
                <Icon name="home-roof" size={30} color="#d44a4a" />
                
                <Text style={{ color: 'black',marginLeft:'5%', marginRight:'15%'  }}>Satış</Text>
            </TouchableOpacity>*/}

            <TouchableOpacity onPress={()=>{
                navigation.navigate('Room')
            }} style={{ width: '70%', height: '7%', backgroundColor: '#ebebeb', justifyContent: 'center', alignItems: 'center', marginTop: '10%', borderRadius: 10,flexDirection:'row' }}>
                <Icon name="home-roof" size={30} color="#d44a4a" />
                
                <Text style={{ color: 'black',marginLeft:'5%', marginRight:'15%'  }}>Ev Sahibleri</Text>
            </TouchableOpacity>
        </View>
    )
}