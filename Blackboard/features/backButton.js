import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons'; // Import Ionicons or any other icon set

const BackButton = ({ dest, passInfo }) => {
    const navigation = useNavigation();

    const backFunct = () => {
        navigation.navigate(dest, passInfo);
    };

    return (
        <TouchableOpacity onPress={backFunct} style={styles.backButton}>
            <Icon name="arrow-back" size={30} color="white" />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    backButton: {
        margin: 5,
        paddingVertical: 2,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        width: '15%',
        borderColor: 'red',
        borderWidth: 1
    }
});

export default BackButton;