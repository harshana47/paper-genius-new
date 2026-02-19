import { StyleSheet } from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { ColorsType } from '../../theme/ThemeContext';

export const createStyles = (colors: ColorsType) =>
    StyleSheet.create({
        fieldContainer: {
            width: '100%',
            marginBottom: verticalScale(14),
        },
        label: {
            color: '#1f1f1f',
            marginBottom: verticalScale(6),
            fontSize: moderateScale(13),
            fontFamily: 'Manrope-Medium',
        },
        input: {
            width: '100%',
            height: verticalScale(50),
            borderWidth: 1,
            borderColor: '#c8c8c8',
            borderRadius: moderateScale(10),
            paddingHorizontal: moderateScale(12),
            fontSize: moderateScale(14),
            color: '#1f1f1f',
            backgroundColor: colors.background,
            fontFamily: 'Manrope-Regular',
        },
        inputDisabled: {
            width: '100%',
            height: verticalScale(50),
            borderWidth: 1,
            borderColor: '#d5d5d5',
            borderRadius: moderateScale(10),
            paddingHorizontal: moderateScale(12),
            fontSize: moderateScale(14),
            color: '#7d7d7d',
            backgroundColor: '#f5f5f5',
            fontFamily: 'Manrope-Regular',
        },
        errorText: {
            color: '#c0382b',
            fontSize: moderateScale(12),
            marginTop: verticalScale(4),
            fontFamily: 'Manrope-Medium',
        },
        primaryButton: {
            width: '100%',
            height: verticalScale(50),
            borderRadius: moderateScale(10),
            backgroundColor: colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
        },
        primaryButtonDisabled: {
            width: '100%',
            height: verticalScale(50),
            borderRadius: moderateScale(10),
            backgroundColor: '#f3a9ac',
            justifyContent: 'center',
            alignItems: 'center',
        },
        primaryButtonText: {
            color: colors.background,
            fontSize: moderateScale(14),
            fontFamily: 'Manrope-SemiBold',
        },
    });
