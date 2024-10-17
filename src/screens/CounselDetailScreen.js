import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Button, Alert, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import sendGetRequest from '../axios/SendGetRequest';
import sendPostRequest from '../axios/SendPostRequest';  // 추가
import { useAuth } from '../auth/AuthContext';
import sendDeleteRequest from '../axios/DeleteRequest';
import EmptyScreen from './EmptyScreen';
import { Image } from 'react-native-animatable';

const CounselDetailScreen = () => {
    const { state } = useAuth();
    const route = useRoute();
    const navigation = useNavigation();
    const { reservationId, notificationId } = route.params;  // notificationId 추가
    const [reservation, setReservation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedValue, setSelectedValue] = useState("");

    // useEffect(() => {
    //     sendGetRequest({
    //         token: state.token,
    //         endPoint: `/reservations/${reservationId}`,
    //         onSuccess: (data) => {
    //             console.log("data: ", data);
    //             setReservation(data.data);
    //             setLoading(false);

    //             // 알림 읽음 처리
    //             if (notificationId) {
    //                 markNotificationAsRead(notificationId);
    //             }
    //         },
    //         onFailure: () => {
    //             Alert.alert("실패", "예약 정보 조회 실패");
    //             setLoading(false);
    //         }
    //     });
    // }, [reservationId, notificationId]);

    useFocusEffect(
        useCallback(() => {
            sendGetRequest({
                token: state.token,
                endPoint: `/reservations/${reservationId}`,
                onSuccess: (data) => {
                    console.log("reservation data: ", data);
                    setReservation(data.data);
                    setLoading(false);

                    // 알림 읽음 처리
                    if (notificationId) {
                        markNotificationAsRead(notificationId);
                    }
                },
                onFailure: () => {
                    Alert.alert("실패", "예약 정보 조회 실패");
                    setLoading(false);
                }
            });
        }, [reservationId, notificationId])
    );

    // 알림 읽음 처리 함수
    const markNotificationAsRead = (notificationId) => {
        sendPostRequest({
            token: state.token,
            endPoint: `/fcm/${notificationId}/read`,
            onSuccess: () => {
                console.log("알림 읽음 처리 성공");
            },
            onFailure: (error) => {
                console.error("알림 읽음 처리 실패:", error);
            }
        });
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (!reservation) {
        return <EmptyScreen message='상담 정보를 찾을 수 없습니다' />;
    }
    const formatDate = (dateString) => {
        if (!dateString) {
            console.warn("Invalid date string:", dateString);
            return ""; // 기본값 반환 (예: 빈 문자열)
        }

        const dateParts = dateString.split('-');
        const year = dateParts[0].slice(-2); // "2024"에서 "24"를 가져옴
        const month = dateParts[1];
        const day = dateParts[2];

        // Date 객체 생성
        const date = new Date(dateString);
        // 요일 배열
        const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
        // 요일 가져오기
        const dayOfWeek = daysOfWeek[date.getDay()];

        return `${year}.${month}.${day} (${dayOfWeek})`; // "YY.MM.DD (요일)" 형식으로 반환
    };

    const sendDeleteReservationRequest = ({ cancelReason, onSuccess }) => {
        const requestParams = {};
        if (cancelReason !== null) requestParams.cancelReason = cancelReason;

        sendDeleteRequest({
            token: state.token,
            endPoint: `/reservations/${reservationId}`,
            requestParams: requestParams,
            onSuccess: () => {
                if (onSuccess) {
                    onSuccess();
                } else {
                    Alert.alert("성공", "예약 취소 성공!");
                }
                navigation.goBack();
            },
            /* onFailure: () => Alert.alert("실패", "예약 취소 실패!") */
        });
    };

    // 상담 취소 시 사유 받기 
    const handleCancelPress = () => {
        console.log("userType: ", state.usertype);
        // 회원은 취소 사유 필요 없음
        if (state.usertype === "MEMBER") {
            Alert.alert(
                "취소 확인", // 제목
                "예약을 취소하시겠습니까?", // 메시지
                [
                    {
                        text: "아니요",
                        onPress: () => console.log("예약 취소 취소"),
                        style: "cancel"
                    },
                    { text: "예", onPress: () => sendDeleteReservationRequest({ cancelReason: null }) }
                ],
                { cancelable: false } // 백 버튼으로 취소할 수 없게 설정 (Android)
            );
            return;
        }
        setModalVisible(true); // 모달 열기
    };

    // 취소 사유 선택한 후 실행
    const handleConfirmCancellation = () => {
        sendDeleteReservationRequest({
            cancelReason: selectedValue,
            onSuccess: () => {
                // 취소 사유를 처리하는 로직 추가
                Alert.alert("상담 취소", `상담이 취소되었습니다.\n사유: ${selectedValue}`);
                setModalVisible(false);
                setSelectedValue(''); // 입력 필드 초기화
            }
        });
    };

    // 채팅방 열기 핸들러
    const handleOpenChatRoom = () => {
        sendPostRequest({
            token: state.token,
            endPoint: `/chat-rooms/open?memberId=${reservation.memberId}`, // 쿼리 파라미터로 memberId 전달

            onSuccess: (data) => {
                const { roomId } = data;
                let roomStatus;

                sendGetRequest({
                    token: state.token,
                    endPoint: `/chat-rooms/${roomId}`,
                    onSuccess: (data) => {
                        // 채팅방으로 네비게이션
                        console.log("data: ", data.roomStatus);

                        navigation.navigate('ChatRoom', {
                            roomId: roomId,
                            nickname: reservation.memberNickname, // 상담 예약된 멤버 닉네임
                            counselorName: reservation.counselorName,  // 상담사 이름
                            roomStatus: data.roomStatus,
                        });
                    }
                });
            },
            onFailure: (errorStatus, errorMessage) => {
                Alert.alert("실패", `채팅방 열기 실패: ${errorMessage}`);
            }
        });
    };

    // 후에 UserInfo 받아서 처리 할 예정. 
    const userType = state.usertype;

    const getKorGender = (gender) => {
        if (gender === 'MALE') return "남";
        if (gender === "FEMALE") return "여";
        return "기타";
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.infoContainer}>
                <View style={styles.dateContainer}>
                    <View style={styles.dateDetailContainer}>
                        <Text style={styles.subtitle}>상담 날짜</Text>
                        <Text style={styles.dateText}>{formatDate(reservation.date)} {reservation.startTime} - {reservation.endTime}</Text>
                    </View>
                    <Text style={styles.type}>  {reservation.type}  </Text>
                </View>
                <View style={styles.memberContainer}>
                    {userType === 'COUNSELOR' ? (
                        <>
                            <Text style={styles.subtitle}>회원 정보</Text>
                            <View style={styles.memberDetailContainer}>
                                <View style={styles.memberDetail}>
                                    <Text style={styles.memberDetailTitleNickname}>닉네임</Text>
                                    <Text style={styles.memberDetailContent}>{reservation.memberNickname}</Text>
                                    <Text style={styles.memberDetailTitle}>성별</Text>
                                    <Text style={styles.memberDetailContent}>{getKorGender(reservation.memberGender)}</Text>
                                </View>
                                <View style={styles.memberDetail}>
                                    <Text style={styles.memberDetailTitle}>출생년도</Text>
                                    <Text style={styles.memberDetailContent}>{reservation.memberBirthYear}</Text>
                                    <Text style={styles.memberDetailTitle}>점수</Text>
                                    <Text style={styles.memberDetailContent}>{reservation.memberDepressionScore}</Text>
                                </View>
                            </View>
                        </>
                    ) : userType === 'MEMBER' ? (
                        <View style={styles.dateDetailContainer}>
                            <Text style={styles.subtitle}>상담사 </Text>
                            <Text style={styles.nameText}> {reservation.counselorName}</Text>
                        </View>
                    ) : null}
                </View>
                <View style={styles.contentContainer}>
                    <Text style={styles.subtitle}>상담 내용</Text>
                    <Text style={{ marginLeft: 15, fontSize: 16 }}>{reservation.comment}</Text>
                </View>
            </View>
            {userType === 'COUNSELOR' && reservation.status === 'PENDING' ? (
                <View style={styles.pendingButtonContainer}>
                    <TouchableOpacity style={styles.pendingButton} onPress={handleOpenChatRoom}>
                        <Text style={styles.buttonText}>채팅방 열기</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.pendingButton} onPress={handleCancelPress}>
                        <Text style={styles.buttonText}>  상담 취소  </Text>
                    </TouchableOpacity>
                </View>
            ) : userType === 'MEMBER' && reservation.status === 'PENDING' ? (
                <View style={styles.memberPendingButtonContainer}>
                    <TouchableOpacity style={styles.pendingButton} onPress={handleCancelPress}>
                        <Text style={styles.buttonText}>상담 취소</Text>
                    </TouchableOpacity>
                </View>
            ) : reservation.status === "CANCELLED_BY_CLIENT" ? (
                <View style={styles.cancelReasonContainer}>
                    <Text style={styles.subtitle}>취소 내용</Text>
                    <View style={styles.cancelDetailContainer}>
                        <Text style={styles.cencelName}> 취소자 </Text>
                        <Text style={{ fontSize: 15 }}>  회원 </Text>
                    </View>
                </View>
            ) : reservation.status === "CANCELLED_BY_COUNSELOR" ? (
                <View style={styles.cancelReasonContainer}>
                    <Text style={styles.subtitle}>취소 내용</Text>
                    <View style={styles.cancelDetailContainer}>
                        <Text style={styles.cencelName}>취소자 </Text>
                        <Text style={{ fontSize: 15 }}>  상담사 </Text>
                    </View>
                    <View style={styles.cancelDetaiReasonContainer}>
                        <Text style={styles.cencelName}>취소 사유 </Text>
                        <Text style={{ fontSize: 15, marginTop: 10 }}>{reservation.cancelComment}</Text>
                    </View>
                </View>
            ) : (
                <>
                    {/* 후기 섹션 */}
                    <View style={styles.reviewContainer}>
                        <View style={styles.reviewTitle}>
                            <Text style={styles.subtitle}>후기</Text>
                            {!reservation.review ? <View /> :
                                <View style={{ flexDirection: 'row' }}>
                                    <Text>{"⭐".repeat(reservation.review.rating)}</Text>
                                    {Array.from({ length: 5 - reservation.review.rating }, (_, index) => (
                                        <Image
                                            key={index} // 고유 키 지정
                                            source={require('../../assets/images/starGray.png')}
                                            style={{ width: 15, height: 15, marginTop: 3, marginLeft: 2 }} // 왼쪽 여백 추가
                                        />
                                    ))}
                                </View>
                            }
                        </View>
                        {reservation.review && reservation.review.content ? (
                            <View>
                                <Text style={styles.reviewContent}>{reservation.review.content}</Text>
                            </View>
                        ) : (
                            userType === 'MEMBER' && (
                                <View>
                                    <Text style={styles.reviewContent}>후기가 없습니다.</Text>
                                    <TouchableOpacity
                                        style={styles.button}
                                        onPress={() => navigation.navigate('MemberWriteReview', { reservationId: reservation.reservationId })}
                                    >
                                        <Text style={styles.buttonText}>작성하기</Text>
                                    </TouchableOpacity>
                                </View>
                            )
                        )}
                    </View>

                    {/* 상담 리포트 섹션 */}
                    <View style={styles.reportContainer}>
                        <Text style={styles.subtitle}>상담 리포트</Text>
                        {reservation.report && Object.keys(reservation.report).length > 0 ? (
                            <Text>{reservation.report.content}</Text>
                        ) : (
                            userType === 'COUNSELOR' && (
                                <View>
                                    <Text>리포트가 없습니다.</Text>
                                    <TouchableOpacity
                                        style={styles.button}
                                        onPress={() => navigation.navigate('CounselWriteReport', { reservationId: reservation.reservationId })}
                                    >
                                        <Text style={styles.buttonText}>리포트 작성하기</Text>
                                    </TouchableOpacity>
                                </View>
                            )
                        )}
                    </View>
                </>

            )}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>상담을 취소하시겠습니까? </Text>
                        <View style={styles.centeredTextContainer}>
                            <Text>상담일 전날 밤 12시까지만 상담을 취소할 수 있습니다.</Text>
                        </View>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={selectedValue}
                                style={styles.picker}
                                onValueChange={(itemValue) => setSelectedValue(itemValue)}
                            >
                                <Picker.Item label="사유를 선택하세요" value="" />
                                <Picker.Item label="개인적인 사정" value="개인적인 사정" />
                                <Picker.Item label="일정 충돌" value="일정 충돌" />
                                <Picker.Item label="건강 문제" value="건강 문제" />
                                <Picker.Item label="기타" value="기타" />
                            </Picker>
                        </View>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmCancellation}>
                                <Text style={styles.confirmButtonText}>확인</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                                <Text style={styles.cancelButtonText}>취소</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 25,
        backgroundColor: '#fff',
    },
    infoContainer: {
        backgroundColor: '#f7f7f7',
        borderRadius: 8,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000', // 그림자 색상
        shadowOffset: {
            width: 0,
            height: 2, // 수직 방향으로 그림자 이동
        },
        shadowOpacity: 0.1, // 그림자 투명도
        shadowRadius: 4, // 그림자 퍼짐 정도
        elevation: 5, // Android에서의 그림자 깊이
    },
    dateContainer: {
        marginBottom: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dateDetailContainer: {
        flexDirection: 'row',
    },
    memberContainer: {
        marginBottom: 0,
    },
    memberDetailContainer: {
        flexDirection: 'cloum',
        justifyContent: 'space-between',
    },
    memberDetail: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
        marginLeft: 15
    },
    memberDetailTitleNickname: {
        width: 60,
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 15
    },
    memberDetailTitle: {
        width: 60,
        fontWeight: 'bold',
        textAlign: 'right',
        fontSize: 15
    },
    memberDetailContent: {
        width: 90,
        marginLeft: 20,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    dateText: {
        fontSize: 16,
        color: '#333',
        marginHorizontal: 7,
    },
    nameText: {
        fontSize: 16,
        color: '#333',
        marginHorizontal: 10,
    },
    type: {
        color: 'white',
        fontSize: 13,
        backgroundColor: '#778DA9',
        borderRadius: 10,
        marginTop: 2,
        padding: 2,
        marginBottom: 10
    },
    contentContainer: {
        marginTop: 20
    },

    reviewContainer: {
        marginBottom: 20,
        padding: 20,
        borderRadius: 5,
        backgroundColor: '#f7f7f7',
        shadowColor: '#000', // 그림자 색상
        shadowOffset: {
            width: 0,
            height: 2, // 수직 방향으로 그림자 이동
        },
        shadowOpacity: 0.1, // 그림자 투명도
        shadowRadius: 4, // 그림자 퍼짐 정도
        elevation: 5, // Android에서의 그림자 깊이
    },
    reviewTitle: {
        flexDirection: 'row',
        justifyContent: 'space-between',

    },
    reviewContent: {
        marginTop: 5,
        marginRight: 10,
    },
    reportContainer: {
        marginBottom: 50,
        padding: 20,
        borderRadius: 5,
        backgroundColor: '#f7f7f7',
        shadowColor: '#000', // 그림자 색상
        shadowOffset: {
            width: 0,
            height: 2, // 수직 방향으로 그림자 이동
        },
        shadowOpacity: 0.1, // 그림자 투명도
        shadowRadius: 4, // 그림자 퍼짐 정도
        elevation: 5, // Android에서의 그림자 깊이
    },
    subtitle: {
        fontSize: 17,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    cancelReasonContainer: {
        marginBottom: 50,
        padding: 20,
        borderRadius: 5,
        backgroundColor: '#f7f7f7',
        shadowColor: '#000', // 그림자 색상
        shadowOffset: {
            width: 0,
            height: 2, // 수직 방향으로 그림자 이동
        },
        shadowOpacity: 0.1, // 그림자 투명도
        shadowRadius: 4, // 그림자 퍼짐 정도
        elevation: 5, // Android에서의 그림자 깊이
    },
    cancelDetaiReasonContainer: {
        alignItems: 'flex-start',
        marginBottom: 10,
        marginLeft: 10
    },
    cancelDetailContainer: {
        flexDirection: 'row', // 가로 방향 정렬
        alignItems: 'center',
        marginBottom: 10,
        marginLeft: 10
    },
    cencelName: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',

    },
    pendingButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 50
    },
    memberPendingButtonContainer: {
        flexDirection: 'row', // 가로 방향 정렬
        alignItems: 'center', // 세로 방향 중앙 정렬
        justifyContent: 'center', // 가로 방향 중앙 정렬
    },
    pendingButton: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#215D9A',
        borderRadius: 5,
        alignItems: 'center',
    },
    button: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#215D9A',
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // 반투명 배경
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    textInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        width: '100%',
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    centeredTextContainer: {
        alignItems: 'center', // 가운데 정렬
        textAlign: 'center',
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '70%',
    },
    confirmButton: {
        backgroundColor: '#215D9A', // 확인 버튼 색상
        borderRadius: 5,
        padding: 10,
        flex: 1,
        marginRight: 20,
        alignItems: 'center',
    },
    confirmButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    cancelButton: {
        backgroundColor: '#215D9A', // 취소 버튼 색상
        borderRadius: 5,
        padding: 10,
        flex: 1,
        marginLeft: 20,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    pickerContainer: {
        borderWidth: 1, // 테두리 두께
        borderColor: 'lightgray', // 테두리 색상
        borderRadius: 5, // 모서리 둥글기
        overflow: 'hidden', // 모서리 둥글기 효과 적용
        width: '80%', // 너비 설정
        marginBottom: 20
    },
    picker: {
        height: 40, // 높이를 줄임
        width: '100%',
        marginTop: -10,
        marginBottom: 5,
        padding: 0, // 패딩 줄임
    },
});

export default CounselDetailScreen;