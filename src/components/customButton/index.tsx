import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { JSX } from 'react';
import { ThemeContextType, useTheme } from '../../theme/ThemeContext';
import { createStyles } from './styles';
import { globalStyles } from '../../theme/GlobalStyles';

interface CustomButtonProps {
    title: string;
    width?: number;
    borderRadius?: number;
    disableState?: boolean;
    loadingState?: boolean;
    type: 'primary' | 'secondary';
    icon?: JSX.Element;
    onPress: any;
}

const CustomButton = (props: CustomButtonProps) => {
    const { colors }: ThemeContextType = useTheme();
    const styles = createStyles(colors);
    return (
        <TouchableOpacity
            style={[
                props.disableState
                    ? styles.disableBtn
                    : props.type == 'primary'
                        ? styles.primaryBtn
                        : styles.secondaryBtn,
                { width: props.width || '100%', borderRadius: props.borderRadius || 10 },
            ]}
            {...(!props.disableState &&
                !props.loadingState && { onPress: props.onPress })}>
            {props.loadingState ? (
                <ActivityIndicator
                    size="small"
                    color={props.type == 'primary' ? colors.background : colors.primary}
                />
            ) : (
                <>
                    {props.icon && props.icon}
                    <Text
                        style={[
                            globalStyles.h4,
                            props.disableState
                                ? styles.disableBtnText
                                : props.type == 'primary'
                                    ? styles.primaryBtnText
                                    : styles.secondaryBtnText,
                        ]}>
                        {props.title}
                    </Text>
                </>
            )}
        </TouchableOpacity>
    );
};

export default CustomButton;
