import React, {useEffect} from "react";
import { Container, Header,
  Item, Input, Icon, Button,
  Text, List, ListItem,
  Left, Thumbnail, Body,
  Right,
} from 'native-base';
import {FlatList, View, ActivityIndicator} from "react-native";
import _ from 'lodash'

export default function PetEncyclopedia(){
  const [data, setData] = React.useState([])
  const [fullData, setFullData] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [keyword, setKeyword] = React.useState('')

  useEffect(() => {
    loadPetEncyclopedia()
  },[])
  async function loadPetEncyclopedia(){
    setLoading(true)
    const response = await fetch('https://jsonplaceholder.typicode.com/photos?_limit=30')
    const data = await response.json()

    setFullData(data)
    setData(data)
    setLoading(false)
  }

  const renderList = ({item, index}) => {
    return (
      <ListItem thumbnail>
        <Left>
          <Thumbnail square source={{ uri: item.thumbnailUrl }} />
        </Left>
        <Body>
          <Text>{item.id}</Text>
          <Text note numberOfLines={1}>{item.title}</Text>
        </Body>
        <Right>
          <Button transparent>
            <Text>View</Text>
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

  const handleSearch = (text) => {
    const formattedQuery = text.toLowerCase();
    const data = _.filter(fullData, photo => {
      if(photo.title.includes(formattedQuery)){
        return true
      }
      return false
    })

    setData(data)
    setKeyword(text)
  }
  return (
    <Container>
      <Header searchBar rounded>
        <Item>
          <Icon name="ios-search"/>
          <Input placeholder="Search" onChangeText={handleSearch}/>
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
  );
}
