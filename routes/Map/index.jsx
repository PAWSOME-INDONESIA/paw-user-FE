import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Dimensions, Image, TouchableOpacity} from 'react-native';
import MapView, {Circle, Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import AsyncStorage from "@react-native-community/async-storage";
import isEmpty from "lodash/isEmpty";
import { Button } from 'native-base'
import {getFollowers, getFollowings, getPet, getUser, getUserPost} from "../../utils/API";

export default function Map() {
  const [pet, setPet] = useState([]);
  const [mapType, setMapType] = useState('standard')
  const [latitudeDelta, setLatitudeDelta] = useState(0.002)
  const [longitudeDelta, setLongitudeDelta] = useState(0.002)

  useEffect(() => {
    const intervalId = setInterval(() => {
      AsyncStorage.getItem('@session').then(res => {
        getPet(res, 'true').then(pet => {
          console.log(pet, 'helo pet')
          if(pet === 'failed'){
            return
          }
          setPet(pet)
        })
      })
    }, 5000)

    return () => clearInterval(intervalId);

  }, [])

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        region={{
          latitude: -6.103958224,
          longitude: 106.79059391,
          latitudeDelta: latitudeDelta,
          longitudeDelta: longitudeDelta,
        }}
        zoomEnabled={true}
        onRegionChangeComplete={reg => {
          if(latitudeDelta !== reg.latitudeDelta){
            setLatitudeDelta(reg.latitudeDelta)
            setLongitudeDelta(reg.longitudeDelta)
          }
        }}
        loadingEnabled
        showsMyLocationButton = {true}
        followsUserLocation={true}
        loadingIndicatorColor="#666666"
        loadingBackgroundColor="#eeeeee"
        provider={PROVIDER_GOOGLE}
        mapType={mapType}
        // zoomControlEnabled={true}
        // zoomTapEnabled={true}
      >
        {
          !isEmpty(pet) && pet.map((res, index) => {
            if(!isEmpty(res.location.latitude)) {
              return (
                <Marker
                  // image={require("../../assets/dog.png")}
                  key={index}
                  centerOffset={{ x: -18, y: -60 }}
                  anchor={{ x: 0.69, y: 1 }}
                  coordinate={{
                    latitude: parseFloat(res.location.latitude),
                    longitude: parseFloat(res.location.longitude)
                  }}
                  title={res.name}
                  description={'I love to eat'}
                >
                  <Image source={{uri: res.imageUrl}} style={{height: 30, width: 30, borderRadius: 50}}/>
                </Marker>
              )
            }
          })
        }
      </MapView>
      <View style={{ position: 'absolute', bottom: 50, left: 30 }}>
        <TouchableOpacity
          style={{width: 100, height: 50, backgroundColor: 'rgba(0, 0, 0, 0.1)', justifyContent: 'center', alignItems: 'center'}}
          onPress={() => setMapType('satellite')}
        >
          <Text style={{color: 'grey', fontWeight: 'bold', textAlign: 'center'}}>
            Satellite Map Type
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ position: 'absolute', bottom: 120, left: 30 }}>
        <TouchableOpacity
          style={{width: 100, height: 50, backgroundColor: 'rgba(0, 0, 0, 0.1)', justifyContent: 'center', alignItems: 'center'}}
          onPress={() => setMapType('standard')}
        >
          <Text style={{color: 'grey', fontWeight: 'bold', textAlign: 'center'}}>
            Standard Map Type
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapStyle: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
