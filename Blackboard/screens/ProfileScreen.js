import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, View, FlatList, ActivityIndicator, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { doc, getDoc } from "firebase/firestore";
import Navbar from '../features/Navbar'
import { db, auth } from '../firebase';
import UploadImage from '../features/ProfilePic';


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
  
    const goToReview = async () => {
      const currentUserId = auth.currentUser.uid;
      const userDocRef = doc(db, "Users", currentUserId);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        if (docSnap.data().role == 'student') {
          navigation.navigate('ClassReview', { className: item, classId: idString[index] });
        }  else {
          navigation.navigate('TeacherProfile', { className: item, classId: idString[index] });
        }
      } else {
        alert("Sorry. Something went wrong on our end.");
      }
  
      
    };

    return (
      <TouchableOpacity onPress={() => toggleExpand(index)}>
        <View style={[styles.itemContainer, isExpanded && styles.expandedItem]}>
          <Text style={styles.itemTitle}>{item}</Text>
          {isExpanded && (
            <TouchableOpacity onPress={goToReview}>
              <Text style={styles.itemContent}>
                View Information
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
    <ImageBackground source={require('../assets/blackboard-bg.jpg')} resizeMode="cover" style={styles.image}>
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        {isLoading ? (
          <View style={styles.center}>
            <ActivityIndicator size='large' color="white"/>
            <Text style={styles.center}>Loading</Text>
          </View>
          
        ) : (
          <View style={styles.container}>
            <Text style={styles.title}>Profile Screen</Text>

            <View style={styles.snap}>
              <View>
                <View style={styles.snap}>
                  <Text style={styles.detailLabel}> Name: </Text>
                  <Text style={styles.detailText}>{auth.currentUser.displayName}</Text>
                </View>

                <View style={styles.snap}>
                  <Text style={styles.detailLabel}> Email: </Text>
                  <Text style={styles.detailText}>{auth.currentUser.email}</Text>
                </View>

                <View style={styles.snap}>
                  <Text style={styles.detailLabel}> Role:</Text>
                  <Text style={styles.detailText}>{userRole}</Text>
                </View>
              </View>

              <View style={styles.img}>
                <UploadImage/>
              </View>
            </View>
            
            <View style={styles.filler}></View>

            <Text style={styles.detailLabel}> Class History:</Text>
            <FlatList
              data={classString}
              renderItem={renderExpandedList}
              keyExtractor={(item, index) => index.toString()}
              style={styles.flatList}
            />
            <View style={styles.logOutButtonContainer}>
              <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.logOutButton}>
                <Text>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        <Navbar navigation={navigation} />
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  title: {
    marginTop: 80,
    marginBottom: 50,
    fontSize: 25,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center'
  },
  detailLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'white',
    textAlign: 'center'
  },
  detailText: {
    fontSize: 16,
    paddingLeft: 5,
    marginBottom: 10,
    color: 'white',
  },
  logOutButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logOutButton: {
    backgroundColor: 'white',
    paddingVertical: 20,
    width: '30%',
    borderRadius: 5,
    alignItems: 'center',
    top: '-25%',
  },
  itemContainer: {
    marginBottom: 15,
    marginHorizontal: 20,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
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
  flatList: {
    paddingTop: 10,
    maxHeight: '40%',
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  snap: {
    flexDirection: 'row',
    margin: 5
  },
  filler: {
    margin: 10
  },
  center: {
    alignContent: 'center',
    textAlign: 'center',
    color: 'white'
  },
  img: {
    marginLeft: 40,
    bottom: '5%'
  }
});

export default ProfileScreen;