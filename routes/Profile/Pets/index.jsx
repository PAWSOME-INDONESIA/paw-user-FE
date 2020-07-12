import React, {useEffect, useState} from 'react';
import {
  StyleSheet, View, Modal, Button, AsyncStorage, FlatList, Image,
  Text, ActivityIndicator, TouchableOpacity, TextInput
} from 'react-native';
import {getPet} from "../../../utils/API";

export default function Pets(props) {
  const [petList, setPetList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [seed, setSeed] = useState(1);
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   fetchPets()
  // }, [])

  const fetchPets = async () => {
    const store = await AsyncStorage.getItem('@session').then(res => {return res})

    setLoading(true)
    const fetchPets = await getPet(store, 'false')

    setPetList(fetchPets)
  }

  const handleSearch = text => {
    console.log(text, 'helo text')
  };

  const renderFooter = () => {
    if (!loading) return null;

    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: '#CED0CE'
        }}
      >
        <ActivityIndicator animating size='large' />
      </View>
    );
  };

  const renderHeader = () => (
    <View
      style={{
        backgroundColor: '#fff',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <TextInput
        autoCapitalize='none'
        onChangeText={handleSearch}
        style={{
          borderRadius: 25,
          borderColor: '#d3d3d3',
          backgroundColor: '#ffffff',
          width: 300,
          height: 35,
          borderWidth: 1,
          paddingLeft: 15,
        }}
        placeholder="Search"
      />
    </View>
  );

  return (
    <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={props.open}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Button title={'Close'} onPress={props.close()} />
              <View
                style={{
                  flex: 1,
                  paddingHorizontal: 0,
                  paddingVertical: 20,
                  marginTop: 40,
                  width: '100%'
                }}
              >
                <FlatList
                  data={petList}
                  keyExtractor={item => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => alert('Item pressed!')}>
                      <View
                        style={{
                          flexDirection: 'row',
                          padding: 16,
                          alignItems: 'center',
                        }}
                      >
                        <Image source={{uri: item.imageUrl}} style={{width: 50, height: 50, marginRight: 20}}/>
                        <Text style={{ fontSize: 22 }}>
                          {item.name} - {item.birthDate}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  ListFooterComponent={renderFooter}
                  ListHeaderComponent={renderHeader}
                />
              </View>
            </View>
          </View>
        </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container : {
    flex: 1,
    backgroundColor: 'white'
  },
  centeredView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    width: '100%',
    height: '100%',
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
