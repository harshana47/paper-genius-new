import { StyleSheet } from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { ColorsType } from '../../../theme/ThemeContext';

export const createStyles = (colors: ColorsType) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
            paddingHorizontal: moderateScale(20),
            justifyContent: 'center',
        },
        heading: {
            color: '#1f1f1f',
            fontSize: moderateScale(24),
            fontFamily: 'Manrope-SemiBold',
            marginBottom: verticalScale(10),
        },
        subtitle: {
            color: '#4b4b4b',
            fontSize: moderateScale(14),
            fontFamily: 'Manrope-Regular',
            marginBottom: verticalScale(18),
            lineHeight: moderateScale(21),
        },
        inlineError: {
            color: '#c0382b',
            fontSize: moderateScale(12),
            marginTop: verticalScale(4),
            marginBottom: verticalScale(12),
            fontFamily: 'Manrope-Medium',
        },
        linkButton: {
            marginTop: verticalScale(12),
            alignItems: 'center',
        },
        linkText: {
            color: colors.primary,
            fontSize: moderateScale(13),
            fontFamily: 'Manrope-SemiBold',
        },
    });
