import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const LandingScreen = ({ navigation }) => {
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     navigation.replace('로그인'); // 2초 후에 'Tabs' 화면으로 이동
  //   }, 1500);

  //   return () => clearTimeout(timer); // 타이머 정리
  // }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      const timer = setTimeout(() => {
        navigation.replace('로그인'); // 2초 후에 'Tabs' 화면으로 이동
      }, 1500);
  
      return () => clearTimeout(timer); // 타이머 정리
    }, [navigation])
  );

  return (
    <View style={styles.container}>
      {/* Grouping aboveQuote, text, and underQuote in a div-like structure */}
      <View style={styles.quoteContainer}>
        <Image source={require('../../assets/images/aboveQuote.png')} style={styles.quote} />
        <Text style={styles.text}>톡! 터놓고 얘기하자</Text>
        <Image source={require('../../assets/images/underQuote.png')} style={styles.quote} />
      </View>
      {/* Centered logo */}
      <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
    </View>
  );
};

export default LandingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Center everything vertically
    alignItems: 'center',      // Center everything horizontally
    backgroundColor: '#fff',   // Set background color
  },
  quoteContainer: {
    alignItems: 'center',      // Center items horizontally inside the container
    marginBottom: 20,          // Add space between the quotes and the logo
  },
  quote: {
    width: 12,               // Adjust these values to match the image size
    height: 8,
    marginVertical: 5,       // Space between the quote images and text
  },
  text: {
    fontSize: 13,
    fontWeight: 'bold',
    marginVertical: 5,       // Space between the quotes and text
  },
  logo: {
    width: 160,
    height: 50,
    marginTop: 190,            // Space between the quotes and the logo
  },
});
