import React, { Component } from 'react';
import { View, Text, Button, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import CardParam from '../components/CardParam';
import ButtonIcon from '../components/ButtonIcon';
import EatTable from '../components/EatTable';
import AdviceCard from '../components/AdviceCard';
import Icon from 'react-native-vector-icons/FontAwesome5';
import * as actions from '../actions';
import { connect } from 'react-redux';

class PatientScreen extends Component {
    constructor(props) {
        super(props);

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

    render() {
        return (
            <ScrollView>
                <View style={{ justifyContent: 'center', flexDirection: 'column', height: 100, marginBottom: 10 }}>
                    <View style={{ flexDirection: 'row', paddingTop: 10, paddingBottom: 10 }}>
                        <View style={{ width: 80, height: 80, borderRadius: 80 / 2, justifyContent: 'space-between', margin: 5 }}>
                            <Image source={{ uri: this.props.patient.avatar }} style={{ height: 80, width: 80, borderRadius: 80 / 2, }} />
                        </View>
                        <View style={{ justifyContent: 'center', flex: 1 }}>
                            <Text style={{ fontSize: 20, color: 'black' }}>{this.props.patient.name}</Text>
                            <Text style={{ marginTop: 10, color: 'black' }}>{this.props.patient.age}</Text>
                            <Text style={{ color: 'black' }}>{this.props.patient.address}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                    <View style={{ width: '49%' }}>
                        <CardParam
                            noti={true}
                            title='Đường huyết'
                            value={this.props.patient.duonghuyet}
                            icon='tint'
                        />
                    </View>
                    <View style={{ width: '49%' }}>
                        <CardParam
                            noti={true}
                            title='Huyết áp'
                            value={this.props.patient.huyetap}
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
                            value={this.props.patient.chieucao}
                            icon='child'
                        />
                    </View>
                    <View style={{ width: '48%' }}>
                        <CardParam
                            noti={false}
                            title='Cân nặng'
                            value={this.props.patient.cannang}
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
                            phone={this.props.patient.id}
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
            </ScrollView>
        );
    }
}

const mapStateToProps = state => ({
    patient: state.patient
})

export default connect(mapStateToProps, actions)(PatientScreen);