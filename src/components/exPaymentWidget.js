import React, { useState } from 'react'
import { usePaymentWidget, AgreementWidget, PaymentMethodWidget } from '@tosspayments/widget-sdk-react-native'
import { Alert, Button } from 'react-native'
import axios from 'axios';
import { useAuth } from '../auth/AuthContext';
import PaymentCompleteModal from './PaymentCompleteModal';

export default function ExPaymentWidget({ onClose, orderInfo }) {
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
    <Button title="결제요청" onPress={handlePayment} />
    <Button
      title="선택된 결제수단"
      onPress={async () => {
        if (paymentMethodWidgetControl == null) {
          Alert.alert('주문 정보가 초기화되지 않았습니다.');
          return;
        }
        Alert.alert(`선택된 결제수단: ${JSON.stringify(await paymentMethodWidgetControl.getSelectedPaymentMethod())}`);
      }}
    />
    <PaymentCompleteModal 
      visible={isModalVisible}
      onClose={handleModalClose}
      paymentInfo={paymentInfo}
    />
  </>
);
}
