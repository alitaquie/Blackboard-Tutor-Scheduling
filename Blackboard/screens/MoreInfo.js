import React, { useState, useEffect } from 'react';
import { View, KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { collection, query, where, getDoc, doc, getDocs, updateDoc, arrayUnion, addDoc } from "firebase/firestore";
import { db } from '../firebase';

const MoreInfoScreen = ({ route }) => {
    const { expandedItemData, teacherId, teacherName } = route.params; 
    const [teacherReviews, setTeacherReviews] = useState([]);

    useEffect(() => {
        fetchReviews();
    }, []); 

    const fetchReviews = async () => {
        try {
            const reviewsRef = collection(db, "Reviews");
            const q = query(reviewsRef, where('teacher', '==', teacherId));
            const querySnapshot = await getDocs(q);
            const reviews = [];
            querySnapshot.forEach((doc) => {
                reviews.push(doc.data());
            });
            console.log("Fetched reviews:", reviews); 
            setTeacherReviews(reviews);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

  
    if (expandedItemData) {

        return (
            <View style={styles.container}>
                <Text>Title: {expandedItemData.title}</Text>
                <Text>Content: {expandedItemData.content}</Text>
                <Text>Teacher Name: {teacherName}</Text> 
                
    
                <Text style={styles.boldText}>Teacher Reviews:</Text>
                {teacherReviews.map((review, index) => (
                    <Text key={index} style={styles.fieldText}>{review.review}</Text>
                ))}
            </View>
        );
    } else {
    
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
    boldText: {
        fontWeight: 'bold',
    },
    fieldText: {
        marginTop: 5,
    },
    // Define other styles here
});

export default MoreInfoScreen;
