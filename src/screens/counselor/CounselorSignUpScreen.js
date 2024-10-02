import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import CustomDatePicker from '../../components/CustomDatePicker'; 
import CheckBox from '@react-native-community/checkbox'; // CheckBox import

function MemberSignUpScreen() {
  const [username, setUsername] = useState('');
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

  // 본인인증 관련 상태. 
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [residentNumber1, setResidentNumber1] = useState('');
  const [residentNumber2, setResidentNumber2] = useState('');
  const [carrier, setCarrier] = useState('');

  // 경력 인증 관련 상태.
  const [company, setCompany] = useState(''); // 소속
  const [companyPhone, setCompanyPhone] = useState(''); // 소속 전화번호
  // 자격증
  const [licenses, setLicenses] = useState( [
    {license_name:'', organization:''}
  ])
  const [careers, setCareers] = useState( [
    {classification:'', company_name:'', responsibility:''},
  ])



  const checkUsernameAvailability = () => {
    Alert.alert('중복 확인', '아이디 중복 확인 로직을 여기에 구현합니다.');
  };

  const checkNicknameAvailability = () => {
    Alert.alert('중복 확인', '닉네임 중복 확인 로직을 여기에 구현합니다.');
  };

  const handleSignUp = () => {
    if (!username || !password || !confirmPassword || !nickname || !verificationCode) {
      Alert.alert('오류', '모든 필드를 입력해주세요.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('오류', '비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!termsAccepted || !privacyAccepted) {
      Alert.alert('오류', '필수 약관에 동의해야 합니다.');
      return;
    }

    console.log('회원가입 정보:', { username, password, nickname, phoneNumber, verificationCode, gender });
    Alert.alert('회원가입 완료', '회원가입이 성공적으로 완료되었습니다!');

    // 입력 필드 초기화
    setUsername('');
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
    setBirthDate('');
    setCompany('');
    setCompanyPhone('');
    setLicenses([
      { license_name: '', organization: '' }
    ]); 
    setCareers([
      {classification:'', company_name:'', responsibility:''}
    ])
  };

  const handleLicenseChange = (index, field, value) => {
    const newCertificates = [...licenses];
    newCertificates[index][field] = value;
    setLicenses(newCertificates);
  };

  const addLicense = () => {
    if (licenses.length < 3) {
      setLicenses([...licenses, { licenseName: '', organization: '' }]);
    } else {
      Alert.alert('오류', '자격증은 최대 3개까지 등록할 수 있습니다.');
    }
  };
  const removeLicense = (index) => {
    if (licenses.length > 1) {
      const newLicenses = licenses.filter((_, i) => i !== index);
      setLicenses(newLicenses);
    } else {
      Alert.alert('오류', '최소 하나의 자격증 입력 필드가 필요합니다.');
    }
  };


  const addCareer = () => {
    if (careers.length < 3) {
      setCareers([...careers, {classification:'', companyName:'', responsibility:''}]);
    } else {
      Alert.alert('오류', '경력 사항은 최대 3개까지 등록할 수 있습니다.');
    }
  };
  const removeCareer = (index) => {
    if (careers.length > 1) {
      const newCareers = careers.filter((_, i) => i !== index);
      setCareers(newCareers);
    } else {
      Alert.alert('오류', '최소 하나의 경력 사항 입력 필드가 필요합니다.');
    }
  };
  const handleCareerChange = (index, field, value) => {
    const newCareers = [...careers];
    newCareers[index][field] = value;
    setCareers(newCareers);
  };


  const handleCertification = () => {
    // 모든 필드가 입력되었는지 확인
    if (!name || !phoneNumber || !residentNumber1 || !residentNumber2 || !carrier) {
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
        <Text style={styles.title}>계정정보</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="아이디를 입력해주세요"
            value={username}
            onChangeText={setUsername}
          />
          <TouchableOpacity style={styles.checkButton} onPress={checkUsernameAvailability}>
            <Text style={styles.checkButtonText}>중복 확인</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="비밀번호를 입력해주세요"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="비밀번호 재확인"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="닉네임을 입력해주세요"
            value={nickname}
            onChangeText={setNickname}
            keyboardType="default"
          />
          <TouchableOpacity style={styles.checkButton} onPress={checkNicknameAvailability}>
            <Text style={styles.checkButtonText}>중복 확인</Text>
          </TouchableOpacity>
        </View>
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
        <View style={styles.inputContainer}>
          <CustomDatePicker birthDate={birthDate} setBirthDate={setBirthDate} />
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.title}>본인 인증</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="이름을 입력해주세요"
            value={name}
            onChangeText={setName}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="전화번호를 입력해주세요"
            value={password}
            onChangeText={setPassword}
          />
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
        <Text style={styles.title}>자격 인증</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="소속(센터명, 회사명)"
            value={company}
            onChangeText={setCompany}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="소속 전화번호"
            value={companyPhone}
            onChangeText={setCompanyPhone}
            keyboardType="phone-pad"
          />
        </View>
        <View style={styles.detailSectionContainer}>
        <Text style={styles.detailTitle}>공인 자격</Text>
        <Text style={styles.explanation}> 
          심리, 상담, 임상심리 관련 자격증만 최대 3개까지 등록할 수 있습니다.  
        </Text>
        {licenses.map((license, index) => (
          <View key={index} style={styles.detailInputContainer}>
            <TextInput
              style={styles.detailInput}
              placeholder="발행처"
              value={license.organization}
              onChangeText={(value) => handleLicenseChange(index, 'organization', value)}
            />
            <TextInput
              style={styles.detailInput}
              placeholder="자격이름"
              value={license.license_name}
              onChangeText={(value) => handleLicenseChange(index, 'license_name', value)}
            />
            {licenses.length > 1 && (
              <TouchableOpacity style={styles.removeButton} onPress={() => removeLicense(index)}>
                <Text style={styles.removeButtonText}>삭제</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
        <TouchableOpacity style={styles.addButton} onPress={addLicense}>
          <Text style={styles.addButtonText}>추가</Text>
        </TouchableOpacity>
      </View>
        <View style = {styles.detailSectionContainer}>
          <Text style={styles.detailTitle}>경력 사항</Text>
          <Text style={styles.explanation}>
                심리, 상담, 임상과 관련된 경력만 입력해주세요
          </Text>
          {careers.map((career, index) => (
          <View key={index} style={styles.detailInputContainer}>
            <View style={styles.detailPickerContainer}>
              <Picker
                selectedValue={career.classification}
                style={styles.picker}
                onValueChange={(itemValue) => handleCareerChange(index, 'classification', itemValue)}
              >
                <Picker.Item label="선택" value="" />
                <Picker.Item label="현재 근무지" value="CURRENT" />
                <Picker.Item label="이전 근무지" value="PREVIOUS" />
              </Picker>
            </View>
            <View style={styles.horizontalInputContainer}>
              <TextInput
                style={styles.detailInput}
                placeholder="기관/회사명"
                value={career.company_name}
                onChangeText={(value) => handleCareerChange(index, 'companyName', value)}
              />
              <TextInput
                style={styles.detailInput}
                placeholder="담당 업무"
                value={career.responsibility}
                onChangeText={(value) => handleCareerChange(index, 'responsibility', value)}
              />
            </View>
            {careers.length > 1 && (
              <TouchableOpacity style={styles.removeButton} onPress={() => removeCareer(index)}>
                <Text style={styles.removeButtonText}>삭제</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
        <TouchableOpacity style={styles.addButton} onPress={addCareer}>
              <Text style={styles.addButtonText}>추가</Text>
        </TouchableOpacity>
        </View>
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
    marginBottom: 15,
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
  picker: {
    marginTop: -10,
  },
  rnInputContainer: {
    flexDirection: 'row', // 가로로 나열
    alignItems: 'center', // 세로 중앙 정렬
    marginBottom: 15, // 아래쪽 여백 조정
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
  detailSectionContainer: {
    marginBottom: 20,
    marginLeft:20,
    marginRight:20,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  explanation: {
    fontSize: 12,
    marginBottom: 10,
  },
  detailInputContainer: {
    marginBottom: 10,
    marginTop:5
  },
  detailInput: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 8,
    borderRadius: 5,
    marginTop:5
  },
  detailPickerContainer: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },

  horizontalInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addButton: {
    backgroundColor: '#001F3F',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  removeButton: {
    backgroundColor: '#D78A8A',
    paddingVertical: 5,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 5,
  },
  removeButtonText: {
    color: '#fff',
  },
});

export default MemberSignUpScreen;