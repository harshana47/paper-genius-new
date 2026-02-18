import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../theme/ThemeContext';

export const createStyles = (colors: ColorsType) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
            width: '100%',
            height: '100%',
        },
    });
