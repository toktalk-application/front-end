import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import MemberCalendar from '../../components/Calendar/MemberCalendar'; // 경로를 상황에 맞게 수정하세요.
import { useNavigation } from '@react-navigation/native';

const moodOptions = [
    { key: 'HAPPY', label: '😃' },
    { key: 'NEUTRAL', label: '😐' },
    { key: 'DEPRESSED', label: '😞' },
    { key: 'SAD', label: '😭' },
    { key: 'ANGRY', label: '😡' },
];


function MemberMainScreen() {
    const navigation = useNavigation();
    const [markedDates, setMarkedDates] = useState({});
    const [moodDates, setMoodDates] = useState({}); 
    const [reservations, setReservations] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedEmotion, setSelectedEmotion] = useState(null); 
    const today = new Date().toISOString().split('T')[0];

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

    useEffect(() => {
        const fetchMarkedDates = async () => {
            const dummyData = {
                "2024-10-04": true,
                "2024-10-05": true,
                "2024-10-06": true,
                "2024-10-18": true,
                "2024-10-19": true,
                "2024-10-31": true,
            };

            const formattedData = Object.keys(dummyData).reduce((acc, date) => {
                acc[date] = { marked: dummyData[date] === true };
                return acc;
            }, {});

            setMarkedDates(formattedData);
        };


        const fetchEmotions = async () => {
            // API 요청 예시 (여기서는 더미 데이터 사용)
            // const response = await fetch('https://api.example.com/get/emotions'); // 실제 API URL로 변경
            const data = await response.json(); // API에서 받아온 데이터 사용
        };
        const dummyEmotionsData = {
            "2024-10-01": "ANGRY", 
            "2024-10-02": "HAPPY", 
            "2024-10-03": "HAPPY", 
            "2024-10-04": "NEUTRAL", 
            "2024-10-05": "NEUTRAL", 
            "2024-10-06": "HAPPY", 
            "2024-10-07": "HAPPY",
            "2024-10-08": "HAPPY"
        };
        // enum 으로 받은 감정을 이모지로 바꿔주는 작업.
        const formattedMoodDates = Object.keys(dummyEmotionsData).reduce((acc, date) => {
            const moodKey = dummyEmotionsData[date];
            const moodOption = moodOptions.find(option => option.key === moodKey);
            acc[date] = moodOption ? moodOption.label : ''; // 이모지로 변환
            return acc;
        }, {});

        setMoodDates(formattedMoodDates); // 이모지로 변환된 감정 데이터 설정
        


        fetchMarkedDates();
        // fetchEmotions();
    }, []);

    const fetchReservations = async (date) => {
        const dummyReservations = [
            {
                reservationId: 5,
                counselorId: 1,
                nickName: "눈누난나",
                counselorName: "김철수",
                comment: "지친다 정말루다가",
                type: "CHAT",
                status: "PENDING",
                date: "2024-10-18",
                startTime: "09:00",
                endTime: "10:50",
            },
            {
                reservationId: 6,
                counselorId: 1,
                nickName: "뉴뉴",
                counselorName: "홍길동",
                comment: "우울해요",
                type: "CALL",
                status: "PENDING",
                date: "2024-10-18",
                startTime: "11:00",
                endTime: "11:50",
            },
        ];

        const filteredReservations = dummyReservations.filter(reservation => reservation.date === date);
        setReservations(filteredReservations);
    };

    const handleDayPress = (day) => {
        if (selectedDate === day.dateString) {
            setSelectedDate('');
            setReservations([]);
        } else {
            setSelectedDate(day.dateString);
            fetchReservations(day.dateString);
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

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <FlatList
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
                        />
                    </View>
                )}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleReservationPress(item.reservationId)} style={styles.itemContainer}>
                        <View style={styles.row}>
                            <View style={styles.timeContainer}>
                                <Text style={styles.timeText}> {formatTime(item.startTime)} </Text>
                                <Text style={styles.timeText}> | </Text>
                                <Text style={styles.timeText}> {formatTime(item.endTime)} </Text>
                            </View>
                            <View style={styles.detailsContainer}>
                                <View style={styles.detailsRow}>
                                    <Text style={styles.nickNameText}>상담자 {item.counselorName}</Text>
                                    <Text style={styles.typeText}> {item.type} </Text>
                                </View>
                                <Text style={styles.commentText}>상담 내용 {item.comment}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            />
            <Modal
                transparent
                visible={modalVisible}
                animationType="slide"
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        {/* 텍스트를 감싸는 View 추가 */}
                        <View style={styles.textContainer}>
                            <Text style={styles.textStyle}>오늘의 기분을 선택하세요</Text>
                        </View>
                        <View style={styles.emotionContainer}>
                            {moodOptions.map((emotion) => (
                                <TouchableOpacity 
                                    key={emotion.key} 
                                    onPress={() => handleEmotionPress(emotion)} 
                                    style={[
                                        styles.emotionButton,
                                        selectedEmotion === emotion.key && { backgroundColor: '#FFD700' } // 선택된 감정 배경색 변경
                                    ]}
                                >
                                    <Text style={styles.emotionText}>{emotion.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
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
    },
    timeContainer: {
        flex: 2,
        padding: 5,
        alignItems: 'center',
        flexDirection: 'column',
    },
    timeText: {
        color: 'black',
        fontSize: 12,
    },
    detailsContainer: {
        backgroundColor: '#001932',
        flex: 7,
        paddingLeft: 10,
        paddingVertical: 3,
        borderRadius: 10,
    },
    detailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
        marginLeft: 5,
        marginRight: 10,
    },
    nickNameText: {
        color: 'white',
        fontSize: 13,
        fontWeight: 'bold',
    },
    typeText: {
        color: 'black',
        fontSize: 11,
        backgroundColor: 'white',
        borderRadius: 10,
        paddingHorizontal: 5,
    },
    commentText: {
        color: 'white',
        marginLeft: 5,
        marginRight: 5,
        marginTop: 5,
        marginBottom: 10,
        fontSize: 12,
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
