// src/services/tossPayments.js

import { REACT_APP_TOSS_CLIENT_KEY } from '@env';

export const getPaymentScript = (paymentData) => {
  return `
    const clientKey = '${REACT_APP_TOSS_CLIENT_KEY}';
    const tossPayments = TossPayments(clientKey);
    
    tossPayments.requestPayment('카드', {
      amount: ${paymentData.amount},
      orderId: '${paymentData.orderId}',
      orderName: '${paymentData.orderName}',
      customerName: '${paymentData.customerName}',
      successUrl: '${paymentData.successUrl}',
      failUrl: '${paymentData.failUrl}',
    }).catch(function (error) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'error', error: error.message }));
    });
  `;
};