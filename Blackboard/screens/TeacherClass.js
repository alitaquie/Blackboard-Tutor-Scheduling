import React, { useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Switch} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Navbar from './Navbar';
import DateTimePicker from '@react-native-community/datetimepicker';
import { doc, setDoc, getDoc, collection, updateDoc } from "firebase/firestore";
import { db, auth } from '../firebase';
import RNPickerSelect from 'react-native-picker-select';

const TeacherClassScreen = () => {
  const navigation = useNavigation();
  const [course, setCourse] = useState('');
  const [isGroup, setIsGroup] = useState(false);
  const [date, setDate] = useState(new Date());
  const [location, setLocation] = useState('');
  const [subject, setSubject] = useState('');
  const [attendance, setAttendance] = useState(0);

  const toggleSwitch = () => setIsGroup(previousState => !previousState);

  const createClass = async () => {
    // Logic to create a new class
    console.log('Creating class:', course, isGroup, date, location, subject, attendance);
    if (!course) {
      alert("Please provide a course name.");
    } else {
      const newRef = doc(collection(db, "Events"));
      await setDoc(newRef, {
        attendance: attendance,
        course: course,
        isGroup: isGroup,
        location: location,
        subject: subject,
        date: date
      });
      console.log("success");

      const userDocRef = doc(db, "Users", auth.currentUser.uid);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        await updateDoc(doc(db, "Users", auth.currentUser.uid), {
          classes: docSnap.data().classes.concat([newRef.id])
        });
        alert("Success! Class created.");
      } else {
        alert("Sorry, something went wrong on our end!");
      }
    }
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
    label: 'Select Subject',
    value: null
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding" keyboardVerticalOffset={0}>
      <View style={styles.content}>
        <Text style={styles.title}>Create New Class</Text>
        <View style={styles.input}>

          <View style={styles.input1}>
            <RNPickerSelect
              placeholder={placeholder}
              items={options}
              onValueChange={text => setSubject(text)}
              value={subject}
            />
          </View>

          <TextInput
            style={styles.input2}
            placeholder="Course Name"
            placeholderTextColor="#cccccc"
            value={course}
            onChangeText={text => setCourse(text)}
          />
          
          <TextInput
            style={styles.input3}
            placeholder="Location (City)"
            placeholderTextColor="#cccccc"
            value={location}
            onChangeText={text => setLocation(text)}
          />
          <View style={styles.input4}>
            <View style={styles.datestyle}>
              <Text style={styles.filler}>Date / Time</Text>
              <DateTimePicker 
                value={date}
                mode={'date'}
                is24Hour={true}
                onChange={onChange}
              />
              <DateTimePicker
                value={date}
                mode={'time'}
                is24Hour={true}
                onChange={onChange}
              />
            </View>
          </View>
        </View>

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

        <TouchableOpacity style={styles.createButton} onPress={createClass}>
          <Text style={styles.ButtonText}>Create</Text>
        </TouchableOpacity>
      </View>
      <Navbar navigation={navigation} />
    </KeyboardAvoidingView>
  );
};

const constStyle = {
  backgroundColor: '#5f9eb8',
  width: '100%',
  margin: 20,
  padding: 15,
  borderRadius: 5,
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'black'
  },
  content: {
    position: 'absolute',
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center'
  },
  title: {
    fontSize: 40,
    bottom: '20%',
    textAlign: 'center',
    color: 'white'
  },
  input: {
    alignItems: 'center',
    width: '100%'
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 10,
    bottom: '30%'
  },
  input1: {
    ...constStyle,
    bottom: '25%'
  },
  input2: {
    ...constStyle,
    bottom: '30%',
  },
  input3: {
    ...constStyle,
    bottom: '35%'
  },
  input4: {
    ...constStyle,
    bottom: '40%'
  },
  datestyle: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  checkboxText: {
    margin: 10,
    fontSize: 25,
    color: 'white'
  },
  filler: {
    color: "#cccccc"
  },
  createButton: {
    backgroundColor: '#5f9eb8',
    padding: 10,
    borderRadius: 5,
    width: '80%',
    alignSelf: 'center',
    bottom: '10%'
  },
  ButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center'
  }, 
});

export default TeacherClassScreen;