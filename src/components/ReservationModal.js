import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, Animated, ScrollView, Image, PanResponder } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import ReservationCalendar from '../components/Calendar/ReservationCalendar.js'
import TimeSelection from '../components/TimeSelection'; 

const ReservationModal = ({ visible, onClose }) => {
  const [slideAnim] = useState(new Animated.Value(800));
  const [selectedType, setSelectedType] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState([]);
  const [details, setDetails] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedDay, setSelectedDay] = useState('');

  // 아코디언 상태 관리
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isCommentOpen, setIsCommentOpen] = useState(false);

  const [availability, setAvailability] = useState({
    '9:00': false, '10:00': false, '11:00': false, '12:00': false, '13:00': false,
    '14:00': false, '15:00': false, '16:00': false, '17:00': false, '18:00': false,
    '19:00': false, '20:00': false, '21:00': false, '22:00': false, '23:00': false,
  });

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
  };

  const handleDayPress = (day) => {
    if (selectedDate === day.dateString) {
      // 이미 선택된 날짜를 다시 선택하면 선택 취소
      setSelectedDate('');
    } else {
      // 새로운 날짜를 선택했을 때
      setSelectedDate(day.dateString);
      const date = new Date(day.dateString);
      const dayOfWeek = date.toLocaleString('ko-KR', { weekday: 'long' }); // 요일 가져오기
      setSelectedDay(dayOfWeek); // 선택된 요일 상태 업데이트
      console.log('선택된 요일:', dayOfWeek); // 요일 출력

      // 기본 시간 설정
    //   if (defaultTimes[dayOfWeek]) {
    //     const updatedAvailability = { ...availability[dayOfWeek] };
    //     defaultTimes[dayOfWeek].forEach(time => {
    //       updatedAvailability[time] = true; // 해당 시간의 상태를 true로 설정
    //     });
    //     setAvailability((prev) => ({
    //       ...prev,
    //       [dayOfWeek]: updatedAvailability,
    //     }));
    //   }
    }
  };


  const handleTimePress = (selectedTime) => {
    const selectedTimes = [...time];

    // 선택된 시간이 배열에 이미 있다면 제거
    if (selectedTimes.includes(selectedTime)) {
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
            setTime([...selectedTimes, selectedTime]);
            setAvailability((prev) => ({
                ...prev,
                [selectedTime]: true, // 선택
            }));
        } else {
            const lastTime = selectedTimes[selectedTimes.length - 1];
            const lastHour = parseInt(lastTime.split(':')[0], 10);
            const currentHour = parseInt(selectedTime.split(':')[0], 10);
            const currentMinute = parseInt(selectedTime.split(':')[1], 10);

            // 마지막 시간과 현재 선택된 시간이 연속적일 경우에만 추가
            if (currentHour === lastHour && currentMinute === 0) {
                // 같은 시간의 00분 선택
                alert('같은 시간을 두 번 선택할 수 없습니다.');
            } else if (currentHour === lastHour + 1 && currentMinute === 0) {
                // 다음 시간의 00분 선택
                setTime([...selectedTimes, selectedTime]);
                setAvailability((prev) => ({
                    ...prev,
                    [selectedTime]: true, // 선택
                }));
            } else if (currentHour === lastHour && currentMinute === 50) {
                // 같은 시간의 50분 선택
                setTime([...selectedTimes, selectedTime]);
                setAvailability((prev) => ({
                    ...prev,
                    [selectedTime]: true, // 선택
                }));
            } else {
                alert('시간은 연속적으로 선택해야 합니다.');
            }
        }
    }
    setIsCommentOpen(true);
};


  const handleSubmit = () => {
    if (!selectedType) {
      alert('상담 종류를 선택해주세요.');
      return;
    }
    alert(`예약 완료!\n상담 종류: ${selectedType}\n날짜: ${date.toLocaleDateString()}\n시간: ${time}\n상담 내용: ${details}`);
    onClose();
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

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <Animated.View style={[styles.modalContent, { transform: [{ translateY: slideAnim }] }]}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          </TouchableOpacity>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
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
                  <TouchableOpacity onPress={() => { setSelectedType('전화 상담'); setIsDateOpen(true); }} style={selectedType === '전화 상담' ? styles.selectedType : styles.typeButton}>
                    <Text>전화 상담</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => { setSelectedType('채팅 상담'); setIsDateOpen(true); }} style={selectedType === '채팅 상담' ? styles.selectedType : styles.typeButton}>
                    <Text>채팅 상담</Text>
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
                    source={selectedDate? (isCommentOpen ? require('../../assets/images/up.png') : require('../../assets/images/down.png')) : require('../../assets/images/down.png')} 
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
                    <Text style={styles.cost}>총 결제금액</Text>
                    <Text style={styles.costValue}>50,000원</Text>
                        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>결제하기</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Animated.View>
      </View>
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
    marginHorizontal:10,
    marginTop: 5,
    borderBottomColor: '#ccc',
    flexDirection: 'row',   
    justifyContent: 'space-between', 
    alignItems: 'center', 
  },
  accordionContent: {
    paddingVertical: 10,
  },
  icon:{
    width: 15,
    height: 15,
    marginTop:10,
    marginRight:10
  },
  typeContainer: {
    flexDirection: 'row',
    marginHorizontal:15
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
    backgroundColor: '#ffa500',
    borderRadius: 5,
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
  selectedTypeText: {
    marginTop: 10,
    fontWeight: 'bold',
  },
  textInput: {
    height: 150,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    marginHorizontal:20
  },
  cost: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#001326',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
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
    marginRight:10
  },
  label: {
    fontSize: 15,
    color: 'gray',
    height:20,
    width:200
  },
  selectedLabel: {
    fontSize: 14,
    color: 'gray',
    height:20,
    width:72
  },
  value: {
    fontSize: 13,
    fontWeight: 'bold',
    paddingTop:10,
    height:60,
    width:67
  },
  dateValue: {
    fontSize: 13,
    fontWeight: 'bold',
    paddingTop:10,
    height:60,
    width:70,
    marginRight:6
  },
  timeValue:{
    fontSize: 13,
    fontWeight: 'bold',
    paddingTop:10,
    marginLeft:7,
    height:60,
    width:60
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
    backgroundColor: '#e0f7fa',
    padding: 10,
    borderRadius: 5,
    width: 120,
    alignItems: 'center',
  },
  buttonText: {
    color: '#00796b',
    fontWeight: 'bold',
  },
});

export default ReservationModal;
