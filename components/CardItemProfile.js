import React, { Component } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { Overlay, Button, CheckBox, Input, ListItem } from 'react-native-elements';
import AntDesign from 'react-native-vector-icons/AntDesign';
import * as actions from '../actions';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';

class CardItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            data: this.props.settingDetail,
            update: this.props.settingDetail,
            checkDuongHuyet: false,
            checkHuyetAp: false
        }
    }

    updateData = () => {
        if (this.props.type === 'speciality') {
            var majors = [];
            if (this.state.checkDuongHuyet) {
                majors.push("Đường huyết");
            }
            if (this.state.checkHuyetAp) {
                majors.push("Huyết áp");
            }
            this.setState({
                data: majors.toString()
            }, () => {
                this.props.updateMyProfile(this.props.keyname, this.state.data);
                this.setState({ update: this.state.data, open: false })
            })
        }
        else {
            this.props.updateMyProfile(this.props.keyname, this.state.data);
            this.setState({ update: this.state.data, open: false })
        }
    }


    setUnVisible = () => {
        this.setState({ open: false, data: this.state.update });
    }

    componentDidMount = () => {
        if (this.props.type === 'speciality') {
            temp = this.state.data
            temp.search('Huyết áp') >= 0 ? this.setState({ checkHuyetAp: true }) : this.setState({ checkHuyetAp: false })
            temp.search('Đường huyết') >= 0 ? this.setState({ checkDuongHuyet: true }) : this.setState({ checkDuongHuyet: false })
        }
    }

    render() {
        if (this.props.type === 'speciality') {
            return (
                <View>
                    <Overlay
                        borderRadius={10}
                        height={280}
                        isVisible={this.state.open}
                        onBackdropPress={() => { this.setUnVisible() }}>
                        <ScrollView>
                            <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold', marginBottom: 25 }}>{this.props.settingLabel}</Text>
                            {(this.props.type === 'speciality') &&
                                <View style={{
                                    flex: 1,
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    marginHorizontal: 20,
                                }}>
                                    <CheckBox
                                        title="Đường huyết"
                                        checked={this.state.checkDuongHuyet}
                                        onPress={() => this.setState({ checkDuongHuyet: !this.state.checkDuongHuyet })}
                                    />
                                    <CheckBox
                                        title="Huyết áp"
                                        checked={this.state.checkHuyetAp}
                                        onPress={() => this.setState({ checkHuyetAp: !this.state.checkHuyetAp })}
                                    />
                                </View>
                            }
                            {
                                (this.props.type === 'text') && <View style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginHorizontal: 20,
                                }}>
                                    <Input onChangeText={(text) => this.setState({ data: text })} placeholder={this.props.settingLabel}>{this.state.data}</Input>
                                </View>
                            }
                            <Button
                                type='outline'
                                title="Cập nhật"
                                buttonStyle={{ width: 120, alignSelf: 'center', marginTop: 20 }}
                                onPress={() => this.updateData()}
                            />
                        </ScrollView>
                    </Overlay>
                    <ListItem
                        title={
                            <Text style={{ fontSize: 20, color: 'black' }}>
                                {(this.props.type === 'gender') ? ((this.state.update !== undefined) ? (this.state.update ? "Nam" : "Nữ") : (this.props.settingDetail ? "Nam" : "Nữ")) : (this.state.update ? this.state.update : this.props.settingDetail)}
                            </Text>
                        }
                        subtitle={this.props.label}
                        rightIcon={
                            <AntDesign name='edit' size={25} color='rgba(74, 195, 180, 1)' onPress={() => this.setState({ open: true })}></AntDesign>
                        }
                    />
                </View>
            );
        }
        else {
            return (
                <View>
                    <Overlay
                        borderRadius={10}
                        height={200}
                        isVisible={this.state.open}
                        onBackdropPress={() => { this.setUnVisible() }}>
                        <ScrollView>
                            <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold', marginBottom: 25 }}>{this.props.settingLabel}</Text>
                            {(this.props.type === 'gender') &&
                                <View style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginHorizontal: 20,
                                }}>
                                    <CheckBox
                                        title="Nam"
                                        checked={(this.state.data !== undefined) ? this.state.data : this.props.settingDetail}
                                        onPress={() => this.setState({ data: true })}
                                    />
                                    <CheckBox
                                        title="Nữ"
                                        checked={(this.state.data !== undefined) ? !this.state.data : !this.props.settingDetail}
                                        onPress={() => this.setState({ data: false })}
                                    />
                                </View>
                            }
                            {
                                (this.props.type === 'text') && <View style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginHorizontal: 20,
                                }}>
                                    <Input onChangeText={(text) => this.setState({ data: text })} placeholder={this.props.settingLabel}>{this.state.data}</Input>
                                </View>
                            }
                            <Button
                                type='outline'
                                title="Cập nhật"
                                buttonStyle={{ width: 120, alignSelf: 'center', marginTop: 20 }}
                                onPress={() => this.updateData()}
                            />
                        </ScrollView>
                    </Overlay>
                    <ListItem
                        title={
                            <Text style={{ fontSize: 20, color: 'black' }}>
                                {(this.props.type === 'gender') ? ((this.state.update !== undefined) ? (this.state.update ? "Nam" : "Nữ") : (this.props.settingDetail ? "Nam" : "Nữ")) : (this.state.update ? this.state.update : this.props.settingDetail)}
                            </Text>
                        }
                        subtitle={this.props.label}
                        rightIcon={
                            <AntDesign name='edit' size={25} color='rgba(74, 195, 180, 1)' onPress={() => this.setState({ open: true })}></AntDesign>
                        }
                    />
                </View>
            );
        }
    }
}

const mapStateToProps = state => ({
    profile: state.myProfile
})

export default connect(mapStateToProps, actions)(CardItem);