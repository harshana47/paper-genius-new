import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../../models/navigation';
import { useEffect, useState } from 'react';
import LoginScreen from '../../screens/Auth/LoginScreen';


const Stack = createStackNavigator<RootStackParamList>();

const UserStack = () => {


    return (
        <Stack.Navigator
            initialRouteName={'HomeScreen'}
            screenOptions={{ headerShown: false }}>



        </Stack.Navigator>
    );
};

export default UserStack;
