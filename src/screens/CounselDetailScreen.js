import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Button, Alert,TouchableOpacity, Modal, TextInput} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRoute, useNavigation } from '@react-navigation/native';
import sendGetRequest from '../axios/SendGetRequest';
import { useAuth } from '../auth/AuthContext';
import sendDeleteRequest from '../axios/DeleteRequest';

const CounselDetailScreen = () => {
    const { state } = useAuth();
    const route = useRoute();
    const navigation = useNavigation();
    const { reservationId } = route.params;
    const [reservation, setReservation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false); 
    const [selectedValue, setSelectedValue] = useState("");

    useEffect(() => {
        sendGetRequest({
            token: state.token,
            endPoint: `/reservations/${reservationId}`,
            onSuccess: (data) => {
                console.log("data: ", data);
                setReservation(data.data);
            },
            onFailure: () => Alert.alert("실패", "예약 정보 조회 실패")
        })
    },[]);

    useEffect(() => {
        const fetchReservationDetails = async () => {
            try {
                // 실제 API 호출 대신 더미 데이터 사용

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
                    review: {
                        content: "오랜 심리적, 인간관계 상의 어려움에 대해 도움을 받고싶어 신청하였습니다.",
                        rating: 4,
                        createdAt: new Date().toISOString(),
                    },
                    report: {
                        content: "최근 직장 내 갈등으로 힘들다고 하셨고...",
                        createdAt: new Date().toISOString(),
                    },
                },
                {
                    reservationId: 2,
                    counselorId: 102,
                    memberNickname: "늄념",
                    counselorName: "이상담사",
                    comment: "지금 제 상황이 너무 힘들고...",
                    type: "CALL",
                    status: "CANCELLED_BY_CLIENT",
                    cancelReason: "일정 변경",
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
                    review: {
                        content: "상담을 통해 많은 도움을 받았습니다.",
                        rating: 5,
                        createdAt: new Date().toISOString(),
                    },
                    report: {
                    },
                },
                {
                    reservationId: 4,
                    counselorId: 104,
                    memberNickname: "유재석",
                    counselorName: "김상담사",
                    comment: "상담을 받고 싶습니다.",
                    type: "CALL",
                    status: "CANCELLED_BY_COUNSELOR",
                    cancelReason: "개인 사정",
                    date: "2024-01-20",
                    startTime: "13:00",
                    endTime: "13:50",
                    price: 50000,
                },
                {
                    reservationId: 5,
                    counselorId: 1,
                    memberNickname: "눈누난나",
                    counselorName: "안상담사",
                    comment: "지친다 정말루다가",
                    type: "CHAT",
                    status: "COMPLETED",
                    date: "2024-10-18",
                    startTime: "09:00",
                    endTime: "10:50",
                    review: {
                    },
                    report: {
                    },
                },
                {
                    reservationId: 6,
                    counselorId: 1,
                    memberNickname: "김철수",
                    counselorName: "고상담사",
                    comment: "우울해요",
                    type: "CALL",
                    status: "COMPLETED",
                    date: "2024-10-18",  
                    startTime: "11:00",
                    endTime: "11:50",
                    review: {
                    },
                    report: {
                    },
                },
            ];

            const selectedReservation = dummyData.find(item => item.reservationId === reservationId);
            setReservation(selectedReservation);
            } catch (error) {
                Alert.alert("오류", "예약 정보를 가져오는 데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchReservationDetails();
    }, [reservationId]);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (!reservation) {
        return <Text>예약 정보를 찾을 수 없습니다.</Text>;
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
    
        return `${month}.${day}`; // "YY.MM.DD" 형식으로 반환
    };

    const sendDeleteReservationRequest = ({ cancelReason, onSuccess }) => {
        const requestParams = {};
        if(cancelReason !== null) requestParams.cancelReason = cancelReason;

        sendDeleteRequest({
            token: state.token,
            endPoint: `/reservations/${reservationId}`,
            requestParams: requestParams,
            onSuccess: () => {
                if(onSuccess){
                    onSuccess();
                }else{
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
        if(state.usertype === "MEMBER") {
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

    // 후에 UserInfo 받아서 처리 할 예정. 
    const userType = state.usertype; 

    const getKorGender = (gender) => {
        if(gender === 'MALE') return "남";
        if(gender === "FEMALE") return "여";
        return "기타";
    }
    
    return (
        <ScrollView style={styles.container}>
            <View style={styles.infoContainer}>
                <View style={styles.dateContainer}>
                    <View style= {styles.dateDetailContainer}>
                        <Text style={styles.subtitle}>상담 날짜</Text>
                        <Text style={styles.dateText}>{formatDate(reservation.date)} {reservation.startTime} - {reservation.endTime}</Text>
                    </View>
                    <Text style={styles.type}>  {reservation.type}  </Text>
                </View>
                <View style={styles.memberContainer}>
                {userType === 'COUNSELOR' ? (
                <>
                    <Text style={styles.subtitle}>내담자 정보</Text>
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
                <View style= {styles.dateDetailContainer}>
                    <Text style={styles.subtitle}>상담사 </Text>
                    <Text style={styles.dateText}> {reservation.counselorName}</Text>
                </View>
            ) : null}
                </View>
                <View style={styles.contentContainer}>
                    <Text style={styles.subtitle}>상담 내용</Text>
                    <Text>{reservation.comment}</Text>
                </View>
            </View>
                {userType === 'COUNSELOR' && reservation.status === 'PENDING' ? (
                    <View style={styles.pendingButtonContainer}>
                        <TouchableOpacity style={styles.pendingButton}>
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
                ) : reservation.status === "CANCELLED_BY_CLIENT" || reservation.status === "CANCELLED_BY_COUNSELOR" ? (
                    <View style={styles.cancelReasonContainer}>
                        <Text style={styles.subtitle}>취소 사유</Text>
                        <Text>{reservation.cancelReason}</Text>
                    </View>
                ) : (
                <>
                    {/* 후기 섹션 */}
                    <View style={styles.reviewContainer}>
                            <View style={styles.reviewTitle}>
                                <Text style={styles.subtitle}>후기</Text>
                                <Text>{"⭐".repeat(reservation.review.rating)}</Text>
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
        marginRight: 10,
        flexDirection: 'row',
    },
    memberDetailTitleNickname:{
        width:60,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingLeft:8
    },
    memberDetailTitle:{
        width:60,
        fontWeight: 'bold',
        textAlign: 'right',
    },
    memberDetailContent:{
        width:60,
        marginLeft:20
    },
    subtitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    dateText: {
        fontSize: 15,
        color: '#333',
        marginHorizontal: 10,
        marginTop: 2
    },
    type: {
        color: 'white',
        fontSize: 13,
        backgroundColor:'#778DA9',
        borderRadius: 10,
        marginTop: 2,
        padding:2,
        marginBottom:10
    },
    contentContainer: {
        marginTop:20
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
    reviewTitle:{
        flexDirection: 'row',
        justifyContent: 'space-between',

    },
    reviewContent: {
        marginTop: 5,
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
    pendingButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal:50
    }, 
    memberPendingButtonContainer: {
        flexDirection: 'row', // 가로 방향 정렬
        alignItems: 'center', // 세로 방향 중앙 정렬
        justifyContent: 'center', // 가로 방향 중앙 정렬
    },
    pendingButton: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#001326',
        borderRadius: 5,
        alignItems: 'center',
    },
    button: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#001326',
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
        backgroundColor: '#3C6894', // 확인 버튼 색상
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
        backgroundColor: '#CA6767', // 취소 버튼 색상
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
        marginBottom:20
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
