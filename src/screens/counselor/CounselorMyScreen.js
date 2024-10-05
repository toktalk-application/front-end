import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import MenuItem from '../../components/MenuItem.js'; 
import calendarIcon from '../../../assets/images/calendar.png'
import chargeIcon from '../../../assets/images/charge.png'
import profileIcon from '../../../assets/images/profile.png'
import { useNavigation } from '@react-navigation/native';

const CounselorMyScreen = () => {
  const navigation = useNavigation();
  // 더미 데이터
  const counselorData = {
    name: "홍길동",
    imageUrl: "https://via.placeholder.com/80", // 더미 이미지 URL
  };
  const handleMenuPress = (menu) => {
    if (menu === '프로필 관리') {
      navigation.navigate('프로필 관리'); // 프로필 관리 화면으로 이동
    } else if (menu === '요금 관리') {
      navigation.navigate('요금 관리'); // 요금 관리 화면으로 이동
    } else if (menu === '일정 관리') {
      navigation.navigate('일정 관리'); // 일정 관리 화면으로 이동
    }
  };


  return (
    <View style={styles.containder}>
      <View style={styles.infoContainer}>
        <Image
          source={{ uri: counselorData.imageUrl }}
          style={styles.image}
        />
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{counselorData.name}</Text>
          <Text style={styles.counselor}> 상담사님 </Text>
        </View>
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
    backgroundColor: 'white',
    padding: 10, // 약간의 패딩 추가
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
});

export default CounselorMyScreen;
