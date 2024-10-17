import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import timeLine from '../../../assets/images/timeLine.png'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import sendGetRequest from '../../axios/SendGetRequest';
import { useAuth } from '../../auth/AuthContext';
import EmptyScreen from '../EmptyScreen';
import LoadingScreen from '../LoadingScreen';

const MemberReservationScreen = () => {
    const { state } = useAuth();
    const currentDate = new Date(new Date().getTime() + 9 * 60 * 60 * 1000);
    const navigation = useNavigation();
    const [reservations, setReservations] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [completedCount, setCompletedCount] = useState(0);

    const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear().toString());
    const [selectedMonth, setSelectedMonth] = useState((currentDate.getMonth() + 1).toString());
    const [sortVisible, setSortVisible] = useState(false);

    const [isLoading, setIsLoading] = useState(true);
    const [filteredBy, setFilteredBy] = useState('ALL');

    // useEffect(() => {
    //     sendGetRequest({
    //         token: state.token,
    //         endPoint: "/reservations/monthly-detail",
    //         requestParams: {
    //             month: selectedYear + '-' + String(selectedMonth).padStart(2, '0') // 월 형식을 9 -> 09 와 같이 변환
    //         },
    //         onSuccess: (data) => {
    //             console.log("reservations: ", data);
    //             const completedReservations = data.data.filter(reservation => reservation.status !== "CANCELLED");
    //             const total = completedReservations.reduce((sum, reservation) => sum + reservation.fee, 0);
    //             setReservations(data.data);
    //             setCompletedCount(completedReservations.length || 0);
    //             setTotalAmount(total);
    //             setIsLoading(false);
    //         },
    //         /* onFailure: () => Alert.alert("실패", "내 특정월 상담 목록 조회 실패") */
    //     })
    // }, [selectedMonth, selectedYear]);

    useFocusEffect(
        useCallback(() => {
            sendGetRequest({
                token: state.token,
                endPoint: "/reservations/monthly-detail",
                requestParams: {
                    month: selectedYear + '-' + String(selectedMonth).padStart(2, '0'), // 월 형식을 9 -> 09 와 같이 변환
                    status: filteredBy,
                },
                onSuccess: (data) => {
                    const completedReservations = data.data.filter(reservation => reservation.status !== "CANCELLED_BY_CLIENT" && reservation.status !== "CANCELLED_BY_COUNSELOR");
                    const total = completedReservations.reduce((sum, reservation) => sum + reservation.fee, 0);
                    setReservations(data.data);
                    setCompletedCount(completedReservations.length || 0);
                    setTotalAmount(total);
                    setIsLoading(false);
                },
                /* onFailure: () => Alert.alert("실패", "내 특정월 상담 목록 조회 실패") */
            })
        }, [selectedMonth, selectedYear, filteredBy])
    );

    const handleReservationPress = (reservationId) => {
        navigation.navigate('CounselDetail', { reservationId });
    };

    return (
        <View style={styles.container}>
            <View style={styles.dropdown}>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={selectedYear}
                        style={styles.picker}
                        onValueChange={(itemValue) => setSelectedYear(itemValue)}
                    >
                        <Picker.Item label={`${currentDate.getFullYear()}년`} value={currentDate.getFullYear().toString()} />
                        <Picker.Item label={`${currentDate.getFullYear() - 1}년`} value={(currentDate.getFullYear() - 1).toString()} />
                    </Picker>
                </View>
                <View style={styles.pickerContainer}>
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
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={filteredBy}
                        style={styles.picker}
                        onValueChange={(itemValue) => setFilteredBy(itemValue)}
                    >
                        <Picker.Item key={'ALL'} label='전체' value={'ALL'}/>
                        <Picker.Item key={'PENDING'} label='상담 대기중' value={'PENDING'}/>
                        <Picker.Item key={'CANCELLED'} label='취소됨' value={'CANCELLED'}/>
                        <Picker.Item key={'COMPLETED'} label='상담 완료' value={'COMPLETED'}/>
                    </Picker>
                </View>
            </View>
            <ScrollView>
                {isLoading ? <LoadingScreen message={'상담 예약 정보를 불러오는 중입니다..'} /> : reservations.length === 0 ?
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <EmptyScreen message="상담 예약 내역이 없습니다" />
                    </View> : reservations.map(reservation => (
                        <TouchableOpacity
                            key={reservation.reservationId}
                            onPress={() => handleReservationPress(reservation.reservationId)}
                            style={styles.card}
                        >
                            <View style={styles.row}>
                                <View style={styles.verticalLine} />
                                <View style={styles.infoContainer}>
                                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                        <View style={styles.dateContainer}>
                                            <Text style={styles.dateText}>
                                                {reservation.date} ({new Date(`${reservation.date}T${reservation.startTime}`).toLocaleString('ko-KR', { weekday: 'short' })})
                                            </Text>
                                            <Text style={styles.timeText}>
                                                {reservation.startTime} - {reservation.endTime}
                                            </Text>
                                        </View>
                                        {reservation.status.includes('CANCELLED') ? <Text style={styles.cancelledText}>취소됨</Text> :
                                        reservation.status.includes("PENDING") ? <Text style={{color: '#215D9A', fontWeight: 'bold', marginRight: 5}}>상담 대기중</Text> : 
                                        <Text style={{color: 'grey', fontWeight: 'bold', marginRight: 5}}>상담 완료</Text>}
                                    </View>
                                    <View style={styles.contentsContainer}>
                                        <View style={styles.detailsFirstContainer}>
                                            <View style={styles.nicknameContainer}>
                                                <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#3C6894' }}>상담사    </Text>
                                                <Text style={styles.nickname}>{reservation.counselorName}</Text>
                                            </View>
                                            <Text style={styles.type}>{reservation.type}</Text>
                                        </View>
                                        <View style={styles.detailsContainer}>
                                            <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#3C6894' }}>상담 내용  </Text>
                                            <Text style={styles.comment} numberOfLines={1} ellipsizeMode="tail">{reservation.comment}</Text>
                                        </View>
                                        <View style={styles.divider} />
                                        <View style={styles.priceContainer}>
                                            <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 5 }}>가격</Text>
                                            <Text style={styles.price}>{reservation.fee.toLocaleString()} 원</Text>
                                        </View>
                                        {/* {reservation.status.startsWith('CANCELLED') ? (
                                            <View style={styles.cancelledTextContainer}>
                                                <Text style={styles.cancelledText}>취소됨</Text>
                                            </View>
                                        ) : (
                                            <View style={styles.priceContainer}>
                                                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>가격</Text>
                                                <Text style={styles.price}>{reservation.fee.toLocaleString()} 원</Text>
                                            </View>
                                        )} */}
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
            </ScrollView>
            <View style={styles.totalAmountContainer}>
                <View style={styles.totalAmountTitle}>
                    <Text style={styles.totalAmount}>총 결제 금액 </Text>
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
        justifyContent: 'space-between', // 아이템 사이의 간격 조정

    },
    pickerContainer: {
        backgroundColor: '#fff', // 배경색
        width: '30%', // 너비 설정
        borderRadius: 10, // 둥근 테두리
        borderWidth: 1, // 테두리 두께
        borderColor: '#ccc', // 테두리 색
        shadowColor: '#000', // 그림자 색
        shadowOffset: {
            width: 0,
            height: 2, // 그림자 수직 위치
        },
        shadowOpacity: 0.1, // 그림자 투명도
        shadowRadius: 4, // 그림자 크기
        elevation: 2, // 안드로이드에서 그림자 효과
        marginTop: 5,
        marginLeft: 5,
        marginRight: 5
    },
    picker: {
        height: 50, // 높이 설정
        width: '100%', // 너비 설정
        marginTop: -8,
        marginLeft: 5
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
        marginTop: 5,
    },
    detailsFirstContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5
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
        marginLeft: 5,
        marginRight: 70
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
        marginTop: 5,
        marginBottom: 5,
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
        backgroundColor: '#215D9A',
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
        marginRight: 5,
    },
});

export default MemberReservationScreen;

