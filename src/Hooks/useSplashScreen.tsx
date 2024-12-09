import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { ResizeMode, Video } from "expo-av";

const SplashScreen = ({ onFinish }) => {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (isReady) {
            setTimeout(() => onFinish(), 1500); // Duration of GIF or video
        }
    }, [isReady]);

    return (
        <View style={styles.container}>
            <Video
                source={require("../../assets/splash.mp4")} // Replace with your video file
                style={styles.video}
                shouldPlay
                isLooping={false}
                resizeMode={ResizeMode.CONTAIN}
                onPlaybackStatusUpdate={(status) => {
                    if (status.isLoaded && !status.isPlaying && status.didJustFinish) {
                        setIsReady(true);
                    }
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        height: '100%',
        backgroundColor:'#000'
    },
    video: {
        width: Dimensions.get("window").width,
        height: '100%',
    },
});

export default SplashScreen;
