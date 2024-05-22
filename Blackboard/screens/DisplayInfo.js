import React, { useState, useEffect } from 'react';
import { ScrollView, View, StyleSheet, Text, ImageBackground, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from '../firebase';
import BackButton from '../features/backButton';

const DisplayInfo = () => {
  const route = useRoute();
  const { classDetails } = route.params;

  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
      } catch (error) {
        console.error('Error fetching teacher data:', error);
      } finally {
        setIsLoading(false);
      }
    };

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

    fetchTeacher();
  }, [classDetails.id]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Course Name: {classDetails.specific}</Text>
      <Text style={styles.text}>Subject: {classDetails.name}</Text>
      <Text style={styles.text}>Date: {classDetails.day}</Text>
      <Text style={styles.text}>Location: {classDetails.location}</Text>
      <Text style={styles.text}>Attendance: {classDetails.attendance}</Text>
      <Text style={styles.text}>Type: {classDetails.type ? 'Group' : 'Individual'}</Text>

      <Text style={styles.teacherHeader}>Teachers:</Text>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : teachers.length > 0 ? (
        teachers.map((teacher, index) => (
          <Text key={index} style={styles.text}>
            {teacher.name} - {teacher.rating === 0 ? "No Rating" : `☆${teacher.rating.toFixed(2)}`}
          </Text>
        ))
      ) : (
        <Text style={styles.text}>No teachers available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 18,
    marginVertical: 5,
  },
  teacherHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
});

export default DisplayInfo;
