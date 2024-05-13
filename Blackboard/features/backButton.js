import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const backButton = ({ dest }) => {
    const navigation = useNavigation();

    const backFunct = () => {
        navigation.navigate(dest);
      };

      return (
            <TouchableOpacity onPress={backFunct} style={styles.backButton}>
                <Text style={styles.buttonText}>Go Back</Text>
            </TouchableOpacity>
        );
}

const styles = StyleSheet.create({
    backButton: {
        margin: 15,
        paddingVertical: 6,
        alignItems: 'center',
        borderRadius: 10,
        width: '25%',
        top: '-3%',
        borderColor: 'white',
        borderWidth: 2
    },
    buttonText: {
        fontSize: 25,
        color: 'white',
        textAlign: 'center'
    }
});

export default backButton;


