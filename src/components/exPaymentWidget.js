import React, { useState } from 'react'
import { usePaymentWidget, AgreementWidget, PaymentMethodWidget } from '@tosspayments/widget-sdk-react-native'
import { Alert, Button, StyleSheet, View, Text } from 'react-native'
import axios from 'axios';
import { useAuth } from '../auth/AuthContext';
import PaymentCompleteModal from './PaymentCompleteModal';
import sendPostRequest from '../axios/SendPostRequest';

export default function ExPaymentWidget({ onClose, orderInfo, resetState }) {
  const paymentWidgetControl = usePaymentWidget();
  const [paymentMethodWidgetControl, setPaymentMethodWidgetControl] = useState(null);
  const [agreementWidgetControl, setAgreementWidgetControl] = useState(null);
  const { state } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState({});

  const generateOrderId = () => {
    // 앞 6자리: 오늘 날짜를 "yyMMdd" 형식으로 생성
    const date = new Date();
    const year = date.getFullYear().toString().slice(2); // "yy" 형식
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // "MM" 형식
    const day = ('0' + date.getDate()).slice(-2); // "dd" 형식
    const datePart = year + month + day;

    // 뒤 12자리는 랜덤한 문자열 생성
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const randomPart = Array.from({ length: 12 }, () =>
      characters.charAt(Math.floor(Math.random() * characters.length))
    ).join('');

    return datePart + randomPart;
  };

  const getCounsellingType = (type) => {
    if(type.includes('전화')) return 'CALL';
    if(type.includes('채팅')) return 'CHAT';
  }

  const handlePayment = async () => {
    if (!orderInfo) {
      Alert.alert('주문 정보가 없습니다.');
      return;
    }
    const agreement = await agreementWidgetControl.getAgreementStatus();
    if (!agreement.agreedRequiredTerms) {
      Alert.alert('약관에 동의하지 않았습니다.');
      return;
    }

    // handlePayment 함수 내부
    paymentWidgetControl.requestPayment?.({
      orderId: generateOrderId(),  // 고유한 주문 ID 생성
      orderName: `${orderInfo.counselingType} - ${orderInfo.selectedDate} ${orderInfo.selectedTime}`,  // 주문명 설정
      amount: parseInt(orderInfo.totalAmount.replace(/[^0-9]/g, '')),  // 결제 금액 (숫자만 추출)
    }).then(async (result) => {
      if (result?.success) {
        console.log("Toss Payments 결제 성공:", result.success);
        console.log("orderInfo: ", orderInfo);
        const requestBody = {
          counselorId: orderInfo.counselorId,
          comment: orderInfo.comment,
          type: getCounsellingType(orderInfo.counselingType),
          date: orderInfo.selectedDate,
          startTimes: orderInfo.startTimes,
          fee: result.success.amount
        }
        try {
          // 결제 성공 후 서버에 결제 정보 전송
          const response = await axios.post('http://10.0.2.2:8080/toss', {
            orderId: result.success.orderId,
            paymentKey: result.success.paymentKey,
            paymentType: result.success.paymentType,
            amount: result.success.amount,
            counselorId: orderInfo.counselorId,
            counselingType: orderInfo.counselingType,
            selectedDate: orderInfo.selectedDate,
            selectedTime: orderInfo.selectedTime,
          }, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': state.token  // 인증 토큰
            },
          });

          console.log('서버 응답:', response.data);

          const paymentData = result.success || {};
          console.log(paymentData);
          const reservationNumber = result.success.orderId;  // 예약 번호로 주문 ID 사용

          // 결제 완료 모달에 표시할 정보 설정
          setPaymentInfo({
            reservationNumber: reservationNumber,
            counselorName: paymentData.counselorName || orderInfo.counselorName || '정보 없음',
            counselingType: paymentData.counselingType || orderInfo.counselingType,
            selectedDate: paymentData.selectedDate || orderInfo.selectedDate,
            selectedTime: paymentData.selectedTime || orderInfo.selectedTime,
            amount: paymentData.amount || orderInfo.totalAmount,
            paymentMethod: paymentData.paymentMethod || '카드',
          });
          console.log('orderId:', orderInfo);
          console.log('paymentsWidgetRequestbody:', requestBody);
          sendPostRequest({
            token: state.token,
            endPoint: "/reservations",
            requestBody: requestBody,
            onSuccess: () => resetState(),
            onFailure: () => Alert.alert('실패')
          });

          setIsModalVisible(true);  // 결제 완료 모달 표시
        } catch (error) {
          console.error('POST 요청 실패:', error.response?.data || error.message);
          Alert.alert('결제 확인 실패', '서버와의 통신 중 오류가 발생했습니다.');
        }
      } else if (result?.fail) {
        console.log("Toss Payments 결제 실패:", result.fail);
        Alert.alert("결제 실패");
      }
    });
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    onClose();
  };

  return (
    <>
      <View>
        <View style={styles.infoContainer}>
          <Text style={styles.title}>예약 내역</Text>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>상담사</Text>
            <Text style={styles.counselorName}>{orderInfo.counselorName}</Text>
            <Text style={styles.counselingType}>{orderInfo.counselingType}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>일정</Text>
            <Text style={styles.date}>{orderInfo.selectedDate}</Text>
            <Text style={styles.time}>{orderInfo.selectedTime}</Text>
          </View>
        </View>
        <View style={styles.paymentContainer}>
          <Text style={styles.paymentTitle}>결제 금액</Text>
          <Text style={styles.totalAmount}>{orderInfo.totalAmount}</Text>
        </View>
      </View>
      <View>
        <PaymentMethodWidget
          selector="payment-methods"
          onLoadEnd={() => {
            paymentWidgetControl.renderPaymentMethods('payment-methods', { value: parseInt(orderInfo.totalAmount.replace(/[^0-9]/g, '')) }, {
              variantKey: 'DEFAULT',
            }).then((control) => {
              setPaymentMethodWidgetControl(control);
            });
          }}
        />
        <AgreementWidget
          selector="agreement"
          onLoadEnd={() => {
            paymentWidgetControl.renderAgreement('agreement', {
              variantKey: 'DEFAULT',
            }).then((control) => {
              setAgreementWidgetControl(control);
            });
          }}
        />
      </View>
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <Button title="결제요청" onPress={handlePayment} />
        </View>
      </View>
      <PaymentCompleteModal
        visible={isModalVisible}
        onClose={handleModalClose}
        paymentInfo={paymentInfo}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    position: 'absolute', // 위치 고정
    bottom: 0,              // 화면의 상단
    left: 0,             // 화면의 왼쪽
    right: 0,            // 화면의 오른쪽
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoContainer: {
    marginBottom: 16,
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  section: {
    marginBottom: 12,
    flexDirection: 'row',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  counselorName: {
    fontSize: 16,
    color: '#333',
  },
  counselingType: {
    fontSize: 14,
    color: '#666',
  },
  paymentContainer: {

  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 20,
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  methodContainer: {
    marginTop: 10,
  },
  methodTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  paymentMethod: {
    fontSize: 14,
    color: '#666',
  },
  buttonContainer: {
    marginTop: 20,
  },
});

