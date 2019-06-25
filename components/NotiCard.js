import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Avatar } from 'react-native-elements';
import axios from 'axios';
import api from '../services/config';
import AsyncStorage from '@react-native-community/async-storage'


class NotiCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            highlight: this.props.data.DaXem == 0 ? true : false
        }
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
        this.props.navigation.navigate('PatientProfile', { id: this.props.data.MaTaiKhoanLienQuan })
    }

    _renderTime = () => {
        var date = new Date(this.props.data.ThoiGian);
        var year = date.getFullYear();
        var month = date.getMonth();
        var day = date.getDate();
        var hour = date.getHours();
        var min = date.getMinutes();
        var sec = date.getSeconds();
        return (
            <Text style={{ color: 'rgba(54, 175, 160, 1)' }}>
                {day + '/' + month + '/' + year + ' lúc ' + (hour<10?'0':'') + hour + ":" + (min < 10 ? '0' : '') + min}
            </Text>
        )
    }

    render() {
        return (
            <TouchableOpacity onPress={() => this.onHandleClick()}>
                <View style={{ padding: 10, flexDirection: 'row',alignItems: 'center' , backgroundColor: this.state.highlight ? '#EFEFEF' : 'white' }}>
                    <Avatar
                        rounded
                        size='medium'
                        title={this.props.data.TenNguoiLienQuan ? this.props.data.TenNguoiLienQuan[this.props.data.TenNguoiLienQuan.lastIndexOf(' ') + 1] : ''}
                        activeOpacity={0.7}
                        containerStyle={{ width: 40, height: 40, borderRadius: 40 / 2 }}
                        source={{ uri: 'data:image/jpeg;base64,' + this.props.data.AvatarNguoiLienQuan }}
                    />
                    <View style={{ flex: 1, marginLeft: 10, fontSize: 14 }}>
                        <Text>
                            <Text>Bệnh nhân </Text>
                            <Text style={{ color: 'black' }}>{this.props.data.TenNguoiLienQuan}</Text>
                            <Text>{this.props.data.LoaiThongBao === 1 ? ' muốn bạn theo dõi sức khỏe' : this.props.data.LoaiThongBao === 2 ? ' gửi tin nhắn mới cho bạn' : ' đã chấp nhận được theo dõi'}</Text>
                        </Text>
                        {this._renderTime()}
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

export default NotiCard;