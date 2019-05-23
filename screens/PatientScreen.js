import React, { Component } from 'react';
import { View, Text, Button, ScrollView, TouchableOpacity, Image, FlatList, ActivityIndicator } from 'react-native';
import CardParam from '../components/CardParam';
import ButtonIcon from '../components/ButtonIcon';
import EatTable from '../components/EatTable';
import AdviceCard from '../components/AdviceCard';
import Icon from 'react-native-vector-icons/FontAwesome5';
import * as actions from '../actions';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';

class PatientScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            birth: 0,
        }

        this._bootstrapAsync();
    }

    _bootstrapAsync = async () => {
        const userId = this.props.navigation.getParam("id", "nope");
        //AsyncStorage.clear();
        //console.log(userId);
        axios(api + 'follows/patient-following-by-doctor', {
            params: {
                MaBenhNhan: userId
            }
        }).then(response => {
            let data = response.data;
            let date = new Date()
            date = date.getFullYear();
            let birth = new Date(data.patient.NgaySinh);
            birth = date - birth.getFullYear();
            //console.log(birth);
            if (data.status == 'success') {
                data = data.patient;
                this.setState({ patient: data, loading: true, birth: birth });
            }
        })
            .catch(error => {
                console.log(error)
            })
    }

    deleteAdvice = (key) => {
        let ads = [...this.props.advices];
        ads.splice(key, 1);
        this.setprops({ advices: ads });
    }

    addAdvice = (value) => {
        let ads = [...this.props.advices];
        ads.unshift(value);
        this.setprops({ advices: ads });
    }

    componentWillMount() {
        const id = this.props.navigation.getParam("id", "");

    }

    _renderLayout = () => {
        if (this.state.loading) {
            return (
                <ScrollView>
                    <View>
                        <View style={{ justifyContent: 'center', flexDirection: 'column', height: 100, marginBottom: 10 }}>
                            <View style={{ flexDirection: 'row', paddingTop: 10, paddingBottom: 10 }}>
                                <View style={{ width: 80, height: 80, borderRadius: 80 / 2, justifyContent: 'space-between', margin: 5 }}>
                                    <Image source={{ uri:'data:image/jpeg;base64,' + this.state.patient.Avatar }} style={{ height: 80, width: 80, borderRadius: 80 / 2, }} />
                                </View>
                                <View style={{ justifyContent: 'center', flex: 1 }}>
                                    <Text style={{ fontSize: 20, color: 'black' }}>{this.state.patient.HoTen}</Text>
                                    <Text style={{ marginTop: 10, color: 'black' }}>{this.state.birth + ' tuổi'}</Text>
                                    <Text style={{ color: 'black' }}>{this.state.patient.DiaChi}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                            <View style={{ width: '49%' }}>
                                <CardParam
                                    noti={true}
                                    title='Đường huyết'
                                    value={this.state.patient.DuongHuyet + " mg/dl"}
                                    icon='tint'
                                />
                            </View>
                            <View style={{ width: '49%' }}>
                                <CardParam
                                    noti={true}
                                    title='Huyết áp'
                                    value={this.state.patient.HuyetAp + ' mmHg'}
                                    icon='stethoscope'
                                />
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                            <View style={{ width: '49%' }}>
                                <CardParam
                                    noti={false}
                                    title='HbA1c'
                                    value={this.props.patient.hba1c}
                                    icon='hiking'
                                />
                            </View>
                            <View style={{ width: '49%' }}>
                                <CardParam
                                    noti={false}
                                    title='Nhịp tim'
                                    value={this.props.patient.nhiptim}
                                    icon='heartbeat'
                                />
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ width: '48%' }}>
                                <CardParam
                                    noti={false}
                                    title='Chiều cao'
                                    value={this.state.patient.ChieuCao + " m"}
                                    icon='child'
                                />
                            </View>
                            <View style={{ width: '48%' }}>
                                <CardParam
                                    noti={false}
                                    title='Cân nặng'
                                    value={this.state.patient.CanNang + " kg"}
                                    icon='weight'
                                />
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 5, marginTop: 10 }}>
                            <View style={{ width: '49%' }}>
                                <ButtonIcon
                                    icon='comments'
                                    label='Nhắn tin'
                                    screen='ChatScreen'
                                    navigation={this.props.navigation}
                                />
                            </View>
                            <View style={{ width: '49%' }}>
                                <ButtonIcon
                                    icon='phone-square'
                                    label='Gọi điện'
                                    screen=''
                                    phone={this.state.patient.MaBenhNhan}
                                    navigation={this.props.navigation}
                                />
                            </View>
                        </View>
                        <View style={{ marginTop: 10 }}>
                            <View style={{ flexDirection: 'row', padding: 10 }}>
                                <Icon name='clipboard' size={20} color='rgba(54, 175, 160, 1)' />
                                <View style={{ flexDirection: 'row', flex: 1 }}>
                                    <Text style={{ color: 'rgba(54, 175, 160, 1)', fontSize: 16, marginLeft: 10 }}>Lời khuyên</Text>
                                </View>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('AddAdvice')}>
                                    <View style={{ paddingLeft: 10, paddingRight: 10 }}>
                                        <Icon name='plus-circle' size={20} color='rgba(54, 175, 160, 1)' />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <FlatList
                                data={this.props.patient.advices}
                                renderItem={({ item }) => <AdviceCard key={item.key}
                                    pos={item.key}
                                    title={item.title}
                                    content={item.content}
                                    deleteAdvice={this.deleteAdvice}
                                />}
                            />
                            <EatTable />
                        </View>
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
            <View style={{flex: 1 }}>
                {this._renderLayout()}
            </View>
        );
    }
}

const mapStateToProps = state => ({
    patient: state.patient
})

export default connect(mapStateToProps, actions)(PatientScreen);