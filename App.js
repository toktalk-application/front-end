import React, { useEffect } from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native'; // notifee 관련 import 추가
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthProvider } from './src/auth/AuthContext.js'; 
import { Platform, PermissionsAndroid } from 'react-native';
import { NotificationProvider, useNotification } from './src/components/NotificationContext';
import { configureNotifications } from './src/components/notificationUtils';

import MemberMainScreen from './src/screens/member/MemberMainScreen.js';
import MemberCounselScreen from './src/screens/member/MemberCounselScreen.js';
import MemberCounselorDetailScreen from './src/screens/member/MemberCounselorDetailScreen.js';
import MemberChattingScreen from './src/screens/member/MemberChattingScreen.js';
import MemberMyScreen from './src/screens/member/MemberMyScreen.js';
import MemberReservationScreen from './src/screens/member/MemberReservationScreen.js';
import TestScreen from './src/screens/member/TestScreen.js';
import TestResultScreen from './src/screens/member/TestResultScreen.js';
import TestResultModal from './src/screens/member/TestResultModal.js';

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

// 알림 권한 요청 함수 추가
const requestNotificationPermission = async () => {
  try {
    const alreadyRequested = await AsyncStorage.getItem('notification_permission_requested');
    if (!alreadyRequested) {
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Notification permission granted');
        } else {
          console.log('Notification permission denied');
        }
        await AsyncStorage.setItem('notification_permission_requested', 'true');
      }
    }
  } catch (error) {
    console.log('Error requesting notification permission:', error);
  }
};

