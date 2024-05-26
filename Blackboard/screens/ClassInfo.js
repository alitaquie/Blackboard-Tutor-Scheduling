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
    const [isSortMenuVisible, setIsSortMenuVisible] = useState(false);

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
                        content: `Location: ${location}\nDate: ${strDate}\nTime: ${strTime} ${day_stats}\nAttendance: ${attendance}\nType: ${group_stat}`,
                        timestamp: timestamp
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
                        const teacherList = [];
                        for (const doc of querySnapshot.docs) {
                            const userData = doc.data();
                            const teacherId = doc.id;
                            const averageRating = await calcTeacherRating(teacherId);
                            teacherList.push({ id: teacherId, name: userData.name, rating: averageRating });
                        }
                        teacherData[docId] = teacherList;
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

    const calcTeacherRating = async (teacherId) => {
        try {
            const userRef = doc(db, "Users", teacherId);
            const userDoc = await getDoc(userRef);
            const ratings = userDoc.data().ratings;
    
            let totalRating = 0;
            let ratingCount = 0;
    
            for (const ratingId of ratings) {
                const reviewRef = doc(db, "Reviews", ratingId);
                const reviewDoc = await getDoc(reviewRef);
                if (reviewDoc.exists() && reviewDoc.data().starRating !== undefined) {
                    totalRating += reviewDoc.data().starRating;
                    ratingCount++;
                }
            }
    
            return ratingCount > 0 ? totalRating / ratingCount : 0;
        } catch (error) {
            console.error('Error calculating teacher rating:', error);
            return 0;
        }
    };

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
                                <Text key={idx} style={styles.teacherName}>{teacher.name} - {teacher.rating === 0 ? "No Rating" : `☆${teacher.rating.toFixed(2)}`}</Text>
                            ))}
                        </View>
                    </View>
                )}
                {isExpanded && (
                    <View style={styles.buttonRow}>
                        <TouchableOpacity onPress={() => getMoreInfo(index)} style={styles.moreInfoButton}>
                            <Text style={styles.buttonText}>More Info</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={finishSignUp} style={styles.signUpButton}>
                            <Text style={styles.buttonText}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        );
    };
    
    
    const sortDataByEarliestDate = () => {
        const sortedData = [...data].sort((a, b) => a.timestamp - b.timestamp);
        setData(sortedData);
        setIsSortMenuVisible(false);
    };
    const sortDataByLatestDate = () => {
        const sortedData = [...data].sort((a, b) => b.timestamp - a.timestamp);
        setData(sortedData);
        setIsSortMenuVisible(false);
    };
    const sortDataByHighestRating = () => {
        const sortedData = [...data].sort((a, b) => {
            const aRating = teachers[a.id]?.reduce((acc, teacher) => acc + teacher.rating, 0) / teachers[a.id]?.length || 0;
            const bRating = teachers[b.id]?.reduce((acc, teacher) => acc + teacher.rating, 0) / teachers[b.id]?.length || 0;
            return bRating - aRating;
        });
        setData(sortedData);
        setIsSortMenuVisible(false);
    };
    const sortDataByLowestRating = () => {
        const sortedData = [...data].sort((a, b) => {
            const aRating = teachers[a.id]?.reduce((acc, teacher) => acc + teacher.rating, 0) / teachers[a.id]?.length || 0;
            const bRating = teachers[b.id]?.reduce((acc, teacher) => acc + teacher.rating, 0) / teachers[b.id]?.length || 0;
            return aRating - bRating;
        });
        setData(sortedData);
        setIsSortMenuVisible(false);
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
                    <TouchableOpacity onPress={() => setIsSortMenuVisible(!isSortMenuVisible)} style={styles.sortButton}>
                        <Text style={styles.buttonText}>Sort By</Text>
                    </TouchableOpacity>
                    {isSortMenuVisible && (
                        <View style={styles.sortOptionsContainer}>
                            <TouchableOpacity onPress={sortDataByEarliestDate} style={styles.sortOptionButton}>
                                <Text style={styles.buttonText}>Earliest Date</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={sortDataByLatestDate} style={styles.sortOptionButton}>
                                <Text style={styles.buttonText}>Latest Date</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={sortDataByHighestRating} style={styles.sortOptionButton}>
                                <Text style={styles.buttonText}>Highest Rating</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={sortDataByLowestRating} style={styles.sortOptionButton}>
                                <Text style={styles.buttonText}>Lowest Rating</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    {isLoading && 
                    (<View style={styles.loadingstyle}>
                        <ActivityIndicator color="white"/>
                        <Text style={styles.buttonText}>Loading</Text>
                    </View>)}
                    <View style={styles.exliststyle} >
                        <ExpandableList data={data}/>
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
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        width: '45%',
        borderColor: 'white',
        borderWidth: 2
    },
    moreInfoButton: {
        margin: 15,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        width: '45%',
        borderColor: 'white',
        borderWidth: 2
    },
    buttonText: {
        fontSize: 20,
        color: 'white',
        textAlign: 'center',
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
    },
    sortButton: {
        margin: 15,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 15,
        width: 100,
        height: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
    },
    sortOptionsContainer: {
        backgroundColor: 'black',
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 10,
        position: 'absolute',
        top: 200,
        left: '35%',
        zIndex: 1,
    },
    sortOptionButton: {
        paddingVertical: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    }
});



export default ClassInfoScreen;