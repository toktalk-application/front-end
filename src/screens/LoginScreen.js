import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet } from 'react-native';

// 일반 사용자 로그인 화면
function MemberLoginScreen({ onLogin, navigation }) {
  return (
    <View style={styles.formContainer}>
      <Text style={styles.label}>아이디</Text>
      <TextInput style={styles.input} placeholder="아이디를 입력해주세요" />
      <Text style={styles.label}>비밀번호</Text>
      <TextInput style={styles.input} placeholder="비밀번호를 입력해주세요" secureTextEntry />
      <View style={styles.loginButton}>
        <TouchableOpacity onPress={() => onLogin('Member')}>
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
function CounselorLoginScreen({ onLogin, navigation }) {
  return (
    <View style={styles.formContainer}>
      <Text style={styles.label}>아이디</Text>
      <TextInput style={styles.input} placeholder="아이디를 입력해주세요" />
      <Text style={styles.label}>비밀번호</Text>
      <TextInput style={styles.input} placeholder="비밀번호를 입력해주세요" secureTextEntry />
      <View style={styles.loginButton}>
        <TouchableOpacity onPress={() => onLogin('Counselor')}>
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

  const handleLogin = (userType) => {
    // 로그인 성공 후 Tabs로 이동
    navigation.navigate('Tabs', { userType });
  };


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
        <MemberLoginScreen onLogin={handleLogin} navigation={navigation}/>
      ) : (
        <CounselorLoginScreen onLogin={handleLogin} navigation={navigation}/>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
    marginBottom: 10, // 입력 필드 간 간격 조정
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
    marginBottom : 5,
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
});
