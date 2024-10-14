import axios from 'axios';
import { REACT_APP_API_URL } from '@env'; // 환경 변수에서 API URL 가져오기
import * as Keychain from 'react-native-keychain';

// 인증 토큰 가져오기
const getAuthToken = async () => {
  try {
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      return credentials.password.replace('Bearer ', '');
    }
    console.error('저장된 토큰이 없습니다.');
    return null;
  } catch (error) {
    console.error('인증 토큰 가져오기 실패:', error);
    return null;
  }
};

// 알림 가져오기
export const getNotifications = async () => {
    try {
      const authToken = await getAuthToken();
      if (!authToken) {
        console.error('인증 토큰이 없습니다.');
        throw new Error('인증 토큰이 없습니다.');
      }
      const cleanToken = authToken.replace('Bearer ', ''); // 접두사 제거
      console.log('Clean Auth Token:', cleanToken); // 정제된 토큰 확인용 로그
  
      console.log('API 요청 URL:', `${REACT_APP_API_URL}/fcm`);
      const response = await axios.get(`${REACT_APP_API_URL}/fcm`, {
        headers: {
          'Authorization': `Bearer ${cleanToken}`, // 정제된 토큰 사용
          'Content-Type': 'application/json',
        },
      });
  
      console.log('알림 가져오기 성공:', response.data);
      return response.data;
    } catch (error) {
      console.error('알림 가져오기 실패:', error);
      console.error('오류 응답:', error.response ? error.response.data : '응답 없음');
      console.error('오류 상태:', error.response ? error.response.status : '상태 없음');
      throw error;
    }
  };

// 알림 읽음 처리
export const markNotificationAsRead = async (notificationId) => {
    try {
      const authToken = await getAuthToken();
      if (!authToken) {
        throw new Error('인증 토큰이 없습니다.');
      }
      const cleanToken = authToken.replace('Bearer ', ''); // 접두사 제거
  
      await axios.post(`${REACT_APP_API_URL}/fcm/${notificationId}/read`, {}, {
        headers: {
          'Authorization': `Bearer ${cleanToken}`, // 정제된 토큰 사용
          'Content-Type': 'application/json',
        },
      });
  
      console.log('알림 읽음 처리 성공');
    } catch (error) {
      console.error('알림 읽음 처리 실패:', error.response ? error.response.data : error.message);
      throw error;
    }
  };

  export const deleteNotification = async (notificationId) => {
    try {
      const authToken = await getAuthToken();
      if (!authToken) {
        throw new Error('인증 토큰이 없습니다.');
      }
      const cleanToken = authToken.replace('Bearer ', ''); // 접두사 제거
  
      await axios.delete(`${REACT_APP_API_URL}/fcm/${notificationId}`, {
        headers: {
          'Authorization': `Bearer ${cleanToken}`,
          'Content-Type': 'application/json',
        },
      });
  
      console.log('알림 삭제 성공');
    } catch (error) {
      console.error('알림 삭제 실패:', error);
      throw error;
    }
  };