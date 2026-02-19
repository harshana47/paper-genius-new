import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../features/stateHooks';
import { ThemeContextType, useTheme } from '../../../theme/ThemeContext';
import { clearSession } from '../../../auth/slices/authSlice';
import { clearAuthSession } from '../../../auth/services/authStorage';
import { createStyles } from './styles';

const HomeScreen = () => {
    const dispatch = useAppDispatch();
    const { colors }: ThemeContextType = useTheme();
    const styles = createStyles(colors);
    const username = useAppSelector(state => state.auth.username);

    const handleLogout = async () => {
        await clearAuthSession();
        dispatch(clearSession());
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Logged In</Text>
            <Text style={styles.subtitle}>
                {username
                    ? `Welcome ${username}.`
                    : 'Authentication completed successfully.'}
            </Text>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

export default HomeScreen;
