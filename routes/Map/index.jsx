import React from 'react';
import { StyleSheet, Text, View, Dimensions, Image } from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';

export default function Map() {

  const region = {
    latitude: -6.104490,
    longitude: 106.795030,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.mapStyle}
        initialRegion={{
          latitude: -6.104490,
          longitude: 106.795030,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        region={region}
        zoomEnabled={true}
        provider={PROVIDER_GOOGLE}
      >
        <Marker
          // image={require("../../assets/dog.png")}
          draggable
          coordinate={{
            latitude: -6.104490,
            longitude: 106.795030,
          }}
          onDragEnd={(e) => alert(JSON.stringify(e.nativeEvent.coordinate))}
          title={'Pet A'}
          description={'This is a description of the marker'}
        >
          <Image source={require("../../assets/dog.png")} style={{height: 50, width: 50 }} />
        </Marker>

        <Marker
          coordinate={{
            latitude: -6.104490,
            longitude: 106.796030,
          }}
          title={'Pet B'}
          description={'This is a description of the marker'}
        >
          {/*<Image source={require("../../assets/dog.png")} style={{height: 50, width: 50 }} />*/}
        </Marker>

        <Marker
          draggable
          coordinate={{
            latitude: -6.104490,
            longitude: 106.792030,
          }}
          onDragEnd={(e) => alert(JSON.stringify(e.nativeEvent.coordinate))}
          title={'Pet C'}
          description={'This is a description of the marker'}
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
