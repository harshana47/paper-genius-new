import { StyleSheet } from 'react-native';
import { ColorsType } from '../theme/ThemeContext';

export const createStyles = (colors: ColorsType) =>
    StyleSheet.create({
        loadingContainer: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.background,
        },
    });
