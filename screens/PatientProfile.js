import React, { Component } from 'react';
import { View, ScrollView, Image, Text, ActivityIndicator, TouchableOpacity, Linking } from 'react-native';
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
                <Text style={{ fontSize: 20, color: 'black' }}>{this.props.detail}</Text>
                <Text>{this.props.label}</Text>
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
            type: ''
        }

        //this._bootstrapAsync();
    }

    componentDidMount = async () => {
        this.setState({ loading: true });
        const id = this.props.navigation.getParam('id', 'nope');
        const userId = await AsyncStorage.getItem('UserId');
        axios.get(api + 'follows/check-relationship-of-patient-with-doctor', {
            params: {
                MaBenhNhan: id,
                MaBacSi: userId
            }
        }).then(response => {
            //console.log(response.data.typeRelationship);
            var d;
            switch(response.data.typeRelationship) {
                case 'followed':
                    d = 'Hủy theo dõi'
                    break;
                case 'add':
                    d = 'Theo dõi'
                    break;
                case 'accept':
                    d = 'Đồng ý theo dõi'
                    break;
                case 'cancel':
                    d = 'Hủy yêu cầu'
            }
            this.setState({ follow: d, type: response.data.typeRelationship })
        }).catch(error => {
            console.log(error)
        })
        axios.get(api + 'doctors/find-doctor-by-id', {
            params: {
                MaBacSi: userId
            }
        }).then(response => {
            this.setState({ doctor: response.data.doctor[0] });
            console.log(response.data);
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
            MaTaiKhoan: userId
        })
        if (this.state.type == 'add') {
            axios.post(api + 'follows/wait', {
                NguoiTheoDoi: userId,
                NguoiBiTheoDoi: this.state.data.MaBenhNhan,
                Type: 2
            }).then(response => {
                //console.log('hello');
                this.setState({ follow: 'Hủy yêu cầu', type: 'cancel' })
            }).catch(error => {
                console.log(error)
            })
            socket.emit("create notifications", {
                MaTaiKhoan: this.state.data.MaBenhNhan,
                LoaiNguoiChinh: 1,
                MaTaiKhoanLienQuan: this.state.doctor.MaBacSi,
                LoaiNguoiLienQuan: 2,
                TenNguoiLienQuan: this.state.doctor.HoTen,
                AvatarNguoiLienQuan: this.state.doctor.Avatar,
                LoaiThongBao: 1
            });
        }
        if (this.state.type == 'accept') {
            axios.post(api + 'follows/followed', {
                NguoiTheoDoi: userId,
                NguoiBiTheoDoi: this.state.data.MaBenhNhan,
                Type: 2
            }).then(response => {
                //console.log('hello');
                this.setState({ follow: 'Hủy theo dõi', type: 'followed' })
            }).catch(error => {
                console.log(error)
            })
            socket.emit("create notifications", {
                MaTaiKhoan: this.state.data.MaBenhNhan,
                LoaiNguoiChinh: 1,
                MaTaiKhoanLienQuan: this.state.doctor.MaBacSi,
                LoaiNguoiLienQuan: 2,
                TenNguoiLienQuan: this.state.doctor.HoTen,
                AvatarNguoiLienQuan: this.state.doctor.Avatar,
                LoaiThongBao: 3
            });
        }

        if (this.state.type == 'followed' || this.state.type == 'cancel') {
            axios.post(api + 'follows/unfollowed', {
                NguoiTheoDoi: userId,
                NguoiBiTheoDoi: this.state.data.MaBenhNhan,
                Type: 2
            }).then(response => {
                //console.log('hello');
                this.setState({ follow: 'Theo dõi', type: 'add' })
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
                            <Text style={{ marginBottom: 15, fontSize: 20, paddingLeft: 20, color: 'black' }}>{this.state.data.HoTen}</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ flex: 1 }}>
                                    <TouchableOpacity onPress={() => Linking.openURL(`tel:${this.state.data.MaBenhNhan}`)}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 20 }}>
                                            <Icon name='phone' size={20} />
                                            <Text style={{ marginLeft: 5, fontSize: 16 }}>Gọi điện</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.handleClick()}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 20, marginTop: 10 }}>
                                            <Icon name='eye' size={20} />
                                            <Text style={{ marginLeft: 5, fontSize: 16 }}>{this.state.follow}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View>
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('ChatScreen', { data: this.state.data })}>

                                        <View style={{ flexDirection: 'row', paddingLeft: 20 }}>
                                            <Icon name='comment-dots' size={20} />
                                            <Text style={{ marginLeft: 5, fontSize: 16 }}>Nhắn tin</Text>
                                        </View>
                                    </TouchableOpacity>
                                    {(this.state.follow == 'followed' ? <TouchableOpacity onPress={() => this.props.navigation.navigate('RelativeStas', { data: this.state.data })}>

                                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 20, marginTop: 10 }}>
                                            <Icon name='file-contract' size={20} />
                                            <Text style={{ marginLeft: 5, fontSize: 16 }}>Xem chỉ số</Text>
                                        </View>
                                    </TouchableOpacity> : <Text></Text>)}
                                </View>
                            </View>
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