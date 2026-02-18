import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../../models/navigation';
import { useEffect, useState } from 'react';
import LoginScreen from '../../screens/Auth/LoginScreen';


const Stack = createStackNavigator<RootStackParamList>();

const AuthStack = () => {


    return (
        <Stack.Navigator
            initialRouteName={'LoginScreen'}
            screenOptions={{ headerShown: false }}>

            <Stack.Screen name="LoginScreen" component={LoginScreen} />

        </Stack.Navigator>
    );
};

export default AuthStack;
