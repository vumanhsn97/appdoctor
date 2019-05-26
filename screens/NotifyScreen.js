import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList } from 'react-native';
import * as actions from '../actions';
import api from '../services/config';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import io from 'socket.io-client';
const socket = io(api);

class NotiCard extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        this.setState({ highlight: (this.props.data.DaXem == 0 ? true : false) });
    }

    onHandleClick = () => {
        if (this.state.highlight == true) {
            axios.post(api + 'notifications/seenThisNotification', {
                Id: this.props.data.Id,
                MaTaiKhoan: this.props.data.MaTaiKhoanChinh,
                LoaiNguoiChinh: this.props.data.LoaiNguoiChinh,
            }).then(response => {
                let data = response.data;
                if (data.status == 'success') {

                }
            })
                .catch(error => {
                    console.log(error)
                })
        }
        this.setState({ highlight: false });
        this.props.navigation.navigate('PatientProfile', {id: this.props.data.MaTaiKhoanChinh})
    }

    render() {
        return (
            <TouchableOpacity onPress={() => this.onHandleClick()}>
                <View style={{ padding: 10, flexDirection: 'row', backgroundColor: this.state.highlight ? '#EFEFEF' : 'white' }}>
                    <Image source={{ uri: this.props.data.AvatarNguoiLienQuan }} style={{ width: 40, height: 40, borderRadius: 60 / 2 }} />
                    <Text style={{ flex: 1, marginLeft: 10, fontSize: 14 }}>
                        <Text style={{ color: 'black' }}>{this.props.data.TenNguoiLienQuan}</Text>
                        <Text>{this.props.data.LoaiThongBao}</Text>
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }
}
var e;
class NotifyScreen extends Component {
    constructor(props) {
        super(props);
        e = this;
        this.state = {
            loading: true,
            notifications: []
        }
        this._bootstrapAsync();
    }

    componentDidMount() {

    }

    _bootstrapAsync = async () => {
        const userId = await AsyncStorage.getItem('UserId');
        socket.on('update list notifications', function (info) {
            e.setState({ notifications: [info, ...e.state.notifications], loading: false });
        })
        socket.emit("join room", {
            LoaiTaiKhoan: 2,
            MaTaiKhoan: userId
        })
        //AsyncStorage.clear();
        axios(api + 'notifications', {
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
                keyExtractor={e => e.MaBenhNhan}
                renderItem={({ item }) => <NotiCard
                    data={item}
                    navigation={this.props.navigation}
                />}
            />)
        }
    }

    render() {
        return (
            <View>
                <View style={{ flexDirection: 'row', marginBottom: 10, height: 60, borderBottomColor: '#EFEFEF', backgroundColor: 'rgba(54, 175, 160, 1)', alignItems: 'center' }}>
                    <View style={{ flex: 1, marginLeft: 5, marginRight: 5, alignItems: 'center' }}>
                        <Text style={{ fontSize: 20, color: 'white' }}>Thông báo</Text>
                    </View>
                </View>
                {(this.state.notifications.length < 1) ? <View style={{ alignItems: 'center' }}>
                    <Text>Chưa có thông báo</Text>
                </View> : <Text></Text>}
                {this._renderLayout()}
            </View>
        );
    }
}

export default NotifyScreen;