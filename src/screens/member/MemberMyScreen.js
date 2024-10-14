import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity,Alert } from 'react-native';
import MenuItem from '../../components/MenuItem.js'; 
import { useNavigation } from '@react-navigation/native';
import sendGetRequest from '../../axios/SendGetRequest.js';
import { useAuth } from '../../auth/AuthContext';

const MemberMyScreenScreen = () => {
  const { state } = useAuth();
  const navigation = useNavigation();
  // 더미 데이터
  const memberData = {
    nickName: "냠냐미",
  };
  const handleMenuPress = (menu) => {
    if (menu === '내 상담 내역') {
      navigation.navigate('내 상담 내역');
    } else if (menu === '우울 검사') {
      navigation.navigate('우울 검사'); // 일정 관리 화면으로 이동
    } else if (menu === '우울 검사 내역') {
      navigation.navigate('우울 검사 내역'); // 일정 관리 화면으로 이동
    }
  };

  const [myData, setMyData] = useState({data:{}});

  useEffect(() => {
    sendGetRequest({
      token: state.token,
      endPoint: `/members/${state.identifier}`,
      onSuccess: (data) => {
        console.log("data: ", data);
        setMyData(data.data);
      },
      /* onFailure: () => Alert.alert("요청 실패", "내 정보 GET요청 실패"), */
    });
  }, []);


  return (
    <View style={styles.containder}>
      <View style={styles.infoContainer}>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{myData.nickname}</Text>
          <Text style={styles.counselor}> 님 </Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('설정')}>
          <Image source={require('../../../assets/images/settings.png')} style={styles.icon} />
      </TouchableOpacity>
      </View>
      <View style={styles.menuContainer}>
        <MenuItem 
          icon={require('../../../assets/images/history.png')} // 내 상담 내역
          title="내 상담 내역"
          onPress={() => handleMenuPress('내 상담 내역')}
        />
        <MenuItem 
          icon={require('../../../assets/images/list.png')}// 
          title="우울 검사 내역"
          onPress={() => handleMenuPress('우울 검사 내역')}
        />
        <MenuItem 
          icon={require('../../../assets/images/test.png')}// 
          title="우울 검사"
          onPress={() => handleMenuPress('우울 검사')}
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
    backgroundColor: 'white',
    padding: 10, // 약간의 패딩 추가
    marginHorizontal:20
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
  icon: {
    width: 20,
    height: 20,
    marginRight:20
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
  },
});

export default MemberMyScreenScreen;
