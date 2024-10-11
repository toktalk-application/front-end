import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const initialState = {
        isAuthenticated: false,
        token: null,
        usertype: null,
    };

    const [state, setState] = useState(initialState);

    const login = async (token, usertype, navigation) => {
        const newState = {
            isAuthenticated: true,
            token,
            usertype,
        };
        setState(newState);
        await AsyncStorage.setItem('authState', JSON.stringify(newState));
    
        // 데이터가 제대로 저장되었는지 확인
        const storedValue = await AsyncStorage.getItem('authState');
        if (storedValue) {
            // JSON 문자열을 객체로 변환
            const parsedValue = JSON.parse(storedValue);
            console.log('저장된 데이터:', parsedValue);
        } else {
            console.log('데이터가 저장되지 않았습니다.');
        }
        
        navigation.navigate('Tabs', { userType: usertype });
    };

    const logout = () => {
        const newState = {
            isAuthenticated: false,
            token: null,
            usertype: null,
        };
        setState(newState);
        AsyncStorage.removeItem('authState'); 
    };

    useEffect(() => {
        const loadAuthState = async () => {
            const savedState = await AsyncStorage.getItem('authState');
            if (savedState) {
                setState(JSON.parse(savedState));
            }
        };
        loadAuthState();
    }, []);

    return (
        <AuthContext.Provider value={{ state, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};