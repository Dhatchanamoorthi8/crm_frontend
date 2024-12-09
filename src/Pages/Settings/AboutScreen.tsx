import React from 'react'
import { Center, View, Text, Heading, ScrollView, Image } from '@gluestack-ui/themed'
import * as Application from 'expo-application';

const AboutScreen = () => {

    console.log(Application.nativeApplicationVersion, 'version');

    return (
        <ScrollView style={{ backgroundColor: '#F4F9FD' }}>


            <View flex={1}>

                <View p="$10" m="$10">
                    <Image source={require("../../../assets/logo-01-04.png")} h="$72" w="$72" />
                </View>



                <Center>
                    <View>
                        <Text textAlign='center' fontFamily='MonaSans_SemiBold' color='#0A1629'>APP Version : {Application.nativeApplicationVersion}</Text>
                    </View>
                </Center>
            </View>




        </ScrollView >
    )
}

export default AboutScreen