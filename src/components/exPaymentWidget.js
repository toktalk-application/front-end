import React, { useState } from 'react'
import { usePaymentWidget, AgreementWidget, PaymentMethodWidget } from '@tosspayments/widget-sdk-react-native'
import { Alert, Button } from 'react-native'
import axios from 'axios';
import { useAuth } from '../auth/AuthContext';

export default function ExPaymentWidget({ onClose }) {
  const paymentWidgetControl = usePaymentWidget();
  const [paymentMethodWidgetControl, setPaymentMethodWidgetControl] = useState(null);
  const [agreementWidgetControl, setAgreementWidgetControl] = useState(null);
  const { state } = useAuth();

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
    if (paymentWidgetControl == null || agreementWidgetControl == null) {
      Alert.alert('주문 정보가 초기화되지 않았습니다.');
      return;
    }

    const agreement = await agreementWidgetControl.getAgreementStatus();
    if (!agreement.agreedRequiredTerms) {
      Alert.alert('약관에 동의하지 않았습니다.');
      return;
    }

    paymentWidgetControl.requestPayment?.({
      orderId: generateOrderId(),
      orderName: '토스 티셔츠 외 2건',
    }).then(async (result) => {
      if (result?.success) {
        Alert.alert(result.success.orderId)
        Alert.alert("성공 가즈아ㅏㅏ");
        try {
          // POST 요청 보내기
          const response = await axios.post('http://10.0.2.2:8080/toss', {
            orderId: result.success.orderId,
            paymentKey: result.success.paymentKey,
            paymentType: result.success.paymentType,
            amount: result.success.amount,
          }, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': state.token
            },
          });
        } catch (error) {
          // 에러 처리
          Alert.alert(error)
          console.error('POST 요청 실패:', error);
        }
        onClose(); // 모달 닫기
      } else if (result?.fail) {
        Alert.alert("실패 가즈아ㅏㅏ");
        onClose(); // 모달 닫기
      }
    });
  };

  return (
    <>
      <PaymentMethodWidget
        selector="payment-methods"
        onLoadEnd={() => {
          paymentWidgetControl.renderPaymentMethods('payment-methods', { value: 5000 }, {
            variantKey: 'DEFAULT', // 토스 어드민 > UI 설정값
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
    </>
  );
}