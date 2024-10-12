import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import sendPatchRequest from '../../axios/PatchRequest';
import { useAuth } from '../../auth/AuthContext';
import sendGetRequest from '../../axios/SendGetRequest';
import { useNavigation } from '@react-navigation/native';

function CounselorEditScreen() {
    const { state } = useAuth();
    const navigation = useNavigation();
    const [profileImage, setProfileImage] = useState(null);
    const [introduction, setIntroduction] = useState(''); // 자기 소개
    const [expertise, setExpertise] = useState(''); // 전문 분야
    const [sessionDescription, setSessionDescription] = useState(''); // 상담 세션 설명
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        sendGetRequest({
            token: state.token,
            endPoint: `/counselors/${state.identifier}`,
            onSuccess: (data) => {
                /* console.log("data: ", data); */
                setIntroduction(data.data.introduction);
                setExpertise(data.data.expertise);
                setSessionDescription(data.data.sessionDescription);
            },
            onFailure: () => Alert.alert("실패!", "내 정보 GET 요청 실패")
        });
    }, []);

    const selectImage = async () => {
        const options = {
            mediaType: 'photo',
            includeBase64: false,
        };

        try {
            const response = await launchImageLibrary(options);

            if (response.didCancel) {
                console.log('사용자가 이미지를 선택하지 않았습니다.');
            } else if (response.errorCode) {
                console.log('이미지 선택 오류:', response.errorMessage);
            } else if (response.assets) {
                const source = { uri: response.assets[0].uri };
                setProfileImage(source);
            }
        } catch (error) {
            console.error('이미지 선택 중 오류 발생:', error);
        }
    };

    const handleSubmit = async () => {
        const data = {
            profileImage: profileImage ? profileImage.uri : null,
        };

        if (introduction) data.introduction = introduction;
        if (expertise) data.expertise = expertise;
        if (sessionDescription) data.sessionDescription = sessionDescription;

        /* console.log(data); */

        sendPatchRequest({
            token: state.token,
            endPoint: "/counselors",
            requestBody: data,
            onSuccess: () => {
                navigation.navigate("프로필 관리");
            },
            onFailure: () => Alert.alert("수정 실패", "실패!")
        });
    };

    return (
        <ScrollView style={styles.container}>
            {/* 프로필 이미지 표시 */}
            <View style={styles.imageContainer}>
                {profileImage ? (
                    <Image source={profileImage} style={styles.image} />
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
