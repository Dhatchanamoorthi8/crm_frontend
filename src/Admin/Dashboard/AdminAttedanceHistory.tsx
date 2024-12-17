
import React, { useCallback, useEffect, useState } from 'react';
import api from '@/src/Services/axiosConfig';
import { Card, HStack, ScrollView, View, VStack } from '@gluestack-ui/themed';
import { Text } from '@gluestack-ui/themed';
import { RefreshControl } from 'react-native-gesture-handler';
import { Center } from '@gluestack-ui/themed';
import Spinner from 'react-native-loading-spinner-overlay';
import { StyleSheet } from 'react-native';
import { Avatar } from '@gluestack-ui/themed';
import { ColorCodes } from '@/src/Components/ColorCodes';
import { AvatarFallbackText } from '@gluestack-ui/themed';
import { Heading } from '@gluestack-ui/themed';
import { Divider } from '@gluestack-ui/themed';

const AdminAttedanceHistory = ({ route }) => {
    // Access the passed data via route.params
    const { filtertype } = route.params;

    const [loader, setloader] = useState(false);

    const [refreshing, setRefreshing] = useState(false)

    const [HistoryData, setHistoryData] = useState([])

    const fetchData = async () => {
        try {

            const response = await api.get(`attendance/adminAttendanceHistory?filtertype=${filtertype}`)

            if (response.data) {
                setHistoryData(response.data)
            }



        } catch (error) {

            console.log(error);

        }
    }


    useEffect(() => {
        fetchData()
    }, [filtertype])

    const onRefresh = useCallback(() => {
        setRefreshing(true)
        fetchData()
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
                        <View mx={'$3'} my={'$3'}>
                            <Text
                                fontFamily='MonaSans_400Regular'
                                textTransform='capitalize'
                                color='#7D8592'
                                textAlign='center'
                            >
                                {filtertype}
                            </Text>
                        </View>

                        {HistoryData.map((item, index) => (
                            <Card variant='elevated' style={styles.card} key={index}>
                                <View>
                                    <VStack space='4xl'>
                                        <HStack
                                            space='md'
                                            justifyContent='space-between'
                                            alignItems='center'
                                        >
                                            <HStack space='md'>
                                                <Avatar
                                                    className='bg-indigo-600'
                                                    bg={ColorCodes(item.name)}
                                                >
                                                    <AvatarFallbackText className='text-white'>
                                                        {item.name}
                                                    </AvatarFallbackText>

                                                    {/* <AvatarImage source={{ uri: item.profile }} /> */}
                                                    {/* {item.isactive ? (
                        <AvatarBadge bg='$green400' />
                    ) : (
                        <AvatarBadge bg='$red400' />
                    )} */}
                                                </Avatar>
                                                <VStack>
                                                    <Heading size='sm' fontFamily='NunitoSans_Bold'>
                                                        {item.name}
                                                    </Heading>
                                                    <Text
                                                        size='sm'
                                                        style={{ color: '#91929E', fontSize: 14 }}
                                                        fontFamily='NunitoSans_Regular'
                                                    >
                                                        {item.designation}
                                                    </Text>
                                                </VStack>
                                            </HStack>


                                        </HStack>
                                    </VStack>
                                </View>
                                <Divider my={'$5'} />

                                <View
                                    display='flex'
                                    flexDirection='row'
                                    justifyContent='space-between'
                                    my={'$5'}
                                >
                                    <View>
                                        <Text
                                            style={{ color: '#91929E', fontSize: 14 }}
                                            fontFamily='MonaSans_400Regular'
                                        >
                                            Intime
                                        </Text>

                                        <Text
                                            style={{ color: '#0A1629', fontSize: 16 }}
                                            fontFamily='NunitoSans_Regular'
                                        >
                                            {item.intime ? item.intime : 'Null'}
                                        </Text>
                                    </View>

                                    <View>
                                        <Text
                                            style={{ color: '#91929E', fontSize: 14 }}
                                            fontFamily='NunitoSans_Regular'
                                        >
                                            Outtime
                                        </Text>

                                        <Text
                                            style={{ color: '#0A1629', fontSize: 16 }}
                                            fontFamily='NunitoSans_Regular'
                                        >
                                            {item.outime ? item.outime : 'null'}
                                        </Text>
                                    </View>

                                    <View>
                                        <Text
                                            style={{ color: '#91929E', fontSize: 14 }}
                                            fontFamily='NunitoSans_Regular'
                                        >
                                            late Time
                                        </Text>

                                        <Text
                                            style={{ color: '#0A1629', fontSize: 16 }}
                                            fontFamily='NunitoSans_Regular'
                                        >
                                            {item.lateTime ? item.lateTime : 'Null'}
                                        </Text>
                                    </View>
                                </View>

                                <View>
                                    <Text
                                        style={{ color: '#91929E', fontSize: 14 }}
                                        fontFamily='NunitoSans_Regular'
                                    >
                                        Position
                                    </Text>

                                    <Text
                                        style={{ color: '#0A1629', fontSize: 16 }}
                                        fontFamily='NunitoSans_Regular'
                                    >
                                        {item.designationName}
                                    </Text>
                                </View>

                            </Card>
                        ))}
                    </View>
                )
                }



            </ScrollView >
        </View >
    );
};


const styles = StyleSheet.create({
    cardWrapper: {
        paddingHorizontal: 5,
        paddingVertical: 10
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
})


export default AdminAttedanceHistory;
