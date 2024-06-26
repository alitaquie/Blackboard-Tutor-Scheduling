import React, { useState, useEffect} from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, View, Switch, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Navbar from '../features/Navbar';
import { getDocs, collection, query, where, Timestamp } from "firebase/firestore";
import { db } from '../firebase';
import RNPickerSelect from 'react-native-picker-select';
import { Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

const StudentClassScreen = () => {
  const navigation = useNavigation();
  const [isGroup, setIsGroup] = useState(false);
  const [subject, setSubject] = useState('');

  const toggleSwitch = () => setIsGroup(previousState => !previousState);

  // Find and navigate to matching class
  const findClass = async () => {
    // Logic to create a new class
    // Logs for debugging
    console.log('isGroup:', isGroup); 
    console.log("subject: \'", subject, "\'");
    
    const Ref = collection(db, 'Events');
    const currentDate = Timestamp.fromDate(new Date());
    // Query finds future events only
    const q1 = query(Ref, where("date", ">", currentDate));

    try {
      const querySnapshot = await getDocs(q1);
      const matchingIDs = [];

      // Go through each document that is fetched
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Check if the document matches
        if (
          data.isGroup === isGroup &&
          (!subject || data.subject === subject) &&
          (!data.hasOwnProperty('closed') || data.closed === false)
        ) {
          // Collect the matching document IDs
          matchingIDs.push(doc.id);
        }
      });

      console.log("Matching IDs: ", matchingIDs);
      navigation.navigate("ClassInfo", { MatchingDocIDs: matchingIDs });
    } catch (error) {
      console.error("Error with finding class: ", error);
    }
  };

  // Display an alert that explains the group/private option
  const showAlert = () => {
    Alert.alert(
      "Group or Private Settings",
      "Private: One on one tutoring exclusive to you.\nGroup: Get tutored in a group with fellow students."
    );
  };

  useEffect(() => {
    // Fetch subject options here if needed
    setSubject(''); // Set initial subject
  }, []);

  // Subject options
  const options = [
    { label: 'ACEN - Academic English', value: 'ACEN - Academic English' },
    { label: 'AM - Applied Mathematics', value: 'AM - Applied Mathematics' },
    { label: 'ANTH - Anthropology', value: 'ANTH - Anthropology' },
    { label: 'APLX - Applied Linguistics', value: 'APLX - Applied Linguistics' },
    { label: 'ARBC - Arabic', value: 'ARBC - Arabic' },
    { label: 'ART - Art', value: 'ART - Art' },
    { label: 'ARTG - Art & Design: Games + Playable Media', value: 'ARTG - Art & Design: Games + Playable Media' },
    { label: 'ASTR - Astronomy and Astrophysics', value: 'ASTR - Astronomy and Astrophysics' },
    { label: 'BIOC - Biochemistry and Molecular Biology', value: 'BIOC - Biochemistry and Molecular Biology' },
    { label: 'BIOE - Biology Ecology and Evolutionary', value: 'BIOE - Biology Ecology and Evolutionary' },
    { label: 'BIOL - Biology Molecular Cell and Developmental', value: 'BIOL - Biology Molecular Cell and Developmental' },
    { label: 'BME - Biomolecular Engineering', value: 'BME - Biomolecular Engineering' },
    { label: 'CHEM - Chemistry and Biochemistry', value: 'CHEM - Chemistry and Biochemistry' },
    { label: 'CHIN - Chinese', value: 'CHIN - Chinese' },
    { label: 'CLNI - College Nine', value: 'CLNI - College Nine' },
    { label: 'CLST - Classical Studies', value: 'CLST - Classical Studies' },
    { label: 'CMMU - Community Studies', value: 'CMMU - Community Studies' },
    { label: 'CMPM - Computational Media', value: 'CMPM - Computational Media' },
    { label: 'COWL - Cowell College', value: 'COWL - Cowell College' },
    { label: 'CRES - Critical Race and Ethnic Studies', value: 'CRES - Critical Race and Ethnic Studies' },
    { label: 'CRSN - Carson College', value: 'CRSN - Carson College' },
    { label: 'CRWN - Crown College', value: 'CRWN - Crown College' },
    { label: 'CSE - Computer Science and Engineering', value: 'CSE - Computer Science and Engineering' },
    { label: 'CSP - Coastal Science and Policy', value: 'CSP - Coastal Science and Policy' },
    { label: 'DANM - Digital Arts and New Media', value: 'DANM - Digital Arts and New Media' },
    { label: 'EART - Earth Sciences', value: 'EART - Earth Sciences' },
    { label: 'ECE - Electrical and Computer Engineering', value: 'ECE - Electrical and Computer Engineering' },
    { label: 'ECON - Economics', value: 'ECON - Economics' },
    { label: 'EDUC - Education', value: 'EDUC - Education' },
    { label: 'ENVS - Environmental Studies', value: 'ENVS - Environmental Studies' },
    { label: 'ESCI - Environmental Sciences', value: 'ESCI - Environmental Sciences' },
    { label: 'FIL - Filipino', value: 'FIL - Filipino' },
    { label: 'FILM - Film and Digital Media', value: 'FILM - Film and Digital Media' },
    { label: 'FMST - Feminist Studies', value: 'FMST - Feminist Studies' },
    { label: 'FREN - French', value: 'FREN - French' },
    { label: 'GAME - Games and Playable Media', value: 'GAME - Games and Playable Media' },
    { label: 'GCH - Global and Community Health', value: 'GCH - Global and Community Health' },
    { label: 'GERM - German', value: 'GERM - German' },
    { label: 'GRAD - Graduate', value: 'GRAD - Graduate' },
    { label: 'GREE - Greek', value: 'GREE - Greek' },
    { label: 'HAVC - History of Art and Visual Culture', value: 'HAVC - History of Art and Visual Culture' },
    { label: 'HEBR - Hebrew', value: 'HEBR - Hebrew' },
    { label: 'HISC - History of Consciousness', value: 'HISC - History of Consciousness' },
    { label: 'HIS - History', value: 'HIS - History' },
    { label: 'HCI - Human Computer Interaction', value: 'HCI - Human Computer Interaction' },
    { label: 'HUMN - Humanities', value: 'HUMN - Humanities' },
    { label: 'ITAL - Italian', value: 'ITAL - Italian' },
    { label: 'JAPN - Japanese', value: 'JAPN - Japanese' },
    { label: 'JRLC - John R Lewis College', value: 'JRLC - John R Lewis College' },
    { label: 'JWST - Jewish Studies', value: 'JWST - Jewish Studies' },
    { label: 'KRSG - Kresge College', value: 'KRSG - Kresge College' },
    { label: 'LAAD - Languages', value: 'LAAD - Languages' },
    { label: 'LALS - Latin American and Latino Studies', value: 'LALS - Latin American and Latino Studies' },
    { label: 'LATN - Latin', value: 'LATN - Latin' },
    { label: 'LGST - Legal Studies', value: 'LGST - Legal Studies' },
    { label: 'LING - Linguistics', value: 'LING - Linguistics' },
    { label: 'LIT - Literature', value: 'LIT - Literature' },
    { label: 'MATH - Mathematics', value: 'MATH - Mathematics' },
    { label: 'MERR - Merrill College', value: 'MERR - Merrill College' },
    { label: 'METX - Microbiology and Environmental Toxicology', value: 'METX - Microbiology and Environmental Toxicology' },
    { label: 'MUSC - Music', value: 'MUSC - Music' },
    { label: 'NLP - Natural Language Processing', value: 'NLP - Natural Language Processing' },
    { label: 'OAKS - Oakes College', value: 'OAKS - Oakes College' },
    { label: 'OCEA - Ocean Sciences', value: 'OCEA - Ocean Sciences' },
    { label: 'PBS - Physical Biological Sciences', value: 'PBS - Physical Biological Sciences' },
    { label: 'PERS - Persian', value: 'PERS - Persian' },
    { label: 'PHIL - Philosophy', value: 'PHIL - Philosophy' },
    { label: 'PHYE - Physical Education', value: 'PHYE - Physical Education' },
    { label: 'PHYS - Physics', value: 'PHYS - Physics' },
    { label: 'POLI - Politics', value: 'POLI - Politics' },
    { label: 'PORT - Portuguese', value: 'PORT - Portuguese' },
    { label: 'PRTR - Porter College', value: 'PRTR - Porter College' },
    { label: 'PSYC - Psychology', value: 'PSYC - Psychology' },
    { label: 'PUNJ - Punjabi', value: 'PUNJ - Punjabi' },
    { label: 'SCIC - Science Communication', value: 'SCIC - Science Communication' },
    { label: 'SOCD - Social Documentation', value: 'SOCD - Social Documentation' },
    { label: 'SOCY - Sociology', value: 'SOCY - Sociology' },
    { label: 'SPAN - Spanish', value: 'SPAN - Spanish' },
    { label: 'SPHS - Spanish for Heritage Speakers', value: 'SPHS - Spanish for Heritage Speakers' },
    { label: 'STAT - Statistics', value: 'STAT - Statistics' },
    { label: 'STEV - Stevenson College', value: 'STEV - Stevenson College' },
    { label: 'THEA - Theater Arts', value: 'THEA - Theater Arts' },
    { label: 'TIM - Technology Information Management', value: 'TIM - Technology Information Management' },
    { label: 'UCDC - UCDC', value: 'UCDC - UCDC' },
    { label: 'VAST - Visualizing Abolitionist Studies', value: 'VAST - Visualizing Abolitionist Studies' },
    { label: 'WRIT - Writing', value: 'WRIT - Writing' },
    { label: 'YIDD - Yiddish', value: 'YIDD - Yiddish' }
  ];

  const placeholder = {
    label: 'Select a subject...',
    value: null
  };

  return (
    <ImageBackground source={require('../assets/blackboard-bg.jpg')} resizeMode="cover" style={styles.image}>
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <View style={styles.content}>
          <Text style={styles.title}>Find Class</Text>
          <View style={styles.input}>
            <RNPickerSelect
              placeholder={placeholder}
              items={options}
              onValueChange={text => setSubject(text)}
              value={subject}
            />
          </View>
          <View style={styles.checkboxContainer}>
            <Text style={styles.checkboxText}>Private</Text>
            <Switch
              trackColor={{ false: '#262626', true: '#000000' }}
              thumbColor={isGroup ? 'white' : '#f4f3f4'}
              ios_backgroundColor="#171717"
              onValueChange={toggleSwitch}
              value={isGroup}
            />
            <Text style={styles.checkboxText}>Group</Text>
            <TouchableOpacity onPress={showAlert} style={styles.infoIcon}>
              <Ionicons name="information-circle-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.createButton} onPress={findClass}>
            <Text style={styles.ButtonText}>Search</Text>
          </TouchableOpacity>
        </View>
        <Navbar navigation={navigation} />
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  logo: {
      width: '50%',
      height: '10%',
      marginBottom: 10,
      borderRadius: 40
  },
  infoIcon: {
    marginLeft: 10,
  },
  image: {
      flex: 1,
      justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  content: {
    flex: 1,
    justifyContent: 'center'
  },
  title: {
    fontSize: 50,
    top: '-15%',
    textAlign: 'center',
    color: 'white',
  },
  input: {
    backgroundColor: '#878787',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 5,
    marginBottom: 10,
    top: '-11%',
    width: '80%',
    alignSelf: 'center'
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    top: '-10%'
  },
  datestyle: {
    flexDirection: 'row',
    backgroundColor: '#c1e2e3',
    borderRadius: 5,
    padding: 7,
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    alignSelf: 'center',
    top: '-21%'
  },
  checkboxText: {
    margin: 10,
    fontSize: 25,
    color: 'white'
  },
  filler: {
    color: '#93a7ab'
  },
  createButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    width: '80%',
    alignSelf: 'center',
    bottom: '-10%'
  },
  ButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center'
  }
});

export default StudentClassScreen;