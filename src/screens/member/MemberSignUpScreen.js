import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import CustomDatePicker from '../../components/CustomDatePicker'; 
import CheckBox from '@react-native-community/checkbox';
import {REACT_APP_API_URL} from '@env';
import axios from 'axios';


function MemberSignUpScreen() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [gender, setGender] = useState('');
  const [genderLabel, setGenderLabel] = useState('성별 선택');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [allAccepted, setAllAccepted] = useState(false);
  const [birthDate, setBirthDate] = useState(new Date()); 
  const [open, setOpen] = useState(false); 

  // 유효성 검증. 빨간 줄 올라오기. 
  const [userIdError, setUserIdError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [nicknameError, setNicknameError] = useState('');


  // 본인인증 관련 상태. 
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [residentNumber1, setResidentNumber1] = useState('');
  const [residentNumber2, setResidentNumber2] = useState('');
  const [carrier, setCarrier] = useState('');

  const validateUserId = (input) => {
    const userIdPattern = /^[a-zA-Z0-9]{4,20}$/;
    if (!userIdPattern.test(input)) {
      setUserIdError('영문 또는 숫자로만 입력해야 합니다. (4~20자)');
    } else {
      setUserIdError(''); // 오류 메시지 초기화
    }
    setUserId(input);
  };

  const validatePassword = (input) => {
    const passwordPattern = /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?=\S+$).{10,20}/;
    if (!passwordPattern.test(input)) {
      setPasswordError('영문 대소문자와 숫자, 특수문자를 포함하여 입력해야 합니다. (10~20자)' );
    } else {
      setPasswordError(''); // 오류 메시지 초기화
    }
    setPassword(input); // 비밀번호 상태 업데이트
  };

  const validateConfirmPassword = (input) => {
    if (input !== password) {
      setConfirmPasswordError('비밀번호가 일치하지 않습니다.');
    } else {
      setConfirmPasswordError('');
    }
    setConfirmPassword(input);
  };

  const validateNickname = (input) => {
    const nicknamePattern = /^[ㄱ-ㅎ가-힣a-zA-Z0-9]{2,10}$/
    if (!nicknamePattern.test(input)) {
      setNicknameError('닉네임은 영문 및 한글 또는 숫자로만 입력해야 합니다. (2~10자)');
    } else {
      setNicknameError('');
    }
    setNickname(input);
  };

  const checkUsernameAvailability = () => {
    Alert.alert('중복 확인', '아이디 중복 확인 로직을 여기에 구현합니다.');
  };

  const checkNicknameAvailability = () => {
    Alert.alert('중복 확인', '닉네임 중복 확인 로직을 여기에 구현합니다.');
  };

  const handleSignUp = async () => {
    if (!userId || !password || !confirmPassword || !nickname || !birthDate || !gender) {
      Alert.alert('오류', '모든 필드를 입력해주세요.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('오류', '비밀번호가 일치하지 않습니다.');
      return;
    }
    const signUpData = {
      userId,
      password,
      nickname,
      birth: birthDate.toISOString().split('T')[0], // YYYY-MM-DD 형식으로 변환
      gender: gender === 'MALE' ? 'MALE' : 'FEMALE', // 성별 처리
    };

    if (!termsAccepted || !privacyAccepted) {
      Alert.alert('오류', '필수 약관에 동의해야 합니다.');
      return;
    }
    try {
      const response = await axios.post(`${REACT_APP_API_URL}/members`, signUpData);
      console.log('회원가입 성공:', response.data);
      Alert.alert('회원가입 완료', '회원가입이 성공적으로 완료되었습니다!');
      
      // 입력 필드 초기화
      setUserId('');
      setPassword('');
      setConfirmPassword('');
      setNickname('');
      setPhoneNumber('');
      setVerificationCode('');
      setGender('');
      setGenderLabel('성별 선택');
      setTermsAccepted(false);
      setPrivacyAccepted(false);
      setAllAccepted(false); 
      setName('');
      setResidentNumber1('');
      setResidentNumber2('');
      setCarrier('');
      setBirthDate(new Date()); // birthDate 초기화
      setUserIdError('');
      setPasswordError('');
      setConfirmPasswordError('');
      setNicknameError('');
    } catch (error) {
      console.error('회원가입 실패:', error);
      Alert.alert('오류', '회원가입에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  const handleCertification = () => {
    // 모든 필드가 입력되었는지 확인
    if (!name || !phoneNumber || !carrier) {
      Alert.alert('오류', '모든 본인 인증 필드를 입력해주세요.');
      return;
    }
  
    // 인증 로직 구현
    Alert.alert('인증 진행', '인증 로직을 구현할 예정입니다.');
  };
  
  const toggleAllAccepted = () => {
    setAllAccepted(!allAccepted);
    setTermsAccepted(!allAccepted);
    setPrivacyAccepted(!allAccepted);
  };


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.sectionContainer}>
        <View style={{ height : 105 }}>
          <Text style={styles.title}>계정정보</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="아이디를 입력해주세요"
                value={userId}
                onChangeText={validateUserId}
              />
              <TouchableOpacity style={styles.checkButton} onPress={checkUsernameAvailability}>
                <Text style={styles.checkButtonText}>중복 확인</Text>
              </TouchableOpacity>
            </View>
            {userIdError ? ( // 오류 메시지 표시
                <Text style={styles.errorText}>{userIdError}</Text>
              ) : null}
        </View>
        <View style={{ height : 65 }}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="비밀번호를 입력해주세요"
              value={password}
              onChangeText={validatePassword}
              secureTextEntry
            />
          </View>
          {passwordError ? ( // 오류 메시지 표시
                <Text style={styles.errorText}>{passwordError}</Text>
              ) : null}
        </View>
        <View style={{ height : 65 }}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="비밀번호 재확인"
              value={confirmPassword}
              onChangeText={validateConfirmPassword} 
              secureTextEntry
            />
          </View>
          {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
        </View>
        <View style={{ height : 65 }}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="닉네임을 입력해주세요"
              value={nickname}
              onChangeText={validateNickname}
              keyboardType="default"
            />
            <TouchableOpacity style={styles.checkButton} onPress={checkNicknameAvailability}>
              <Text style={styles.checkButtonText}>중복 확인</Text>
            </TouchableOpacity>
          </View>
          {nicknameError ? <Text style={styles.errorText}>{nicknameError}</Text> : null}
        </View>
        <View style={{ height : 65 }}>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={gender}
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) => {
                setGender(itemValue);
                setGenderLabel(itemIndex === 0 ? '성별 선택' : itemValue);
              }}
            >
              <Picker.Item label="성별 선택" value="" />
              <Picker.Item label="여자" value="FEMALE" />
              <Picker.Item label="남자" value="MALE" />
              <Picker.Item label="기타" value="ETC" />
            </Picker>
          </View>
        </View>
        <View style={{ width : '100%' }}>
          <View style={styles.datePickerContainer}>
            <CustomDatePicker style={styles.datePicker} birthDate={birthDate} setBirthDate={setBirthDate} />
          </View>
        </View>
      </View>
      <View style={styles.sectionContainer}>
        <Text style={styles.title}>본인 인증</Text>
        <View style={{ height : 65 }}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="이름을 입력해주세요"
              value={name}
              onChangeText={setName}
            />
          </View>
        </View>
        <View style={{ height : 65 }}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="전화번호를 입력해주세요"
              value={password}
              onChangeText={setPassword}
            />
          </View>
        </View>
        <View style={styles.rnInputContainer}>
          <TextInput
            style={styles.rninput}
            placeholder="주민등록번호 앞자리"
            value={residentNumber1}
            onChangeText={setResidentNumber1}
            keyboardType="number-pad"
          />
        <View>
          <Text style={{ fontSize: 30, alignSelf: 'center', }}> - </Text> 
          </View>
          <TextInput
            style={styles.rninput}
            placeholder="주민등록번호 뒷자리"
            value={residentNumber2}
            onChangeText={setResidentNumber2}
            secureTextEntry // 뒷자리는 *****로 표시
            keyboardType="number-pad"
          />
        </View>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={carrier}
            style={styles.picker}
            onValueChange={(itemValue) => setCarrier(itemValue)}
          >
            <Picker.Item label="통신사 선택" value="" />
            <Picker.Item label="SKT" value="0" />
            <Picker.Item label="KT" value="1" />
            <Picker.Item label="LG" value="2" />
          </Picker>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleCertification}>
            <Text style={styles.buttonText}> PASS 인증 </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.title}>약관동의</Text>
        <View style={styles.checkboxContainer}>
          <CheckBox
            value={allAccepted}
            onValueChange={toggleAllAccepted}
          />
          <Text style={styles.checkboxLabel}>
            모두 동의합니다.
          </Text>
        </View>
        <View style={styles.checkboxContainer}>
          <CheckBox
            value={termsAccepted}
            onValueChange={setTermsAccepted}
          />
          <Text style={styles.checkboxLabel}>
            서비스 이용약관 동의 (필수)
            <TouchableOpacity onPress={() => Alert.alert('내용보기', '서비스 이용약관 내용')}>
              <Text style={styles.link}> 내용보기</Text>
            </TouchableOpacity>
          </Text>
        </View>
        <View style={styles.checkboxContainer}>
          <CheckBox
            value={privacyAccepted}
            onValueChange={setPrivacyAccepted}
          />
          <Text style={styles.checkboxLabel}>
            개인정보 이용/수집 동의 (필수)
            <TouchableOpacity onPress={() => Alert.alert('내용보기', '개인정보 이용/수집 내용')}>
              <Text style={styles.link}> 내용보기</Text>
            </TouchableOpacity>
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>회원가입</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  sectionContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  title: {
    backgroundColor: 'lightgray',
    fontSize: 15,
    marginBottom: 10,
    paddingTop:5,
    paddingBottom: 8,
    paddingLeft:10,
    textAlign: 'left',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height:40
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  pickerContainer: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    overflow: 'hidden',
  },
  datePickerContainer:{
    flexDirection: 'row',
    height:40,
    width: '100%',
  },
  datePicker:{
    flex: 1,
  },
  picker: {
    marginTop: -10,
  },
  rnInputContainer: {
    flexDirection: 'row', // 가로로 나열
    alignItems: 'center', // 세로 중앙 정렬
    marginBottom: 25, // 아래쪽 여백 조정
  },
  rninput: {
    flex: 1, // 각 입력 필드가 가로 공간을 균등하게 차지하도록 설정
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  checkButton: {
    marginLeft: 10,
    backgroundColor: '#66798C',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  checkButtonText: {
    color: '#fff',
  },
  button: {
    backgroundColor: '#001F3F',
    paddingVertical: 10,
    borderRadius: 5,
    marginTop:5
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkboxLabel: {
    fontSize: 16,
    marginLeft: 10,
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  errorText: {
    color: 'red', // 오류 메시지 색상
    fontSize: 12,
    marginLeft:5,
  },
});

export default MemberSignUpScreen;