const setupNotificationsOnFirstLogin = async (memberId) => {
  try {
    const hasSetupNotifications = await AsyncStorage.getItem('hasSetupNotifications');
    
    if (hasSetupNotifications !== 'true') {
      let permissionGranted = false;

      if (Platform.OS === 'ios') {
        const authStatus = await messaging().requestPermission();
        permissionGranted = 
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      } else if (Platform.OS === 'android' && Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        permissionGranted = granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        permissionGranted = true;
      }

      if (permissionGranted) {
        console.log('Notification permission granted');
        const token = await messaging().getToken();
        console.log('FCM Token:', token);
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

// 알림 채널 생성 및 알림 관련 로직 추가
const NotificationSetup = () => {
  const { setUnreadNotifications } = useNotification();

  useEffect(() => {
    const unsubscribe = configureNotifications(setUnreadNotifications);
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [setUnreadNotifications]);

  return null;
};

const CustomHeader = ({ routeName, navigation }) => {
  const { unreadNotifications } = useNotification();

  return (
    <View style={styles.header}>
      {routeName === 'Main' ? (
        <Image source={require('./assets/images/logo.png')} style={styles.logo} />
      ) : (
        <Text style={styles.title}>{routeName}</Text>
      )}
      <TouchableOpacity onPress={() => navigation.navigate('알림')} style={styles.alarmContainer}>
        <Image source={require('./assets/images/alarm.png')} style={styles.alarmIcon} />
        {unreadNotifications > 0 && (
          <View style={styles.redDot} />
        )}
      </TouchableOpacity>
    </View>
  );
};

// userType 이 Member, Counselor 이느냐에 따라 보이는 screen 이 다름.
function Tabs({ route, navigation }) {
  const { userType } = route.params; 

  const getTabIcon = (activeIcon, inactiveIcon) => {
    return ({ focused }) => (
      <Image
        source={focused ? activeIcon : inactiveIcon}
        style={{ width: 34, height: 34 }}
      />
    );
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        header: () => <CustomHeader routeName={route.name} navigation={navigation} />,
        tabBarStyle: {
          paddingBottom: 20,
          paddingTop: 10,
          paddingHorizontal: 10,
          height: 80,
        },
      })}
    >
      {userType === 'MEMBER' ? (
        <>
          <Tab.Screen name="Main" component={MemberMainScreen} options={{
            tabBarIcon: getTabIcon(require('./assets/images/homeFill.png'), require('./assets/images/home.png')),
            tabBarLabel: () => null,
          }} />
          <Tab.Screen name="상담" component={MemberCounselScreen} options={{
            tabBarIcon: getTabIcon(require('./assets/images/counselFill.png'), require('./assets/images/counsel.png')),
            tabBarLabel: () => null,
          }} />
          <Tab.Screen name="채팅" component={MemberChattingScreen} options={{
            tabBarIcon: getTabIcon(require('./assets/images/chatFill.png'), require('./assets/images/chat.png')),
            tabBarLabel: () => null,
          }} />
          <Tab.Screen name="내 정보" component={MemberMyScreen} options={{
            tabBarIcon: getTabIcon(require('./assets/images/myFill.png'), require('./assets/images/my.png')),
            tabBarLabel: () => null,
          }} />
        </>
      ) : userType === 'COUNSELOR' ? (
        <>
          <Tab.Screen name="Main" component={CounselorMainScreen} options={{
            tabBarIcon: getTabIcon(require('./assets/images/homeFill.png'), require('./assets/images/home.png')),
            tabBarLabel: () => null,
          }} />
          <Tab.Screen name="상담" component={CounselorCounselScreen} options={{
            tabBarIcon: getTabIcon(require('./assets/images/counselFill.png'), require('./assets/images/counsel.png')),
            tabBarLabel: () => null,
          }} />
          <Tab.Screen name="채팅" component={CounselorChattingScreen} options={{
            tabBarIcon: getTabIcon(require('./assets/images/chatFill.png'), require('./assets/images/chat.png')),
            tabBarLabel: () => null,
          }} />
          <Tab.Screen name="내 정보" component={CounselorMyScreen} options={{
            tabBarIcon: getTabIcon(require('./assets/images/myFill.png'), require('./assets/images/my.png')),
            tabBarLabel: () => null,
          }} />
        </>
      ) : null}
    </Tab.Navigator>
  );
}

function App() {
    configureNotifications();
    setupNotificationsOnFirstLogin();

  
  return (
    <AuthProvider>
      <NotificationProvider>
      <NotificationSetup />
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} />
            <Stack.Screen name="로그인" component={LoginScreen} />
            <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
            <Stack.Screen name="내담자 회원가입" component={MemberSignUpScreen} />
            <Stack.Screen name="상담자 회원가입" component={CounselorSignUpScreen} />
            <Stack.Screen name="알림" component={AlarmScreen} />
            <Stack.Screen name="CounselDetailScreen" component={CounselDetailScreen} options={{ title: '상담 상세 정보' }} />
            <Stack.Screen name="프로필 관리" component={CounselorProfileScreen} />
            <Stack.Screen name="프로필 수정" component={CounselorEditScreen} />
            <Stack.Screen name="요금 관리" component={CounselorChargeScreen} />
            <Stack.Screen name="일정 관리" component={CounselorPlanScreen} />
            <Stack.Screen name="기본 시간 설정" component={CounselorTimeSettingScreen}/>
            <Stack.Screen name="내 상담 내역" component={MemberReservationScreen} />
            <Stack.Screen name="우울 검사" component={TestScreen}/>
            <Stack.Screen name="우울 검사 내역" component={TestResultScreen}/>
            <Stack.Screen name="TestResult" component={TestResultModal} options={{ title: '' }} />
            <Stack.Screen name="CounselDetail" component={CounselDetailScreen} options={{ title: '상담 상세 정보' }} />
            <Stack.Screen name="CounselWriteReport" component={CounselWriteReportScreen} options={{ title: '' }} />
            <Stack.Screen name="MemberWriteReview" component={MemberWriteReviewScreen} options={{ title: '' }} />
            <Stack.Screen name="MemberCounselorDetail" component={MemberCounselorDetailScreen} options={{ title: '' }} />
            <Stack.Screen name="ChatRoom" component={ChatRoomScreen} options={{ headerShown: false }}/>
            <Stack.Screen name="설정" component={SettingsScreen}/>
          </Stack.Navigator>
        </NavigationContainer>
      </NotificationProvider>
    </AuthProvider>
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
  alarmContainer: {
    position: 'relative',
  },
  redDot: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'red',
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