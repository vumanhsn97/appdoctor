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
import SearchScreen from './screens/SearchScreen';
import PatientProfile from './screens/PatientProfile';
import RelativeStas from './screens/RelativeStas';
import RegisterInformationPage from './screens/RegisterInformationPage';
import ForgetInformationPage from './screens/ForgetInformationPage';
import { YellowBox } from 'react-native';
import api from './services/config';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import io from 'socket.io-client';
const socket = io(api);
YellowBox.ignoreWarnings(['ViewPagerAndroid']);
import * as actions from './actions';

const LoginStack = createStackNavigator({
  LoginScreen: {
    screen: LoginScreen,
    navigationOptions: () => ({
      header: null,
    }),
  },
  RegisterInformationPage: {
    screen: RegisterInformationPage,
    navigationOptions: {
      headerStyle: {
        backgroundColor: 'rgba(54, 175, 160, 1)',
      },
      headerBackTitleStyle: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'white',
      },
      headerTintColor: 'white'
    },
  },
  ForgetInformationPage: {
    screen: ForgetInformationPage,
    navigationOptions: {
      headerStyle: {
        backgroundColor: 'rgba(54, 175, 160, 1)',
      },
      headerBackTitleStyle: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'white',
      },
      headerTintColor: 'white'
    },
  }
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
  NotifyScreen: {
    screen: NotifyScreen,
    navigationOptions: () => ({
      header: null,
    }),
  },
});

const ProfileStack = createStackNavigator({
  ProfileScreen: {
    screen: ProfileScreen,
    navigationOptions: () => ({
      header: null,
    }),
  },
});

getNotifi = async () => {
  const userId = await AsyncStorage.getItem('UserId');
  socket.emit("join room", {
    LoaiTaiKhoan: 2,
    MaTaiKhoan: userId
  })
  socket.emit('get notifications number', {
    MaTaiKhoan: userId,
    LoaiTaiKhoan: 2
  })
  socket.on('get notifications number', (info) => {
    return info;
  })
}

const TabNavigator = createMaterialTopTabNavigator({
  HomeStack: HomeStack,
  MessStack: MessStack,
  NotifyStack: NotifyStack,
  ProfileStack: ProfileStack
},
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        let iconName;
        const { routeName } = navigation.state;
        if (routeName === 'HomeStack') {
          iconName = 'address-book';
        } else if (routeName === 'MessStack') {
          iconName = 'comments';
        } else if (routeName === 'NotifyStack') {
          iconName = 'bell';
        } else if (routeName === 'ProfileStack') {
          iconName = 'user';
        }
        this.getNotifi();
        return (
          <View>
            {iconName != 'befll' ? <Icon size={20} color={tintColor} name={iconName} /> :
              <View>
                <Icon size={20} color={tintColor} name={iconName} />
                <Text style={{ position: 'absolute', bottom: 10, left: 15, color: 'red' }}>2</Text>
              </View>
            }
          </View>
        )
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
  TabNavigator: {
    screen: TabNavigator,
    navigationOptions: () => ({
      header: null
    }),
  },
  PatientScreen: {
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
  SearchScreen: {
    screen: SearchScreen,
    navigationOptions: () => ({
      header: null,
    }),
  },
  PatientProfile: {
    screen: PatientProfile,
    navigationOptions: () => ({
      headerStyle: {
        backgroundColor: 'rgba(54, 175, 160, 1)',
      },
      headerTintColor: 'white',
    }),
  },
  RelativeStas: {
    screen: RelativeStas,
    navigationOptions: () => ({
      header: null,
    }),
  },
});

const MainNavigator = createAppContainer(createSwitchNavigator({
  AuthLoading: AuthLoadingScreen,
  LoginStack: {
    screen: LoginStack,
    navigationOptions: {
      header: null,
    },
  },
  AppStack: {
    screen: TabScreen,
    navigationOptions: {
      header: null,
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

