import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList } from 'react-native';
import * as actions from '../actions';
import api from '../services/config';
import AsyncStorage from '@react-native-community/async-storage';
import { Avatar } from 'react-native-elements';
import axios from 'axios';
import io from 'socket.io-client';
import Icon from 'react-native-vector-icons/FontAwesome5';
import NotiCard from '../components/NotiCard';
const socket = io(api);

class NotifyScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            notifications: []
        }
    }



    componentDidMount = async () => {
        const userId = await AsyncStorage.getItem('UserId');
        socket.emit("join room", {
            LoaiTaiKhoan: 2,
            MaTaiKhoan: userId
        })
        //AsyncStorage.clear();
        socket.on('update list notifications', async(info) => {
            axios.get(api + 'notifications', {
                params: {
                    MaTaiKhoan: await AsyncStorage.getItem('UserId'),
                    LoaiNguoiChinh: 2
                }
            }).then(response => {
                let data = response.data;
                console.log(data);
                if (data.status == 'success') {
                    data = data.notifications;
                    this.setState({ notifications: data, loading: false });
                }
            })
                .catch(error => {
                    console.log(error)
                })
        })
        axios.get(api + 'notifications', {
            params: {
                MaTaiKhoan: userId,
                LoaiNguoiChinh: 2
            }
        }).then(response => {
            let data = response.data;
            if (data.status == 'success') {
                data = data.notifications;
                this.setState({ notifications: data, loading: false });
            }
        })
            .catch(error => {
                console.log(error)
            })
    }

    _renderLayout = () => {
        if (!this.state.loading) {
            return (<FlatList
                data={this.state.notifications}
                keyboardShouldPersistTaps='always'
                keyExtractor={(item, index) => 'key' + index}
                renderItem={({ item }) => <NotiCard
                    data={item}
                    navigation={this.props.navigation}
                />}
            />)
        }
    }

    _renderNoNoti = () => {
        if (this.state.notifications.length < 1) {
            return (
                <View style={{ alignItems: 'center' }}>
                    <Text>Chưa có thông báo</Text>
                </View>
            )
        }
    }

    render() {
        return (
            <View>
                <View style={{ flexDirection: 'row', height: 60, borderBottomColor: '#EFEFEF', backgroundColor: 'rgba(54, 175, 160, 1)', alignItems: 'center' }}>
                    <View style={{ flex: 1, marginLeft: 5, marginRight: 5, alignItems: 'center' }}>
                        <Text style={{ fontSize: 20, color: 'white' }}>Thông báo</Text>
                    </View>
                </View>
                {this._renderNoNoti()}
                {this._renderLayout()}
            </View>
        );
    }
}

export default NotifyScreen;