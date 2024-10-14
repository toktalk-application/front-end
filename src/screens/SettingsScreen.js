import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import MenuItem from '../components/MenuItem';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../auth/AuthContext';
import sendPostRequest from '../axios/SendPostRequest';

const SettingsScreen = () => {
  const { state } = useAuth();
  const { logout } = useAuth('');
  const navigation = useNavigation(); // 네비게이션 훅 사용
  const handleLogout = () => {
    Alert.alert("로그아웃", "정말 로그아웃 하시겠습니까?", [
        { text: "취소", style: "cancel" },
        { 
            text: "로그아웃", 
            onPress: async () => {
                const token = state.token; // 현재 저장된 토큰 가져오기
                try {
                    await sendPostRequest({
                        token,
                        endPoint: '/auth/logout',
                        requestBody: {}, // 로그아웃 시 요청 본문은 비워둘 수 있습니다.
                        onSuccess: () => {
                            console.log("Logged out");
                            navigation.navigate('로그인'); // 로그인 페이지로 이동
                            logout();
                        },
                        /* onFailure: () => {
                            Alert.alert("오류", "로그아웃에 실패했습니다.");
                        } */
                    });
                } catch (error) {
                    console.error("로그아웃 중 오류 발생:", error);
                    Alert.alert("오류", "로그아웃 중 오류가 발생했습니다.");
                }
            }
        },
    ]);
};
  const handleDeleteAccount = () => {
    // 회원 탈퇴 로직 추가
    Alert.alert("회원 탈퇴", "정말 회원 탈퇴 하시겠습니까?", [
      { text: "취소", style: "cancel" },
      { text: "탈퇴", onPress: () => console.log("Account deleted") },
    ]);
  };

  return (
    <View style={styles.container}>
        <MenuItem 
          title="로그아웃"
          onPress={handleLogout} style={styles.button}
        />
        <MenuItem 
          title="회원탈퇴"
          onPress={handleDeleteAccount} style={styles.button}
        />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor:'white'
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    padding: 5,
    marginVertical: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    borderBottomWidth: 1, // 아래 테두리 두께
    borderBottomColor: '#ccc', // 아래 테두리 색상
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
  },
});

export default SettingsScreen;
