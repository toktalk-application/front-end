import axios from 'axios';
import { REACT_APP_API_URL } from '@env';
import * as Keychain from 'react-native-keychain';

const getAuthToken = async () => {
  try {
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      // 'Bearer ' 접두사가 있으면 제거, 없으면 그대로 반환
      return credentials.password.replace('Bearer ', '');
    }
    console.error('저장된 토큰이 없습니다.');
    return null;
  } catch (error) {
    console.error('인증 토큰 가져오기 실패:', error);
    return null;
  }
};

const apiRequest = async (method, endpoint, data = null) => {
  const authToken = await getAuthToken();
  if (!authToken) {
    throw new Error('인증 토큰이 없습니다.');
  }

  console.log(`${method.toUpperCase()} 요청 URL:`, `${REACT_APP_API_URL}${endpoint}`);

  try {
    const response = await axios({
      method,
      url: `${REACT_APP_API_URL}${endpoint}`,
      data,
      headers: {
        'Authorization': `Bearer ${authToken}`, // authToken은 이미 'Bearer ' 접두사가 제거된 상태
        'Content-Type': 'application/json',
      },
    });
    console.log(`${method.toUpperCase()} 요청 성공:`, endpoint);
    return response.data;
  } catch (error) {
    console.error(`${method.toUpperCase()} 요청 실패:`, endpoint, error);
    console.error('오류 응답:', error.response ? error.response.data : '응답 없음');
    console.error('오류 상태:', error.response ? error.response.status : '상태 없음');
    throw error;
  }
};

export const getNotifications = () => apiRequest('get', '/fcm');

export const markNotificationAsRead = (notificationId) => 
  apiRequest('post', `/fcm/${notificationId}/read`);

export const deleteNotification = (notificationId) => 
  apiRequest('delete', `/fcm/${notificationId}`);