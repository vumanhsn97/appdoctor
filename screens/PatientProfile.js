import React, { Component } from 'react';
import { View, ScrollView, Image, Text, ActivityIndicator } from 'react-native';
import { Divider } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import api from '../services/config';

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
            loading: true
        }

        //this._bootstrapAsync();
    }


     componentDidMount() {
        this.setState({ loading: true });
        const userId = this.props.navigation.getParam('id', 'nope');
        axios.get(api + 'patients/find-patient-by-id', {
            params: {
                MaBenhNhan: userId
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
                            <View style={{ justifyContent: 'space-between', flexDirection: 'row', paddingLeft: 30, paddingRight: 30 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Icon name='phone' size={25} />
                                    <Text style={{ marginLeft: 5, fontSize: 16 }}>Giọi điện</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Icon name='comment-dots' size={25} />
                                    <Text style={{ marginLeft: 5, fontSize: 16 }}>Nhắn tin</Text>
                                </View>
                            </View>
                            <View style={{ justifyContent: 'space-between', flexDirection: 'row', paddingLeft: 30, paddingRight: 30, marginTop: 10 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Icon name='eye' size={25} />
                                    <Text style={{ marginLeft: 5, fontSize: 16 }}>Theo dõi</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Icon name='file-invoice' size={25} />
                                    <Text style={{ marginLeft: 5, fontSize: 16 }}>Chỉ số</Text>
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
        return(
            <View style = {{ alignItems: "center", justifyContent: 'center', flex: 1 }}>
                <ActivityIndicator size="large" color="#00ff00"/>
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