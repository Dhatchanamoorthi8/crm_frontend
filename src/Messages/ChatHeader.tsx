import { ChevronLeftIcon, Icon, VStack, Text, HStack, Avatar, AvatarFallbackText, AvatarImage, Heading } from '@gluestack-ui/themed';
import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ColorCodes } from '../Components/ColorCodes';
import ImagePreview from '../Components/ImagePreview';
import { format } from 'date-fns';

const ChatHeader = ({ navigation, title, route }) => {

    const { userid, userDataprops, lastOnline, isOnline, close } = route.params


    console.log(close, 'close');


    console.log(typeof (lastOnline), isOnline, 'isOnline');


    const [profileView, SetprofileView] = useState({
        isopen: false,
        base64: null,
    })




    function convertTo12HrFormat(timeString: any) {



        console.log(timeString);


        // Split the time string into hours, minutes, and seconds
        const [hours, minutes, seconds] = timeString.split(':');

        // Create a new Date object using the current date, but setting the time to the given hours, minutes, and seconds
        const date = new Date();
        date.setHours(hours);
        date.setMinutes(minutes);
        date.setSeconds(seconds);

        // Format the time to 12-hour format with AM/PM
        return format(date, 'hh:mm:ss a');  // e.g., "05:51:11 PM"
    }



    return (
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 15,
                backgroundColor: '#F4F9FD',
                shadowColor: '#fff',
            }}
        >
            <TouchableOpacity onPress={() => {
                //close()
                navigation.goBack()
            }}>
                <Icon as={ChevronLeftIcon} h={'$8'} w={'$8'} />
            </TouchableOpacity>





            <HStack space='md' style={{ marginLeft: 10 }}>

                <TouchableOpacity onPress={() => SetprofileView((current: any) => ({ ...current, isopen: true, base64: userDataprops.profile }))}>
                    <Avatar
                        className='bg-indigo-600'
                        bg={ColorCodes(userDataprops.username)}
                        size='md'
                    >
                        <AvatarFallbackText className='text-white'>
                            {userDataprops.username}
                        </AvatarFallbackText>

                        <AvatarImage
                            source={{
                                uri: `data:image/png;base64,${userDataprops.profile}`
                            }}
                            alt={'User Avatar'}
                        />

                    </Avatar>
                </TouchableOpacity>



                <VStack>
                    <Heading size='sm' fontFamily='MonaSans_400Regular'>
                        {userDataprops.username}
                    </Heading>

                    <Text>

                        {isOnline ? 'online' : convertTo12HrFormat(lastOnline)}
                        {/* {lastOnline === null ? isOnline : convertTo12HrFormat(lastOnline)} */}

                    </Text>

                </VStack>
            </HStack>



            <ImagePreview imageBase64={profileView.base64} modalVisible={profileView.isopen} closeModal={() =>
                SetprofileView((current: any) => ({ ...current, isopen: false }))
            } />


        </View>
    );
};

export default ChatHeader;
function usestate(arg0: { isopen: boolean; base64: null; }): [any, any] {
    throw new Error('Function not implemented.');
}

