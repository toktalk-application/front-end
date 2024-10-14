import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import MenuItem from '../../components/MenuItem.js'; 
import calendarIcon from '../../../assets/images/calendar.png'
import chargeIcon from '../../../assets/images/charge.png'
import profileIcon from '../../../assets/images/profile.png'
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import sendGetRequest from '../../axios/SendGetRequest.js';
import { useAuth } from '../../auth/AuthContext.js';

const CounselorMyScreen = () => {
  const { state } = useAuth();
  const navigation = useNavigation();

  const handleMenuPress = (menu) => {
    if (menu === '프로필 관리') {
      navigation.navigate('프로필 관리'); // 프로필 관리 화면으로 이동
    } else if (menu === '요금 관리') {
      navigation.navigate('요금 관리'); // 요금 관리 화면으로 이동
    } else if (menu === '일정 관리') {
      navigation.navigate('일정 관리'); // 일정 관리 화면으로 이동
    }
  };
  const [myData, setMyData] = useState({data:{}});

  useFocusEffect(
    React.useCallback(() => {
      sendGetRequest({
        token: state.token,
        endPoint: `/counselors/${state.identifier}`,
        onSuccess: (data) => {
          console.log("data: ", data);
          setMyData(data.data);
        },
        /* onFailure: () => Alert.alert("요청 실패", "내 정보 GET요청 실패"), */
      });
  
      // Optional cleanup if needed (none in your case)
      return () => {
        // Cleanup logic if any
      };
    }, [state.token, state.identifier])  // Dependencies: these values trigger re-fetch when changed
  );


  return (
    <View style={styles.containder}>
      <View style={styles.infoContainer}>
        <View style={styles.nameBingContainer}>
        <Image source={{ uri: myData.profileImage || 'https://via.placeholder.com/120' }} style={styles.image} />
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{myData.name}</Text>
            <Text style={styles.counselor}> 상담사님 </Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('설정')}>
          <Image source={require('../../../assets/images/settings.png')} style={styles.icon} />
      </TouchableOpacity>
      </View>
      <View style={styles.menuContainer}>
        <MenuItem 
          icon={profileIcon} // 프로필 관리 이미지
          title="프로필 관리"
          onPress={() => handleMenuPress('프로필 관리')}
        />
        <MenuItem 
          icon={chargeIcon} // 요금 관리 아이콘
          title="요금 관리"
          onPress={() => handleMenuPress('요금 관리')}
        />
        <MenuItem 
          icon={calendarIcon} // 일정 관리 아이콘
          title="일정 관리"
          onPress={() => handleMenuPress('일정 관리')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containder:{
    backgroundColor:'white',
    flex:1
  },
  infoContainer: {
    flexDirection: 'row', // 좌우 배치
    alignItems: 'center', // 수직 중앙 정렬
    justifyContent: 'space-between', // 아이템 간격을 균등하게 배치
    alignItems: 'center', // 세로 중앙 정렬
    backgroundColor: 'white',
    padding: 10, // 약간의 패딩 추가
  },
  nameBingContainer:{
    flexDirection: 'row', // 가로 방향으로 배치

  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40, // 원형 이미지 (반지름을 반으로 설정)
    marginRight: 10, // 이미지와 이름 사이의 간격
    marginLeft: 20
  },
  nameContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
  },
  counselor: {
    fontSize: 14,
    fontWeight: '400',
    marginTop: 5
  },
  menuContainer: {
    flexDirection: 'column', // 좌우 배치
    padding: 20, 
  },
  icon: {
    width: 20,
    height: 20,
    marginRight:20
  },
});

export default CounselorMyScreen;
