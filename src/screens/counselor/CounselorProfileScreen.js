import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import sendGetRequest from '../../axios/SendGetRequest';
import { useAuth } from '../../auth/AuthContext';
import LoadingScreen from '../LoadingScreen';



function CounselorProfileScreen() {
  const navigation = useNavigation();
  const { state } = useAuth();
  const [counselorData, setCounselorData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const imageSource = counselorData && counselorData.profileImage 
  ? { uri: counselorData.profileImage } 
  : require('../../../assets/images/emptyImage.png'); // 대체 이미지

  
  useFocusEffect(
    React.useCallback(() => {
        const fetchData = () => {
            sendGetRequest({
                token: state.token,
                endPoint: `/counselors/${state.identifier}`,
                onSuccess: (data) => {
                    console.log("data2: ", data);
                    setCounselorData(data.data);
                    setIsLoading(false);
                },
                onFailure: () => {
                    /* Alert.alert("내 정보 GET요청 실패!"); */
                    setIsLoading(false);
                },
            });
        };

        fetchData(); // 데이터 요청

        return () => {
            // 컴포넌트 언마운트 시 필요한 정리 작업을 여기에 추가
        };
    }, [state.token, state.identifier]) // 의존성 배열에 추가
);
  
  return (
    <>
        {isLoading ? (<LoadingScreen message={'프로필 정보를 불러오는 중입니다..'}/>) : (
          <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.profileContainer}>
            {/* 상담사 이름 및 정보 */}
            <View style={styles.infoContainer}>
              <View style={styles.nameContainer}>
                <Text style={styles.name}>{counselorData.name} 상담사</Text>
                <View style={styles.ratingContainer}>
                  <Text style={{fontSize:16}}>   ⭐</Text>
                  <Text style={{fontSize:16}}>{' ' + counselorData.rating}</Text>
                </View>
              </View>
              <Text style={styles.introduce}>{counselorData.introduction}</Text>
              <View style={styles.pricingContainer}>
                <Text style={styles.pricingName}>채팅</Text>
                <Text style={styles.pricing}>{counselorData.chatPrice.toLocaleString()} 원</Text>
                <Text style={styles.pricingName}>전화</Text>
                <Text style={styles.pricing}>{counselorData.callPrice.toLocaleString()} 원</Text>
              </View>
            </View>
            
            {/* 상담사 이미지 */}
            <View style={styles.imageContainer}>
              <Image source={imageSource} style={styles.image} />
            </View>
          </View>
          <View style={styles.descriptionContainer}>
            {/* 상담사 소개 */}
            <Text style={styles.sectionTitle}>📍 전문 분야 소개</Text>
            <Text style={styles.detaiDescription}>안녕하세요, {counselorData.name} 상담사입니다. </Text>
            <Text style={styles.detaiDescription}>{counselorData.expertise}</Text>
    
            {/* 경력 및 자격 */}
            <Text style={styles.sectionTitle}>👩‍🎓 공인 자격</Text>
            {counselorData.licenses.map((license, index) => (
              <Text key={`${license.licenseDto}-${index}`} style={styles.license}>
                🏅 {license.licenseName} ({license.organization})
              </Text>
            ))}
            <Text style={styles.sectionTitle}>💼 경력</Text>
            {counselorData.careers.map((career, index) => (
              <Text key={`${career.careerId}-${index}`} style={styles.career}>
                {career.classification === "CURRENT" ? "현재" : "이전"} ) {career.company} - {career.responsibility}
              </Text>
            ))}
            {/* 상담 진행 방법 */}
            <Text style={styles.sectionTitle}>📑 상담 세션 소개</Text>
            <Text style={styles.detaiDescription}>{counselorData.sessionDescription}</Text>
          
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
  nameContainer:{
    flexDirection: 'row',
    alignItems: 'center',
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
    marginVertical: 6,
    marginRight: 5
  },
  pricingContainer: {
    /* marginTop: 10, */
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
    backgroundColor: '#215D9A',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  ratingContainer:{
    flexDirection: 'row',
    alignItems: 'center', // 별점과 점수를 수평 중앙 정렬
    fontSize:14
  }
});

export default CounselorProfileScreen;

