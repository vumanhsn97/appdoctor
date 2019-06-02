import React, { Component } from 'react';
import { Provider, connect } from 'react-redux';
import { View, ScrollView, Text, FlatList, ListView, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import * as actions from '../actions';
import CardMess from '../components/CardMess';
import AsyncStorage from '@react-native-community/async-storage';
import io from 'socket.io-client';
import api from '../services/config';
import axios from 'axios';
const socket = io(api);

class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            patients: [],
            focus: false,
            textsearch: "",
            no: '',
        }
    }

    static navigationOptions = {
        drawerLabel: 'HomeScreen',
        drawerIcon: ({ tintColor }) => (
            <Icon name='search' size={20} color='black' />
        ),
    };

    componentDidMount = async () => {
        const userId = await AsyncStorage.getItem('UserId');
        //AsyncStorage.clear();
        socket.emit("join room", {
            LoaiTaiKhoan: 2,
            MaTaiKhoan: userId
        })

        axios.get(api + 'follows/list-doctor-following', {
            params: {
                MaBacSi: userId
            }
        }).then(response => {
            let data = response.data;
            if (data.status == 'success') {
                data = data.list_patients;
                console.log(data);
                this.setState({ patients: data });
            } else {
                //AsyncStorage.clear();
                //this.props.navigation.navigate('LoginStack');
                this.setState({ no: 'Không có bệnh nhân nào được theo dõi' });
            }
        })
            .catch(error => {
                console.log(error)
            })

        socket.on('update list notifications', async(info) => {
            axios(api + 'follows/list-doctor-following', {
                params: {
                    MaBacSi: await AsyncStorage.getItem('UserId')
                }
            }).then(response => {
                let data = response.data;
                if (data.status == 'success') {
                    data = data.list_patients;
                    this.setState({ patients: data, no: '' });
                } else {
                    //AsyncStorage.clear();
                    //this.props.navigation.navigate('LoginStack');
                    this.setState({ patients: [], no: 'Không có bệnh nhân nào được theo dõi' });
                }
            })
                .catch(error => {
                    console.log(error)
                })
        });

        socket.on('update relationship', (info) => {
            axios(api + 'follows/list-doctor-following', {
                params: {
                    MaBacSi: userId
                }
            }).then(response => {
                let data = response.data;
                if (data.status == 'success') {
                    data = data.list_patients;
                    this.setState({ patients: data, no: '' });
                } else {
                    //AsyncStorage.clear();
                    //this.props.navigation.navigate('LoginStack');
                    this.setState({ patients: [], no: 'Không có bệnh nhân nào được theo dõi' });
                }
            })
                .catch(error => {
                    console.log(error)
                })
        });
    }

    componentWillUnmount() {

    }

    _renderNo = () => {
        if (this.state.no === '') return;
        return (<View style={{ flexDirection: 'column', alignItems: 'center' }}>
            <Text style={{ color: 'black' }}>{this.state.no}</Text>
        </View>)
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', marginBottom: 10, height: 60, borderBottomColor: '#EFEFEF', backgroundColor: 'rgba(54, 175, 160, 1)', alignItems: 'center' }}>
                    <View style={{ flex: 1, marginLeft: 5, marginRight: 5, alignItems: 'center' }}>
                        <Text style={{ fontSize: 20, color: 'white' }}>Tin nhắn</Text>
                    </View>
                </View>
                {this._renderNo()}
                <FlatList
                    data={this.state.patients}
                    keyboardShouldPersistTaps='always'
                    keyExtractor={e => e.MaBenhNhan}
                    renderItem={({ item }) => <CardMess
                        item={item}
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