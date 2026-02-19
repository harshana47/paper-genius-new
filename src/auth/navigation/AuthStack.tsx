import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CheckUserScreen from '../screens/CheckUserScreen';
import OtpVerificationScreen from '../screens/OtpVerificationScreen';
import SignUpScreen from '../screens/SignUpScreen';
import { AuthStackParamList } from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStack = () => {
    return (
        <Stack.Navigator
            initialRouteName="CheckUser"
            screenOptions={{
                headerShown: false,
            }}>
            <Stack.Screen name="CheckUser" component={CheckUserScreen} />
            <Stack.Screen name="VerifyOtp" component={OtpVerificationScreen} />
            <Stack.Screen name="Signup" component={SignUpScreen} />
        </Stack.Navigator>
    );
};

export default AuthStack;
