import React from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, PermissionsAndroid } from 'react-native';

import MemberMainScreen from './src/screens/member/MemberMainScreen.js';
import MemberCounselScreen from './src/screens/member/MemberCounselScreen.js';
import MemberCounselorDetailScreen from './src/screens/member/MemberCounselorDetailScreen.js';
import MemberChattingScreen from './src/screens/member/MemberChattingScreen.js';
import MemberMyScreen from './src/screens/member/MemberMyScreen.js';
import MemberReservationScreen from './src/screens/member/MemberReservationScreen.js';
import TestScreen from './src/screens/member/TestScreen.js';

import CounselorMainScreen from './src/screens/counselor/CounselorMainScreen.js';
import CounselorCounselScreen from './src/screens/counselor/CounselorCounselScreen.js';
import CounselorChattingScreen from './src/screens/counselor/CounselorChattingScreen.js';
import CounselorMyScreen from './src/screens/counselor/CounselorMyScreen.js';
import CounselorProfileScreen from './src/screens/counselor/CounselorProfileScreen.js';
import CounselorChargeScreen from './src/screens/counselor/CounselorChargeScreen.js';
import CounselorPlanScreen from './src/screens/counselor/CounselorPlanScreen.js';
import CounselorTimeSettingScreen from './src/screens/counselor/CounselorTimeSettingScreen.js';
import CounselorEditScreen from './src/screens/counselor/CounselorEditScreen.js';

import AlarmScreen from './src/screens/AlarmScreen.js'; 
import LandingScreen from './src/screens/LandingScreen.js';
import LoginScreen from './src/screens/LoginScreen';  

import MemberSignUpScreen from './src/screens/member/MemberSignUpScreen.js';
import CounselorSignUpScreen from './src/screens/counselor/CounselorSignUpScreen.js';

import CounselDetailScreen from './src/screens/CounselDetailScreen.js';
import CounselWriteReportScreen from './src/screens/CounselWriteReportScreen.js';
import MemberWriteReviewScreen from './src/screens/MemberWriteReviewScreen.js';
import ChatRoomScreen from './src/screens/ChatroomScreen.js'
import SettingsScreen from './src/screens/SettingsScreen.js'

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const setupNotificationsOnFirstLogin = async (userId) => {
  try {
    const hasSetupNotifications = await AsyncStorage.getItem('hasSetupNotifications');
    
    if (hasSetupNotifications !== 'true') {
      let permissionGranted = false;

      // iOS에서 권한 요청
      if (Platform.OS === 'ios') {
        const authStatus = await messaging().requestPermission();
        permissionGranted = 
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      } 
      // Android에서 권한 요청 (Android 13 이상)
      else if (Platform.OS === 'android' && Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        permissionGranted = granted === PermissionsAndroid.RESULTS.GRANTED;
      } 
      // Android 13 미만에서는 별도의 권한 요청 불필요
      else {
        permissionGranted = true;
      }

      if (permissionGranted) {
        console.log('Notification permission granted');
        // FCM 토큰 얻기 및 서버로 전송
        const token = await messaging().getToken();
        console.log('FCM Token:', token);
        await sendFcmTokenToServer(userId, token);
        
        // 설정 완료 표시
        await AsyncStorage.setItem('hasSetupNotifications', 'true');
      } else {
        console.log('Notification permission denied');
      }
    } else {
      console.log('Notifications already set up');
    }
  } catch (error) {
    console.log('Error in notification setup:', error);
  }
};

const sendFcmTokenToServer = async (userId, fcmToken) => {
  try {
    const userToken = await AsyncStorage.getItem('userToken'); // 저장된 인증 토큰
    const response = await fetch(`https://your-api-url.com/api/members/${userId}/fcm-token`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify({ fcmToken })
    });
    if (response.ok) {
      console.log('FCM token successfully sent to server');
    } else {
      console.error('Failed to send FCM token to server');
    }
  } catch (error) {
    console.error('Error sending FCM token to server:', error);
  }
};


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
        <Stack.Screen name="내담자 회원가입" component={MemberSignUpScreen} />
        <Stack.Screen name="상담자 회원가입" component={CounselorSignUpScreen} />
        <Stack.Screen name="알림" component={AlarmScreen} />
        <Stack.Screen name="프로필 관리" component={CounselorProfileScreen} />
        <Stack.Screen name="프로필 수정" component={CounselorEditScreen} />
        <Stack.Screen name="요금 관리" component={CounselorChargeScreen} />
        <Stack.Screen name="일정 관리" component={CounselorPlanScreen} />
        <Stack.Screen name="기본 시간 설정" component={CounselorTimeSettingScreen}/>
        <Stack.Screen name="내 상담 내역" component={MemberReservationScreen} />
        <Stack.Screen name="우울 검사" component={TestScreen}/>
        <Stack.Screen name="CounselDetail" component={CounselDetailScreen} options={{ title: '' }} />
        <Stack.Screen name="CounselWriteReport" component={CounselWriteReportScreen} options={{ title: '' }} />
        <Stack.Screen name="MemberWriteReview" component={MemberWriteReviewScreen} options={{ title: '' }} />
        <Stack.Screen name="MemberCounselorDetail" component={MemberCounselorDetailScreen} options={{ title: '' }} />
        <Stack.Screen name="ChatRoom" component={ChatRoomScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="설정" component={SettingsScreen}/>
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
