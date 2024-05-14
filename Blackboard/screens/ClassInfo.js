import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, View, FlatList, ActivityIndicator, ImageBackground } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { collection, query, where, getDoc, doc , getDocs, updateDoc, arrayUnion } from "firebase/firestore";
import { db, auth } from '../firebase';
import BackButton from '../features/backButton';

const ClassInfoScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const MatchingDocIDs = route.params?.MatchingDocIDs;
    

    const [savedIndex, setSavedIndex] = useState(null);

    const finishSignUp = async () => {
        try {
            // Update the user's document with the selected class ID added to the 'classes' array
            const userDocRef = doc(db, 'Users', auth.currentUser.uid);
            await updateDoc(userDocRef, { classes: arrayUnion(MatchingDocIDs[savedIndex]) });

            const eventDocRef = doc(db, 'Events', MatchingDocIDs[savedIndex]);
            const eventDocSnap = await getDoc(eventDocRef);
            if (eventDocSnap.exists()) {
              updateDoc(eventDocRef, { attendance: eventDocSnap.data().attendance += 1 });
            }

            // Navigate to the Home screen after successful sign-up
            navigation.navigate("Home");
        } catch (error) {
            console.error("Error signing up:", error);
            // Handle error, e.g., show error message to the user
        }
    };

    const getMoreInfo = (index) => {
        const expandedItemData = data[index];
        const classTeachers = teachers[expandedItemData.id] || []; // Get teachers for the selected class
        navigation.navigate('MoreInfo', { 
            expandedItemData: expandedItemData, 
            classTeachers: classTeachers,
            MatchingDocIDs: MatchingDocIDs // Pass teachers data to MoreInfo screen
        }); 
    };
    
    

    const [data, setData] = useState([]);
    const [teacherName, setTeacherName] = useState('');
    const [teachers, setTeachers] = useState([]); // Store teachers for each class
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const newData = [];
            for (const docId of MatchingDocIDs) {
                const docRef = doc(db, 'Events', docId);
                const docSnap = await getDoc(docRef);
                if(docSnap.exists()) {
                    const { attendance, course, date, isGroup, location, subject} = docSnap.data();
                    let group_stat = isGroup ? 'Group' : 'Private';
                    const timestamp = date.seconds * 1000;
                    const new_date = new Date(timestamp);
                    
                    
                    const time = new_date.getTime() - (7 * 60 * 60 * 1000);
                    const tmp_date = new Date(time);
                    const strDate = tmp_date.toISOString().split("T")[0];
                    let strTime = tmp_date.toISOString().split("T")[1].split(".")[0]; 

                    const hour = Number(strTime.substring(0,2));
                    day_stats = "";
                    if (hour < 12) {
                        if (hour == 0) {
                            strTime = `${hour+12}${strTime.substring(2)}`;
                        }
                        day_stats = "AM";
                    } else {
                        if (hour > 12) {
                            strTime = `${hour-12}${strTime.substring(2)}`;
                        }
                        day_stats = "PM";
                    }
                    strTime = strTime.substring(0,5);
                    strHour = strTime.split(":")[0];
                    strMinutes = strTime.split(":")[1];
                    strTime = strHour + ":" + strMinutes;

                    newData.push({
                        id: docSnap.id,
                        title: course,
                        content: `Location: ${location}\nDate: ${strDate}\nTime: ${strTime} ${day_stats}\nAttendance: ${attendance}\nType: ${group_stat}`
                    });
                }
            }
            setData(newData);
            setIsLoading(false);
        };

      

        // const [teachers, setTeachers] = useState({}); // Store teachers for each class

        const fetchTeacher = async () => {
            try {
                const teacherData = [];
                for (const docId of MatchingDocIDs) {
                    const usersRef = collection(db, 'Users');
                    const q = query(usersRef, where('role', '==', 'teacher'), where('classes', 'array-contains', docId));
                    const querySnapshot = await getDocs(q);
                    if (querySnapshot) {
                        querySnapshot.forEach((doc) => {
                            const userData = doc.data();
                            teacherData[docId] = []
                            teacherData[docId].push({ id: doc.id, name: userData.name });
                        });
                    }
                }
                setTeachers(teacherData);
            } catch (error) {
                console.error('Error fetching teacher data:', error);
            }
        };
        
        
        

        fetchData();
        fetchTeacher();
    }, [MatchingDocIDs]);


    const ExpandableListItem = ({ item, index, isExpanded, toggleExpand }) => {
        return (
            <View style={[styles.itemContainer, isExpanded && styles.expandedItem]}>
                <TouchableOpacity onPress={toggleExpand} style={styles.itemTouchable}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                </TouchableOpacity>
                {isExpanded && (
                    <View>
                        <Text style={styles.itemContent}>{item.content}</Text>
                        <View>
                            {teachers[item.id] && teachers[item.id].map((teacher, idx) => (
                                <Text key={idx} style={styles.teacherName}>{teacher.name}</Text>
                            ))}
                        </View>
                    </View>
                )}
                {isExpanded && (
                    <TouchableOpacity onPress={() => getMoreInfo(index)} style={styles.moreInfoButton}>
                        <Text style={styles.buttonText}>More Info</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };
    
   
    const ExpandableList = ({ data }) => {
        const [expandedIndex, setExpandedIndex] = useState(null);
    
        const toggleExpand = (index) => {
            setExpandedIndex(expandedIndex === index ? null : index);
            if (expandedIndex === null) {
                setSavedIndex(index);
            }
        };
    
        const renderItem = ({ item, index }) => (
            <ExpandableListItem
                item={item}
                index={index}
                isExpanded={expandedIndex === index}
                toggleExpand={() => toggleExpand(index)}
                teacherName={teacherName}
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
        <ImageBackground source={require('../assets/blackboard-bg.jpg')} resizeMode="cover" style={styles.image}>
            <KeyboardAvoidingView style={styles.container} behavior="padding">
                <View>
                    <BackButton dest="StudentClass" passInfo={{}}/>
                    <Text style={styles.title}>Matching Classes</Text>
                    {isLoading && 
                    (<View style={styles.loadingstyle}>
                        <ActivityIndicator color="white"/>
                        <Text style={styles.buttonText}>Loading</Text>
                    </View>)}
                    <View style={styles.exliststyle} >
                        <ExpandableList data={data}/>
                    </View>
                    

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={finishSignUp} style={styles.signUpButton}>
                            <Text style={styles.buttonText}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    title: {
        fontSize: 35,
        textAlign: 'center',
        margin: 20,
        top: '2%',
        color: 'white'
    },
    backButton: {
        margin: 15,
        paddingVertical: 6,
        alignItems: 'center',
        borderRadius: 10,
        width: '25%',
        top: '-3%',
        borderColor: 'white',
        borderWidth: 2
    },
    signUpButton: {
        margin: 15,
        paddingVertical: 20,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 10,
        width: '30%',
        bottom: -100,
        borderColor: 'white',
        borderWidth: 2
    },
    moreInfoButton: {
        backgroundColor: 'black',
        margin: 15,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 10,
        width: '30%',
        borderColor: 'white',
        borderWidth: 2
    },
    buttonText: {
        fontSize: 20,
        color: 'white',
        textAlign: 'center'
    },
    itemContainer: { 
        marginBottom: 15, 
        padding: 10, 
        backgroundColor: "black", 
        borderRadius: 10, 
        elevation: 3, 
        borderColor: 'white',
        borderWidth: 1.5
    }, 
    itemTouchable: { 
        borderRadius: 10, 
        overflow: "hidden", 
    }, 
    itemTitle: { 
        fontSize: 18, 
        fontWeight: "bold", 
        color: "white", 
    }, 
    itemContent: { 
        marginTop: 10, 
        fontSize: 14, 
        color: "white", 
    },
    expandedItem: {
        backgroundColor: '#011163', // Add your desired highlight color here
    },
    exliststyle: {
        bottom: '-5%',
        maxHeight: '55%'
    },
    teacherName: {
        color: 'white'
    },
    loadingstyle: {
        margin: 15
    },
    image: {
        flex: 1,
        justifyContent: 'center',
    }
})


export default ClassInfoScreen;