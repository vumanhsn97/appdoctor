import React, { Component } from 'react';
import { Provider, connect } from 'react-redux';
import { View, ScrollView, Text, FlatList, ListView, TextInput, TouchableOpacity, Keyboard, ActivityIndicator, YellowBox } from 'react-native';
import CardPatient from '../components/CardPatient';
import Icon from 'react-native-vector-icons/FontAwesome5';
import * as actions from '../actions';
import api from '../services/config';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import io from 'socket.io-client';
const socket = io(api);

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
            no: ''
        }

        this._bootstrapAsync();
    }

    _bootstrapAsync = async () => {
        const userId = await AsyncStorage.getItem('UserId');
        //AsyncStorage.clear();
        socket.emit("join room", {
            LoaiTaiKhoan: 2,
            MaTaiKhoan: userId
        })

        axios(api + 'follows/list-doctor-following', {
            params: {
                MaBacSi: userId
            }
        }).then(response => {
            let data = response.data;
            if (data.status == 'success') {
                data = data.list_patients;
                this.setState({ patients: data, data: data });
            } else {
                //AsyncStorage.clear();
                //this.props.navigation.navigate('LoginStack');
                this.setState({ no: 'Không có bệnh nhân nào được theo dõi' });
            }
        })
            .catch(error => {
                AsyncStorage.clear();
                this.props.navigation.navigate('LoginStack');
                console.log(error)
            })

        socket.on("update relationship", (data) => {
            axios(api + 'follows/list-doctor-following', {
                params: {
                    MaBacSi: data.LoaiNguoiGui == 2 ? data.MaNguoiGui : data.MaNguoiNhan
                }
            }).then(response => {
                let data = response.data;
                if (data.status == 'success') {
                    data = data.list_patients;
                    this.setState({ patients: data, data: data, no: '' });
                } else {
                    //AsyncStorage.clear();
                    //this.props.navigation.navigate('LoginStack');
                    this.setState({ data: [], patients: [], no: 'Không có bệnh nhân nào được theo dõi' });
                }
            })
                .catch(error => {
                    //AsyncStorage.clear();
                    //this.props.navigation.navigate('LoginStack');
                    console.log(error)
                })
        })

        this.setState({ loading: true })
    }

    static navigationOptions = {
        drawerLabel: 'HomeScreen',
        tabBarIcon: ({ focused, tintColor }) => {
            let iconName;
            const { routeName } = navigation.state;
            if (routeName === 'HomeStack') {
                iconName = 'search';
            } else if (routeName === 'MessStack') {
                iconName = 'comments';
            } else if (routeName === 'NotifyStack') {
                iconName = 'bell';
            } else if (routeName === 'ProfileStack') {
                iconName = 'user';
            }
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
    };


    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            this._keyboardDidShow,
        );
        this.keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            this._keyboardDidHide,
        );
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow() {
    }

    _keyboardDidHide = () => {
        //this.setState({ textsearch: "", focus: false })
        if (this.state.textsearch == "") this.setState({ focus: false });
    }


    componentWillMount() {
        //const patientsData = this.props.patients;

    }

    searchPatient = ({ text }) => {
        this.setState({ textsearch: text });
        let list = [...this.state.data];
        for (let i = 0; i < list.length; i++) {
            if (list[i].HoTen.indexOf(text) === -1) {
                list.splice(i, 1);
                i = i - 1;
            }
        }
        this.setState({ patients: list, textsearch: text });
    }

    onInputFocus = ({ text }) => {
        this.setState({ focus: true });
        //this.searchPatient(text);
    }

    backClick = () => {
        let list = [...this.state.data];
        this.setState({ focus: false, patients: list, textsearch: "" });
        Keyboard.dismiss();
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
                <View>
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

    render() {
        return (
            <View style={{ flex: 1 }}>
                {this._renderLayout()}
            </View>
        );
    }
}

const mapStateToProps = state => ({
    patients: state.patients
});

export default connect(mapStateToProps, actions)(HomeScreen)