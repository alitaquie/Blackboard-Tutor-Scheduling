import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/FontAwesome5';
import {auth, db} from '../firebase';
import { doc, getDoc } from "firebase/firestore";

const Navbar = ({ navigation }) => {
  const goToProfileScreen = () => {
    navigation.navigate('Profile');
  };

  const goToHomeScreen= () => {
    navigation.navigate('Home');
  };

  const goToClass = async () => {
    // try {
    //     const currentUserUid = auth.currentUser.email;
    //     const userDocRef = doc(db, "Users", currentUserUid);
    //     const docSnap = await getDoc(userDocRef);

    //     if (docSnap.exists()) {
    //         const userData = docSnap.data();

    //         if (userData.role === 'student') {
    //             navigation.navigate('StudentClass');
    //         } else {
    //             navigation.navigate('TeacherClass');
    //         }
    //     } else {
    //         console.error("User document does not exist!");
    //         // Handle the case where the user document does not exist in Firestore
    //     }
    // } catch (error) {
    //     console.error("Error fetching user data:", error.message);
    //     // Handle the error, such as navigating to an error screen or displaying an error message
    // }
    
    navigation.navigate('TeacherClass');

  };

  return (
    <View style={styles.navbar}>
      <TouchableOpacity style={styles.navItem} onPress = {goToHomeScreen}>
        <Icon2 name="home" size={30} color="white" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress= {goToClass}>
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
    position: 'fixed',
    bottom: 0
  },
  navItem: {
    alignItems: 'center',
  },
};

export default Navbar;