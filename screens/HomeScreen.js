import React, { Component } from 'react';
import { Provider, connect } from 'react-redux';
import { View, ScrollView, Text, FlatList, ListView, TextInput, TouchableOpacity, Keyboard, ActivityIndicator, YellowBox  } from 'react-native';
import CardPatient from '../components/CardPatient';
import Icon from 'react-native-vector-icons/FontAwesome5';
import * as actions from '../actions';
import api from '../services/config';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

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
            loading: false
        }

        this._bootstrapAsync();
    }

    _bootstrapAsync = async () => {
        const userId = await AsyncStorage.getItem('UserId');
        //AsyncStorage.clear();
        axios(api + 'follows/list-doctor-following', {
            params: {
                MaBacSi: userId
            }
          }).then(response => {
            let data = response.data;
            if  (data.status == 'success') {
                data = data.list_patients;
                this.setState({ patients: data, data: data, loading: true});
            }
          })
          .catch(error => {
            console.log(error)
          })
    }


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

    _renderLayout = () => {
        if (this.state.loading) {
            return (
                <View>
                    <View style={{ flexDirection: 'row', marginBottom: 10, height: 60, borderBottomColor: '#EFEFEF', backgroundColor: 'rgba(54, 175, 160, 1)', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', backgroundColor: 'white', flex: 1, borderRadius: 15, marginLeft: 5, marginRight: 5 }}>
                            <View style={{ justifyContent: 'center', paddingLeft: 10, paddingRight: 5 }}>
                                {(this.state.focus) ? <TouchableOpacity onPress={this.backClick} >
                                    <View style={{ paddingRight: 10 }}>
                                        <Icon name='arrow-circle-left' size={20} color='gray' />
                                    </View>
                                </TouchableOpacity> : <Icon name='search' size={20} color='gray' />}
                            </View>
                            <TextInput
                                style={{ flex: 1, padding: 5, }}
                                placeholder=''
                                value={this.state.textsearch}
                                onFocus={(text) => this.onInputFocus({ text })}
                                onChangeText={(text) => this.searchPatient({ text })}
                            />
                        </View>
                        {this.state.focus ? <Text></Text> : <TouchableOpacity onPress = {() => this.props.navigation.navigate('SearchScreen')}>
                            <View style={{ paddingLeft: 10, paddingRight: 10 }}>
                                <Icon name='user-plus' size={20} color='white' />
                            </View>
                        </TouchableOpacity>}
                    </View>
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
            <View style = {{ alignItems: "center", justifyContent: 'center', flex: 1 }}>
                <ActivityIndicator size="large" color="#00ff00"/>
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