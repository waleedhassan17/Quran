import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import ReadQuran from './screens/ReadQuranScreen';
import Search from './screens/Search';
import SurahDetail from './screens/SurahDetail';

const Stack = createNativeStackNavigator();

const App = () => {
  return(
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen name='HomeScreen' component={HomeScreen} options={{headerShown:false}}/>
      <Stack.Screen name='ReadQuran' component={ReadQuran} />
      <Stack.Screen name='Search' component={Search} />
      <Stack.Screen name='SurahDetail' component={SurahDetail} />
       
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;