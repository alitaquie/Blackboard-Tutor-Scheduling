import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
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
    const currentUserId = auth.currentUser.uid;
    const userDocRef = doc(db, "Users", currentUserId);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      if (docSnap.data().role == 'student') {
        navigation.navigate('StudentClass');
      }  else {
        navigation.navigate('TeacherClass');
      }
    } else {
      alert("Sorry. Something went wrong on our end.");
    }
    
    
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

const styles = StyleSheet.create({
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
    position: 'absolute',
    bottom: 0
  },
  navItem: {
    alignItems: 'center',
  },
});

export default Navbar;