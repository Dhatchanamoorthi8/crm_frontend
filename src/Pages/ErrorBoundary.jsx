import React, { Component } from 'react'
import { View, Text, Button, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'

class ErrorBoundary extends Component {
  constructor (props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError () {
    return { hasError: true }
  }

  componentDidCatch (error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleLogout = () => {
    const { navigation } = this.props
    navigation.replace('Login') // Ensure 'Login' matches your screen name
  }

  render () {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Something went wrong!</Text>
          <Button title='Logout & Login Again' onPress={this.handleLogout} />
        </View>
      )
    }
    return this.props.children
  }
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorText: {
    fontSize: 18,
    marginBottom: 10,
    color: 'red'
  }
})

export function ErrorBoundaryWrapper ({ children }) {
  const navigation = useNavigation()
  return <ErrorBoundary navigation={navigation}>{children}</ErrorBoundary>
}
