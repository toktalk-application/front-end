import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, Animated, ScrollView, Image, PanResponder, Alert } from 'react-native';
import ReservationCalendar from '../components/Calendar/ReservationCalendar.js'
import TimeSelection from '../components/TimeSelection';
import { PaymentWidgetProvider } from '@tosspayments/widget-sdk-react-native';
import ExPaymentWidget from './exPaymentWidget';
import { REACT_APP_TOSS_CLIENT_KEY } from '@env';
import sendGetRequest from '../axios/SendGetRequest.js';
import { useAuth } from '../auth/AuthContext.js';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const ReservationModal = ({ visible, onClose, counselorId, chatPrice, callPrice, counselorData }) => {
  const { state } = useAuth();
  const navigation = useNavigation();
  const slideAnim = useRef(new Animated.Value(800)).current; // 슬라이드 애니메이션
  const [scrollAnim] = useState(new Animated.Value(0));
  const [selectedType, setSelectedType] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState([]);
  const [details, setDetails] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [showWebView, setShowWebView] = useState(false);
  const scrollViewRef = useRef(null);
  const [orderInfo, setOrderInfo] = useState(null);

  // 아코디언 상태 관리
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isCommentOpen, setIsCommentOpen] = useState(false);

  const initialTimes = {
    '09:00': false, '10:00': false, '11:00': false, '12:00': false, '13:00': false,
    '14:00': false, '15:00': false, '16:00': false, '17:00': false, '18:00': false,
    '19:00': false, '20:00': false, '21:00': false, '22:00': false, '23:00': false,
  };
  const [availability, setAvailability] = useState(initialTimes);
  const [availableTimes, setAvailableTimes] = useState({});
  useEffect(() => {
    // ScrollView가 늘어날 때마다 스크롤을 아래로 이동
    if (scrollViewRef.current) {
      // 스크롤 위치를 부드럽게 설정
      scrollViewRef.current.scrollToEnd({
        y: scrollViewRef.current.scrollHeight,
        duration: 800,
        animated: true, // 부드럽게 스크롤
      });
    }
  }, [isTypeOpen, isDateOpen, isCommentOpen, selectedDate, details, time])

  useEffect(() => {
    if (visible) {
      // 모달이 열릴 때 애니메이션 시작
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // 모달이 닫힐 때 애니메이션 시작
      Animated.timing(slideAnim, {
        toValue: 800,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // 모달이 닫힐 때 상태 초기화
      resetState();
    }
  }, [visible]);

  useEffect(() => {
    console.log('Updated time:', time); // time 상태가 변경될 때마다 출력
  }, [time]); 

  // useFocusEffect(
  //   useCallback(() => {
  //     if (visible) {
  //       // 모달이 열릴 때 애니메이션 시작
  //       Animated.timing(slideAnim, {
  //         toValue: 0,
  //         duration: 300,
  //         useNativeDriver: true,
  //       }).start();
  //     } else {
  //       // 모달이 닫힐 때 애니메이션 시작
  //       Animated.timing(slideAnim, {
  //         toValue: 800,
  //         duration: 300,
  //         useNativeDriver: true,
  //       }).start();
  
  //       // 모달이 닫힐 때 상태 초기화
  //       resetState();
  //     }
  //   }, [time])
  // );

  // useFocusEffect(
  //   useCallback(() => {
  //     console.log('Updated time:', time); // time 상태가 변경될 때마다 출력
  //   }, [visible])
  // );

  // 상태 초기화 함수
  const resetState = () => {
    setSelectedType('');
    setDate(new Date());
    setTime('');
    setDetails('');
    setSelectedDate('');
    setIsTypeOpen(false);
    setIsDateOpen(false);
    setIsCommentOpen(false);
    setAvailability(initialTimes);
  };

  // 수정
  const handlePaymentRequest = () => {
    if (!details) {
      Alert.alert('상담 내용을 입력해주세요.')
    }
    else {
      const orderInfo = {
        counselingType: selectedType,
        totalAmount: getTotalFee(),
        selectedDate: selectedDate,
        selectedTime: formatSelectedTime(time),
        counselorId: counselorId,
        counselorName: counselorData?.name || '알 수 없음',  // 기본값 제공
        comment: details,
        startTimes: time
      };
      setOrderInfo(orderInfo);
      setShowWebView(true);
    }
  };

  const onClosee = () => {
    onClose();
    setShowWebView(false);
  }

  const handleDayPress = (day) => {
    if (selectedDate === day.dateString) {
      // 이미 선택된 날짜를 다시 선택하면 선택 취소
      setSelectedDate('');
    } else {
      // 새로운 날짜를 선택했을 때

      console.log("day: ", day.dateString);
      // 상담사의 특정일 예약 가능 시간 조회
      sendGetRequest({
        token: state.token,
        endPoint: `/counselors/available-dates/${counselorId}`,
        requestParams: {
          date: day.dateString
        },
        onSuccess: (data) => {
          console.log("data: ", data);
          const times = data.data.availableTimes;

          /* const newAvailableTimes = initialTimes;
          Object.keys(times).forEach(time => {
            if(time in newAvailableTimes) newAvailableTimes[time] = true;
          })
          setAvailability(newAvailableTimes); */
          setAvailableTimes(times);
        },
        /* onFailure: () => Alert.alert("실패", "특정 상담사의 특정일 타임슬롯 조회 실패") */
      })

      setSelectedDate(day.dateString);
      const date = new Date(day.dateString);
      const dayOfWeek = date.toLocaleString('ko-KR', { weekday: 'long' }); // 요일 가져오기
      setSelectedDay(dayOfWeek); // 선택된 요일 상태 업데이트
      console.log('선택된 요일:', dayOfWeek); // 요일 출력
    }
  };


  const addTime = (selectedTime, selectedTimes) => {
    setTime([...selectedTimes, selectedTime].sort((a,b) => a.localeCompare(b)));
    setAvailability((prev) => ({
      ...prev,
      [selectedTime]: true, // 선택
    }));
  }

  const isOutlander = (array, el) => {
    const index = array.indexOf(el); // el의 인덱스
    return index === 0 || index === array.length - 1; // 첫 번째 또는 마지막 인덱스인지 판별
  }

  const handleTimePress = (selectedTime) => {
    const selectedTimes = [...time];
    console.log('selectedTime: ', selectedTime);
    console.log('selectedTimes: ', selectedTimes);

    // 선택된 시간이 배열에 이미 있다면 제거
    if (selectedTimes.includes(selectedTime)) {
      if(!isOutlander(selectedTimes, selectedTime)){
        Alert.alert("예약시간은 연속돼야 합니다.");
        return;
      }
      setTime(selectedTimes.filter(t => t !== selectedTime)); // 선택 취소
      // availability 상태 업데이트
      setAvailability((prev) => ({
        ...prev,
        [selectedTime]: false, // 선택 해제
      }));
    } else {
      // 선택된 시간이 배열에 없다면 추가
      if (selectedTimes.length === 0) {
        // 첫 선택
        addTime(selectedTime, selectedTimes);
      } else { // 일반적인 경우
        const lastTime = selectedTimes[selectedTimes.length - 1];
        const firstTime = selectedTimes[0];
        const firstHour = parseInt(firstTime.split(':')[0], 10);
        const lastHour = parseInt(lastTime.split(':')[0], 10);
        const currentHour = parseInt(selectedTime.split(':')[0], 10);
        const currentMinute = parseInt(selectedTime.split(':')[1], 10);

        console.log('firstHour: ', firstHour);
        console.log('lastTime: ', lastTime);
        console.log('lastHour: ', lastHour);
        console.log('currentHour: ', currentHour);
        console.log('currentMinute: ', currentMinute);

        // 마지막 시간과 현재 선택된 시간이 연속적일 경우에만 추가
        if (currentHour === lastHour && currentMinute === 0) {
          // 같은 시간의 00분 선택
          Alert.alert('같은 시간을 두 번 선택할 수 없습니다.');
        } else if (currentHour === lastHour + 1 && currentMinute === 0) {
          // 다음 시간의 00분 선택
          addTime(selectedTime, selectedTimes);
        } else if (currentHour === lastHour && currentMinute === 50) {
          // 같은 시간의 50분 선택
          addTime(selectedTime, selectedTimes);
        } else if (currentHour === firstHour - 1 && currentMinute === 0) {
          // 이전 시간 선택했을 때
          addTime(selectedTime, selectedTimes);
        } else {
          Alert.alert('시간은 연속적으로 선택해야 합니다.');
        }
      }
    }
    setIsCommentOpen(true);
  };

  const formatDate = (date) => {
    const parsedDate = new Date(date);

    // 유효한 날짜인지 확인
    if (isNaN(parsedDate.getTime())) {
      return ''; // Invalid Date일 경우 빈 문자열 반환
    }

    const options = { year: '2-digit', month: '2-digit', day: '2-digit' };
    const formattedDate = parsedDate.toLocaleDateString('ko-KR', options);

    // 날짜 형식 변경
    return formattedDate.replace(/\./g, '.').replace(/(\d{2})\/(\d{2})\/(\d{2})/, '$3.$1.$2').trim();
  };

  const formatSelectedTime = (time) => {
    if (!Array.isArray(time) || time.length === 0) return '';

    // 첫 번째 시간과 마지막 시간 가져오기
    const startTime = time[0]; // 시작 시간
    const endHour = parseInt(time[time.length - 1].split(':')[0], 10); // 마지막 시간 (+1 시간)
    const endMinute = '50'; // 고정된 종료 분

    // 형식화된 문자열 반환
    return `${startTime} - ${endHour.toString().padStart(2, '0')}:${endMinute}`;
  };

  // 총 결제금액 계산
  const getTotalFee = () => {
    let totalTimes = 0;
    Object.keys(availability).forEach((time, isSelected) => {
      if(availability[time]) totalTimes ++ ;
    })
    let totalFee = 0;
    if(selectedType === '전화 상담'){
      totalFee = totalTimes * callPrice;
    }
    if(selectedType === '채팅 상담'){
      totalFee =  totalTimes * chatPrice;
    }
    return totalFee.toLocaleString() + ' 원';
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      {showWebView ? (
        <PaymentWidgetProvider
          clientKey={REACT_APP_TOSS_CLIENT_KEY}
          customerKey={`sbd0Tg2oe-tJS4xNk1krs`}>
          <ExPaymentWidget onClose={onClosee} orderInfo={orderInfo} resetState={resetState} />
        </PaymentWidgetProvider>
      ) : (
        <View style={styles.modalContainer}>
          <Animated.View style={[styles.modalContent, { transform: [{ translateY: slideAnim }] }]}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            </TouchableOpacity>
            <ScrollView 
              ref={scrollViewRef} //
              contentContainerStyle={styles.scrollContainer}>
              {/* 상담 종류 선택 섹션 */}
              <TouchableOpacity onPress={() => setIsTypeOpen(!isTypeOpen)} style={styles.accordionHeader}>
                <Text style={styles.label}>📞  상담 종류 선택 </Text>
                <Image
                  source={isTypeOpen ? require('../../assets/images/up.png') : require('../../assets/images/down.png')}
                  style={styles.icon}
                />
              </TouchableOpacity>
              {isTypeOpen && (
                <View style={styles.accordionContent}>
                  <View style={styles.typeContainer}>
                    <TouchableOpacity onPress={() => { setSelectedType('채팅 상담'); setIsDateOpen(true); }} style={selectedType === '채팅 상담' ? styles.selectedType : styles.typeButton}>
                      <Text style={selectedType === '채팅 상담' ? styles.selectedTypeText : styles.typeButtonText} >채팅 상담</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { setSelectedType('전화 상담'); setIsDateOpen(true); }} style={selectedType === '전화 상담' ? styles.selectedType : styles.typeButton}>
                      <Text onPress={() => { setSelectedType('전화 상담'); setIsDateOpen(true); }} style={selectedType === '전화 상담' ? styles.selectedTypeText : styles.typeButtonText}>전화 상담</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              <TouchableOpacity onPress={() => setIsDateOpen(!isDateOpen)} style={styles.accordionHeader}>
                <Text style={styles.label}>📅  날짜와 시간 선택 </Text>
                <Image
                  source={selectedType ? (isDateOpen ? require('../../assets/images/up.png') : require('../../assets/images/down.png')) : require('../../assets/images/down.png')}
                  style={styles.icon}
                />
              </TouchableOpacity>
              {/* 날짜와 시간 선택 섹션 */}
              {selectedType && (
                <>
                  {isDateOpen && (
                    <>
                      <ReservationCalendar onDayPress={handleDayPress} selectedDate={selectedDate} />
                      {/* 시간 선택 섹션 */}
                      {selectedDate && (
                        <TimeSelection
                          availability={availability}
                          availableTimes={availableTimes}
                          selectedDay={new Date(selectedDate).toLocaleString('ko-KR', { weekday: 'long' })}
                          onTimePress={handleTimePress}
                        />
                      )}
                    </>
                  )}
                </>
              )}
              <TouchableOpacity onPress={() => setIsCommentOpen(!isCommentOpen)} style={styles.accordionHeader}>
                <Text style={styles.label}>📖  상담 내용 </Text>
                <Image
                  source={selectedDate ? (isCommentOpen ? require('../../assets/images/up.png') : require('../../assets/images/down.png')) : require('../../assets/images/down.png')}
                  style={styles.icon}
                />
              </TouchableOpacity>
              {/* 상담 내용 입력 섹션 */}
              {selectedDate && (
                <>
                  {isCommentOpen && (
                    <View style={styles.accordionContent}>
                      <TextInput
                        style={[styles.textInput, { textAlignVertical: 'top' }]}
                        placeholder="상담하고 싶은 내용을 적어주세요."
                        multiline
                        value={details}
                        onChangeText={setDetails}
                      />
                    </View>
                  )}
                </>
              )}
            </ScrollView>
            {/* 선택한 상담 종류 표시 */}
            <View style={styles.container}>
              <View style={styles.row}>
                <View style={styles.column}>
                  <Text style={styles.selectedLabel}>상담 종류</Text>
                  <Text style={styles.value}>{selectedType}</Text>
                </View>
                <View style={styles.column}>
                  <Text style={styles.selectedLabel}>선택 날짜</Text>
                  <Text style={styles.dateValue}>{formatDate(selectedDate)}</Text>
                </View>
                <View style={styles.column}>
                  <Text style={styles.selectedLabel}>선택 시간</Text>
                  <Text style={styles.timeValue}>
                    {formatSelectedTime(time)}
                  </Text>
                </View>
              </View>
              <View style={styles.footer}>
                <Text style={styles.cost}>총 결제 금액</Text>
                <Text style={styles.costValue}>{getTotalFee()}</Text>
                <TouchableOpacity style={styles.submitButton} onPress={handlePaymentRequest} >
                  <Text style={styles.submitButtonText}>결제하기</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </View>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    height: 800,
    padding: 5,
    borderRadius: 10,
    maxHeight: '90%', // 최대 높이 제한
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20, // 추가적인 패딩
  },
  label: {
    marginTop: 20,
    fontWeight: 'bold',
  },
  accordionHeader: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    marginHorizontal: 10,
    marginTop: 5,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accordionContent: {
    paddingVertical: 10,
  },
  icon: {
    width: 15,
    height: 15,
    marginTop: 10,
    marginRight: 10
  },
  typeContainer: {
    flexDirection: 'row',
    marginHorizontal: 15
  },
  typeButton: {
    padding: 10,
    marginRight: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  selectedType: {
    padding: 10,
    marginRight: 10,
    backgroundColor: '#215D9A',
    borderRadius: 5,
  },
  typeButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  selectedTypeText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  dateButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginBottom: 10,
  },
  timeSelection: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  timeButton: {
    padding: 10,
    marginRight: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  selectedTime: {
    padding: 10,
    marginRight: 10,
    backgroundColor: '#ffa500',
    borderRadius: 5,
  },
  textInput: {
    height: 150,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    marginHorizontal: 20
  },
  cost: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  container: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopColor: '#ccc',
    borderTopWidth: 1,
    backgroundColor: '#fff',
  },
  row: {
    flex: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  column: {
    flex: 1,
    alignItems: 'center', // 텍스트 중앙 정렬
    marginRight: 10
  },
  label: {
    fontSize: 15,
    color: 'gray',
    height: 20,
    width: 200
  },
  selectedLabel: {
    fontSize: 14,
    color: 'gray',
    height: 20,
    width: 72
  },
  value: {
    fontSize: 13,
    fontWeight: 'bold',
    paddingTop: 10,
    height: 60,
    width: 67
  },
  dateValue: {
    fontSize: 13,
    fontWeight: 'bold',
    paddingTop: 10,
    height: 60,
    width: 70,
    marginRight: 6
  },
  timeValue: {
    fontSize: 13,
    fontWeight: 'bold',
    paddingTop: 10,
    marginLeft: 7,
    height: 60,
    width: 60
  },
  footer: {
    alignItems: 'flex-end',
  },
  cost: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  costValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#215D9A',
    padding: 10,
    borderRadius: 5,
    width: 120,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ReservationModal;