import { EmptyWork } from '@/assets/Icons/SvgIcons';
import { ColorCodes } from '@/src/Components/ColorCodes';
import api from '@/src/Services/axiosConfig';
import { AvatarFallbackText } from '@gluestack-ui/themed';
import { Avatar } from '@gluestack-ui/themed';
import { AvatarBadge } from '@gluestack-ui/themed';
import { Card, Center, ScrollView, Text, View } from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { RefreshControl } from 'react-native-gesture-handler';
import Spinner from 'react-native-loading-spinner-overlay';

const AdminDashboard = () => {

    const navigate = useNavigation()

    const [loader, setloader] = useState(false);

    const [refreshing, setRefreshing] = useState(false)

    const [DashBoardCardcount, setDashBoardCardcount] = useState({
        totalEmployees: 0,
        present: 0,
        absent: 0,
        latePunch: 0,
        halfDay: 0
    })
    const [presentCardData, setPresentCardData] = useState([]);
    const [absentCardData, setAbsentCardData] = useState([]);
    const [latePunchCardData, setLatePunchCardData] = useState([]);
    const [halfDayCardData, setHalfDayCardData] = useState([]);


    // Fetch Dashboard Counts and All Card Data
    const fetchDashboardData = async () => {
        setloader(true);

        try {
            // Use Promise.all to fetch all data concurrently
            const [
                dashboardResponse,
                presentResponse,
                absentResponse,
                latePunchResponse,
                halfDayResponse,
            ] = await Promise.all([
                api.get('attendance/DashBoardCounts'), // Dashboard counts
                api.get('attendance/adminAttendanceHistory?filtertype=present'), // Present data
                api.get('attendance/adminAttendanceHistory?filtertype=absent'), // Absent data
                api.get('attendance/adminAttendanceHistory?filtertype=late'), // Late punch data
                api.get('attendance/adminAttendanceHistory?filtertype=halfday'), // Half day data
            ]);


            // Update states with API responses
            if (dashboardResponse.status === 200) {
                setDashBoardCardcount(dashboardResponse.data);
            }
            if (presentResponse.status === 200) {
                setPresentCardData(presentResponse.data);
            }
            if (absentResponse.status === 200) {
                setAbsentCardData(absentResponse.data);
            }
            if (latePunchResponse.status === 200) {
                setLatePunchCardData(latePunchResponse.data);
            }
            if (halfDayResponse.status === 200) {
                setHalfDayCardData(halfDayResponse.data);
            }

            console.log('All data fetched successfully');
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setloader(false);
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchDashboardData();
    }, []);



    const onRefresh = useCallback(() => {
        setRefreshing(true)
        fetchDashboardData()
        setTimeout(() => {
            setRefreshing(false)
        }, 1000)
    }, [])

    return (
        <View flex={1} bg="#F4F9FD">
            <ScrollView refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >

                {loader ? (


                    <>
                        <Center>
                            <Spinner size={'large'} visible={loader} />
                        </Center>

                        <Text textAlign="center" mt="$4">
                            No results found.
                        </Text>
                    </>


                ) : (
                    <View style={styles.cardWrapper}>

                        <View style={styles.container} >

                            <Card variant='filled' style={styles.largeCard}  >
                                <TouchableOpacity >
                                    <View style={styles.cardContent}>
                                        <Text style={styles.largeCardNumber}>{DashBoardCardcount.totalEmployees}</Text>
                                        <Text style={styles.largeCardText}>Total Employee</Text>
                                    </View>
                                </TouchableOpacity>

                            </Card>


                            <View style={styles.smallCardsContainer}  >

                                <View style={styles.row} m='$1'>


                                    <Card variant="filled" style={styles.smallCard} bg='#43A047' >
                                        <TouchableOpacity onPress={() => navigate.navigate('AdminAttedanceHistory', {
                                            filtertype: 'present'
                                        })}>
                                            <View style={styles.cardContent}>
                                                <Text style={styles.cardValue}>{DashBoardCardcount.present}</Text>
                                                <Text style={styles.cardTitle}>Present</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </Card>





                                    <Card variant="elevated" style={styles.smallCard} bg='#E53935'>
                                        <TouchableOpacity onPress={() => navigate.navigate('AdminAttedanceHistory', {
                                            filtertype: 'absent'
                                        })}>
                                            <View style={styles.cardContent}>
                                                <Text style={styles.cardValue}>{DashBoardCardcount.absent}</Text>
                                                <Text style={styles.cardTitle}>Absent</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </Card>

                                </View>


                                <View style={styles.row} m='$1'>
                                    <Card variant="elevated" style={styles.smallCard} bg='#FDD835'>
                                        <TouchableOpacity onPress={() => navigate.navigate('AdminAttedanceHistory', {
                                            filtertype: 'late'
                                        })} >
                                            <View style={styles.cardContent}>
                                                <Text style={styles.cardValue}>{DashBoardCardcount.latePunch}</Text>
                                                <Text style={styles.cardTitle}>Late Punch</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </Card>
                                    <Card variant="elevated" style={styles.smallCard} bg='#29B6F6'>
                                        <TouchableOpacity onPress={() => navigate.navigate('AdminAttedanceHistory', {
                                            filtertype: 'halfday'
                                        })}>
                                            <View style={styles.cardContent}>
                                                <Text style={styles.cardValue}>{DashBoardCardcount.halfDay}</Text>
                                                <Text style={styles.cardTitle}>Half Day</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </Card>

                                </View>

                            </View>
                        </View>


                        {/* Present Card */}


                        <View>
                            <Card
                                variant='elevated'
                                mx={'$2'}
                                my={'$3'}
                                rounded={'$2xl'}
                                style={styles.card}
                            >
                                <View
                                    flexDirection='row'
                                    gap={'$3'}
                                    justifyContent='space-between'
                                >
                                    <View alignItems='flex-start'>
                                        <Text fontFamily='MonaSans_Bold' fontSize={'$xl'} color="#43A047">
                                            Present
                                        </Text>
                                    </View>

                                    <View alignItems='flex-start'>
                                        <TouchableOpacity onPress={() => navigate.navigate('AdminAttedanceHistory', {
                                            filtertype: 'present'
                                        })}>
                                            <Text fontFamily='MonaSans_400Regular' color='$blue700'>
                                                View More
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <View
                                    mt={'$4'}
                                    style={{
                                        flexDirection: 'row',
                                        flexWrap: 'wrap',
                                        justifyContent: 'space-between',
                                        padding: 5,
                                        gap: 16
                                    }}
                                >
                                    {presentCardData.length > 0 ? (
                                        presentCardData.map((item, index) => (
                                            <TouchableOpacity
                                                key={item.id} // Use a unique key for each item
                                                onPress={() => navigate.navigate('AdminAttedanceHistory', {
                                                    filtertype: 'present'
                                                })}
                                                style={{
                                                    width: '45%',
                                                    marginBottom: 16
                                                }}
                                            >
                                                <Card
                                                    variant='elevated'
                                                    style={{
                                                        marginBottom: 16,
                                                        alignItems: 'center',
                                                        padding: 16,
                                                        backgroundColor: '#F4F9FD'
                                                    }}
                                                    rounded={'$lg'}
                                                >
                                                    <View style={{ alignItems: 'center' }}>

                                                        <Avatar
                                                            size='md'
                                                            bg={ColorCodes(item.name)}
                                                        >
                                                            <AvatarFallbackText>
                                                                {item.name}
                                                            </AvatarFallbackText>
                                                            {/* {item.Status === 'P' ? (
                                                                        <AvatarBadge bg='red' />
                                                                    ) : (
                                                                        <AvatarBadge bg='green' />
                                                                    )} */}
                                                        </Avatar>

                                                    </View>
                                                    <Text
                                                        style={{
                                                            marginTop: 8,
                                                            color: '#0A1629',
                                                            fontFamily: 'MonaSans_Bold'
                                                        }}
                                                        isTruncated={true}
                                                    >
                                                        {item.name}
                                                    </Text>
                                                    <Text fontFamily='MonaSans_400Regular' isTruncated={true} style={{ fontSize: 12 }}>
                                                        {item.designation}
                                                    </Text>
                                                </Card>
                                            </TouchableOpacity>
                                        ))
                                    ) : (
                                        <EmptyWork />
                                    )}
                                </View>
                            </Card>
                        </View>


                        {/* Absent Card */}

                        <View>
                            <Card
                                variant='elevated'
                                mx={'$2'}
                                my={'$3'}
                                rounded={'$2xl'}
                                style={styles.card}
                            >
                                <View
                                    flexDirection='row'
                                    gap={'$3'}
                                    justifyContent='space-between'
                                >
                                    <View alignItems='flex-start'>
                                        <Text fontFamily='MonaSans_Bold' fontSize={'$xl'} color="#E53935">
                                            Absent
                                        </Text>
                                    </View>

                                    <View alignItems='flex-start'>
                                        <TouchableOpacity onPress={() => navigate.navigate('AdminAttedanceHistory', {
                                            filtertype: 'absent'
                                        })}>
                                            <Text fontFamily='MonaSans_400Regular' color='$blue700'>
                                                View More
                                            </Text>
                                        </TouchableOpacity>

                                    </View>
                                </View>

                                <View
                                    mt={'$4'}
                                    style={{
                                        flexDirection: 'row',
                                        flexWrap: 'wrap',
                                        justifyContent: 'space-between',
                                        padding: 5,
                                        gap: 16
                                    }}
                                >
                                    {absentCardData.length > 0 ? (
                                        absentCardData.map((item, index) => (
                                            <TouchableOpacity
                                                key={item.id} // Use a unique key for each item
                                                //onPress={() => handlePartynameclick(item.id)}
                                                style={{
                                                    width: '45%',
                                                    marginBottom: 16
                                                }}
                                            >
                                                <Card
                                                    variant='elevated'
                                                    style={{
                                                        marginBottom: 16,
                                                        alignItems: 'center',
                                                        padding: 16,
                                                        backgroundColor: '#F4F9FD'
                                                    }}
                                                    rounded={'$lg'}
                                                >
                                                    <View style={{ alignItems: 'center' }}>

                                                        <Avatar
                                                            size='md'
                                                            bg={ColorCodes(item.name)}
                                                        >
                                                            <AvatarFallbackText>
                                                                {item.name}
                                                            </AvatarFallbackText>
                                                            {/* {item.Status === 'P' ? (
                                                                        <AvatarBadge bg='red' />
                                                                    ) : (
                                                                        <AvatarBadge bg='green' />
                                                                    )} */}
                                                        </Avatar>

                                                    </View>
                                                    <Text
                                                        style={{
                                                            marginTop: 8,
                                                            color: '#0A1629',
                                                            fontFamily: 'MonaSans_Bold'
                                                        }}
                                                        isTruncated={true}
                                                    >
                                                        {item.name}
                                                    </Text>
                                                    <Text fontFamily='MonaSans_400Regular' isTruncated={true} style={{ fontSize: 12 }}>
                                                        {item.designation}
                                                    </Text>
                                                </Card>
                                            </TouchableOpacity>
                                        ))
                                    ) : (
                                        <EmptyWork />
                                    )}
                                </View>
                            </Card>
                        </View>



                        {/* Late Card */}

                        <View>
                            <Card
                                variant='elevated'
                                mx={'$2'}
                                my={'$3'}
                                rounded={'$2xl'}
                                style={styles.card}
                            >
                                <View
                                    flexDirection='row'
                                    gap={'$3'}
                                    justifyContent='space-between'
                                >
                                    <View alignItems='flex-start'>
                                        <Text fontFamily='MonaSans_Bold' fontSize={'$xl'} color="#FDD835">
                                            Late
                                        </Text>
                                    </View>

                                    <View alignItems='flex-start'>
                                        <TouchableOpacity onPress={() => navigate.navigate('AdminAttedanceHistory', {
                                            filtertype: 'late'
                                        })}>
                                            <Text fontFamily='MonaSans_400Regular' color='$blue700'>
                                                View More
                                            </Text>
                                        </TouchableOpacity>

                                    </View>
                                </View>

                                <View
                                    mt={'$4'}
                                    style={{
                                        flexDirection: 'row',
                                        flexWrap: 'wrap',
                                        justifyContent: 'space-between',
                                        padding: 5,
                                        gap: 16
                                    }}
                                >
                                    {latePunchCardData.length > 0 ? (
                                        latePunchCardData.map((item, index) => (
                                            <TouchableOpacity
                                                key={item.id} // Use a unique key for each item
                                                //onPress={() => handlePartynameclick(item.id)}
                                                style={{
                                                    width: '45%',
                                                    marginBottom: 16
                                                }}
                                            >
                                                <Card
                                                    variant='elevated'
                                                    style={{
                                                        marginBottom: 16,
                                                        alignItems: 'center',
                                                        padding: 16,
                                                        backgroundColor: '#F4F9FD'
                                                    }}
                                                    rounded={'$lg'}
                                                >
                                                    <View style={{ alignItems: 'center' }}>

                                                        <Avatar
                                                            size='md'
                                                            bg={ColorCodes(item.name)}
                                                        >
                                                            <AvatarFallbackText>
                                                                {item.name}
                                                            </AvatarFallbackText>
                                                            {/* {item.Status === 'P' ? (
                                                                        <AvatarBadge bg='red' />
                                                                    ) : (
                                                                        <AvatarBadge bg='green' />
                                                                    )} */}
                                                        </Avatar>

                                                    </View>
                                                    <Text
                                                        style={{
                                                            marginTop: 8,
                                                            color: '#0A1629',
                                                            fontFamily: 'MonaSans_Bold'
                                                        }}
                                                        isTruncated={true}
                                                    >
                                                        {item.name}
                                                    </Text>
                                                    <Text fontFamily='MonaSans_400Regular' isTruncated={true} style={{ fontSize: 12 }}>
                                                        {item.designation}
                                                    </Text>
                                                </Card>
                                            </TouchableOpacity>
                                        ))
                                    ) : (
                                        <EmptyWork />
                                    )}
                                </View>
                            </Card>
                        </View>



                        {/* Half  Card */}

                        <View>
                            <Card
                                variant='elevated'
                                mx={'$2'}
                                my={'$3'}
                                rounded={'$2xl'}
                                style={styles.card}
                            >
                                <View
                                    flexDirection='row'
                                    gap={'$3'}
                                    justifyContent='space-between'
                                >
                                    <View alignItems='flex-start'>
                                        <Text fontFamily='MonaSans_Bold' fontSize={'$xl'} color="#29B6F6">
                                            Half Day
                                        </Text>
                                    </View>

                                    <View alignItems='flex-start'>
                                        <TouchableOpacity onPress={() => navigate.navigate('AdminAttedanceHistory', {
                                            filtertype: 'halfday'
                                        })}>
                                            <Text fontFamily='MonaSans_400Regular' color='$blue700'>
                                                View More
                                            </Text>
                                        </TouchableOpacity>

                                    </View>
                                </View>

                                <View
                                    mt={'$4'}
                                    style={{
                                        flexDirection: 'row',
                                        flexWrap: 'wrap',
                                        justifyContent: 'space-between',
                                        padding: 5,
                                        gap: 16
                                    }}
                                >
                                    {halfDayCardData.length > 0 ? (
                                        halfDayCardData.map((item, index) => (
                                            <TouchableOpacity
                                                key={item.id} // Use a unique key for each item
                                                //onPress={() => handlePartynameclick(item.id)}
                                                style={{
                                                    width: '45%',
                                                    marginBottom: 16
                                                }}
                                            >
                                                <Card
                                                    variant='elevated'
                                                    style={{
                                                        marginBottom: 16,
                                                        alignItems: 'center',
                                                        padding: 16,
                                                        backgroundColor: '#F4F9FD'
                                                    }}
                                                    rounded={'$lg'}
                                                >
                                                    <View style={{ alignItems: 'center' }}>

                                                        <Avatar
                                                            size='md'
                                                            bg={ColorCodes(item.name)}
                                                        >
                                                            <AvatarFallbackText>
                                                                {item.name}
                                                            </AvatarFallbackText>
                                                            {/* {item.Status === 'P' ? (
                                                                        <AvatarBadge bg='red' />
                                                                    ) : (
                                                                        <AvatarBadge bg='green' />
                                                                    )} */}
                                                        </Avatar>


                                                    </View>
                                                    <Text
                                                        style={{
                                                            marginTop: 8,
                                                            color: '#0A1629',
                                                            fontFamily: 'MonaSans_Bold'
                                                        }}
                                                        isTruncated={true}
                                                    >
                                                        {item.name}
                                                    </Text>
                                                    <Text fontFamily='MonaSans_400Regular' isTruncated={true} style={{ fontSize: 12 }}>
                                                        {item.designation}
                                                    </Text>
                                                </Card>
                                            </TouchableOpacity>
                                        ))
                                    ) : (
                                        <EmptyWork />
                                    )}
                                </View>
                            </Card>
                        </View>

                    </View>
                )}



            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    cardWrapper: {
        paddingHorizontal: 5,
        paddingVertical: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 13,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        marginBottom: 20,
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flex: 1,
        gap: 1
    },
    largeCard: {
        flex: 0,
        width: 160, // Square shape
        height: 170,
        borderRadius: 10,
        elevation: 4,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1E88E5',
    },
    largeCardNumber: {
        fontSize: 40,
        color: '#FFF',
        fontFamily: 'MonaSans_Bold'
    },
    largeCardText: {
        fontSize: 16,
        color: '#FFF',
        marginTop: 5,
        fontFamily: 'MonaSans_Black',
    },
    smallCardsContainer: {
        flex: 5,
        padding: 0,
        margin: 0

    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 1,
        gap: 4
    },
    smallCard: {
        flex: 6,
        height: 80, // Rectangular shape
        borderRadius: 8,
        elevation: 4,
        marginHorizontal: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: 14,
        fontFamily: 'MonaSans_Black',
        color: '#FFF',
        marginTop: 5,
    },
    cardValue: {
        fontSize: 20,
        fontFamily: 'MonaSans_Bold',
        color: '#FFF',
    },
    card: {
        backgroundColor: '#FFFFFF', // White background for card
        borderRadius: 13, // Rounded corners
        shadowColor: '#000', // Black shadow color
        shadowOffset: { width: 0, height: 4 }, // Shadow offset
        shadowOpacity: 0.1, // Shadow opacity
        shadowRadius: 8, // Shadow blur radius
        elevation: 5, // Elevation for Android (shadow on Android)
        marginBottom: 20 // Space between cards
    }
});

export default AdminDashboard;
