import React from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MainScreen from './src/screens/member/MemberMainScreen.js';
import CounselScreen from './src/screens/member/MemberCounselScreen.js';
import ChattingScreen from './src/screens/member/MemberChattingScreen.js';
import MyScreen from './src/screens/member/MemberMyScreen.js';
import AlarmScreen from './src/screens/AlarmScreen.js'; 
import LandingScreen from './src/screens/LandingScreen.js';
import LoginScreen from './src/screens/LoginScreen';  

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const CustomHeader = ({ routeName, navigation }) => {
  return (
    <View style={styles.header}>
      {routeName === 'Main' ? (
        <Image source={require('./assets/images/logo.png')} style={styles.logo} />
      ) : (
        <Text style={styles.title}>{routeName}</Text>
      )}
      <TouchableOpacity onPress={() => navigation.navigate('AlarmScreen')}>
        <Image source={require('./assets/images/alarm.png')} style={styles.alarmIcon} />
      </TouchableOpacity>
    </View>
  );
};

function MyTabs({ navigation }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        header: () => <CustomHeader routeName={route.name} navigation={navigation} />, // Set custom header per screen
      })}
    >
      <Tab.Screen name="Main" component={MainScreen} />
      <Tab.Screen name="Counsel" component={CounselScreen} />
      <Tab.Screen name="Chatting" component={ChattingScreen} />
      <Tab.Screen name="My" component={MyScreen} />
    </Tab.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} />
        <Stack.Screen
          name="Login"
          component={LoginScreen}// 로그인 페이지에서 헤더 숨김
        />
        <Stack.Screen
          name="Tabs"
          component={MyTabs}
          options={{ headerShown: false }} // Hide default header
        />
        <Stack.Screen name="AlarmScreen" component={AlarmScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    height: 80,  
  },
  logo: {
    width: 100,
    height: 40,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  alarmIcon: {
    width: 18,
    height: 20,
  },
});

export default App;
