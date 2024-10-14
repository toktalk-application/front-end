import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import sendPatchRequest from '../../axios/PatchRequest';
import { useAuth } from '../../auth/AuthContext';
import sendGetRequest from '../../axios/SendGetRequest';
import { useNavigation } from '@react-navigation/native';
import sendPostRequest from '../../axios/SendPostRequest';


function CounselorEditScreen() {
    const { state } = useAuth();
    const navigation = useNavigation();
    const [profileImage, setProfileImage] = useState(null);
    const [introduction, setIntroduction] = useState(''); // 자기 소개
    const [expertise, setExpertise] = useState(''); // 전문 분야
    const [sessionDescription, setSessionDescription] = useState(''); // 상담 세션 설명
    const [isLoading, setIsLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        sendGetRequest({
            token: state.token,
            endPoint: `/counselors/${state.identifier}`,
            onSuccess: (data) => {
                /* console.log("data: ", data); */
                setProfileImage(data.data.profileImage);
                setIntroduction(data.data.introduction);
                setExpertise(data.data.expertise);
                setSessionDescription(data.data.sessionDescription);
            },
            /* onFailure: () => Alert.alert("실패!", "내 정보 GET 요청 실패") */
        });
    }, []);


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

                // 이미지 업로드 (S3로 업로드)
                const formData = new FormData();
                formData.append('file', {
                    uri: uri,
                    type: 'image/jpeg',
                    name: `image_${state.identifier}.jpg`,
                });
                console.log(uri);
                setProfileImage(uri);

                const uploadResponse = await fetch('http://10.0.2.2:8080/counselors/upload-image', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Authorization': `Bearer ${state.token}`,
                    },
                });
                
                const responseText = await uploadResponse.text(); // 응답 내용을 텍스트로 가져옵니다
                console.log("서버 응답:", responseText); // 응답 내용을 로그로 출력합니다
                
                    let result;
                
                    // 응답 상태가 2xx일 경우에만 JSON으로 파싱 시도
                    if (uploadResponse.ok) {
                    } else {
                        // 에러 상태일 경우
                        Alert.alert('실패', '이미지 업로드에 실패했습니다.');
                        console.error('서버에서 반환한 오류:', responseText);
                    }
            }
        });
    };
    


    const handleSubmit = async () => {
        const data = {
            profileImage: profileImage ? profileImage : null,
        };

        if (introduction) data.introduction = introduction;
        if (expertise) data.expertise = expertise;
        if (sessionDescription) data.sessionDescription = sessionDescription;

        /* console.log(data); */
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
            {/* 프로필 이미지 표시 */}
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
                <Text style={styles.sectionDescription}>- 자신이 어떤 상담사인지 한 줄로 설명해 주세요.</Text>
                <TextInput style={styles.input} placeholder= {isLoading ? "입력해주세요" : introduction}
                    value={introduction}
                    onChangeText={setIntroduction} />
            </View>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>전문 분야 소개</Text>
                <Text style={styles.sectionDescription}>- 자신의 전문 분야와 강점을 소개해주세요.</Text>
                <TextInput style={styles.bingInput} placeholder="입력해주세요" multiline numberOfLines={4} textAlignVertical="top"
                    value={expertise}
                    onChangeText={setExpertise} />
            </View>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>상담 세션 소개</Text>
                <Text style={styles.sectionDescription}>- 상담이 어떻게 진행되는지 구체적으로 설명해주세요.</Text>
                <Text style={styles.sectionDescription}>- 상담을 통해 얻을 수 있는 긍정적인 변화나 기대할 수 있는 효과를 구체적으로 적어주세요.</Text>
                <TextInput style={styles.bigInput} placeholder="입력해주세요" multiline numberOfLines={4} textAlignVertical="top"
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
    sectionDescription: {
        fontSize: 13,
        marginBottom: 5,
        color: '#555',
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
