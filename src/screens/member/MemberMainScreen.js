import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import MemberCalendar from '../../components/Calendar/MemberCalendar'; // 경로를 상황에 맞게 수정하세요.
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import sendGetRequest from '../../axios/SendGetRequest';
import { useAuth } from '../../auth/AuthContext';
import sendPostRequest from '../../axios/SendPostRequest';
import { all } from 'axios';

const moodOptions = [
    { key: 'HAPPY', label: '😃' },
    { key: 'NEUTRAL', label: '😐' },
    { key: 'DEPRESSED', label: '😞' },
    { key: 'SAD', label: '😭' },
    { key: 'ANGRY', label: '😡' },
];


function MemberMainScreen() {
    const { state } = useAuth();
    const navigation = useNavigation();
    const [markedDates, setMarkedDates] = useState({});
    const [moodDates, setMoodDates] = useState({});
    const [reservations, setReservations] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedEmotion, setSelectedEmotion] = useState(null);
    const today = new Date().toISOString().split('T')[0];
    const [isReservationLoading, setIsReservationLoading] = useState(true);
    const [isMoodLoading, setIsMoodLoading] = useState(true);
    const flatListRef = useRef(null);

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    const handleEmotionPress = (emotion) => {
        setMoodDates((prev) => ({
            ...prev,
            [today]: emotion.label, // 오늘 날짜에 감정 저장
        }));
        setSelectedEmotion(emotion.key); // 선택된 감정 업데이트
        // toggleModal(); // 감정 선택 후 모달 닫기
        // 후에 post/emotions 해서 오늘 입력한 기분값을 전달해야 함. 
    };


    const getFormattedMoodDates = (emotions) => Object.keys(emotions).reduce((acc, date) => {
        const moodKey = emotions[date];
        const moodOption = moodOptions.find(option => option.key === moodKey);
        acc[date] = moodOption ? moodOption.label : ''; // 이모지로 변환
        return acc;
    }, {});

    useFocusEffect(
        useCallback(() => {
            setSelectedDate("");
            /* handleDayPress(selectedDate); */

            const now = new Date();
            const year = now.getFullYear();
            const month = (now.getMonth() + 1).toString().padStart(2, '0');
            const formattedMonth = `${year}-${month}`;

            sendGetRequest({
                token: state.token,
                endPoint: "/reservations/monthly",
                requestParams: {
                    month: formattedMonth
                },
                onSuccess: (data) => {
                    console.log("monthlyData: ", data);
                    setMarkedDates(data.data);
                    setIsReservationLoading(false);
                },
                onFailure: () => Alert.alert("실패!", "내 한 달간 날짜별 예약 존재 여부 확인 실패")
            });

            sendGetRequest({
                token: state.token,
                endPoint: "/members/daily-moods",
                requestParams: {
                    month: formattedMonth
                },
                onSuccess: (data) => {
                    console.log("mood data: ", data);
                    const formattedData = getFormattedMoodDates(data.data);
                    setMoodDates(formattedData);
                    setIsMoodLoading(false);
                },
                onFailure: () => Alert.alert("실패", "실패!")
            });

            sendGetRequest({
                token: state.token,
                endPoint: `/members/${state.identifier}`,
                onSuccess: (data) => {
                    console.log("data: ", data);
                    if (!data.data.lastTestResult || Object.keys(data.data.lastTestResult).length === 0) {
                        Alert.alert(
                            "우울 검사 필요",
                            "우울 검사를 진행해야 합니다.",
                            [
                                {
                                    text: "확인",
                                    onPress: () => navigation.navigate("우울 검사"),
                                },
                            ],
                            { cancelable: false }
                        );
                    }
                },
                onFailure: () => Alert.alert("요청 실패", "내 정보 GET요청 실패"),
            });
        }, [])
    );

    const handleDayPress = (day) => {
        // 두 번 누르면 해제
        if (selectedDate === day.dateString) {
            console.log("날짜 클릭");
            setSelectedDate('');
            setReservations([]);
        } else { // 일반적인 경우
            console.log("날짜 클릭");
            sendGetRequest({
                token: state.token,
                endPoint: "/reservations/daily",
                requestParams: {
                    date: day.dateString,
                    exceptCancelledReservation: true,
                },
                onSuccess: (data) => {
                    console.log("data: ", data);
                    setReservations(data.data);
                },
                onFailure: () => Alert.alert("실패", "내 특정일 예약 목록 조회 실패")
            });
            setSelectedDate(day.dateString);
            /* fetchReservations(day.dateString); */
        }
    };

    const handleReservationPress = (reservationId) => {
        navigation.navigate('CounselDetail', { reservationId });
    };

    const formatTime = (time) => {
        const [hour, minute] = time.split(':');
        const formattedHour = (hour % 12 === 0 ? 12 : hour % 12).toString().padStart(2, '0');
        const period = hour < 12 ? '오전' : '오후';
        return `${period} ${formattedHour}:${minute}`;
    };

    const getMinDate = () => {
        return new Date().toISOString().split('T')[0];
    }

    const getMaxDate = () => {
        const today = new Date();

        const currentYear = today.getFullYear();
        const nextMonth = today.getMonth() + 1;

        // 다음 달의 마지막 날 계산
        const lastDayOfNextMonth = new Date(currentYear, nextMonth + 1, 0).getDate();

        // 최대 날짜 설정
        return (`${currentYear}-${String(nextMonth + 1).padStart(2, '0')}-${lastDayOfNextMonth}`);
    }

    useEffect(() => {
        if (flatListRef.current) {
            flatListRef.current.scrollToEnd({
                y: flatListRef.current.scrollHeight,
                animated: true, // 부드럽게 스크롤
            });
            // 데이터가 변경될 때마다 FlatList의 끝으로 스크롤
        }
    }, [selectedDate, reservations]);

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            {isReservationLoading || isMoodLoading ? <View /> :
                <FlatList
                    ref={flatListRef}
                    data={reservations}
                    keyExtractor={(item) => item.reservationId.toString()}
                    ListHeaderComponent={() => (
                        <View style={{ marginBottom: 10 }}>
                            <TouchableOpacity style={styles.Button} onPress={toggleModal}>
                                <Text style={styles.buttonText}>오늘의 기분은?</Text>
                            </TouchableOpacity>
                            <MemberCalendar
                                moodDates={moodDates}
                                markedDates={markedDates}
                                onDayPress={handleDayPress}
                                selectedDate={selectedDate}
                                minDate={getMinDate()}
                                maxDate={getMaxDate()}
                            />
                        </View>
                    )}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleReservationPress(item.reservationId)} style={styles.itemContainer}>
                            {selectedDate === '' ? <View /> : <View style={styles.row}>
                                <View style={styles.timeContainer}>
                                    <Text style={styles.timeText}> {formatTime(item.startTime)} </Text>
                                    <Text style={styles.timeText}> | </Text>
                                    <Text style={styles.timeText}> {formatTime(item.endTime)} </Text>
                                </View>
                                <View style={styles.detailsContainer}>
                                <View style={styles.detailsRow}>
                                  <View style= {{ flexDirection: 'row', justifyContent: 'space-between', alignItems:'center', marginBottom:10}}>
                                        <Text style={styles.nickNameText}>상담사 </Text>
                                        <Text style= {{color :'white'}}>{item.counselorName}</Text>
                                    </View>
                                        <Text style={styles.typeText}> {item.type} </Text>
                                    </View>
                                    <View style= {{ flexDirection: 'row', justifyContent: 'flex-start', alignItems:'center'}}>
                                        <Text style={styles.commentText}> 상담 내용 </Text> 
                                        <Text style= {{ color: 'white', marginRight:70}}   numberOfLines={1} ellipsizeMode="tail" > {item.comment || '없음'}</Text>
                                    </View>
                                </View>
                            </View>}
                        </TouchableOpacity>
                    )}
                />}
            <Modal
                transparent
                visible={modalVisible}
                animationType="slide"
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        {/* 텍스트를 감싸는 View 추가 */}
                        <View style={styles.textContainer}>
                            <View style={{ position: 'relative', flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                                <Text></Text>
                                <Text style={styles.textStyle}>오늘의 기분을 선택하세요</Text>
                                <TouchableOpacity style={{ alignSelf: 'center', marginRight: 10 }} onPress={() => setModalVisible(false)}>
                                    <Text style={{fontSize: 15}}>❌</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.emotionContainer}>
                            {moodOptions.map((emotion) => (
                                <TouchableOpacity
                                    key={emotion.key}
                                    onPress={() => handleEmotionPress(emotion)}
                                    style={[
                                        styles.emotionButton,
                                        selectedEmotion === emotion.key && { backgroundColor: '#FFD700' }
                                    ]}
                                >
                                    <Text style={styles.emotionText}>{emotion.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <TouchableOpacity onPress={() => {
                            if (!selectedEmotion) {
                                Alert.alert("실패", "오늘의 기분을 선택해주세요");
                                return;
                            }
                            console.log("selectedEmotion: ", selectedEmotion);
                            console.log("today: ", new Date().toISOString().slice(0, 10));

                            if (!selectedEmotion) toggleModal();

                            sendPostRequest({
                                token: state.token,
                                endPoint: "/members/daily-moods",
                                requestBody: {
                                    date: new Date().toISOString().slice(0, 10),
                                    mood: selectedEmotion
                                },
                                onSuccess: () => toggleModal(),
                                onFailure: () => Alert.alert("실패", "실패!")
                            })
                        }} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}> 저장 </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    itemContainer: {
        marginLeft: 10,
        marginRight: 20,
        padding: 5,
        borderRadius: 5,
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    Button: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginRight: 20,
    },
    buttonText: {
        backgroundColor: '#FFCE50',
        padding: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        fontSize: 15
    },
    timeContainer: {
        flex: 2,
        padding: 3,
        marginBottom: 2,
        alignItems: 'center',
        flexDirection: 'column',
    },
    timeText: {
        color: 'black',
        fontSize: 14,
    },
    detailsContainer: {
        backgroundColor: '#215D9A', // 배경 색상
        flex: 7, // 공간을 더 차지하도록 설정
        paddingLeft: 10, // 약간의 여백
        paddingVertical: 10,
        paddingBottom:15,
        borderRadius: 10,
    },
    detailsRow: {
        flexDirection: 'row', // 좌우 배치
        justifyContent: 'space-between', // 양쪽 끝 정렬    
        alignItems: 'center',
        marginLeft: 5,
        marginRight: 10
    },
    nickNameText: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
    },
    typeText: {
        color: 'black',
        fontSize: 13,
        backgroundColor: 'white',
        borderRadius: 10,
        paddingHorizontal: 5,
        paddingVertical:2,
        marginBottom:5
    },
    commentText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
      },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
    },
    textContainer: {
        alignItems: 'center', // 텍스트 수평 중앙 정렬
        marginBottom: 10, // 아래 여백 추가
    },
    textStyle: {
        fontSize: 18, // 텍스트 크기 조정
        fontWeight: 'bold', // 텍스트 두께 조정
        marginLeft: 20,
    },
    emotionContainer: {
        flexDirection: 'row', // 가로 방향 정렬
        justifyContent: 'space-around', // 버튼 사이의 간격 조정
        marginVertical: 10, // 위아래 여백 추가
    },
    emotionButton: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#F2F2F2',
        marginHorizontal: 12, // 버튼 사이 여백
        // iOS 그림자 속성
        shadowColor: '#000', // 그림자 색상
        shadowOffset: {
            width: 0, // 수평 이동
            height: 2, // 수직 이동
        },
        shadowOpacity: 0.3, // 그림자 불투명도
        shadowRadius: 4, // 그림자 반경
        elevation: 5, // 그림자 높이
    },
    emotionText: {
        fontSize: 20,
    },
    closeButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#FFCE50',
        borderRadius: 5,
    },
    closeButtonText: {
        fontSize: 16,
        color: 'black',
        textAlign: 'center',
    },
});



export default MemberMainScreen;
