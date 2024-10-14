import React, { memo, useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { REACT_APP_API_URL } from '@env';
import { useAuth } from '../auth/AuthContext';
import messaging from '@react-native-firebase/messaging';
import * as Keychain from 'react-native-keychain';

// 일반 사용자 로그인 화면
function MemberLoginScreen({ navigation }) {
  const { login } = useAuth('');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const { state } = useAuth();
  const [userIdError, setUserIdError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateUserId = (input) => {
    const userIdPattern = /^[a-zA-Z0-9]{4,20}$/;
    if (!userIdPattern.test(input)) {
      setUserIdError('영문 또는 숫자로만 입력해야 합니다.(4~20자)');
    } else {
      setUserIdError('');
    }
    setUserId(input);
  };

  const validatePassword = (input) => {
    const passwordPattern = /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?=\S+$).{10,20}/;
    if (!passwordPattern.test(input)) {
      setPasswordError('영문 대소문자와 숫자, 특수문자를 포함하여 입력해야 합니다.(10~20자)');
    } else {
      setPasswordError('');
    }
    setPassword(input);
  };

  // FCM 토큰을 업데이트하는 함수
  const updateFcmToken = async () => {
    try {
      // Firebase Messaging에서 현재 기기의 FCM 토큰을 가져옴
      const fcmToken = await messaging().getToken();
      console.log('FCM Token:', fcmToken);
  
      // Keychain에서 저장된 인증 토큰을 가져옴
      // Keychain은 iOS와 Android에서 민감한 데이터(예: 토큰)를 안전하게 저장하는 시스템
      // 암호화되어 저장되므로 앱 삭제 전까지 안전하게 보관됨
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        const token = credentials.password;
        const cleanToken = token.replace('Bearer ', ''); // 접두사 제거
  
        const response = await axios.post(
          `${REACT_APP_API_URL}/members/fcm-token`,
          { fcmToken: fcmToken }, // 요청 본문에 FCM 토큰 포함
          {
            headers: {
              'Authorization': `Bearer ${cleanToken}`, // 인증 헤더에 접두사 제거한 토큰 포함
              'Content-Type': 'application/json',
            },
          }
        );
        console.log('FCM 토큰 업데이트 응답:', response.data);
      } else {
        console.error('저장된 토큰이 없습니다.');
      }
    } catch (error) {
      console.error('FCM 토큰 업데이트 실패:', error.response ? error.response.data : error.message);
    }
  };
  
  // 로그인 함수
  const onLogin = async () => {
    try {
      const response = await axios.post(`${REACT_APP_API_URL}/auth/login`, {
        userId: userId,
        password: password,
        userType: 'MEMBER'
      });
  
      if (response.status === 200) {
        // 로그인 성공 시 서버에서 받은 정보 추출
        const token = response.headers.get('Authorization');
        const usertype = response.data.usertype;
        const nickname = response.data.nickname;
        const identifier = response.data.identifier;
        
        // 토큰을 Keychain에 안전하게 저장
        // 'token'은 키(key)로, 실제 토큰 값은 password 필드에 저장됨
        await Keychain.setGenericPassword('token', token);
        
        // login 함수를 먼저 호출하여 상태를 업데이트
        await login(token, usertype, navigation, identifier, nickname);
        
        // 상태 업데이트 후 FCM 토큰 업데이트
        await updateFcmToken(token);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("로그인 실패", "아이디 또는 비밀번호가 올바르지 않습니다.");
    }
  };
  

  // 에러 메시지가 있는지 확인하고 boolean으로 변환
  const isUserIdError = userIdError !== '';
  const isPasswordError = passwordError !== '';
  // 로그인 버튼 활성화 조건
  const isLoginButtonDisabled = userId.trim() === '' || password.trim() === '' || isUserIdError || isPasswordError;

  return (
    <View style={styles.formContainer}>
      <View style={{ height: 65, marginBottom: 40 }}>
        <Text style={styles.label}>아이디</Text>
        <TextInput
          style={styles.input}
          placeholder="아이디를 입력해주세요"
          value={userId}
          onChangeText={validateUserId}
        />
        {userIdError ? ( // 오류 메시지 표시
          <Text style={styles.errorText}>{userIdError}</Text>
        ) : null}
      </View>
      <View style={{ height: 65, marginBottom: 40 }}>
        <Text style={styles.label}>비밀번호</Text>
        <TextInput
          style={styles.input}
          placeholder="비밀번호를 입력해주세요"
          value={password}
          onChangeText={validatePassword}
          secureTextEntry
        />
        {passwordError ? ( // 오류 메시지 표시
          <Text style={styles.errorText}>{passwordError}</Text>
        ) : null}
      </View>
      <View style={[
        styles.loginButton,
        { backgroundColor: isLoginButtonDisabled ? 'lightgray' : '#99A5B2' } // 비활성화 시 색상 변경
      ]}>
        <TouchableOpacity onPress={onLogin} disabled={isLoginButtonDisabled}>
          <Text style={styles.loginButtonText}>로그인</Text>
        </TouchableOpacity>
      </View>
      {/* 로그인 버튼 아래에 줄 추가 */}
      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.orText}>또는</Text>
        <View style={styles.divider} />
      </View>
      {/* 회원가입 안내 메시지와 버튼 */}
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>아직 회원이 아니신가요?  </Text>
        <TouchableOpacity onPress={() => navigation.navigate('내담자 회원가입')}>
          <Text style={styles.signupButton}>회원가입</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// 상담자 로그인 화면
function CounselorLoginScreen({ navigation }) {
  const { login } = useAuth('');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  const [userIdError, setUserIdError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateUserId = (input) => {
    const userIdPattern = /^[a-zA-Z0-9]{4,20}$/;
    if (!userIdPattern.test(input)) {
      setUserIdError('영문 또는 숫자로만 입력해야 합니다.(4~20자)');
    } else {
      setUserIdError('');
    }
    setUserId(input);
  };

  const validatePassword = (input) => {
    const passwordPattern = /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?=\S+$).{10,20}/;
    if (!passwordPattern.test(input)) {
      setPasswordError('영문 대소문자와 숫자, 특수문자를 포함하여 입력해야 합니다.(10~20자)');
    } else {
      setPasswordError('');
    }
    setPassword(input);
  };

  // COUNSELOR FCM 토큰을 업데이트하는 함수 추가
  const updateFcmToken = async (token) => {
    try {
      const fcmToken = await messaging().getToken();
      console.log('FCM Token:', fcmToken);

      const cleanToken = token.replace('Bearer ', '');

      const response = await axios.post(
        `${REACT_APP_API_URL}/counselors/fcm-token`,
        { fcmToken: fcmToken },
        {
          headers: {
            'Authorization': `Bearer ${cleanToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('FCM 토큰 업데이트 응답:', response.data);
    } catch (error) {
      console.error('FCM 토큰 업데이트 실패:', error.response ? error.response.data : error.message);
    }
  };

  const onLogin = async () => {
    try {
      const response = await axios.post(`${REACT_APP_API_URL}/auth/login`, {
        userId: userId,
        password: password,
        userType: 'COUNSELOR'
      });

      // 로그인 성공 처리
      if (response.status === 200) {
        const token = response.headers.get('Authorization');
        const usertype = response.data.usertype;
        const identifier = response.data.identifier;
        const name = response.data.name;
        const nickname = response.data.nickname;

        // 토큰을 Keychain에 안전하게 저장
        await Keychain.setGenericPassword('token', token);
        
        // login 함수를 먼저 호출하여 상태를 업데이트
        await login(token, usertype, navigation, identifier, nickname, name);
        
        // 상태 업데이트 후 FCM 토큰 업데이트
        await updateFcmToken(token);
      }

    } catch (error) {
      // 로그인 실패 처리
      Alert.alert("로그인 실패", "아이디 또는 비밀번호가 올바르지 않습니다.");
      console.error(error);
    }
  };

  // 에러 메시지가 있는지 확인하고 boolean으로 변환
  const isUserIdError = userIdError !== '';
  const isPasswordError = passwordError !== '';
  // 로그인 버튼 활성화 조건
  const isLoginButtonDisabled = userId.trim() === '' || password.trim() === '' || isUserIdError || isPasswordError;

  return (
    <View style={styles.formContainer}>
      <View style={{ height: 65, marginBottom: 40 }}>
        <Text style={styles.label}>아이디</Text>
        <TextInput
          style={styles.input}
          placeholder="아이디를 입력해주세요"
          value={userId}
          onChangeText={validateUserId}
        />
        {userIdError ? ( // 오류 메시지 표시
          <Text style={styles.errorText}>{userIdError}</Text>
        ) : null}
      </View>
      <View style={{ height: 65, marginBottom: 40 }}>
        <Text style={styles.label}>비밀번호</Text>
        <TextInput
          style={styles.input}
          placeholder="비밀번호를 입력해주세요"
          value={password}
          onChangeText={validatePassword}
          secureTextEntry
        />
        {passwordError ? ( // 오류 메시지 표시
          <Text style={styles.errorText}>{passwordError}</Text>
        ) : null}
      </View>
      <View style={[
        styles.loginButton,
        { backgroundColor: isLoginButtonDisabled ? 'lightgray' : '#99A5B2' } // 비활성화 시 색상 변경
      ]}>
        <TouchableOpacity onPress={onLogin} disabled={isLoginButtonDisabled}>
          <Text style={styles.loginButtonText}>로그인</Text>
        </TouchableOpacity>
      </View>
      {/* 로그인 버튼 아래에 줄 추가 */}
      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.orText}>또는</Text>
        <View style={styles.divider} />
      </View>
      {/* 회원가입 안내 메시지와 버튼 */}
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}> 상담자님을 기다리고 있어요!  </Text>
        <TouchableOpacity onPress={() => navigation.navigate('상담자 회원가입')}>
          <Text style={styles.signupButton}>회원가입</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function LoginScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('User'); // 현재 활성화된 탭을 상태로 관리

  return (
    <View style={styles.container}>
      {/* 커스텀 탭 버튼 */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'User' && styles.activeTab]}
          onPress={() => setActiveTab('User')}
        >
          <Text style={styles.tabText}>내담자 로그인</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'Counselor' && styles.activeTab]}
          onPress={() => setActiveTab('Counselor')}
        >
          <Text style={styles.tabText}>상담자 로그인</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'User' ? (
        <MemberLoginScreen navigation={navigation} />
      ) : (
        <CounselorLoginScreen navigation={navigation} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: '#fff',
  },
  tabButton: {
    paddingVertical: 20, // 탭 버튼의 상하 패딩 조정
    paddingHorizontal: 30,
  },
  tabText: {
    fontSize: 16, // 탭 텍스트 크기 증가
    fontWeight: 'bold',
    color: '#333',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#001932',
  },
  formContainer: {
    justifyContent: 'center',
    padding: 30, // 폼 컨테이너의 패딩 조정
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 14, // 레이블 크기 증가
    marginBottom: 0,
    padding: 5,
    textAlign: 'left', // 레이블 텍스트 정렬 왼쪽
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 5,
  },
  loginButton: {
    marginTop: 20,
    marginBottom: 20, // 로그인 버튼 아래 여백 추가
    backgroundColor: '#99A5B2', // 배경색 변경
    borderRadius: 5, // 모서리 둥글게 처리
  },
  loginButtonText: {
    color: '#fff', // 텍스트 색상
    fontSize: 16, // 텍스트 크기
    textAlign: 'center', // 텍스트 중앙 정렬
    marginBottom: 5,
    paddingVertical: 8, // 수직 패딩
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  orText: {
    marginHorizontal: 10,
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    fontSize: 14,
    marginRight: 5,
  },
  signupButton: {
    fontSize: 14,
    color: '#334C65',
    textDecorationLine: 'underline',
  },
  errorText: {
    height: 20,
    color: 'red', // 오류 메시지 색상
    fontSize: 11,
    marginLeft: 3,
  },
});
