import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import sendPatchRequest from '../../axios/PatchRequest';
import { useAuth } from '../../auth/AuthContext';
import sendGetRequest from '../../axios/SendGetRequest';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

function CounselorEditScreen() {
    const { state } = useAuth();
    const navigation = useNavigation();
    const [profileImage, setProfileImage] = useState(null);
    const [initialProfileImage, setInitialProfileImage] = useState(null); // 초기 이미지 상태
    const [introduction, setIntroduction] = useState('');
    const [initialIntroduction, setInitialIntroduction] = useState(''); // 초기 자기소개 상태
    const [expertise, setExpertise] = useState('');
    const [initialExpertise, setInitialExpertise] = useState(''); // 초기 전문 분야 상태
    const [sessionDescription, setSessionDescription] = useState('');
    const [initialSessionDescription, setInitialSessionDescription] = useState(''); // 초기 상담 세션 설명 상태
    const [isLoading, setIsLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            sendGetRequest({
                token: state.token,
                endPoint: `/counselors/${state.identifier}`,
                onSuccess: (data) => {
                    setProfileImage(data.data.profileImage);
                    setInitialProfileImage(data.data.profileImage); // 초기 이미지 저장
                    setIntroduction(data.data.introduction);
                    setInitialIntroduction(data.data.introduction); // 초기 자기소개 저장
                    setExpertise(data.data.expertise);
                    setInitialExpertise(data.data.expertise); // 초기 전문 분야 저장
                    setSessionDescription(data.data.sessionDescription);
                    setInitialSessionDescription(data.data.sessionDescription); // 초기 상담 세션 설명 저장
                    setIsLoading(false);
                },
                /* onFailure: () => Alert.alert("실패!", "내 정보 GET 요청 실패") */
            });
        }, [])
    );

    // 이미지 선택 및 S3에 업로드하는 함수
    const selectImage = () => {
        const options = {
            mediaType: 'photo',
            maxWidth: 600,
            maxHeight: 600,
            quality: 1,
        };

        launchImageLibrary(options, async (response) => {
            if (response.didCancel) {
                Alert.alert('알림', '이미지 선택이 취소되었습니다.');
            } else if (response.errorMessage) {
                Alert.alert('에러', '이미지를 선택하는 중 오류가 발생했습니다.');
            } else {
                const uri = response.assets[0].uri;
                setProfileImage(uri);
            }
        });
    };

    const handleSubmit = async () => {
        const data = {
            profileImage: profileImage ? profileImage : null,
            introduction,
            expertise,
            sessionDescription,
        };
        if (!introduction || !expertise || !sessionDescription) {
            Alert.alert("알림", "모든 필드를 채워주세요."); // 필드가 비어있을 경우 경고
            return;
        }

        if (!profileImage) {
            Alert.alert("알림", "사진을 등록해주세요"); // 필드가 비어있을 경우 경고
            return;
        }

        // 변경된 내용 체크
        if (
            profileImage === initialProfileImage &&
            introduction === initialIntroduction &&
            expertise === initialExpertise &&
            sessionDescription === initialSessionDescription
        ) {
            Alert.alert("알림", "수정된 내용이 없습니다."); // 수정된 내용이 없을 경우
            return;
        }

        try {
            await sendPatchRequest({
                token: state.token,
                endPoint: "/counselors",
                requestBody: data,
                onSuccess: () => {
                    navigation.navigate("프로필 관리");
                },
                onFailure: () => Alert.alert("수정 실패", "실패!")
            });
        } catch (error) {
            Alert.alert("업로드 실패", "이미지 업로드에 실패했습니다.");
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.imageContainer}>
                {profileImage ? (
                    <Image source={{ uri: profileImage }} style={styles.image} />
                ) : (
                    <Image source={{ uri: 'https://via.placeholder.com/120' }} style={styles.image} />
                )}
                <TouchableOpacity onPress={selectImage}>
                    <Text style={styles.albumButton}>앨범에서 사진 선택</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>자기 소개</Text>
                <TextInput
                    style={styles.input}
                    placeholder="입력해주세요"
                    value={introduction}
                    onChangeText={setIntroduction} />
            </View>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>전문 분야 소개</Text>
                <TextInput
                    style={styles.bingInput}
                    placeholder="입력해주세요"
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    value={expertise}
                    onChangeText={setExpertise} />
            </View>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>상담 세션 소개</Text>
                <TextInput
                    style={styles.bigInput}
                    placeholder="입력해주세요"
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    value={sessionDescription}
                    onChangeText={setSessionDescription} />
            </View>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>수정 완료</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 2,
        borderColor: '#d3d3d3',
    },
    albumButton: {
        marginTop: 10,
        padding: 7,
        backgroundColor: '#f0c14b',
        borderRadius: 5,
        fontSize: 12,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    section: {
        marginBottom: 10,
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    bingInput: {
        height: 80,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    bigInput: {
        height: 120,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    submitButton: {
        marginTop: 10,
        marginBottom: 40,
        padding: 10,
        backgroundColor: '#001326',
        borderRadius: 5,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default CounselorEditScreen;
