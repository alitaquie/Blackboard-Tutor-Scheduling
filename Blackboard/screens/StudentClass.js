import React, { useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Switch, Button } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import Navbar from './Navbar';
import DateTimePicker from '@react-native-community/datetimepicker';
import {StatusBar} from 'expo-status-bar';
import { doc, getDocs, collection, updateDoc, query, where } from "firebase/firestore";
import { db, auth } from '../firebase';
import RNPickerSelect from 'react-native-picker-select';

const StudentClassScreen = () => {
  const navigation = useNavigation();
  const [isGroup, setIsGroup] = useState(false);
  const [date, setDate] = useState(new Date());
  const [location, setLocation] = useState('');
  const [subject, setSubject] = useState('');
  const [MatchingDocIDs, setMatchingDocIDs] = useState([]);

  const toggleSwitch = () => setIsGroup(previousState => !previousState);

  const findClass = async () => {
    // Logic to create a new class
    console.log('finding class:', isGroup, subject); 
    
    const Ref = collection(db, 'Events');
    const q1 = query(Ref, where("isGroup", "==", isGroup), where("subject", "==", subject));
    const querySnapshot = await getDocs(q1);
    setMatchingDocIDs([]);
    querySnapshot.forEach((doc) => {
      setMatchingDocIDs(MatchingDocIDs => [...MatchingDocIDs, doc.id]);
    });
    console.log("success");
    navigation.navigate("ClassInfo", {MatchingDocIDs: MatchingDocIDs});
  };

  const onChange = (e, selectedDate) => {
    setDate(selectedDate);
  }

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
    label: 'Select an option...',
    value: null,
  };

  return (
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
        <TextInput
          style={styles.input}
          placeholder="Location (City)"
          value={location}
          onChangeText={text => setLocation(text)}
        />
        <View style={styles.checkboxContainer}>
          <Text style={styles.checkboxText}>Private</Text>
          <Switch
            trackColor={{ false: '#ffffff', true: '#000000' }}
            thumbColor={isGroup ? '#5eb7ff' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isGroup}
          />
          <Text style={styles.checkboxText}>Group</Text>
        </View>
        <TouchableOpacity style={styles.createButton} onPress={findClass}>
          <Text style={styles.ButtonText}>Search</Text>
        </TouchableOpacity>
      </View>
      <Navbar navigation={navigation} />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#2b44bd'
  },
  content: {
    flex: 1,
    justifyContent: 'center'
  },
  title: {
    fontSize: 40,
    top: '-15%',
    textAlign: 'center'
  },
  input: {
    backgroundColor: '#c1e2e3',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 5,
    marginBottom: 10,
    top: '-11%',
    width: '80%',
    alignSelf: 'center',
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
    fontSize: 25
  },
  filler: {
    color: '#93a7ab'
  },
  createButton: {
    backgroundColor: '#002842',
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
  }, 
});

export default StudentClassScreen;