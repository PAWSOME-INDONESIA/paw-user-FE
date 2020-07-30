import React, {useEffect, useState} from 'react';
import {
  Image,
  StyleSheet,
  Text, ScrollView,
  TouchableOpacity,
  View, ActivityIndicator, FlatList
} from 'react-native';
import {Container, Header, Icon, Input, Item, List, ListItem, Button, Right, Body, Left, Thumbnail} from "native-base";
import Modal from "react-native-modal";
import UserProfile from "../UserProfile";

export default function Follower(props) {
  const [data, setData] = React.useState([])
  const [data2, setData2] = React.useState([])
  const [openUserProfile, setOpenUserProfile] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [uProfile, setUProfile] = React.useState('')

  useEffect(() => {
    setData(props.followers)
    setData2(props.followers)
  },[props.followers])

  const handleSearch = (text) => {
    let filteredData = data2.filter(x => String(x.username).includes(text));
    setData(filteredData)
  }

  if(openUserProfile){
    return(
      <UserProfile
        uProfile={uProfile}
        closeUProfile={() => setOpenUserProfile(false)}
        backFollow={err => {
          let filteredData = data.filter(x => x.id !== err.userID);
          setData(filteredData)
          props.backData(filteredData)
        }}
      />
    )
  }

  const renderList = ({item, index}) => {
    return (
      <ListItem thumbnail style={{marginTop: 10}}>
        <Left>
          <Thumbnail circular source={{ uri: item.imageUrl }} />
        </Left>
        <Body>
          <Text>{item.username}</Text>
          <Text note numberOfLines={1}  style={{color: 'grey', fontSize: 10, marginTop: 5}}>{item.bio}</Text>
        </Body>
        <Right>
          <Button transparent onPress={() => {
            setOpenUserProfile(true)
            setUProfile(item)
          }}>
            <Text style={{color: '#000080'}}>View</Text>
          </Button>
        </Right>
      </ListItem>
    )
  }

  const renderFooter = () => {
    return(
      loading && (
        <View style={{paddingVertical: 20, borderTopWidth: 1, borderColor: 'white'}}>
          <ActivityIndicator animating size="large"/>
        </View>
      )
    )
  }
    return(
      <View style={styles.container}>
        <Modal
          isVisible={props.open}
          onSwipeComplete={props.close}
          swipeThreshold={50}
          swipeDirection={['down']}
        >
          <Container style={{marginTop: 30, borderRadius: 20}}>
              <Item style={{top: 10, marginLeft: 20, marginRight: 20}}>
                <Icon name="ios-search"/>
                <Input placeholder="Search" onChangeText={handleSearch} autoCapitalize="none"/>
              </Item>
            <List>
              <FlatList
                data={data}
                renderItem={renderList}
                keyExtractor={(item, index) => index.toString()}
                ListFooterComponent={renderFooter}
              />
            </List>
          </Container>
        </Modal>
      </View>
    )
}

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: 20,
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
  },
});
