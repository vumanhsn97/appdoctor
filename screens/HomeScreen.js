import React, { Component } from 'react';
import { Provider, connect } from 'react-redux';
import { View, ScrollView, Text, FlatList, ListView, TextInput, TouchableOpacity, Keyboard, ActivityIndicator, YellowBox } from 'react-native';
import CardPatient from '../components/CardPatient';
import Icon from 'react-native-vector-icons/FontAwesome5';
import * as actions from '../actions';
import api from '../services/config';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from "react-native-firebase";

YellowBox.ignoreWarnings([
    'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?'
]);

class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            patients: [],
            focus: false,
            textsearch: "",
            loading: false,
            refreshing: false,
            no: ''
        }

    }

    onLoadListPatinents = async () => {
        const userId = await AsyncStorage.getItem('UserId');
        axios(api + 'follows/list-doctor-following', {
            params: {
                MaBacSi: userId
            }
        }).then(response => {
            let data = response.data;
            if (data.status == 'success') {
                data = data.list_patients;
                this.setState({ patients: data, refreshing: false, no: '' });
            } else {
                //AsyncStorage.clear();
                //this.props.navigation.navigate('LoginStack');
                this.setState({ patients: [], no: 'Không có bệnh nhân nào được theo dõi' });
            }
        })
            .catch(error => {
                AsyncStorage.clear();
                this.props.navigation.navigate('LoginStack');
                console.log(error)
            })
    }

    onRefreshing = () => {
        this.setState({ refreshing: true, patients: [] }, async () => { await this.onLoadListPatinents() })
    }

    componentDidMount = async () => {
        const userId = await AsyncStorage.getItem('UserId');
        //AsyncStorage.clear();
        this.props.screenProps.socket.emit("join room", {
            LoaiTaiKhoan: 2,
            MaTaiKhoan: userId
        })

        this.props.screenProps.socket.emit('get notifications number', {
            LoaiTaiKhoan: 2,
            MaTaiKhoan: userId
        })

        this.props.screenProps.socket.on('get notifications number', (info) => {
            this.props.screenProps.updateNotification(info)
        })

        this.onLoadListPatinents();


        this.props.screenProps.socket.on("update relationship", (data) => {
            this.onLoadListPatinents();
        })

        this.setState({ loading: true })

        this.checkPermission();
        this.createNotificationListeners();
    }

    componentWillUnmount() {
        this.notificationListener();
        this.notificationOpenedListener();
    }

    componentWillMount  = async() => {
        this.props.screenProps.socket.emit("join room", {
            LoaiTaiKhoan: 2,
            MaTaiKhoan: await AsyncStorage.getItem('UserId')
        })
    }

    _renderNo = () => {
        if (this.state.no === '') return;
        return (
            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                <Text style={{ color: 'black' }}>{this.state.no}</Text>
            </View>)
    }

    _renderLayout = () => {
        if (this.state.loading) {
            return (
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', marginBottom: 10, height: 60, borderBottomColor: '#EFEFEF', backgroundColor: 'rgba(54, 175, 160, 1)', alignItems: 'center' }}>
                        <View style={{ flex: 1, marginLeft: 5, marginRight: 5, alignItems: 'center' }}>
                            <Text style={{ fontSize: 20, color: 'white' }}>Danh sách bệnh nhân</Text>
                        </View>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('SearchScreen')}>
                            <View style={{ width: 30 }}>
                                <Icon name='search' size={15} color='white' />
                            </View>
                        </TouchableOpacity>
                    </View>
                    {this._renderNo()}
                    <FlatList
                        data={this.state.patients}
                        keyboardShouldPersistTaps='always'
                        keyExtractor={e => e.MaBenhNhan}
                        renderItem={({ item }) => <CardPatient
                            id={item.MaBenhNhan}
                            noti={false}
                            name={item.HoTen}
                            avatar={'data:image/jpeg;base64,' + item.Avatar}
                            type='Tiểu đường'
                            highlight={false}
                            navigation={this.props.navigation}
                        />}
                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefreshing}
                    />
                </View>
            )
        }
        return (
            <View style={{ alignItems: "center", justifyContent: 'center', flex: 1 }}>
                <ActivityIndicator size="large" color="#00ff00" />
            </View>
        )
    }

    async checkPermission() {
        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
            this.getToken();
            // alert('enable')
        } else {
            // alert('unenable')
            this.requestPermission();
        }
    }

    //3
    async getToken() {
        let fcmToken = await AsyncStorage.getItem('fcmToken');
        if (!fcmToken) {
            // alert('token')
            fcmToken = await firebase.messaging().getToken();
            if (fcmToken) {
                // user has a device token
                await AsyncStorage.setItem('fcmToken', fcmToken);
                const userId = await AsyncStorage.getItem('UserId');
                await firebase.messaging().subscribeToTopic(`2-${ userId }`);
            }
        }
        // alert(fcmToken)
    }

    //2
    async requestPermission() {
        try {
            await firebase.messaging().requestPermission();
            // User has authorised
            this.getToken();
        } catch (error) {
            // User has rejected permissions
            console.log('permission rejected');
        }
    }


    render() {
        return (
            <View style={{ flex: 1 }}>
                {this._renderLayout()}
            </View>
        );
    }

    ////////////////////// Add these methods //////////////////////

  //Remove listeners allocated in createNotificationListeners()

  async createNotificationListeners() {
    /*
    * Triggered when a particular notification has been received in foreground
    * */
    this.notificationListener = firebase.notifications().onNotification((notification) => {
      const { title, body } = notification;
      // alert(notification)
      this.showAlert(title, body);
    });

    /*
    * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
    * */
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
      const { title, body } = notificationOpen.notification;
      this.showAlert(title, body);
    });

    /*
    * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
    * */
    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
      const { title, body } = notificationOpen.notification;
      // this.showAlert(title, body);
    }
    /*
    * Triggered for data only payload in foreground
    * */
    this.messageListener = firebase.messaging().onMessage((message) => {
      //process data message
      console.log(JSON.stringify(message));
    });
  }

  showAlert(title, body) {
    Alert.alert(
      title, body,
      [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ],
      { cancelable: false },
    );
  }
}

const mapStateToProps = state => ({
    patients: state.patients,
    noti: state.noti
});

export default connect(mapStateToProps, actions)(HomeScreen)