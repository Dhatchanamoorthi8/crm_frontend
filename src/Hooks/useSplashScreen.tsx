import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { ResizeMode, Video } from "expo-av";
import LottieView from "lottie-react-native";
import { Text } from "@gluestack-ui/themed";

const lottiePath = require('../../assets/Icons/logosplash.json');

const SplashScreen = ({ onFinish }) => {
    const [isReady, setIsReady] = useState(false);

    const animation = useRef<LottieView>(null);

    useEffect(() => {
        if (isReady) {
            setTimeout(() => onFinish(), 500);
        }
    }, [isReady]);

    return (
        <View style={styles.container}>
            {lottiePath ? (
                <LottieView
                    autoPlay
                    loop={false} // Ensure the animation does not loop infinitely
                    ref={animation}
                    style={styles.lottie}
                    source={lottiePath}
                    onAnimationFinish={() => setIsReady(true)} // This ensures `isReady` updates after animation finishes
                />

            ) : (
                <View>
                    <Text style={{ color: '#fff' }}>Loading Animation...</Text>
                </View>
            )}

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        height: '100%',
        backgroundColor: '#fff', // Change this to white or other colors
    },
    lottie: {
        width: Dimensions.get("window").width,
        height: 300,
        borderRadius: 12,  // Optional: rounded corners for the animation container
    },
});

export default SplashScreen;
