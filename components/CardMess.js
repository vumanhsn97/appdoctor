import React, { Component } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default class CardMess extends Component {

    render() {
        const back_color = this.props.highlight ? '#EFEFEF' : 'white'; 
        return (
            <TouchableOpacity style={style.border} onPress={() => this.props.navigation.navigate('ChatScreen', { patientId: this.props.id })}>
                <View style={{
                    width: '94%',
                    margin: '3%',
                    marginTop: 5,
                    marginBottom: 5,
                    height: 70,
                    borderRadius: 10,
                    borderColor: '#EFEFEF',
                    borderWidth: 1,
                    flexDirection: 'row',
                    backgroundColor: back_color,
                }}>
                    <Image source={{uri: 'https://hcplive.s3.amazonaws.com/v1_media/_image/happydoctor.jpg'}} style={style.avatar} />
                    <View style={{ flex: 1 }}>
                        <Text style={style.name}>{this.props.name}</Text>
                        <View style={{ flexDirection: 'row', marginTop: 7, justifyContent: 'space-between' }}>
                            <Text style={style.label}>{this.props.mess}</Text>
                            <Text style={style.time}>{this.props.time}</Text>
                        </View>
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