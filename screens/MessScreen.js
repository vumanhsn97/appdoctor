import React, { Component } from 'react';
import { Provider, connect } from 'react-redux';
import { View, ScrollView, Text, FlatList, ListView, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import * as actions from '../actions';
import CardMess from '../components/CardMess';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../services/config';
import axios from 'axios';

class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            patients: [],
            refeshing: true,
            focus: false,
            textsearch: "",
            no: '',
        }
    }

    
    onLoadListPatients = async() => {
        const userId = await AsyncStorage.getItem('UserId');
        axios.get(api + 'follows/list-doctor-following', {
            params: {
                MaBacSi: userId
            }
        }).then(response => {
            let data = response.data;
            if (data.status == 'success') {
                data = data.list_patients;
                this.setState({ patients: data, no: '', refeshing: false });
            } else {
                //AsyncStorage.clear();
                //this.props.navigation.navigate('LoginStack');
                this.setState({ patients: [], refeshing: false, no: 'Không có bệnh nhân nào được theo dõi' });
            }
        })
            .catch(error => {
                console.log(error)
            })
        this.setState({ refeshing: false });
    }

    onRefreshing = () => {
        this.setState({ patients: [], refeshing: true }, async() => { await this.onLoadListPatients()})
    }

    componentDidMount = async () => {
        const userId = await AsyncStorage.getItem('UserId');
        //AsyncStorage.clear();

        this.onLoadListPatients();

        this.props.screenProps.socket.on('update list notifications', async(info) => {
            this.onRefreshing();
        });

        this.props.screenProps.socket.on('update relationship', async(info) => {
            this.onRefreshing();
        })
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
                        socket={this.props.screenProps.socket}
                    />}
                    refreshing={this.state.refeshing}
                    onRefresh={this.onRefreshing}
                />
            </View>
        );
    }
}

const mapStateToProps = state => ({
    patients: state.patients
});

export default connect(mapStateToProps, actions)(HomeScreen)