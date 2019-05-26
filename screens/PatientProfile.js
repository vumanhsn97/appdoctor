import React, { Component } from 'react';
import { View, ScrollView, Image, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Divider } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import api from '../services/config';
import io from 'socket.io-client';
const socket = io(api);
import AsyncStorage from '@react-native-community/async-storage';

class InforCard extends Component {
    render() {
        return (
            <View style={{ padding: 10 }}>
                <Text style={{ fontSize: 20 }}>{this.props.label}</Text>
                <Text>{this.props.detail}</Text>
            </View>
        )
    }
};

class PatientProfile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            follow: '',
        }

        //this._bootstrapAsync();
    }

    componentDidMount  = async() =>  {
        this.setState({ loading: true });
        const id = this.props.navigation.getParam('id', 'nope');
        const userId = await AsyncStorage.getItem('UserId');
        axios.get(api + 'follows/check-relationship-of-patient-with-doctor', {
            params: {
                MaBenhNhan: id,
                MaBacSi: userId
            }
        }).then(response => {
            console.log(response.data.typeRelationship);
            this.setState({ follow: response.data.typeRelationship })
        }).catch(error => {
            console.log(error)
        })
        axios.get(api + 'patients/find-patient-by-id', {
            params: {
                MaBenhNhan: id
            }
        }).then(response => {
            let data = response.data.patient[0];
            //console.log(data);
            let date = data.NgaySinh;
            date = new Date(date);
            date = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
            data.NgaySinh = date;
            if (response.data.status == 'success') {
                this.setState({ data: data })

            } else {
                //this.setState({ fail: 'Không tìm thấy bệnh nhân nào', patients: []})
            }
            this.setState({ loading: false });
        })
            .catch(error => {
                console.log(error)
            })
    };

    handleClick = async () => {
        
        const userId = await AsyncStorage.getItem('UserId');
        socket.emit("join room", {
            LoaiTaiKhoan: 2,
            MaTaiKhoan: this.state.data.MaBenhNhan
        })
        if (this.state.follow == 'add') {
            axios.post(api + 'follows/wait', {
                NguoiTheoDoi: userId,
                NguoiBiTheoDoi: this.state.data.MaBenhNhan,
                Type: 2
            }).then(response => {
                console.log('hello');
                this.setState({ follow: 'cancel' })
            }).catch(error => {
                console.log(error)
            })
            socket.emit("create notifications", {
                MaTaiKhoan: userId,
                LoaiNguoiChinh: 2,
                MaTaiKhoanLienQuan: this.state.data.MaBenhNhan,
                LoaiNguoiLienQuan: 1,
                TenNguoiLienQuan: this.state.data.HoTen,
                AvatarNguoiLienQuan: this.state.data.Avatar,
                LoaiThongBao: 1,
                LoaiTaiKhoan: 2
            });
        }
        if (this.state.follow == 'accept') {
            axios.post(api + 'follows/followed', {
                NguoiTheoDoi: userId,
                NguoiBiTheoDoi: this.state.data.MaBenhNhan,
                Type: 2
            }).then(response => {
                console.log('hello');
                this.setState({ follow: 'followed' })
            }).catch(error => {
                console.log(error)
            })
            socket.emit("create notifications", {
                MaTaiKhoan: userId,
                LoaiNguoiChinh: 2,
                MaTaiKhoanLienQuan: this.state.data.MaBenhNhan,
                LoaiNguoiLienQuan: 1,
                TenNguoiLienQuan: this.state.data.HoTen,
                AvatarNguoiLienQuan: this.state.data.Avatar,
                LoaiThongBao: 1,
                LoaiTaiKhoan: 2
            });
        }

        if (this.state.follow == 'followed' || this.state.follow == 'cancel') {
            axios.post(api + 'follows/unfollowed', {
                NguoiTheoDoi: userId,
                NguoiBiTheoDoi: this.state.data.MaBenhNhan,
                Type: 2
            }).then(response => {
                console.log('hello');
                this.setState({ follow: 'add' })
            }).catch(error => {
                console.log(error)
            })
        }
        
        socket.on("update list notifications", function (data) {
            console.log(data);
        })
    }

    handleClickUnFollow = () => {

    }

    _renderLayout = () => {
        if (!this.state.loading) {
            return (
                <ScrollView>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', padding: 10 }}>
                        <Image style={{ width: 80, height: 80, borderRadius: 80 / 2 }}
                            source={{ uri: 'data:image/jpeg;base64,' + this.state.data.Avatar }}
                        >
                        </Image>
                        <View style={{ flex: 1 }}>
                            <Text style={{ marginBottom: 15, fontSize: 20, paddingLeft: 20 }}>{this.state.data.HoTen}</Text>
                            <TouchableOpacity onPress={() => this.handleClick()}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 20 }}>
                                    <Text style={{ marginLeft: 5, fontSize: 16 }}>{this.state.follow}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', padding: 10 }}>
                        <Icon name='align-left' size={26}></Icon>
                        <Text style={{ fontSize: 18, marginLeft: 5 }}>Thông tin bệnh nhân</Text>
                    </View>
                    <Divider />
                    <View style={{ paddingLeft: 10, paddingRight: 10 }}>
                        <InforCard
                            label='Giới tính'
                            detail={(this.state.data.GioiTinh === null) ? 'Nữ' : 'Nam'}
                        />
                        <InforCard
                            label='Email'
                            detail={this.state.data.Email}
                        />
                        <InforCard
                            label='Ngày sinh'
                            detail={this.state.data.NgaySinh}
                        />
                        <InforCard
                            label='Địa chỉ'
                            detail={this.state.data.DiaChi}
                        />
                    </View>
                </ScrollView>
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
            <View>
                {this._renderLayout()}
            </View>
        )
    }
}

export default PatientProfile;