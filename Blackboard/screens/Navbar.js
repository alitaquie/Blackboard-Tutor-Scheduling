import React, { useState, useEffect } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/FontAwesome5';
import { auth, db } from '../firebase';
import { doc, getDoc } from "firebase/firestore";

const Navbar = ({ navigation }) => {
  const [userRole, setUserRole] = useState(null); // State to hold user role
  const [loading, setLoading] = useState(true); // State to manage loading state

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const currentUserUid = auth.currentUser.email;
        const userDocRef = doc(db, "Users", currentUserUid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists) {
          setUserRole(docSnap.data().role);
        } else {
          console.error("User document not found");
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  const goToProfileScreen = () => {
    navigation.navigate('Profile');
  };

  const goToHomeScreen= () => {
    navigation.navigate('Home');
  };

  const goToClass = () => {
    if (userRole === 'student') {
      navigation.navigate('StudentClass');
    }  else if (userRole === 'teacher') {
      navigation.navigate('TeacherClass');
    } else {
      navigation.navigate('StudentClass');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.navbar}>
      <TouchableOpacity style={styles.navItem} onPress={goToHomeScreen}>
        <Icon2 name="home" size={30} color="white" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={goToClass}>
        <Icon2 name="book" size={30} color="white" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={goToProfileScreen}>
        <Icon name="person-circle" size={30} color="white" />
      </TouchableOpacity>
      {/* Add more items as needed */}
    </View>
  );
};

const styles = {
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'black',
    paddingVertical: 35,
    paddingHorizontal: 20,
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: 'white',
    position: 'absolute', // Changed to absolute
    bottom: 0
  },
  navItem: {
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default Navbar;