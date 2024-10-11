import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import sendGetRequest from '../../axios/SendGetRequest';
import { useAuth } from '../../auth/AuthContext';

/* const counselorData = {
  "counselorId": 12345,
  "birth": "1985-05-15",
  "gender": "FEMALE",
  "counselorStatus": "ACTIVE",
  "name": "홍길동",
  "userId": "kimpsych",
  "company": "심리 상담소",
  "availableDates": [
    {
      "date": "2023-10-01",
      "availableTimes": ["10:00", "14:00", "16:00"]
    },
    {
      "date": "2023-10-02",
      "availableTimes": ["09:00", "11:00", "15:00"]
    }
  ],
  "chatPrice": 35000,
  "callPrice": 35000,
  "careers": [
    {
      "careerId": 1,
      "classification": "CURRENT",
      "company": "정신건강센터",
      "responsibility": "개인 상담 및 그룹 치료"
    },
    {
      "careerId": 2,
      "classification": "PREVIOUS",
      "company": "심리 클리닉",
      "responsibility": "심리 평가 및 치료"
    }
  ],
  "licenses": [
    {
      "licenseDto": 1,
      "licenseName": "정신 건강 상담사",
      "organization": "한국상담심리학회",
      "issueDate": "2020-06-01"
    },
    {
      "licenseDto": 2,
      "licenseName": "임상 심리사",
      "organization": "한국심리학회",
      "issueDate": "2021-03-15"
    }
  ],
  "createdAt": "2023-10-01T10:00:00",
  "modifiedAt": "2023-10-02T12:00:00"
}; */


function CounselorProfileScreen() {
  const navigation = useNavigation();
  const { state } = useAuth();
  const [counselorData2, setCounselorData2] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    /* console.log("state: ", state); */
    sendGetRequest(
      {
        token: state.token,
        endPoint: `/counselors/${state.identifier}`,
        onSuccess: (data) => {
          console.log("data: ",  data);
          setCounselorData2(data.data);
          setIsLoading(false);
        },
        onFailure: () => Alert.alert("내 정보 GET요청 실패!")
      }
    )
  }, []);
  
  return (
    <>
        {isLoading ? (<ActivityIndicator/>) : (
          <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.profileContainer}>
            {/* 상담사 이름 및 정보 */}
            <View style={styles.infoContainer}>
              <Text style={styles.name}>{counselorData2.name} 상담사</Text>
              <Text style={styles.introduce}>{counselorData2.introduction}</Text>
              <View style={styles.pricingContainer}>
                <Text style={styles.pricingName}>채팅</Text>
                <Text style={styles.pricing}>{counselorData2.chatPrice.toLocaleString()} 원</Text>
                <Text style={styles.pricingName}>전화</Text>
                <Text style={styles.pricing}>{counselorData2.callPrice.toLocaleString()} 원</Text>
              </View>
            </View>
            
            {/* 상담사 이미지 */}
            <View style={styles.imageContainer}>
              <Image source={{ uri: 'https://via.placeholder.com/120' }} style={styles.image} />
            </View>
          </View>
          <View style={styles.descriptionContainer}>
            {/* 상담사 소개 */}
            <Text style={styles.sectionTitle}>📍 심리상담사 소개</Text>
            <Text style={styles.detaiDescription}>안녕하세요, {counselorData2.name} 상담사입니다. 
            {counselorData2.expertise}</Text>
    
            {/* 경력 및 자격 */}
            <Text style={styles.sectionTitle}>👩‍🎓 공인 자격 및 경력</Text>
            {counselorData2.licenses.map((license) => (
              <Text key={license.licenseDto} style={styles.license}>
                🏅 {license.licenseName} ({license.organization})
              </Text>
            ))}
            {counselorData2.careers.map((career) => (
              <Text key={career.careerId} style={styles.career}>
                {career.classification === "CURRENT" ? "현재" : "이전"} ) {career.company} - {career.responsibility}
              </Text>
            ))}
            {/* 상담 진행 방법 */}
            <Text style={styles.sectionTitle}>📍 상담 진행 방법</Text>
            <Text style={styles.detaiDescription}>{counselorData2.sessionDescription}</Text>
          
          </View>
    
          {/* 프로필 수정 버튼 */}
          <TouchableOpacity style={styles.button} onPress = {()=>navigation.navigate("프로필 수정")}>
            <Text style={styles.buttonText}>프로필 수정</Text>
          </TouchableOpacity>
        </ScrollView>
        
        )}
    </>


    
  );
}

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

export default CounselorProfileScreen;
