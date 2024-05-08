import React from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native';

// MoreInfo.js

const MoreInfoScreen = ({ route }) => {
    const { expandedItemData, expandedIndex } = route.params; // Receive data and index from ClassInfoScreen

    console.log("expandedItemData:", expandedItemData); // Log the value of expandedItemData

    // Check if expandedItemData is defined before accessing its properties
    if (expandedItemData) {
        // Now you can use the expandedItemData to display information about the expanded class
        return (
            <View style={styles.container}>
                <Text>Title: {expandedItemData.title}</Text>
                <Text>Content: {expandedItemData.content}</Text>
                {/* Display other information as needed */}
            </View>
        );
    } else {
        // Handle the case when expandedItemData is undefined
        return (
            <View style={styles.container}>
                <Text>Error: Unable to load class information.</Text>
            </View>
        );
    }
};


const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    // Define other styles here
  });


export default MoreInfoScreen;