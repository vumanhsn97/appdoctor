import React, { Component } from 'react';
import { Provider, connect } from 'react-redux';
import { View, ScrollView, Text, FlatList, ListView, TextInput, TouchableOpacity, Keyboard} from 'react-native';
import CardPatient from '../components/CardPatient';
import Icon from 'react-native-vector-icons/FontAwesome5';
import * as actions from '../actions';
import api from '../services/config';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            patients: [],
            focus: false,
            textsearch: "",
        }

        this._bootstrapAsync();
    }

    _bootstrapAsync = async () => {
        const userId = await AsyncStorage.getItem('UserId');
        const password = await AsyncStorage.getItem('Password');
        axios.post(api + 'doctors/log-in', {
            MaBacSi: userId,
            Password: password
        })
            .then(async (response) => {
                if (response.data.status == 'success') {
                    this.props.loadMyProfile(response.data.doctor);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
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
        this.setState({ textsearch: "", focus: false })
    }


    componentWillMount() {
        const patientsData = this.props.patients;
        
        this.setState({ patients: patientsData, data: patientsData });
        
        /*fetch('http://192.168.1.15:5500/patients')
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson.patients);
            })
            .catch((error) => {
                console.error(error);
            });*/
    }

    searchPatient = ({ text }) => {
        this.setState({ textsearch: text });
        if (text === "") {
            this.setState({ patients: [] });
            return;
        }
        let list = [...this.state.data];
        for (let i = 0; i < list.length; i++) {
            if (list[i].name.indexOf(text) === -1) {
                list.splice(i, 1);
                i = i - 1;
            }
        }
        this.setState({ patients: list, textsearch: text });
    }

    onInputFocus = ({ text }) => {
        this.setState({ focus: true });
        this.searchPatient(text);
    }

    backClick = () => {
        let list = [...this.state.data];
        this.setState({ focus: false, patients: list, textsearch: "" });
        Keyboard.dismiss();
    }



    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', marginBottom: 10, height: 60, borderBottomColor: '#EFEFEF', backgroundColor: 'rgba(54, 175, 160, 1)', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', backgroundColor: 'white', flex: 1, borderRadius: 15, marginLeft: 5, marginRight: 5 }}>
                        <View style={{ justifyContent: 'center', paddingLeft: 10, paddingRight: 5 }}>
                            {this.state.focus ? <TouchableOpacity onPress={this.backClick} >
                                <Icon name='arrow-circle-left' size={20} color='gray' />
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
                    {this.state.focus ? <Text></Text> : <TouchableOpacity>
                        <View style={{ paddingLeft: 10, paddingRight: 10 }}>
                            <Icon name='user-plus' size={20} color='white' />
                        </View>
                    </TouchableOpacity>}
                </View>
                <FlatList
                    data={this.props.patients}
                    keyboardShouldPersistTaps='always'
                    keyExtractor={e => e.id}
                    renderItem={({ item }) => <CardPatient
                        id={item.id}
                        noti={item.noti}
                        name={item.name}
                        avatar={item.avatar}
                        type={item.type}
                        highlight={item.highlight}
                        navigation={this.props.navigation}
                    />}

                />
            </View>
        );
    }
}

const mapStateToProps = state => ({
    patients: state.patients
});

export default connect(mapStateToProps, actions)(HomeScreen)