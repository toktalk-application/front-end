import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import ReservationModal from '../../components/ReservationModal';
import sendGetRequest from '../../axios/SendGetRequest';
import { useAuth } from '../../auth/AuthContext';

// 상담사 데이터 배열
const counselorDataArray = [
  {
    counselorId: 1,
    birth: "1985-05-15",
    gender: "FEMALE",
    counselorStatus: "ACTIVE",
    name: "류재원",
    userId: "kimpsych",
    introduction: '괜찮지 않은 그 순간, 온 마음으로 당신의 곁에 있겠습니다.',
    company: "심리 상담소",
    availableDates: [
      {
        date: "2023-10-01",
        availableTimes: ["10:00", "14:00", "16:00"]
      },
      {
        date: "2023-10-02",
        availableTimes: ["09:00", "11:00", "15:00"]
      }
    ],
    chatPrice: 35000,
    callPrice: 35000,
    careers: [
      {
        careerId: 1,
        classification: "CURRENT",
        company: "정신건강센터",
        responsibility: "개인 상담 및 그룹 치료"
      },
      {
        careerId: 2,
        classification: "PREVIOUS",
        company: "심리 클리닉",
        responsibility: "심리 평가 및 치료"
      }
    ],
    licenses: [
      {
        licenseDto: 1,
        licenseName: "정신 건강 상담사",
        organization: "한국상담심리학회",
        issueDate: "2020-06-01"
      },
      {
        licenseDto: 2,
        licenseName: "임상 심리사",
        organization: "한국심리학회",
        issueDate: "2021-03-15"
      }
    ],
    createdAt: "2023-10-01T10:00:00",
    modifiedAt: "2023-10-02T12:00:00"
  },
  // 다른 상담사 데이터 추가
  {
    counselorId: 2,
    birth: "1986-06-20",
    gender: "FEMALE",
    counselorStatus: "ACTIVE",
    name: "최영희",
    userId: "choi",
    introduction: '당신의 마음이 쉬어갈 포근하고 작은 방',
    company: "마음의 쉼터",
    chatPrice: 40000,
    callPrice: 40000,
    careers: [
      {
        careerId: 1,
        classification: "CURRENT",
        company: "정신건강센터",
        responsibility: "개인 상담"
      }
    ],
    licenses: [
      {
        licenseDto: 1,
        licenseName: "상담사",
        organization: "한국상담협회",
        issueDate: "2019-05-10"
      }
    ]
  },
  // 추가 상담사 데이터...
];



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
        <Text style={styles.sectionTitle}>📍 심리상담사 소개</Text>
        <Text style={styles.description}>내담자를 위한 잃어버린 언어를 찾아주는 심리치료사</Text>
        <Text style={styles.detaiDescription}>안녕하세요, {counselorData.name} 상담사입니다. 상담을 통해 여러분의 감정, 생각, 행동을 이해할 수 있도록 돕겠습니다.</Text>

        <Text style={styles.sectionTitle}>👩‍🎓 공인 자격 및 경력</Text>
        {counselorData.licenses.map((license) => (
          <Text key={license.licenseDto} style={styles.license}>
            🏅 {license.licenseName} ({license.organization})
          </Text>
        ))}
        {counselorData.careers.map((career) => (
          <Text key={career.careerId} style={styles.career}>
            {career.classification === "CURRENT" ? "현재" : "이전"} ) {career.company} - {career.responsibility}
          </Text>
        ))}

        <Text style={styles.sectionTitle}>📍 상담 진행 방법</Text>
        <Text style={styles.detaiDescription}>{counselorData.sessionDescription}</Text>
        {/* <Text style={styles.detaiDescription}>상담을 통해 자신의 감정, 생각, 행동을 자유롭게 이야기할 수 있습니다.</Text>
        <Text style={styles.detaiDescription}>내가 원하는 방향으로 상담 프로세스를 이끌어 갈 수 있도록 도와드립니다.</Text> */}
      </View>}
      <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>상담 신청 </Text>
      </TouchableOpacity>
      <ReservationModal visible={modalVisible} onClose={() => setModalVisible(false)} />
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
