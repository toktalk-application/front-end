import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import MenuItem from '../components/MenuItem';
import { useNavigation } from '@react-navigation/native';


const SettingsScreen = () => {
  const navigation = useNavigation(); // 네비게이션 훅 사용
  const handleLogout = () => {
    // 로그아웃 로직 추가
    Alert.alert("로그아웃", "정말 로그아웃 하시겠습니까?", [
      { text: "취소", style: "cancel" },
      { text: "로그아웃", onPress: () => {
        console.log("Logged out");
        navigation.navigate('로그인'); // 로그인 페이지로 이동
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
