import React, {useEffect} from 'react';
import {StyleSheet, Text, View, FlatList, Image, ActivityIndicator, TouchableOpacity} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

//FlatList -> used for creating and mapping a list

export default function Home() {

  const [feed, setFeed] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [likes, setLikes] = React.useState(false);

  const goLike = (id) => {
    setLikes(!likes)
  }

  console.log(likes, 'helo likes')

  async function loadPage(pageNum = page, shouldRefresh = false){
      if(total && page > total) return;

      setLoading(true)

      const response = await fetch(`https://jsonplaceholder.typicode.com/photos?_limit=10&_page=${pageNum}`)

      const data = await response.json()
      const totalItems = response.headers.get('X-Total-Count')

      setTotal(Math.floor(totalItems/5))
      setFeed(shouldRefresh ? data : [...feed, ...data])
      setPage(pageNum + 1)
      setLoading(false)
  };

  useEffect(() => {
    loadPage();
  }, [])

  const renderRow = ({item}) => {
    return(
      <View style={styles.item}>
          <Image style={styles.itemImage} source={{uri: item.url}} />
          <TouchableOpacity onPress={() => goLike(item.id)}>
            <View style={styles.likes}>
              <Ionicons name={likes ? 'ios-heart' : 'ios-heart-empty'} size={24} color="black" />
            </View>
          </TouchableOpacity>
          <Text style={styles.itemText}>100 likes</Text>
          <Text style={styles.itemText}>{item.title}</Text>
      </View>
    )
  };

  const footer = () => {
    return(
      loading ? (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View> ) : null
    )
  };

  async function refreshList() {
      setRefreshing(true)

      await loadPage(1, true);

      setRefreshing(false)
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={feed}
        refreshing={refreshing}
        onEndReached={() => loadPage()}
        onEndReachedThreshold={0.1}
        keyExtractor={post => String(post.id)}
        renderItem={item => renderRow(item)}
        ListFooterComponent={footer}
        onRefresh={refreshList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      width: '100%'
  },
  loader: {
    marginTop: 10,
    alignItems: 'center'
  },
  item: {
    marginBottom: 20
  },
  itemImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover'
  },
  likes: {
    height: 35,
    width: 35,
    marginLeft: 10,
    marginTop: 5,
  },
  itemText: {
    fontSize: 12,
    padding: 5,
    bottom: 5
  },
});
