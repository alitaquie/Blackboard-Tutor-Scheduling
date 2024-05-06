import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Switch, Button, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation, useRoute } from '@react-navigation/native';
import Navbar from './Navbar';
import DateTimePicker from '@react-native-community/datetimepicker';
import {StatusBar} from 'expo-status-bar';
import { doc, getDoc, collection, updateDoc, query, where } from "firebase/firestore";
import { db, auth } from '../firebase';
import RNPickerSelect from 'react-native-picker-select';

const ClassInfoScreen = () => {
    const navigation = useNavigation();
    const backFunct = () => {
        navigation.navigate("StudentClass");
    }

    const finishSignUp = () => {
        navigation.navigate("Home");
    }

    const route = useRoute();
    const MatchingDocIDs = route.params?.MatchingDocIDs;

    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const newData = [];
            for (const docId of MatchingDocIDs) {
                const docRef = doc(db, 'Events', docId);
                const docSnap = await getDoc(docRef);
                if(docSnap.exists()) {
                    const { attendance, course, date, isGroup, location, subject} = docSnap.data();
                    let group_stat = ""
                    if (isGroup) {
                        group_stat = 'Group'
                    } else {
                        group_stat = 'Private'
                    }
                    const timestamp = date.seconds * 1000;
                    const new_date = new Date(timestamp);
                    
                    
                    const time = new_date.getTime() - (7 * 60 * 60 * 1000);
                    const tmp_date = new Date(time);
                    const strDate = tmp_date.toISOString().split("T")[0];
                    const strTime = tmp_date.toISOString().split("T")[1].split(".")[0]; 
                    newData.push({
                        id: doc.id,
                        title: course,
                        content: `Location: ${location}\nDate: ${strDate}\nTime: ${strTime}\nAttendance: ${attendance}\nType: ${group_stat}`
                    });
                }
            }
            setData(newData);
        };

        fetchData();
    }, [MatchingDocIDs]);

    const ExpandableListItem = ({ item, index, isExpanded, toggleExpand }) => {
        return (
            <View style={styles.itemContainer}>
                <TouchableOpacity onPress={toggleExpand} style={styles.itemTouchable}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                </TouchableOpacity>
                {isExpanded && (
                    <Text style={styles.itemContent}>{item.content}</Text>
                )}
            </View>
        );
    };
      
    const ExpandableList = ({ data }) => {
        const [expandedIndex, setExpandedIndex] = useState(null);
    
        const toggleExpand = (index) => {
            setExpandedIndex(expandedIndex === index ? null : index);
        };
    
        const renderItem = ({ item, index }) => (
            <ExpandableListItem
                item={item}
                index={index}
                isExpanded={expandedIndex === index}
                toggleExpand={() => toggleExpand(index)}
            />
        );
    
        return (
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
            />
        );
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <View>
                <TouchableOpacity onPress={backFunct} style={styles.backButton}>
                    <Text style={styles.buttonText}>Go Back</Text>
                </TouchableOpacity>

                <Text style={styles.title}>Matching Classes</Text>
                <ExpandableList data={data} />

                <TouchableOpacity onPress={finishSignUp} style={styles.signUpButton}>
                    <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#2b44bd'
    },
    title: {
        fontSize: 30,
        textAlign: 'center',
        margin: 20
    },
    backButton: {
        backgroundColor: 'cyan',
        top: -160,
        margin: 15,
        paddingVertical: 6,
        alignItems: 'center',
        borderRadius: 10,
        width: '25%'
    },
    signUpButton: {
        backgroundColor: 'cyan',
        margin: 15,
        paddingVertical: 20,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 10,
        width: '30%',
        bottom: -100
    },
    buttonText: {
        fontSize: 25
    },
    itemContainer: { 
        marginBottom: 15, 
        padding: 10, 
        backgroundColor: "white", 
        borderRadius: 10, 
        elevation: 3, 
    }, 
    itemTouchable: { 
        borderRadius: 10, 
        overflow: "hidden", 
    }, 
    itemTitle: { 
        fontSize: 18, 
        fontWeight: "bold", 
        color: "#333", 
    }, 
    itemContent: { 
        marginTop: 10, 
        fontSize: 14, 
        color: "#666", 
    }
})

export default ClassInfoScreen;