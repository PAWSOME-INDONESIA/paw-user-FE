import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';

import Map from '../../routes/Map';
import Home from '../../routes/Home';
import Post from '../../routes/Post';
import Profile from '../../routes/Profile';

//Import all required component
import { View, Text } from 'react-native';
import Search from "../../routes/Search";

const HomeScreen = () => {
  global.currentScreenIndex = 'HomeScreen';
  const Stack = createStackNavigator();

function IconWithBadge({ name, badgeCount, color, size }) {
  return (
    <View style={{ width: 24, height: 24, margin: 5 }}>
      {/*<Ionicons name={name} size={size} color={color} />*/}
      <Entypo name={name} size={size} color={color} />
      {badgeCount > 0 && (
        <View
          style={{
            position: 'absolute',
            right: -6,
            top: -3,
            backgroundColor: 'red',
            borderRadius: 6,
            width: 12,
            height: 12,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
            {badgeCount}
          </Text>
        </View>
      )}
    </View>
  );
}

function HomeIconWithBadge(props) {
  // You should pass down the badgeCount in some other ways like React Context API, Redux, MobX or event emitters.
  return <IconWithBadge {...props} badgeCount={0} />;
}

const Tab = createBottomTabNavigator();

function MyTabs(props) {

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'Home') {
            return (
              <HomeIconWithBadge
                name="home"
                size={size}
                color={color}
              />
            );
          } else if (route.name === 'Add') {
            return (
              <Ionicons
                name={focused ? 'ios-cloud-upload' : 'ios-cloud-outline'}
                size={size}
                color={color}
              />
            );
          }
          else if (route.name === 'Find') {
            return (
              <Ionicons
                name={focused ? 'ios-search' : 'ios-search'}
                size={size}
                color={color}
              />
            );
          }
          else if (route.name === 'Map') {
            return (
            <FontAwesome5
              name="map-marked-alt"
              size={size}
              color={color} />
            );
          } else if (route.name === 'Profile') {
            return (
              <Ionicons
                name={focused ? 'ios-happy' : 'ios-contact'}
                size={size}
                color={color}
              />
            );
          }
        },
      })}
      tabBarOptions={{
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Add" component={Post} />
      <Tab.Screen name="Find" component={Search} />
      <Tab.Screen name="Map" component={Map} />
      <Tab.Screen name="Profile" component={Profile}/>
    </Tab.Navigator>
  );
}

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          // headerShown: false,
          // gestureEnabled: true
        }}>
        <Stack.Screen
          name="MyTabs"
          component={MyTabs}
          options={{
            title: 'MyTabs',
            headerBackTitleVisible: false,
            headerShown: false
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default HomeScreen;
