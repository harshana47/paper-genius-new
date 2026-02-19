import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { ThemeContextType, useTheme } from '../../theme/ThemeContext';
import { createStyles } from './styles';

type AuthButtonProps = {
    title: string;
    onPress: () => void;
    disabled?: boolean;
    loading?: boolean;
};

const AuthButton = ({
    title,
    onPress,
    disabled = false,
    loading = false,
}: AuthButtonProps) => {
    const { colors }: ThemeContextType = useTheme();
    const styles = createStyles(colors);
    const isDisabled = disabled || loading;
    const buttonStyle = isDisabled
        ? styles.primaryButtonDisabled
        : styles.primaryButton;

    return (
        <TouchableOpacity
            onPress={onPress}
            style={buttonStyle}
            activeOpacity={0.9}
            disabled={isDisabled}>
            {loading ? (
                <ActivityIndicator size="small" color={colors.background} />
            ) : (
                <Text style={styles.primaryButtonText}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

export default AuthButton;
