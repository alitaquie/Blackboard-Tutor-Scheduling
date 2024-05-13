import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, View, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { doc, getDoc } from "firebase/firestore";
import Navbar from '../features/Navbar'
import { db, auth } from '../firebase';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [userClasses, setUserClasses] = useState([]);
  const [userRole, setUserRole] = useState([]);
  const [classString, setClassString] = useState([]);
  const [idString, setIdString] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const translateClassString = async (classId) => {
    try {
      const classDocRef = doc(db, 'Events', classId);
      const classDocSnap = await getDoc(classDocRef);
      if (classDocSnap.exists()) {
        const className = classDocSnap.data().course;
        return className;
      }
    } catch (error) {
      console.error('Error fetching class data:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDocRef = doc(db, 'Users', auth.currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setUserRole(userData.role);
          setUserClasses(userData.classes || []);

          // Translate class id string to course name
          const translatedClasses = [];
          const idClasses = [];
          for (const classString of userData.classes || []) {
            const className = await translateClassString(classString);
            translatedClasses.push(className);
            idClasses.push(classString);
          }
          setClassString(translatedClasses);
          setIdString(idClasses);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const ExpandableListItem = ({ item, index, idString, toggleExpand }) => {
    const isExpanded = index === expandedIndex;
  
    const goToReview = () => {
      navigation.navigate('ClassReview', { className: item, classId: idString[index] });
    };

    return (
      <TouchableOpacity onPress={() => toggleExpand(index)}>
        <View style={[styles.itemContainer, isExpanded && styles.expandedItem]}>
          <Text style={styles.itemTitle}>{item}</Text>
          {isExpanded && (
            <TouchableOpacity onPress={goToReview}>
              <Text style={styles.itemContent}>
                Click here to add a review!
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderExpandedList = ({ item, index }) => {
    return (
      <ExpandableListItem
        item={item}
        index={index}
        idString={idString}
        toggleExpand={toggleExpand}
      />
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      {isLoading ? (
        <View>
          <ActivityIndicator size='large' color="black"/>
          <Text>Loading</Text>
        </View>
        
      ) : (
        <View style={styles.content}>
          <Text style={styles.title}>Profile Screen</Text>
          <Text style={styles.notTitle}> Name: {auth.currentUser.displayName}</Text>
          <Text style={styles.notTitle}> Email: {auth.currentUser.email}</Text>
          <Text style={styles.notTitle}> Role: {userRole}</Text>
          <Text style={styles.notTitle}> Class History:</Text>
          <FlatList
            data={classString}
            renderItem={renderExpandedList}
            keyExtractor={(item, index) => index.toString()}
            style={styles.listStyle}
          />
        </View>
      )}
      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.logOutButton}>
        <Text>Logout</Text>
      </TouchableOpacity>
      <Navbar navigation={navigation} />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    marginTop: 50,
    alignItems: 'center',
    backgroundColor: 'black',
    width: '95%',
    borderRadius: 20,
    height: '81%',
    maxHeight: '81%',
    top: '-2.5%'
  },
  title: {
    marginTop: 5,
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white'
  },
  notTitle: {
    color: 'white',
    fontSize: 20,
    margin: 10,
  },
  logOutButton: {
    backgroundColor: 'white',
    paddingVertical: 20,
    width: '30%',
    borderRadius: 5,
    alignItems: 'center',
    top: '-15%',
  },
  itemContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 3,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  itemContent: { 
    marginTop: 10, 
    fontSize: 14, 
    color: "#666", 
  },
  expandedItem: {
    backgroundColor: 'white',
  },
  itemTouchable: { 
    borderRadius: 10, 
    overflow: "hidden", 
  }, 
  listStyle: {
    height: '50%',
    maxHeight: '50%'
  }
});

export default ProfileScreen;