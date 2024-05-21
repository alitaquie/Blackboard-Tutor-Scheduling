import { useState } from 'react';
import { Button, Image, View, StyleSheet, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function UploadImage() {

    const [image, setImage] = useState(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View>
         <View style={styles.container}>
            {!image && <Button title="Pick an Image" onPress={pickImage} />}
            {image && <Image source={{ uri: image }} style={styles.image} />}
        </View>
        {image && <Text style={styles.replace} title="Replace Image" onPress={pickImage} >Replace Image</Text>}
    </View>
  );
}
const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        elevation:2,
        height:140,
        width:140,
        backgroundColor:'#efefef',
        borderRadius:999,
        overflow:'hidden',
    },
    image: {
        alignItems: "center",
        justifyContent: "center",
        elevation:2,
        height:140,
        width:140,
        backgroundColor:'#efefef',
        borderRadius:999,
        overflow:'hidden',
    },
    replace: {
        color: 'white',
        textAlign: 'center',
        marginTop: 10,
        fontSize: 18
    }
})