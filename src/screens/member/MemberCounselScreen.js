import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import sendGetRequest from '../../axios/SendGetRequest';
import { useAuth } from '../../auth/AuthContext';

const MemberCounselScreen = () => {
  const { state } = useAuth();
  const navigation = useNavigation();
  const dummyCounselors = [
    {
      counselorId: 1,
      name: '류재원',
      profileImage: 'https://via.placeholder.com/100',
      introduction: '괜찮지 않은 그 순간, 온 마음으로 당신의 곁에 있겠습니다.',
      chatPrice: 50000,
      callPrice: 50000,
      rating: 4.7,
      reviews: 120,
    },
    {
      counselorId: 2,
      name: '최영희',
      profileImage: 'https://via.placeholder.com/100',
      introduction: '당신의 마음이 쉬어갈 포근하고 작은 방',
      chatPrice: 45000,
      callPrice: 45000,
      rating: 4.2,
      reviews: 184,
    },
    {
      counselorId: 3,
      name: '김태형',
      profileImage: 'https://via.placeholder.com/100',
      introduction: '당신의 감정이 강점이 되도록 함께 하겠습니다.',
      chatPrice: 50000,
      callPrice: 50000,
      rating: 4.8,
      reviews: 24,
    },
    {
      counselorId: 4,
      name: '이수진',
      profileImage: 'https://via.placeholder.com/100',
      introduction: '당신의 이야기를 듣고 함께 나아갑니다.',
      chatPrice: 48000,
      callPrice: 48000,
      rating: 4.5,
      reviews: 75,
    },
    {
      counselorId: 5,
      name: '박민수',
      profileImage: 'https://via.placeholder.com/100',
      introduction: '당신의 마음에 빛을 더합니다.',
      chatPrice: 55000,
      callPrice: 55000,
      rating: 4.9,
      reviews: 50,
    },
    {
      counselorId: 6,
      name: '정하늘',
      profileImage: 'https://via.placeholder.com/100',
      introduction: '당신의 행복을 위해 함께하겠습니다.',
      chatPrice: 47000,
      callPrice: 47000,
      rating: 4.6,
      reviews: 30,
    },
    {
      counselorId: 7,
      name: '휴휴',
      profileImage: 'https://via.placeholder.com/100',
      introduction: '당신의 행복을 위해 함께하겠습니다.',
      chatPrice: 47000,
      callPrice: 47000,
      rating: 4.6,
      reviews: 30,
    },
  ];

  const [counselors, setCounselors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
  }, []);

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => navigation.navigate('MemberCounselorDetail', { counselorId: item.counselorId })}>
        <View style={styles.card}>
          <Image source={{ uri: item.profileImage || "https://via.placeholder.com/80" }} style={styles.image} />
          <View style={styles.infoContainer}>
            <Text style={styles.name}>{item.name} ⭐ {item.rating} ({item.reviews})</Text>
            <Text style={styles.introduction}>{item.introduction}</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.yellowText}>전화 </Text>
              <Text style={styles.grayText}>{item.callPrice}원 </Text>
              <Text style={styles.yellowText}>채팅 </Text>
              <Text style={styles.grayText}>{item.chatPrice}원</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={counselors}
        renderItem={renderItem}
        keyExtractor={item => item.counselorId.toString()}
        contentContainerStyle={{
          paddingBottom: 20, // 하단 여백 추가
        }}
      />
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
    padding: 10,
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
    fontSize: 16,
  },
  introduction: {
    fontSize: 13,
    color: 'gray',
  },
  priceContainer: {
    flexDirection: 'row', // 수평 정렬
    alignItems: 'center',
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
