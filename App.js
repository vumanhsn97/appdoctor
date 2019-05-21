import * as React from 'react';
import { Button, Text, View, StyleSheet } from 'react-native';
import { Provider, connect } from 'react-redux';
import { createAppContainer, createStackNavigator, createMaterialTopTabNavigator, createSwitchNavigator } from 'react-navigation';
import { createStore, combineReducers } from 'redux';
import Icon from 'react-native-vector-icons/FontAwesome5';
import store from './store';
import HomeScreen from './screens/HomeScreen';
import PatientScreen from './screens/PatientScreen';
import MessScreen from './screens/MessScreen';
import NotifyScreen from './screens/NotifyScreen';
import ProfileScreen from './screens/ProfileScreen';
import AddAdvice from './screens/AddAdvice';
import ChatScreen from './screens/ChatScreen';
import LoginScreen from './screens/LoginScreen';
import AuthLoadingScreen from './screens/AuthLoadingScreen';

const LoginStack = createStackNavigator({
  LoginScreen: {
    screen: LoginScreen,
    navigationOptions: () => ({
     header: null,
    }),
  },
})

const HomeStack = createStackNavigator({
  HomeScreen: {
    screen: HomeScreen,
    navigationOptions: () => ({
     header: null,
    }),
  },
});

const MessStack = createStackNavigator({
  MessScreen: {
    screen: MessScreen,
    navigationOptions: () => ({
     header: null,
    }),
  },
});

const NotifyStack = createStackNavigator({
  NotifyScreen:  {
    screen: NotifyScreen,
    navigationOptions: () => ({
     header: null,
    }),
  },
});

const ProfileStack = createStackNavigator({
  ProfileScreen:  {
    screen: ProfileScreen,
    navigationOptions: () => ({
     header: null,
    }),
  },
});

const TabNavigator = createMaterialTopTabNavigator({
  HomeStack: HomeStack,
  MessStack: MessStack,
  NotifyStack: NotifyStack,
  ProfileStack: ProfileStack
},
{
  defaultNavigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ focused, tintColor}) => {
      let iconName;
      const { routeName } = navigation.state;
      if (routeName === 'HomeStack') {
        iconName='address-book';
      } else if (routeName === 'MessStack') {
        iconName = 'comments';
      } else if (routeName === 'NotifyStack') {
        iconName = 'bell';
      } else if (routeName === 'ProfileStack') {
        iconName = 'user';
      }
      return <Icon size={20} color={tintColor} name={iconName} />;
    },
    title: 'hheaea',
    swipeEnabled: false,
    tabBarPosition: 'bottom',
    tabBarOptions: {
      activeTintColor: 'rgba(54, 175, 160, 1)',
      inactiveTintColor: 'rgba(54, 175, 160, 0.5)',
      indicatorStyle: {
        opacity: 0
      },
      style: {
        backgroundColor: 'white',
        borderTopColor: '#EFEFEF',
        borderTopWidth: 1,
      },
      showLabel: false,
      showIcon: true,
    },
  })
});

const TabScreen = createStackNavigator({
  TabNavigator:  {
    screen: TabNavigator,
    navigationOptions: () => ({
     header: null
    }),
  },
  PatientScreen:  {
    screen: PatientScreen,
    navigationOptions: () => ({
      headerStyle: {
        backgroundColor: 'rgba(54, 175, 160, 1)',
      },
      headerTintColor: 'white',
    }),
  },
  AddAdvice: {
    screen: AddAdvice,
    navigationOptions: () => ({
      header: null,
    }),
  },
  ChatScreen: {
    screen: ChatScreen,
    navigationOptions: () => ({
      headerStyle: {
        backgroundColor: 'rgba(54, 175, 160, 1)',
      },
      headerTintColor: 'white',
    }),
  },
});

const MainNavigator = createAppContainer(createSwitchNavigator({
  AuthLoading: AuthLoadingScreen,
  LoginStack: {screen: LoginStack,
    navigationOptions:{
      header:null,
    },
  },
  AppStack : {
    screen: TabScreen,
    navigationOptions:{
      header:null,
    },
  }
}, {
  initialRouteName: 'AuthLoading',
}));

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <MainNavigator />
      </Provider>
    );
  }
}

