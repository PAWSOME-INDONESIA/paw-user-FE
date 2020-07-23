import React, {useEffect} from "react";
import { Container, Header,
  Item, Input, Icon, Button,
  Text, List, ListItem,
  Left, Thumbnail, Body,
  Right, Content, Accordion
} from 'native-base';
import {FlatList, View, ActivityIndicator, Image, TouchableOpacity} from "react-native";
import { getPetEncyclopedia } from '../../utils/API'
import {Ionicons} from "@expo/vector-icons";
import * as Font from 'expo-font';

const animal = [
  {
    name: 'Dogs',
    imageUrl: 'https://cdn.dribbble.com/users/4714983/screenshots/9836903/media/6dd14910e5608775c74cbaffc3b45199.jpg',
    tagline: 'woof woof ...'
  },
  {
    name: 'Cats',
    imageUrl: 'https://i.pinimg.com/originals/4a/46/9b/4a469b1051b4c0665f91bfb8ae879af6.jpg',
    tagline: 'meaw meaw ...'
  },
]

export default function PetEncyclopedia(){
  const [data, setData] = React.useState(animal)
  const [loading, setLoading] = React.useState(false)
  const [details, setDetails] = React.useState([])
  const [detailsCopy, setDetailsCopy] = React.useState([])
  const [openDetails, setOpenDetails] = React.useState(false)

  const getDetails = type => {
    getPetEncyclopedia(type).then(res => {
      if(res === 'failed'){
        return
      }
      setDetails(res)
      setDetailsCopy(res)
      setOpenDetails(true)
    })
  }

  const renderList = ({item, index}) => {
    return (
      <Content>
        <List>
          <ListItem thumbnail>
            <Left>
              <Thumbnail square source={{ uri: item.imageUrl }}/>
            </Left>
            <Body>
              <Text>{item.name}</Text>
              <Text note numberOfLines={1}>{item.tagline}</Text>
            </Body>
            <Right>
              <Button transparent onPress={() => getDetails(item.name)}>
                <Text>Details</Text>
              </Button>
            </Right>
          </ListItem>
        </List>
      </Content>
    )
  }

  const renderDetails = ({item, index}) => {
    return (
      <Content>
        <List>
          <ListItem thumbnail style={{marginTop: 20}}>
            <Left>
              <Thumbnail circular source={{ uri: item.imageUrl }}/>
            </Left>
          </ListItem>
          <Accordion
            style={{marginLeft: 90, bottom: 47, marginRight: 20}}
            dataArray={[item]}
            headerStyle={{ backgroundColor: "#b7daf8" }}
            contentStyle={{ backgroundColor: "#ddecf8" }}
          />
        </List>
      </Content>
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

  const handleSearch = (text) => {
    let filteredData = animal.filter(x => String(x.name).includes(text));
    setData(filteredData)
  }

  const handleSearchDetails = (text) => {
    let filteredData = detailsCopy.filter(x => String(x.title).includes(text));
    setDetails(filteredData)
  }

  if(openDetails){
    return(
      <Container>
        <TouchableOpacity style={{left: 10, top: 20}} onPress={() => setOpenDetails(false)}>
          <Ionicons name="ios-arrow-back" size={30} color="blue" />
          <Text style={{left: 20, bottom: 27, fontWeight: 'bold'}}>Back</Text>
        </TouchableOpacity>
        <Header searchBar rounded style={{marginLeft: 80, backgroundColor: 'white',top: -35, height: 20}}>
          <Item>
            <Icon name="ios-search"/>
            <Input placeholder="Search" onChangeText={handleSearchDetails}/>
          </Item>
        </Header>
        <FlatList
          data={details}
          renderItem={renderDetails}
          keyExtractor={(item, index) => index.toString()}
          ListFooterComponent={renderFooter}
        />
      </Container>
    )
  }

  return (
    <Container>
      <Header searchBar rounded>
        <Item>
          <Icon name="ios-search"/>
          <Input placeholder="Search" onChangeText={handleSearch}/>
        </Item>
      </Header>
      <FlatList
        data={data}
        renderItem={renderList}
        keyExtractor={(item, index) => index.toString()}
        ListFooterComponent={renderFooter}
      />
    </Container>
  );
}
