import React, { useState, useEffect } from 'react';
import { ScrollView, View, StyleSheet, Text, ImageBackground, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from '../firebase';
import BackButton from '../features/backButton';

// Component to display the class details and teacher information
const DisplayInfoScreen = () => {
  const route = useRoute();
  const { classDetails } = route.params;

  const [teachers, setTeachers] = useState([]);
  const [teacherReviews, setTeacherReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [selectedSortOption, setSelectedSortOption] = useState(null);

  // Fetch the data
  useEffect(() => {
    // Fetches teacher data and reviews from database
    const fetchTeacher = async () => {
      try {
        setIsLoading(true);
        const teacherData = [];
        const usersRef = collection(db, 'Users');
        const q = query(usersRef, where('role', '==', 'teacher'), where('classes', 'array-contains', classDetails.id));
        const querySnapshot = await getDocs(q);

        if (querySnapshot) {
          for (const doc of querySnapshot.docs) {
            const userData = doc.data();
            const teacherId = doc.id;
            const averageRating = await calcTeacherRating(teacherId);
            teacherData.push({ id: teacherId, name: userData.name, rating: averageRating });
          }
        }

        setTeachers(teacherData);
        fetchReviews(teacherData); // Fetch reviews after fetching teachers
      } catch (error) {
        console.error('Error fetching teacher data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Calculates the average rating for a teacher based on their reviews
    const calcTeacherRating = async (teacherId) => {
      try {
        const userRef = doc(db, "Users", teacherId);
        const userDoc = await getDoc(userRef);
        const ratings = userDoc.data().ratings || [];

        let totalRating = 0;
        let ratingCount = 0;

        for (const ratingId of ratings) {
          const reviewRef = doc(db, "Reviews", ratingId);
          const reviewDoc = await getDoc(reviewRef);
          if (reviewDoc.exists() && reviewDoc.data().starRating !== undefined) {
            totalRating += reviewDoc.data().starRating;
            ratingCount++;
          }
        }

        return ratingCount > 0 ? totalRating / ratingCount : 0;
      } catch (error) {
        console.error('Error calculating teacher rating:', error);
        return 0;
      }
    };

    // Fetches reviews for the given teachers from the database
    const fetchReviews = async (classTeachers) => {
      try {
        const reviews = [];
        const teacherIds = classTeachers.map(teacher => teacher.id); 
        const reviewsRef = collection(db, "Reviews");
        if (teacherIds.length > 0) {
          const q = query(reviewsRef, where('teacher', 'in', teacherIds));
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            const reviewData = doc.data();
            console.log("Review data:", reviewData);
            const reviewWithDateAndRating = {
              id: doc.id,
              review: reviewData.review, // Correct field name
              starRating: reviewData.starRating
            };
            console.log("Review with date and rating:", reviewWithDateAndRating);
            reviews.push(reviewWithDateAndRating);
          });
        }
        console.log("Reviews:", reviews);
        setTeacherReviews(reviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };
    fetchTeacher();
  }, [classDetails.id]);

  // Returns the rating in a star representation
  const getStarRating = (rating) => {
    return '☆'.repeat(rating);
};

// Handles the sort options and sorts the reviews based off of selection
const handleSortOptionSelect = (option) => {
    setSelectedSortOption(option);
    setShowSortOptions(false);
    if (option === 'highest rating') {
        const sortedReviews = [...teacherReviews].sort((a, b) => {
            const ratingA = a.starRating || 0;
            const ratingB = b.starRating || 0;
            return ratingB - ratingA;
        });
        setTeacherReviews(sortedReviews);
    }
    if (option === 'lowest rating') {
        const sortedReviews = [...teacherReviews].sort((a, b) => {
            const ratingA = a.starRating || 0;
            const ratingB = b.starRating || 0;
            return ratingA - ratingB;
        });
        setTeacherReviews(sortedReviews);
    }
};

  // User interface
  return (
    <ImageBackground source={require('../assets/blackboard-bg.jpg')} resizeMode="cover" style={styles.image}>
        {isLoading ? (
            <View style={styles.center}>
                <ActivityIndicator size='large' color="white"/>
                <Text style={styles.center}>Loading</Text>
            </View>
        ) : (
            <View style={styles.container}>
                <BackButton dest="Home"/>
                <Text style={styles.title}>Class Details</Text>
                <View style={styles.detailsContainer}>
                    <Text style={styles.detailLabel}>Course Name:</Text>
                    <Text style={styles.detailText}>{classDetails.specific}</Text>
                    <Text style={styles.detailLabel}>Subject:</Text>
                    <Text style={styles.detailText}>{classDetails.name}</Text>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Date: </Text>
                      <Text style={styles.detailText}>{classDetails.day}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Location: </Text>
                      <Text style={styles.detailText}>{classDetails.location}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Attendance: </Text>
                      <Text style={styles.detailText}>{classDetails.attendance}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Type: </Text>
                      <Text style={styles.detailText}>{classDetails.type ? 'Group' : 'Individual'}</Text>
                    </View>
                </View>
                <Text style={styles.title}>Teachers</Text>
                {teachers.length > 0 ? (
                    teachers.map((teacher, index) => (
                        <Text key={index} style={styles.detailText}>
                            {teacher.name} - {teacher.rating === 0 ? "No Rating" : `☆${teacher.rating.toFixed(2)}`}
                        </Text>
                    ))
                ) : (
                    <Text style={styles.detailText}>No teachers available</Text>
                )}
                <View style={styles.reviewsContainer}>
                        <View style={styles.sortByContainer}>
                        <Text style={styles.title}>Teacher Reviews</Text>
                        <TouchableOpacity onPress={() => setShowSortOptions(!showSortOptions)}>
                            <Text style={styles.sortByText}>Sort By</Text>
                        </TouchableOpacity>
                        {showSortOptions && (
                            <View style={styles.sortOptions}>
                                <TouchableOpacity onPress={() => handleSortOptionSelect('highest rating')}>
                                    <Text style={styles.sortOption}>Highest Rating</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleSortOptionSelect('lowest rating')}>
                                    <Text style={styles.sortOption}>Lowest Rating</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        </View>
                        
                        <ScrollView style={styles.scrollView}>
                            {teacherReviews.map((review, index) => (
                                <View key={index} style={styles.reviewContainer}>
                                    {review.starRating && (
                                        <Text style={styles.reviewText}>{getStarRating(review.starRating)}</Text>
                                    )}
                                    <Text style={styles.reviewText}>{review.review}</Text>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
            </View>
        )}
    </ImageBackground>
);
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
        textAlign: 'center',
    },
    detailsContainer: {
        marginBottom: 5,
    },
    detailLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: 'white',
    },
    detailRow: {
      flexDirection: 'row',
      marginBottom: 10,
    },
    detailText: {
        fontSize: 16,
        marginBottom: 5,
        color: 'white',
    },
    reviewsContainer: {
        flex: 1,
        borderWidth: 2,
        borderColor: 'white',
        backgroundColor: 'black',
        paddingHorizontal: 10,
        maxHeight: 350,
        borderRadius: 5
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
    },
    center: {
        alignContent: 'center',
        textAlign: 'center',
        color: 'white'
    },
    sortByContainer: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sortByText: {
        color: 'white',
        marginLeft: 20,
        marginBottom: 10,
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 15,
        width: 80,
        height: 30,
        textAlign: 'center',
        lineHeight: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        overflow: 'hidden',
    },
    sortOptions: {
        position: 'absolute',
        top: '-150%',
        right: '1%',
        backgroundColor: 'black',
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 5,
        zIndex: 1,
    },
    sortOption: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        color: 'white',
    },
});

export default DisplayInfoScreen;
