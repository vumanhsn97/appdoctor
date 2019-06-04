import React, { Component } from 'react';
import { View, ScrollView, Image, Text, ActivityIndicator, TouchableOpacity, Linking } from 'react-native';
import { Divider, Avatar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import api from '../services/config';
import AsyncStorage from '@react-native-community/async-storage';

class InforCard extends Component {
    render() {
        return (
            <View style={{ padding: 10 }}>
                <Text style={{ fontSize: 20, color: 'black' }}>{(this.props.detail) ? this.props.detail : 'Chưa có dữ liệu'}</Text>
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
            console.log('hello' + response.data.typeRelationship);
            var d;
            var rela = response.data.typeRelationship
            if (rela === 'accept') rela = 'cancel'
            else if (rela === 'cancel') rela = 'accept'
            switch (rela) {
                case 'followed':
                    d = 'Hủy theo dõi'
                    break;
                case 'add':
                    d = 'Theo dõi'
                    break;
                case 'accept':
                    d = 'Đồng ý'
                    break;
                case 'cancel':
                    d = 'Hủy yêu cầu'
            }
            this.setState({ follow: d, type: rela })
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

        this.props.screenProps.socket.on("update relationship", (data) => {

            axios.get(api + 'follows/check-relationship-of-patient-with-doctor', {
                params: {
                    MaBenhNhan: data.LoaiNguoiGui === 1 ? data.MaNguoiGui : data.MaNguoiNhan,
                    MaBacSi: data.LoaiNguoiNhan === 2 ? data.MaNguoiNhan : data.MaNguoiGui
                }
            }).then(response => {

                var d;
                var rela = response.data.typeRelationship

                if (rela === 'accept') rela = 'cancel'
                else if (rela === 'cancel') rela = 'accept'
                switch (rela) {
                    case 'followed':
                        d = 'Hủy theo dõi'
                        break;
                    case 'add':
                        d = 'Theo dõi'
                        break;
                    case 'accept':
                        d = 'Đồng ý'
                        break;
                    case 'cancel':
                        d = 'Hủy yêu cầu'
                        break;
                }
                this.setState({ follow: d, type: rela })
            }).catch(error => {
                console.log(error)
                alert('err');
            })
        })
    };

    handleClick = async () => {
        const userId = await AsyncStorage.getItem('UserId');
        var load = false;
        if (this.state.type == 'add') {
            await axios.post(api + 'follows/wait', {
                NguoiTheoDoi: userId,
                NguoiBiTheoDoi: this.state.data.MaBenhNhan,
                LoaiNguoiTheoDoi: 2,
                LoaiNguoiBiTheoDoi: 1
            }).then(response => {
                //console.log('hello');
                load = false;
                this.setState({ follow: 'Hủy yêu cầu', type: 'cancel' })
            }).catch(error => {
                console.log(error)
            })
            this.props.screenProps.socket.emit("create notifications", {
                MaTaiKhoan: this.state.data.MaBenhNhan,
                LoaiNguoiChinh: 1,
                MaTaiKhoanLienQuan: this.state.doctor.MaBacSi,
                LoaiNguoiLienQuan: 2,
                TenNguoiLienQuan: this.state.doctor.HoTen,
                AvatarNguoiLienQuan: this.state.doctor.Avatar,
                LoaiThongBao: 1
            });
        }
        else if (this.state.type == 'accept') {
            await axios.post(api + 'follows/followed', {
                NguoiTheoDoi: userId,
                NguoiBiTheoDoi: this.state.data.MaBenhNhan,
                LoaiNguoiTheoDoi: 2,
                LoaiNguoiBiTheoDoi: 1
            }).then(response => {
                //console.log(response);
                load = true;
                this.setState({ follow: 'Hủy theo dõi', type: 'followed' })
            }).catch(error => {
                console.log(error)
            })
            this.props.screenProps.socket.emit("create notifications", {
                MaTaiKhoan: this.state.data.MaBenhNhan,
                LoaiNguoiChinh: 1,
                MaTaiKhoanLienQuan: this.state.doctor.MaBacSi,
                LoaiNguoiLienQuan: 2,
                TenNguoiLienQuan: this.state.doctor.HoTen,
                AvatarNguoiLienQuan: this.state.doctor.Avatar,
                LoaiThongBao: 3
            });
        }

        else if (this.state.type == 'followed' || this.state.type == 'cancel') {

            await axios.post(api + 'follows/unfollowed', {
                NguoiTheoDoi: userId,
                NguoiBiTheoDoi: this.state.data.MaBenhNhan,
                LoaiNguoiTheoDoi: 2,
                LoaiNguoiBiTheoDoi: 1
            }).then(response => {
                //console.log('hello');
                if (this.state.type == 'followed') {
                    load = true;
                } else load = false;
                this.setState({ follow: 'Theo dõi', type: 'add' })
            }).catch(error => {
                console.log(error)
            })
        }

        this.props.screenProps.socket.emit("update relationship", {
            MaNguoiGui: userId,
            LoaiNguoiGui: 2,
            MaNguoiNhan: this.state.data.MaBenhNhan,
            LoaiNguoiNhan: 1,
            updateList: true
        });
    }

    handleClickNotAccept = async() => {
        const userId = await AsyncStorage.getItem('UserId');
        await axios.post(api + 'follows/unfollowed', {
            NguoiTheoDoi: userId,
            NguoiBiTheoDoi: this.state.data.MaBenhNhan,
            LoaiNguoiTheoDoi: 2,
            LoaiNguoiBiTheoDoi: 1
        }).then(response => {
            //console.log('hello');
            this.setState({ follow: 'Theo dõi', type: 'add' })
        }).catch(error => {
            console.log(error)
        })
        this.props.screenProps.socket.emit("update relationship", {
            MaNguoiGui: userId,
            LoaiNguoiGui: 2,
            MaNguoiNhan: this.state.data.MaBenhNhan,
            LoaiNguoiNhan: 1,
            updateList: true
        });
    }

    _renderLayout = () => {
        if (!this.state.loading) {
            return (
                <ScrollView>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', padding: 10 }}>
                        <Avatar
                            rounded
                            size='large'
                            title={this.state.data.HoTen ? this.state.data.HoTen[this.state.data.HoTen.lastIndexOf(' ') + 1] : ''}
                            activeOpacity={0.7}
                            containerStyle={{ width: 80, height: 80 }}
                            source={{ uri: 'data:image/jpeg;base64,' + this.state.data.Avatar }}
                        />

                        <View style={{ flex: 1 }}>
                            <Text style={{ marginBottom: 15, fontSize: 20, paddingLeft: 20, color: 'black' }}>{this.state.data.HoTen}</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                                    <TouchableOpacity onPress={() => Linking.openURL(`tel:${this.state.data.MaBenhNhan}`)}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 20 }}>
                                            <Icon name='phone' size={20} color='rgba(54, 175, 160, 1)'/>
                                            <Text style={{ marginLeft: 5, fontSize: 16, color: 'rgba(54, 175, 160, 1)' }}>Gọi điện</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.handleClick()}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 20, marginTop: 10 }}>
                                            <Icon name={this.state.type == 'add' ? 'user-plus' : this.state.type == 'accept' ? 'user-check' : this.state.type=='cancel' ? 'user-minus' : 'user-slash'} size={20} color='rgba(54, 175, 160, 1)'/>
                                            <Text style={{ marginLeft: 5, fontSize: 16, color: 'rgba(54, 175, 160, 1)' }}>{this.state.follow}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ paddingRight: 20, justifyContent: 'space-between' }}>
                                    {
                                        (this.state.type == 'followed' ? <TouchableOpacity onPress={() => {
                                            
                                            axios.post(api + 'chatnotifications/update-seeing-seen-messages', {
                                                MaTaiKhoan: this.state.doctor.MaBacSi,
                                                LoaiTaiKhoan: 2,
                                                MaTaiKhoanLienQuan: this.state.data.MaBenhNhan,
                                                LoaiTaiKhoanLienQuan: 1
                                            }).then(response => {
                                                this.props.navigation.navigate('ChatScreen', { data: this.state.data })
                                            })
                                                .catch(error => {
                                                    console.log(error)
                                                })
                                        }} >
                                        <View style={{ flexDirection: 'row', paddingLeft: 20 }}>
                                            <Icon name='comment-dots' size={20} color='rgba(54, 175, 160, 1)'/>
                                            <Text style={{ marginLeft: 5, fontSize: 16, color: 'rgba(54, 175, 160, 1)' }}>Nhắn tin</Text>
                                        </View>
                                    </TouchableOpacity> : <Text></Text>)
                                    }
                                    {(this.state.type == 'followed' ? <TouchableOpacity onPress={() => this.props.navigation.navigate('RelativeStas', { data: this.state.data })}>

                                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 20, marginTop: 10 }}>
                                            <Icon name='file-contract' size={20} color='rgba(54, 175, 160, 1)'/>
                                            <Text style={{ marginLeft: 5, fontSize: 16, color: 'rgba(54, 175, 160, 1)' }}>Xem chỉ số</Text>
                                        </View>
                                    </TouchableOpacity> : this.state.type == 'accept' ? <TouchableOpacity onPress={() => this.handleClickNotAccept()}>

                                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 20, marginTop: 10 }}>
                                            <Icon name='user-times' size={20} color='rgba(54, 175, 160, 1)' />
                                            <Text style={{ marginLeft: 5, fontSize: 16, color: 'rgba(54, 175, 160, 1)' }}>Không đồng ý</Text>
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
                            detail={(this.state.data.GioiTinh === null) ? 'Nam' : 'Nữ'}
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
                </ScrollView >
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
        )
    }
}

export default PatientProfile;