import React from 'react';
import {StyleSheet, Text, View, StatusBar, TouchableOpacity, Button} from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { AsyncStorage } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Home from './routes/Home';
// @ts-ignore
import Login from './routes/Login';
// @ts-ignore
import Register from './routes/Register';
import IconCamera from "./components/Icons/IconCamera";
import Map from "./routes/Map";

function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Home/>
    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {/*<Text>Settings!</Text>*/}
      <Button title={'Log Out'} onPress={() => AsyncStorage.removeItem('@session')}/>
    </View>
  );
}

function MapScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Map/>
        </View>
    );
}

function IconWithBadge({ name, badgeCount, color, size }) {
  return (
    <View style={{ width: 24, height: 24, margin: 5 }}>
      <Ionicons name={name} size={size} color={color} />
      {badgeCount > 0 && (
        <View
          style={{
            // On React Native < 0.57 overflow outside of parent will not work on Android, see https://git.io/fhLJ8
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
  return <IconWithBadge {...props} badgeCount={3} />;
}

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'Home') {
            return (
              <HomeIconWithBadge
                name={
                  focused
                    ? 'ios-information-circle'
                    : 'ios-information-circle-outline'
                }
                size={size}
                color={color}
              />
            );
          } else if (route.name === 'Settings') {
              return (
                  <Ionicons
                      name={focused ? 'ios-menu' : 'ios-settings'}
                      size={size}
                      color={color}
                  />
              );
          } else if (route.name === 'Post') {
                return (
                  <Ionicons
                    name={focused ? 'ios-cloud-upload' : 'ios-cloud-outline'}
                    size={size}
                    color={color}
                  />
                );
          } else if (route.name === 'Map') {
            return (
              <Ionicons
                  name={focused ? 'ios-add-circle' : 'ios-add'}
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
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Post" component={MapScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

// function Login() {
//   return (
//     <Login/>
//   )
// }

export default function App() {

  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          // headerShown: false,
          gestureEnabled: false
        }}>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
              title: 'Login',
              headerBackTitleVisible: false,
              headerShown: false
          }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{
              title: 'Welcome' ,
              headerBackTitleVisible: false,
              headerShown: false
          }}
        />
        <Stack.Screen
          name="Home"
          component={MyTabs}
          options={{
              title: 'Pawsome',
              headerStyle: {
                  backgroundColor: '#000000',
              },
              headerLeft: (props) => (
                  <IconCamera onPress={() => alert('helo')}/>
              ),
              headerRight: () => (
                  <Button
                      onPress={() => alert('This is a button!')}
                      title="DM"
                      color="#00cc00"
                  />
              ),
              headerBackTitleVisible: false,
              headerTintColor: '#fff',
              headerTitleStyle: {
                  fontWeight: 'bold', }}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});