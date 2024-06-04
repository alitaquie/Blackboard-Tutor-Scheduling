import React, { useState, useEffect } from 'react';
import { Button, Image, View, StyleSheet, Text, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { storage, db, auth } from '../firebase';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

export default function UploadImage() {
  const [image, setImage] = useState(null);
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      const fetchImage = async () => {
        try {
          const pfpRef = doc(db, 'Images', user.uid);
          const docSnap = await getDoc(pfpRef);

          if (docSnap.exists()) {
            setImage(docSnap.data().url);
          } else {
            console.log('No profile image found for this user');
          }
        } catch (error) {
          console.error('Error fetching image URL from Firestore: ', error);
        }
      };

      fetchImage();
    }
  }, [user]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.05,
    });

    if (!result.canceled && user) {
      const imageUri = result.assets[0].uri;
      const imageRef = ref(storage, `users/${user.uid}/profile.jpg`);

      try {
        // Fetch the image blob
        const response = await fetch(imageUri);
        const blob = await response.blob();

        // Upload the image to Firebase Storage (this will overwrite the existing image)
        const metadata = {
          contentType: 'image/png'
        };
        await uploadBytes(imageRef, blob, metadata);
        console.log('Uploaded a blob or file!');

        // Get the download URL
        const downloadURL = await getDownloadURL(imageRef);
        console.log('File available at', downloadURL);

        // Save the download URL to Firestore
        const pfpRef = doc(db, 'Images', user.uid);
        await setDoc(pfpRef, {
          url: downloadURL,
          timestamp: new Date(),
        });
        console.log('Image URL saved to Firestore');

        setImage(downloadURL);
      } catch (error) {
        console.error('Error during image upload process: ', error);
      }
    } else {
      Alert.alert('No user signed in');
    }
  };

  return (
    <View>
      <View style={styles.container}>
        {!image && <Button title="Pick an Image" onPress={pickImage} />}
        {image && <Image source={{ uri: image }} style={styles.image} />}
      </View>
      {image && (
        <Text style={styles.replace} onPress={pickImage}>
          Replace Image
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    justifyContent: 'center',
    elevation: 2,
    height: 100,
    width: 100,
    backgroundColor: '#efefef',
    borderRadius: 999,
    overflow: 'hidden',
  },
  image: {
    elevation: 2,
    height: 100,
    width: 100,
    backgroundColor: '#efefef',
    borderRadius: 999,
    overflow: 'hidden',
  },
  replace: {
    color: 'white',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 15,
  },
});
