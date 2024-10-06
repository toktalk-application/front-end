import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker'; 
import timeLine from '../../../assets/images/timeLine.png'
import { useNavigation } from '@react-navigation/native';

const CounselorCounselScreen = () => {
    const currentDate = new Date();
    const navigation = useNavigation();
    const [reservations, setReservations] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [completedCount, setCompletedCount] = useState(0);

    const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear().toString());
    const [selectedMonth, setSelectedMonth] = useState((currentDate.getMonth() + 1).toString());
    const [sortVisible, setSortVisible] = useState(false);

    useEffect(() => {
        fetchReservations(selectedYear, selectedMonth);
    }, [selectedYear, selectedMonth]); // year와 month가 변경될 때마다 호출

    const fetchReservations = async (year, month) => {
        // try {
        //     const response = await fetch(`https://your-api-url.com/reservations?year=${year}&month=${month}`);
        //     const data = await response.json();
        //     const total = data.filter(reservation => reservation.status === "COMPLETED").reduce((sum, reservation) => sum + reservation.price, 0);
        //     setReservations(data);
        //     setTotalAmount(total);
        //     setCompletedCount(data.filter(reservation => reservation.status === "COMPLETED").length);
        // } catch (error) {
        //     console.error("Error fetching reservations:", error);
        // }
    };

    useEffect(() => {
        // 더미 데이터 생성
        const dummyData = [
            {
                reservationId: 1,
                counselorId: 101,
                memberNickname: "홍길동",
                counselorName: "김상담사",
                comment: "제 고민은 이거고요...",
                type: "CHAT",
                status: "COMPLETED",
                date: "2024-01-17",
                startTime: "09:00",
                endTime: "10:50",
                price: 50000,
            },
            {
                reservationId: 2,
                counselorId: 102,
                memberNickname: "김철수",
                counselorName: "이상담사",
                comment: "지금 제 상황이 너무 힘들고...",
                type: "CALL",
                status: "CANCELLED_BY_CLIENT",
                date: "2024-01-18",
                startTime: "11:00",
                endTime: "11:50",
                price: 50000,
            },
            {
                reservationId: 3,
                counselorId: 103,
                memberNickname: "이영희",
                counselorName: "박상담사",
                comment: "상담을 받고 싶습니다.",
                type: "CHAT",
                status: "COMPLETED",
                date: "2024-01-19",
                startTime: "12:00",
                endTime: "12:50",
                price: 50000,
            },
            {
                reservationId: 4,
                counselorId: 104,
                memberNickname: "유재석",
                counselorName: "김상담사",
                comment: "상담을 받고 싶습니다.",
                type: "CALL",
                status: "CANCELLED_BY_COUNSELOR",
                date: "2024-01-20",
                startTime: "13:00",
                endTime: "13:50",
                price: 50000,
            },
        ];

        // 날짜와 시간으로 정렬
        const sortedReservations = dummyData.sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.startTime}`);
            const dateB = new Date(`${b.date}T${b.startTime}`);
            return dateA - dateB; // 오름차순 정렬
        });

        const completedReservations = sortedReservations.filter(reservation => reservation.status === "COMPLETED");
        const total = completedReservations.reduce((sum, reservation) => sum + reservation.price, 0);

        setReservations(sortedReservations); // 정렬된 예약을 설정
        setTotalAmount(total);
        setCompletedCount(completedReservations.length); 
    }, []);

    const handleReservationPress = (reservationId) => {
        navigation.navigate('CounselDetail', { reservationId });
    };

    return (
        <View style={styles.container}>
            <View style={styles.dropdown}>
                <Picker
                    selectedValue={selectedYear}
                    style={styles.picker}
                    onValueChange={(itemValue) => setSelectedYear(itemValue)}
                >
                    <Picker.Item label={`${currentDate.getFullYear()}년`} value={currentDate.getFullYear().toString()} />
                    <Picker.Item label={`${currentDate.getFullYear() - 1}년`} value={(currentDate.getFullYear() - 1).toString()} />
                </Picker>
                <Picker
                    selectedValue={selectedMonth}
                    style={styles.picker}
                    onValueChange={(itemValue) => setSelectedMonth(itemValue)}
                >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                        <Picker.Item key={month} label={`${month}월`} value={month.toString()} />
                    ))}
                </Picker>
            </View>
            <ScrollView>
            {reservations.map(reservation => (
                <TouchableOpacity
                    key={reservation.reservationId}
                    onPress={() => handleReservationPress(reservation.reservationId)}
                    style={styles.card}
                >
                    <View style={styles.row}>
                        <View style={styles.verticalLine} />
                        <View style={styles.infoContainer}>
                            <View style={styles.dateContainer}>
                                <Text style={styles.dateText}>
                                    {reservation.date} ({new Date(`${reservation.date}T${reservation.startTime}`).toLocaleString('ko-KR', { weekday: 'short' })})
                                </Text>
                                <Text style={styles.timeText}>
                                    {reservation.startTime} - {reservation.endTime}
                                </Text>
                            </View>
                            <View style={styles.contentsContainer}>
                                <View style={styles.detailsFirstContainer}>
                                    <View style={styles.nicknameContainer}> 
                                        <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#3C6894'}}>내담자     </Text>
                                        <Text style={styles.nickname}>{reservation.memberNickname}</Text>
                                    </View>
                                    <Text style={styles.type}>{reservation.type}</Text>
                                </View>
                                <View style={styles.detailsContainer}>
                                    <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#3C6894' }}>상담 내용  </Text>
                                    <Text style={styles.comment}>{reservation.comment}</Text>
                                </View>
                                <View style={styles.divider} />
                                {reservation.status.startsWith('CANCELLED') ? (
                                    <View style={styles.cancelledTextContainer}>
                                        <Text style={styles.cancelledText}>취소</Text>
                                    </View>
                                ) : (
                                    <View style={styles.priceContainer}>
                                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>가격</Text>
                                        <Text style={styles.price}>{reservation.price.toLocaleString()} 원</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            ))}
            </ScrollView>
            <View style={styles.totalAmountContainer}>
                <View style={styles.totalAmountTitle}>
                    <Text style={styles.totalAmount}>총 매출액 </Text>
                    <Text style= {{ marginTop:3}}> {completedCount} 건 </Text>
                </View>
                <Text style={{ fontSize: 16}} >{totalAmount.toLocaleString()} 원</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor:'white'
    },
    dropdown: {
        flexDirection: 'row', // 가로 방향으로 정렬
        justifyContent: 'flex-start', // 아이템 사이의 간격 조정
    },
    picker: {
        height: 20,
        width: '40%', // 두 Picker가 가로로 배치되도록 일부 너비 설정
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    card: {
        padding: 15,
        borderRadius: 10,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    verticalLine: {
        width: 1,
        backgroundColor: '#001326', // 세로 줄 색상
        height: '100%', // 필요에 따라 조정
        marginRight: 10,
    },
    infoContainer: {
        flex: 1,
        marginLeft: 5,
    },
    dateContainer: {
        flexDirection: 'row', // 가로 방향으로 정렬
        alignItems: 'center', // 세로 방향 정렬
        marginBottom: 10
    },
    dateText: {
        fontSize: 15,
        marginRight: 10, // 날짜와 시간 사이 간격 조정
        color: '#001F3F', // 날짜 색상
        fontWeight: 'bold',
    },
    timeText: {
        fontSize: 14,
        color: '#333', // 시간 색상
        marginTop:3
    },
    contentsContainer: {
        backgroundColor: '#f7f7f7', // 색상 수정
        padding: 10,
        borderRadius: 5,
        shadowColor: '#000', // 그림자 색상
        shadowOffset: {
            width: 0,
            height: 2, // 수직 방향으로 그림자 이동
        },
        shadowOpacity: 0.1, // 그림자 투명도
        shadowRadius: 4, // 그림자 퍼짐 정도
        elevation: 5, // Android에서의 그림자 깊이
    },
    detailsContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    detailsFirstContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    nicknameContainer:{
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    nickname: {
        fontSize: 14,
        marginLeft: 10
    },
    comment: {
        fontSize: 14,
        color: '#555',
        marginBottom: 5,
        marginLeft:5
    },
    priceContainer:{
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    price: {
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'right',
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#ccc',
    },
    totalAmountContainer:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        margin:10
    },
    totalAmountTitle: {
        flexDirection: 'row',
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'right',
    },
    type: {
        color: 'white',
        fontSize: 11,
        backgroundColor:'#778DA9',
        borderRadius: 9,
        paddingHorizontal:6,
        paddingTop:2
    },
    cancelledTextContainer: {
        flexDirection: 'row', // 가로 방향으로 정렬
        justifyContent: 'flex-end', // 우측 정렬
    },
    cancelledText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#CA6767', // 취소 텍스트 색상
    },
});

export default CounselorCounselScreen;
