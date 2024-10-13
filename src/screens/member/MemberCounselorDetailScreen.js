import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import ReservationModal from '../../components/ReservationModal';
import sendGetRequest from '../../axios/SendGetRequest';
import { useAuth } from '../../auth/AuthContext';


const MemberCounselorDetailScreen = () => {
  const route = useRoute();
  const { counselorId } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const { state } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [counselorData, setCounselorData] = useState({});

  useEffect(() => {
    sendGetRequest({
      token: state.token,
      endPoint: `/counselors/${counselorId}`,
      onSuccess: (data) => {
        setCounselorData(data.data);
        setIsLoading(false);
      },
      onFailure: () => Alert.alert("요청 실패", "단일 상담사 정보 조회 실패")
    })
  }, []);

  // counselorId에 해당하는 상담사 정보를 찾기
  /* const counselorData = counselorDataArray.find(counselor => counselor.counselorId === counselorId); */
  console.log("counselorData: ", counselorData);

  // 정보가 없을 경우 처리
  if (!isLoading && !counselorData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>상담사 정보를 찾을 수 없습니다.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {isLoading ? <View/> : <View style={styles.profileContainer}>
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{counselorData.name} 상담사</Text>
          <Text style={styles.introduce}>{counselorData.introduction}</Text>
          <View style={styles.pricingContainer}>
            <Text style={styles.pricingName}>채팅</Text>
            <Text style={styles.pricing}>{counselorData.chatPrice.toLocaleString()} 원</Text>
            <Text style={styles.pricingName}>전화</Text>
            <Text style={styles.pricing}>{counselorData.callPrice.toLocaleString()} 원</Text>
          </View>
        </View>

        <View style={styles.imageContainer}>
          <Image source={{ uri: counselorData.profileImage || 'https://via.placeholder.com/120' }} style={styles.image} />
        </View>
      </View>}
      {isLoading ? <View/> : <View style={styles.descriptionContainer}>
        <Text style={styles.sectionTitle}>📍 전문 분야 소개</Text>
        <Text style={styles.detaiDescription}>안녕하세요, {counselorData.name} 상담사입니다. </Text>
        <Text style={styles.detaiDescription}>{counselorData.expertise}</Text>

        <Text style={styles.sectionTitle}>👩‍🎓 공인 자격</Text>
        {counselorData.licenses.map((license) => (
          <Text key={license.licenseDto} style={styles.license}>
            🏅 {license.licenseName} ({license.organization})
          </Text>
        ))}
        <Text style={styles.sectionTitle}>💼 경력</Text>
        {counselorData.careers.map((career) => (
          <Text key={career.careerId} style={styles.career}>
            {career.classification === "CURRENT" ? "현재" : "이전"} ) {career.company} - {career.responsibility}
          </Text>
        ))}

        <Text style={styles.sectionTitle}>📑 상담 세션 소개</Text>
        <Text style={styles.detaiDescription}>{counselorData.sessionDescription}</Text>
      </View>}
      <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>상담 신청 </Text>
      </TouchableOpacity>
      <ReservationModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)} 
        counselorId={counselorId} 
        counselorData={counselorData}  // 전체 counselorData 객체를 전달
        chatPrice={counselorData?.chatPrice}  // 옵셔널 체이닝 사용
        callPrice={counselorData?.callPrice}  // 옵셔널 체이닝 사용
      />
    </ScrollView>

  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  infoContainer: {
    flex: 1,
    marginRight: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  introduce: {
    fontSize: 14,
    marginVertical: 5,
  },
  pricingContainer: {
    marginTop: 10,
    flexDirection: 'row',
  },
  pricingName: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  pricing: {
    fontSize: 13,
    marginHorizontal: 5,
    color: 'gray',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  descriptionContainer: {
    marginHorizontal: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  description: {
    fontSize: 14,
    fontWeight: 'bold',
    marginVertical: 5,
    lineHeight: 22,
  },
  detaiDescription: {
    fontSize: 13,
  },
  career: {
    fontSize: 13,
    marginVertical: 5,
  },
  license: {
    fontSize: 14,
    marginVertical: 5,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'red',
  },
  button: {
    backgroundColor: '#001326',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default MemberCounselorDetailScreen;
