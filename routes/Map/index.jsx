import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Dimensions, Image, TouchableOpacity} from 'react-native';
import MapView, {Circle, Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import AsyncStorage from "@react-native-community/async-storage";
import isEmpty from "lodash/isEmpty";
import * as Location from 'expo-location';
import { getPet } from "../../utils/API";

export default function Map() {
  const [pet, setPet] = useState([]);
  const [mapType, setMapType] = useState('standard')
  const [mapTypeReverse, setMapTypeReverse] = useState('Satellite Map Style')
  const [latitudeDelta, setLatitudeDelta] = useState(0.002)
  const [longitudeDelta, setLongitudeDelta] = useState(0.002)
  const [longitude, setLongitude] = useState(106.79059391)
  const [latitude, setLatitude] = useState(-6.103958224)

  useEffect(() => {
    const intervalId = setInterval(() => {
      AsyncStorage.getItem('@session').then(res => {
        getPet(res, 'true').then(pet => {
          // console.log(pet, 'helo dum')
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
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: latitudeDelta,
          longitudeDelta: longitudeDelta,
        }}
        zoomEnabled={true}
        onRegionChangeComplete={reg => {
          setLatitudeDelta(reg.latitudeDelta)
          setLongitudeDelta(reg.longitudeDelta)
          setLatitude(reg.latitude)
          setLongitude(reg.longitude)
        }}
        loadingEnabled
        // showsMyLocationButton={true}
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
                  <Image source={{uri: res.imageUrl}} style={{height: 40, width: 40, borderRadius: 50}}/>
                </Marker>
              )
            }
          })
        }
      </MapView>
      <View style={{ position: 'absolute', bottom: 0, left: 30 }}>
        <TouchableOpacity
          style={{width: 100, height: 50, backgroundColor: 'rgba(0, 0, 0, 0.1)', justifyContent: 'center', alignItems: 'center', borderRadius: 10, bottom: -50, left: -10}}
          onPress={() => {
            if(mapType === 'satellite'){
              setMapType('standard')
              setMapTypeReverse('Satellite Map Style')
            } else {
              setMapType('satellite')
              setMapTypeReverse('Standard Map Style')
            }
          }}
        >
          <Text style={{color: 'grey', fontWeight: 'bold', textAlign: 'center'}}>
            {mapTypeReverse}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{width: 50, height: 50, bottom: 50, backgroundColor: 'rgba(0, 0, 0, 0.1)', left: 310, alignItems: 'center', borderRadius: 10, justifyContent: 'center'}}
          onPress={() => {
            console.log('helo2')
            setLatitudeDelta(latitudeDelta/10)
            setLongitudeDelta(longitudeDelta/10)
          }}
        >
          <Text style={{color: 'grey', fontWeight: 'normal', textAlign: 'center', fontSize: 40, top: -3}}>
            +
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{width: 50, height: 50, bottom: 30, backgroundColor: 'rgba(0, 0, 0, 0.1)', left: 310, alignItems: 'center', borderRadius: 10, justifyContent: 'center'}}
          onPress={() => {
            console.log('helo')
            setLatitudeDelta(latitudeDelta*10)
            setLongitudeDelta(longitudeDelta*10)
          }}
        >
          <Text style={{color: 'grey', fontWeight: 'normal', textAlign: 'center', fontSize: 40, top: -3}}>
            -
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
