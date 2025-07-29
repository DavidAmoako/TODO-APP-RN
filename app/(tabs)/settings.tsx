import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const SettingsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>SettingsScreen</Text>
    </View>
  )
}

export default SettingsScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: '000',
        fontSize: 20,
    },
})