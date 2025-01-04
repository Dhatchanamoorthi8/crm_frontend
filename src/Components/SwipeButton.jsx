import React, { useState } from 'react'
import { View, Text, Animated, StyleSheet, Dimensions } from 'react-native'
import { PanGestureHandler } from 'react-native-gesture-handler'

const SCREEN_WIDTH = Dimensions.get('window').width

const SwipeButton = ({ title, onComplete, backgroundColor }) => {
  const [swiped, setSwiped] = useState(false)
  const translateX = new Animated.Value(0)

  const handleGesture = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true }
  )

  const handleGestureEnd = ({ nativeEvent }) => {
    const swipeThreshold = SCREEN_WIDTH * 0.9 - 50 // Container width minus the button width

    if (nativeEvent.translationX >= swipeThreshold) {
      // Fully swiped to the end
      Animated.spring(translateX, {
        toValue: swipeThreshold, // Final position at the end
        useNativeDriver: true
      }).start(() => {
        setSwiped(true)
        if (onComplete) onComplete() // Trigger the onComplete action
      })
    } else {
      // Reset to initial position if not fully swiped
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true
      }).start()
    }
  }

  // If swiped, hide the swipe button
  if (swiped) {
    return null
  }

  return (
    <View style={[styles.swipeButton, { backgroundColor }]}>
      <PanGestureHandler
        onGestureEvent={!swiped ? handleGesture : undefined}
        onEnded={!swiped ? handleGestureEnd : undefined}
      >
        <Animated.View
          style={[
            styles.swipeCircle,
            {
              transform: [{ translateX: translateX }]
            }
          ]}
        >
          <Text style={[styles.arrow, { color: backgroundColor }]}>{'>'}</Text>
        </Animated.View>
      </PanGestureHandler>

      {/* Swipe Instruction Text */}
      {!swiped && (
        <Animated.Text
          style={[
            styles.swipeButtonText,
            {
              opacity: translateX.interpolate({
                inputRange: [0, SCREEN_WIDTH * 0.5],
                outputRange: [1, 0],
                extrapolate: 'clamp'
              })
            }
          ]}
        >
          {title}
        </Animated.Text>
      )}

      {/* Success Text */}
      {swiped && <Text style={styles.successText}>Done!</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  swipeButton: {
    width: SCREEN_WIDTH * 0.9,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative'
  },
  swipeCircle: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 5,
    zIndex: 1
  },
  arrow: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  swipeButtonText: {
    color: 'white',
    fontSize: 18,
    position: 'absolute',
    zIndex: 0,
    textAlign: 'center'
  },
  successText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center'
  }
})

export default SwipeButton
