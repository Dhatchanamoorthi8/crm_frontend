import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  StyleSheet
} from 'react-native'
import Animated, {
  Easing,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS
} from 'react-native-reanimated'
import { PanGestureHandler } from 'react-native-gesture-handler'

const DraggableCard = ({ children, index }) => {
  const [dragged, setDragged] = useState(false)
  const translateY = useSharedValue(0)

  const panGestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startY = translateY.value
    },
    onActive: (event, context) => {
      translateY.value = context.startY + event.translationY
    },
    onEnd: () => {
      // If the card is dragged more than halfway, snap to top
      translateY.value = withSpring(translateY.value < -150 ? -300 : 0)

      // Use runOnJS to call setDragged safely on the JS thread
      runOnJS(() => {
        setDragged(translateY.value < -150)
      })
    }
  })

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withSpring(translateY.value, {
            damping: 15,
            stiffness: 100
          })
        }
      ]
    }
  })

  return (
    <PanGestureHandler onGestureEvent={panGestureHandler}>
      <Animated.View style={[animatedStyle]}>
        {children}
      </Animated.View>
    </PanGestureHandler>
  )
}


export default DraggableCard
