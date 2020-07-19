import React from 'react';
import {createStackNavigator} from "@react-navigation/stack";
import PetEncyclopedia from "../../routes/PetEncyclopedia";
import {NavigationContainer} from "@react-navigation/native";

const PetEncyclopediaScreen = () => {
  const Stack = createStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="MyTabs"
          component={PetEncyclopedia}
          options={{
            title: 'Pet Encyclopedia',
            headerBackTitleVisible: false,
            headerShown: false
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default PetEncyclopediaScreen;
