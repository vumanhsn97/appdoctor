import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,
  ActivityIndicator, StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

export default class AuthLoadingScreen extends Component {
  constructor() {
    super();
    this._bootstrapAsync();
  }

  _bootstrapAsync = async () => {
    const userId = await AsyncStorage.getItem('UserId');
    this.props.navigation.navigate(userId ? 'AppStack' : 'LoginStack');
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});