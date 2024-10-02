import React from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MemberMainScreen from './src/screens/member/MemberMainScreen.js';
import MemberCounselScreen from './src/screens/member/MemberCounselScreen.js';
import MemberChattingScreen from './src/screens/member/MemberChattingScreen.js';
import MemberMyScreen from './src/screens/member/MemberMyScreen.js';

import CounselorMainScreen from './src/screens/counselor/CounselorMainScreen.js';
import CounselorCounselScreen from './src/screens/counselor/CounselorCounselScreen.js';
import CounselorChattingScreen from './src/screens/counselor/CounselorChattingScreen.js';
import CounselorMyScreen from './src/screens/counselor/CounselorMyScreen.js';

import AlarmScreen from './src/screens/AlarmScreen.js'; 
import LandingScreen from './src/screens/LandingScreen.js';
import LoginScreen from './src/screens/LoginScreen';  
import MemberSignUpScreen from './src/screens/member/MemberSignUpScreen.js'
import CounselorSignUpScreen from './src/screens/counselor/CounselorSignUpScreen.js'

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
      <TouchableOpacity onPress={() => navigation.navigate('알림')}>
        <Image source={require('./assets/images/alarm.png')} style={styles.alarmIcon} />
      </TouchableOpacity>
    </View>
  );
};
// userType 이 Member, Counselor 이느냐에 따라 보이는 screen 이 다름. 
function Tabs({ route, navigation }) {
  const { userType } = route.params; 

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        header: () => <CustomHeader routeName={route.name} navigation={navigation} />,
      })}
    >
      {userType === 'Member' ? (
        <>
          <Tab.Screen name="Main" component={MemberMainScreen} />
          <Tab.Screen name="상담" component={MemberCounselScreen} />
          <Tab.Screen name="채팅" component={MemberChattingScreen} />
          <Tab.Screen name="내 정보" component={MemberMyScreen} />
        </>
      ) : userType === 'Counselor' ? (
        <>
          <Tab.Screen name="Main" component={CounselorMainScreen} />
          <Tab.Screen name="상담" component={CounselorCounselScreen} />
          <Tab.Screen name="채팅" component={CounselorChattingScreen} />
          <Tab.Screen name="내 정보" component={CounselorMyScreen} />
        </>
      ) : null}
    </Tab.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="로그인" component={LoginScreen} />
        <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
        <Stack.Screen name="알림" component={AlarmScreen} />
        <Stack.Screen name="내담자 회원가입" component={MemberSignUpScreen} />
        <Stack.Screen name="상담자 회원가입" component={CounselorSignUpScreen} />
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
    fontSize: 20,
    fontWeight: 'bold',
  },
  alarmIcon: {
    width: 18,
    height: 20,
  },
});

export default App;
