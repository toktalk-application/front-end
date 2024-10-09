import React, { useState } from 'react';
import { View, Button, Alert } from 'react-native';
import { WebView } from 'react-native-webview';

const TossPayments = () => {
  const [showWebView, setShowWebView] = useState(false);

  const handlePayment = () => {
    setShowWebView(true);
  };

  const handleWebViewMessage = (event) => {
    const data = JSON.parse(event.nativeEvent.data);
    if (data.status === 'success') {
      Alert.alert('결제 성공', `주문 ID: ${data.orderId}`);
      setShowWebView(false);
    } else if (data.status === 'fail') {
      Alert.alert('결제 실패', data.message);
      setShowWebView(false);
    }
  };

  const webViewContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://js.tosspayments.com/v1"></script>
      </head>
      <body>
        <script>
          const clientKey = 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq';
          const tossPayments = TossPayments(clientKey);

          tossPayments.requestPayment('카드', {
            amount: 1000,
            orderId: 'ORDER_ID_' + new Date().getTime(),
            orderName: '테스트 상품',
            customerName: '홍길동',
            successUrl: 'http://localhost:8080/toss/success',
            failUrl: 'http://localhost:8080/toss/fail',
          }).then(function(data) {
            window.ReactNativeWebView.postMessage(JSON.stringify({status: 'success', ...data}));
          }).catch(function(error) {
            window.ReactNativeWebView.postMessage(JSON.stringify({status: 'fail', message: error.message}));
          });
        </script>
      </body>
    </html>
  `;

  return (
    <View>
      <Button title="결제하기" onPress={handlePayment} />
      {showWebView && (
        <WebView
          source={{ html: webViewContent }}
          onMessage={handleWebViewMessage}
        />
      )}
    </View>
  );
};

export default TossPayments;