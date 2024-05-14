import React, { useState, useEffect } from 'react';
import { ScrollView, View, StyleSheet, Text, ImageBackground } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../firebase';
import BackButton from '../features/backButton';

const MoreInfoScreen = () => {
    const route = useRoute();

    const expandedItemData = route.params?.expandedItemData;
    const classTeachers = route.params?.classTeachers;
    const MatchingDocIDs = route.params?.MatchingDocIDs;

    const [teacherReviews, setTeacherReviews] = useState([]);

    useEffect(() => {
        fetchReviews();
    }, []); 

    const teacherName = classTeachers.map(teacher => teacher.name); 
    

    const fetchReviews = async () => {
        try {
            const reviews = [];
            const teacherIds = classTeachers.map(teacher => teacher.id); 
            const reviewsRef = collection(db, "Reviews");
            if (teacherIds.length > 0) {
                const q = query(reviewsRef, where('teacher', 'in', teacherIds));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    //console.log('doc data: ', doc.data());
                    reviews.push(doc.data());
                });
            }
            //console.log("Reviews: ", reviews);
            setTeacherReviews(reviews);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };
    
    
    if (expandedItemData) {
        return (
            <ImageBackground source={require('../assets/blackboard-bg.jpg')} resizeMode="cover" style={styles.image}>
                <View style={styles.container}>
                    <BackButton dest="ClassInfo" passInfo={{ MatchingDocIDs: MatchingDocIDs }}/>
                    <Text style={styles.title}>Class Details</Text>
                    <View style={styles.detailsContainer}>
                        <Text style={styles.detailLabel}>Title:</Text>
                        <Text style={styles.detailText}>{expandedItemData.title}</Text>
                        <Text style={styles.detailLabel}>Content:</Text>
                        <Text style={styles.detailText}>{expandedItemData.content}</Text>
                        <Text style={styles.detailLabel}>Teacher Name:</Text>
                        <Text style={styles.detailText}>{teacherName}</Text>
                    </View>
                    <View style={styles.reviewsContainer}>
                        <Text style={styles.title}>Teacher Reviews</Text>
                        <ScrollView style={styles.scrollView}>
                            {teacherReviews.map((review, index) => (
                                <View key={index} style={styles.reviewContainer}>
                                    <Text style={styles.reviewText}>{review.review}</Text>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </ImageBackground>
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
        paddingHorizontal: 20,
        paddingTop: 50,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'white',
    },
    detailsContainer: {
        marginBottom: 20,
    },
    detailLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: 'white',
    },
    detailText: {
        fontSize: 16,
        marginBottom: 10,
        color: 'white',
    },
    reviewsContainer: {
        flex: 1,
        borderWidth: 2,
        borderColor: 'white',
        backgroundColor: 'black',
        paddingHorizontal: 10,
        maxHeight: 350,
    },
    scrollView: {
        flex: 1,
        marginBottom: 20,
        maxHeight: 300,
    },
    reviewContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    reviewText: {
        fontSize: 16,
        color: 'white',
    },
    image: {
        flex: 1,
        justifyContent: 'center',
    }
    // Define other styles here
});

export default MoreInfoScreen;
