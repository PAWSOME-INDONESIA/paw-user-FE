import React from 'react';
import {StyleSheet, Text, View, FlatList, Image, ActivityIndicator} from 'react-native';

//FlatList -> used for creating and mapping a list

export default function Home() {

  const [data, setData] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [isLoading, setLoading] = React.useState(false);

  React.useEffect(() => {
    getData();
  }, [page])

  const getData = async () => {
    const url = 'https://jsonplaceholder.typicode.com/photos?_limit=10&_page=' + page
    fetch(url).then((res) => res.json())
      .then((responseJson) => {
        setData(data.concat(responseJson))
        setLoading(false)
      })
  };

  const renderRow = ({item}) => {
    return(
      <View style={styles.item}>
          <Image style={styles.itemImage} source={{uri: item.url}} />
          <Text style={styles.itemText}>{item.title}</Text>
          <Text style={styles.itemText}>{item.id}</Text>
      </View>
    )
  };

  const handleMore = () => {
    setPage(page + 1)
    setLoading(true)
  };

  const handleScroll = ({event}: { event: any }) => {
    console.log(event, 'helo scroll')
  }

  const footer = () => {
    return(
      isLoading ? (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View> ) : null
    )
  };

  return (
    <View style={{width: '100%', flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <FlatList
        data={data}
        style={styles.container}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderRow}
        onEndReached={handleMore}
        onEndReachedThreshold={0}
        ListFooterComponent={footer}
        refreshing={isLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20
  },
  loader: {
    marginTop: 10,
    alignItems: 'center'
  },
  item: {
    borderBottomColor: '#000000',
    borderBottomWidth: 1,
    marginBottom: 10
  },
  itemImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover'
  },
  itemText: {
    fontSize: 16,
    padding: 5
  }
});
