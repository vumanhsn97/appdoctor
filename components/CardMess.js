import React, { Component } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Avatar } from 'react-native-elements';
import api from '../services/config';
import axios from 'axios';
import io from 'socket.io-client';
const socket = io(api);

export default class CardMess extends Component {
    constructor(props) {
        super(props);

        this.state = {
            highlight: this.props.item.DaXem == 0 ? true : false,
        }
    }

    componentDidMount = () => {
        
    }

    onHandleClick = () => {
        this.setState({ highlight: false });
        axios.post(api + 'chatnotifications/update-seeing-seen-messages', {
            MaTaiKhoan: this.props.item.MaTaiKhoan,
            LoaiTaiKhoan: this.props.item.LoaiTaiKhoan,
            MaTaiKhoanLienQuan: this.props.item.MaTaiKhoanLienQuan,
            LoaiTaiKhoanLienQuan: this.props.item.LoaiTaiKhoanLienQuan
        }).then(response => {
            this.props.navigation.navigate('ChatScreen', { data: this.props.item })
        })
            .catch(error => {
                console.log(error)
            })
    }

    render() {
        const back_color = this.state.highlight ? '#EFEFEF' : 'white';
        return (
            <TouchableOpacity style={style.border} onPress={() => this.onHandleClick()}>
                <View style={{
                    width: '94%',
                    margin: '3%',
                    marginTop: 5,
                    marginBottom: 5,
                    height: 70,
                    borderRadius: 10,
                    flexDirection: 'row',
                    backgroundColor: back_color,
                }}>
                    <Avatar
                        rounded
                        size='medium'
                        title={this.props.item.HoTen ? this.props.item.HoTen[this.props.item.HoTen.lastIndexOf(' ') + 1] : ''}
                        containerStyle={style.avatar}
                        source={{ uri: 'data:image/jpeg;base64,' + this.props.item.Avatar }}
                    />
                    <View style={{ flex: 1 }}>
                        <Text style={style.name}>{this.props.item.HoTen}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

const style = StyleSheet.create({
    avatar: {
        margin: 5,
        height: 60,
        width: 60,
        borderRadius: 60 / 2,
        justifyContent: 'flex-start'
    },
    right: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginRight: 5,
        flex: 1
    },
    name: {
        fontSize: 20,
        marginTop: 5,
        color: 'black',
        fontFamily: 'Arial'
    },
    label: {
        fontSize: 13,
        marginLeft: 2,
        color: 'black',
        fontFamily: 'Arial'
    },
    time: {
        fontSize: 13,
        marginLeft: 2,
        paddingRight: 5,
        fontFamily: 'Arial'
    }
});