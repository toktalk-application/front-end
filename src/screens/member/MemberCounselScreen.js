import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import sendGetRequest from '../../axios/SendGetRequest';
import { useAuth } from '../../auth/AuthContext';
import EmptyScreen from '../EmptyScreen';

const MemberCounselScreen = () => {
  const { state } = useAuth();
  const navigation = useNavigation();

  const [counselors, setCounselors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   sendGetRequest({
  //     token: state.token,
  //     endPoint: "/counselors",
  //     onSuccess: (data) => {
  //       console.log("data: ", data);
  //       setCounselors(data.data);
  //       setIsLoading(false);
  //     },
  //     /* onFailure: () => Alert.alert("요청 실패", "상담사 목록 로드 실패!") */
  //   });
  // }, []);

  useFocusEffect(
    useCallback(() => {
      sendGetRequest({
        token: state.token,
        endPoint: "/counselors",
        onSuccess: (data) => {
          console.log("data: ", data);
          setCounselors(data.data);
          setIsLoading(false);
        },
        /* onFailure: () => Alert.alert("요청 실패", "상담사 목록 로드 실패!") */
      });
    }, [])
  );
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => navigation.navigate('MemberCounselorDetail', { counselorId: item.counselorId })}>
        <View style={styles.card}>
          <Image source={{ uri: item.profileImage || "https://via.placeholder.com/80" }} style={styles.image} />
          <View style={styles.infoContainer}>
            <Text style={styles.name}>{item.name}   ⭐ {item.rating || '없음'} ({item.reviews})</Text>
            <Text style={styles.introduction}>{item.introduction}</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.yellowText}>전화 </Text>
              <Text style={styles.grayText}>{formatPrice(item.callPrice)}원 </Text>
              <Text style={styles.yellowText}>채팅 </Text>
              <Text style={styles.grayText}>{formatPrice(item.chatPrice)}원</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {counselors.length === 0 ? <EmptyScreen message="상담사가 없습니다"/> : <FlatList
        data={counselors}
        renderItem={renderItem}
        keyExtractor={item => item.counselorId.toString()}
        contentContainerStyle={{
          paddingBottom: 20, // 하단 여백 추가
        }}
      />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', // 배경색 설정
  },
  card: {
    flexDirection: 'row',
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 50,
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom:8
  },
  introduction: {
    fontSize: 15,
    color: 'gray',
  },
  priceContainer: {
    flexDirection: 'row', // 수평 정렬
    alignItems: 'center',
    marginTop:5
  },
  yellowText: {
    color: '#FFA500', // 노란색
  },
  grayText: {
    fontSize: 12,
    color: '#555', // 진한 회색
    marginRight: 5,
  },
});

export default MemberCounselScreen;
