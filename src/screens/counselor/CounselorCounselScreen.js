import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import timeLine from '../../../assets/images/timeLine.png'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import sendGetRequest from '../../axios/SendGetRequest';
import { useAuth } from '../../auth/AuthContext';
import EmptyScreen from '../EmptyScreen';

const CounselorCounselScreen = () => {
    const { state } = useAuth();
    const currentDate = new Date();
    const navigation = useNavigation();
    const [reservations, setReservations] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [completedCount, setCompletedCount] = useState(0);

    const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear().toString());
    const [selectedMonth, setSelectedMonth] = useState((currentDate.getMonth() + 1).toString());
    const [sortVisible, setSortVisible] = useState(false);

    const [isLoading, setIsLoading] = useState(true);

    // useEffect(() => {
    //     sendGetRequest({
    //         token: state.token,
    //         endPoint: `/reservations/${state.identifier}/monthly-detail`,
    //         requestParams: {
    //             month: selectedYear + "-" + selectedMonth.padStart(2, '0') // 월 형식을 9 -> 09와 같이 변환
    //         },
    //         onSuccess: (data) => {
    //             console.log("data: ", data);

    //             // 날짜와 시간으로 정렬
    //             const sortedReservations = data.data.sort((a, b) => {
    //                 const dateA = new Date(`${a.date}T${a.startTime}`);
    //                 const dateB = new Date(`${b.date}T${b.startTime}`);
    //                 return dateA - dateB; // 오름차순 정렬
    //             });

    //             const completedReservations = sortedReservations.filter(reservation => !reservation.status.includes("CANCELLED"));
    //             const total = completedReservations.reduce((sum, reservation) => sum + reservation.fee, 0);

    //             setReservations(sortedReservations); // 정렬된 예약을 설정
    //             setTotalAmount(total);
    //             setCompletedCount(completedReservations.length);

    //             setIsLoading(false);
    //         },
    //         /* onFailure: () => Alert.alert("실패", "내 특정월 상담 목록 조회 실패!") */
    //     }, [selectedMonth, selectedYear]);

    //     fetchReservations(selectedYear, selectedMonth);
    // }, [selectedYear, selectedMonth]); // year와 month가 변경될 때마다 호출

    useFocusEffect(
        useCallback(() => {
            sendGetRequest({
                token: state.token,
                endPoint: `/reservations/${state.identifier}/monthly-detail`,
                requestParams: {
                    month: selectedYear + "-" + selectedMonth.padStart(2, '0') // 월 형식을 9 -> 09와 같이 변환
                },
                onSuccess: (data) => {
                    console.log("data: ", data);

                    // 날짜와 시간으로 정렬
                    const sortedReservations = data.data.sort((a, b) => {
                        const dateA = new Date(`${a.date}T${a.startTime}`);
                        const dateB = new Date(`${b.date}T${b.startTime}`);
                        return dateA - dateB; // 오름차순 정렬
                    });

                    const completedReservations = sortedReservations.filter(reservation => !reservation.status.includes("CANCELLED"));
                    const total = completedReservations.reduce((sum, reservation) => sum + reservation.fee, 0);

                    setReservations(sortedReservations); // 정렬된 예약을 설정
                    setTotalAmount(total);
                    setCompletedCount(completedReservations.length);

                    setIsLoading(false);
                },
                /* onFailure: () => Alert.alert("실패", "내 특정월 상담 목록 조회 실패!") */
            }, [selectedMonth, selectedYear]);

            fetchReservations(selectedYear, selectedMonth);
        }, [selectedYear, selectedMonth])
    );

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
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
                {isLoading ? <View> </View> : reservations.length === 0 ? 
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <EmptyScreen message="상담 내역이 없습니다" />
                        </View> : reservations.map(reservation => (
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
                                            <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#3C6894' }}>내담자     </Text>
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
                                            <Text style={styles.cancelledText}>취소됨</Text>
                                        </View>
                                    ) : (
                                        <View style={styles.priceContainer}>
                                            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>가격</Text>
                                            <Text style={styles.price}>{reservation.fee.toLocaleString()} 원</Text>
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
                    <Text style={{ marginTop: 3 }}> {completedCount} 건 </Text>
                </View>
                <Text style={{ fontSize: 16 }} >{totalAmount.toLocaleString()} 원</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: 'white'
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
        marginTop: 3
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
    nicknameContainer: {
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
        marginLeft: 5
    },
    priceContainer: {
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
    totalAmountContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        margin: 10
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
        backgroundColor: '#778DA9',
        borderRadius: 9,
        paddingHorizontal: 6,
        paddingTop: 2
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
