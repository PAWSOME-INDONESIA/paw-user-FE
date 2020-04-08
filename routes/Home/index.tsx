import React from 'react';
import {StyleSheet, Text, View, FlatList, Image} from 'react-native';

//FlatList -> used for creating and mapping a list

export default function Home() {
  const friends = [
    {
      name: 'clement',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    },
    {
      name: 'johanes',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSG75DgbSzWIFBiaL_hs3knLhg_VZFVGVpeagz0arNBtfqPDwol&usqp=CAU',
    },
    {
      name: 'bill',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSfMnEnvwDETiaP51zH1w5nmKsZzcdnxjaz3IKyBsEfGI8YKmsb&usqp=CAU',
    },
    {
      name: 'devin',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    },
    {
      name: 'steve',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    },
    {
      name: 'kenneth',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    },
    {
      name: 'djoni',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    },
  ];

  return (
    <View style={{width: '100%', paddingTop: 40, flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Friend List</Text>
      <FlatList
        data={friends}
        style={{paddingTop: 15, width: '100%'}}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => (
          <View style={[
            styles.rowStyle,
            index % 2 > 0 ? styles.itemOdd : styles.itemEven
            ]}>
            <Image style={{marginLeft: 25, borderRadius: 50/2, width: 50, height: 50}} source={{uri: item.image}} />
            <Text style={{marginLeft: 25, lineHeight: 50}}>{item.name}</Text>
          </View>
        )}/>
    </View>
  );
}

const styles = StyleSheet.create({
  rowStyle: {
    flexDirection: 'row',
    paddingHorizontal: 25,
    paddingVertical: 25,
    borderColor: 'lightgrey',
    borderBottomWidth: 1
  },
  itemOdd: {
    backgroundColor: '#f1f1f1'
  },
  itemEven: {
    backgroundColor: '#ffffff'
  }
});
