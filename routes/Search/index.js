import React, {useEffect, useState} from 'react';
import {
  Image,
  StyleSheet,
  Text, ScrollView,
  TouchableOpacity,
  View, ActivityIndicator, TextInput, KeyboardAvoidingView, ImageBackground, FlatList
} from 'react-native';
import {Container, Header, Icon, Input, Item, List, ListItem, Button, Right, Body, Left, Thumbnail} from "native-base";
import {findUserByUsername, getCheckFollowStatus} from '../../utils/API'
import UserProfile from "../../components/UserProfile";
import AsyncStorage from "@react-native-community/async-storage";

export default function Search(props) {
  const [data, setData] = React.useState([])
  const [openUserProfile, setOpenUserProfile] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [keyword, setKeyword] = React.useState('')
  const [uProfile, setUProfile] = React.useState('')

  const handleSearch = (text) => {
    findUserByUsername(text).then(res => {
      if(res === 'failed'){
        setData([])
      } else {
        setData(res)
      }
    })
    setKeyword(text)
  }

  if(openUserProfile){
    return(
      <UserProfile uProfile={uProfile} closeUProfile={() => setOpenUserProfile(false)}/>
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
    <Container>
      <Header searchBar rounded>
        <Item>
          <Icon name="ios-search"/>
          <Input placeholder="Search" onChangeText={handleSearch} autoCapitalize="none"/>
        </Item>
      </Header>
      <List>
        <FlatList
          data={data}
          renderItem={renderList}
          keyExtractor={(item, index) => index.toString()}
          ListFooterComponent={renderFooter}
        />
      </List>
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
  },
});
