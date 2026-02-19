import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ThemeContextType, useTheme } from '../../../theme/ThemeContext';
import AuthInput from '../../components/AuthInput';
import AuthButton from '../../components/AuthButton';
import { signUp } from '../../services/authApi';
import { AuthStackParamList } from '../../navigation/types';
import { createStyles } from './styles';

type Props = NativeStackScreenProps<AuthStackParamList, 'Signup'>;

const SignUpScreen = ({ navigation, route }: Props) => {
    const { colors }: ThemeContextType = useTheme();
    const styles = createStyles(colors);
    const { username } = route.params;
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSignup = async () => {
        const normalizedName = fullName.trim();
        setErrorMessage('');

        if (normalizedName.length < 2) {
            setErrorMessage('Enter your full name.');
            return;
        }

        if (password.length < 5) {
            setErrorMessage('Password should be at least 5 characters.');
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage('Password confirmation does not match.');
            return;
        }

        setLoading(true);
        try {
            await signUp({
                username,
                password,
                fullName: normalizedName,
            });

            navigation.replace('Login', { username });
        } catch (error: any) {
            setErrorMessage(error?.message ?? 'Signup failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Create Account</Text>
            <Text style={styles.subtitle}>
                Your email has been verified. Complete signup and continue to login.
            </Text>

            <AuthInput
                label="Email"
                value={username}
                onChangeText={() => {}}
                placeholder=""
                editable={false}
            />

            <AuthInput
                label="Full Name"
                value={fullName}
                onChangeText={setFullName}
                placeholder="Enter full name"
                autoCapitalize="words"
            />

            <AuthInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Enter password"
                secureTextEntry
            />

            <AuthInput
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Re-enter password"
                secureTextEntry
            />

            {errorMessage ? <Text style={styles.inlineError}>{errorMessage}</Text> : null}

            <AuthButton
                title="Signup"
                onPress={handleSignup}
                disabled={
                    fullName.trim().length === 0 ||
                    password.trim().length === 0 ||
                    confirmPassword.trim().length === 0
                }
                loading={loading}
            />
        </View>
    );
};

export default SignUpScreen;
