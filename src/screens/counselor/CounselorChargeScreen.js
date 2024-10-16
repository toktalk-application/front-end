import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import sendPatchRequest from '../../axios/PatchRequest';
import { useAuth } from '../../auth/AuthContext';
import sendGetRequest from '../../axios/SendGetRequest';
import { useFocusEffect } from '@react-navigation/native';

function CounselorChargeScreen() {
  const { state } = useAuth();
  const [chatPrice, setChatPrice] = useState('0');
  const [initialChatPrice, setInitialChatPrice] = useState('0'); // 초기 가격 상태 추가
  const [callPrice, setCallPrice] = useState('0');
  const [initialCallPrice, setInitialCallPrice] = useState('0'); // 초기 가격 상태 추가
  const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   sendGetRequest({
  //     token: state.token,
  //     endPoint: `/counselors/${state.identifier}`,
  //     onSuccess: (data) => {
  //       console.log("initial data: ", data);
  //       setChatPrice(String(data.data.chatPrice));
  //       setCallPrice(String(data.data.callPrice));
  //       setIsLoading(false);
  //     },
  //     /* onFailure: () => Alert.alert("실패!", "내 정보 GET요청 실패") */
  //   });
  // }, []);

  useFocusEffect(
    useCallback(() => {
      sendGetRequest({
        token: state.token,
        endPoint: `/counselors/${state.identifier}`,
        onSuccess: (data) => {
          console.log("initial data: ", data);
          setChatPrice(String(data.data.chatPrice));
          setInitialChatPrice(String(data.data.chatPrice)); // 초기 가격 저장
          setCallPrice(String(data.data.callPrice));
          setInitialCallPrice(String(data.data.callPrice)); // 초기 가격 저장
          setIsLoading(false);
        },
        /* onFailure: () => Alert.alert("실패!", "내 정보 GET요청 실패") */
      });
    },[])
  );

  return (
    <View style={styles.container}>
      <View style={styles.chargeContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>채팅 상담 가격 설정</Text>
          <Text style={styles.subtitle}>(50분 기준)</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={chatPrice}
            onChangeText={text => setChatPrice(text.replace(/[^0-9]/g, ''))}
            placeholder="가격을 입력해주세요"
            keyboardType="numeric"
          />
          <Text style={styles.currency}>원</Text>
          <TouchableOpacity style={styles.button}>

            <Text style={styles.buttonText} onPress={() => {
              if (chatPrice === initialChatPrice) {
                Alert.alert("알림", "수정된 내용이 없습니다."); // 수정된 내용이 없을 경우
              } else if (!chatPrice) {
                Alert.alert("알림", "입력 필드를 채워주세요."); // 필드가 비워있을 경우
              } else if ( chatPrice <= 0 ) {
                Alert.alert("알림", "가격은 0 원 이상이어야 합니다."); // 필드가 비워있을 경우
              } else {
                sendPatchRequest({
                  token: state.token,
                  endPoint: "/counselors",
                  requestBody: {
                    chatPrice: chatPrice,
                  },
                  onSuccess: () => {
                    Alert.alert("성공", "채팅 상담 가격 변경 성공!")
                    setInitialChatPrice(chatPrice);
                  },
                  /* onFailure: () => Alert.alert("실패", "상담 가격 변경 실패!"), */
                });
              }
            }}>변경</Text>
        </TouchableOpacity>
      </View>
    </View>

      {/* 추가적인 가격 설정을 위한 또 다른 chargeContainer */ }
  <View style={styles.chargeContainer}>
    <View style={styles.header}>
      <Text style={styles.title}>전화 상담 가격 설정</Text>
      <Text style={styles.subtitle}>(50분 기준)</Text>
    </View>
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        value={callPrice}
        onChangeText={text => setCallPrice(text.replace(/[^0-9]/g, ''))}
        placeholder="가격을 입력해주세요"
        keyboardType="numeric"
      />
      <Text style={styles.currency}>원</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText} onPress={() => {
              if (callPrice === initialCallPrice) {
                Alert.alert("알림", "수정된 내용이 없습니다."); // 수정된 내용이 없을 경우
              } else if (!callPrice ) {
                Alert.alert("알림", "입력 필드를 채워주세요."); // 필드가 비워있을 경우
              } else if ( callPrice <= 0 ) {
                Alert.alert("알림", "가격은 0 원 이상이어야 합니다."); // 필드가 비워있을 경우
              } else {
                sendPatchRequest({
                  token: state.token,
                  endPoint: "/counselors",
                  requestBody: {
                    callPrice: callPrice,
                  },
                  onSuccess: () => {
                    Alert.alert("성공", "채팅 상담 가격 변경 성공!")
                    setInitialCallPrice(callPrice);
                  },
                  /* onFailure: () => Alert.alert("실패", "상담 가격 변경 실패!"), */
                });
              }
            }} >변경</Text>
      </TouchableOpacity>
    </View>
  </View>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', // 배경 색상
    padding: 20,
  },
  chargeContainer: {
    backgroundColor: '#f1f1f1',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20, // 각 컨테이너 사이의 간격
    elevation: 5, // 안드로이드 그림자 효과
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 13,
    color: 'gray',
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#ccc',
  },
  input: {
    flex: 1,
    padding: 5,
    fontSize: 13,
    borderWidth: 1,
    backgroundColor: 'white',
    borderColor: 'white',
    borderRadius: 5,
    marginRight: 10,
  },
  currency: {
    flex: 0.6,
    fontSize: 16,
    color: 'black',
  },
  button: {
    backgroundColor: '#215D9A', // 버튼 배경 색상
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CounselorChargeScreen;
