import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default class CardParam extends Component {
    render() {
        return (
            <View style={{ flexDirection: 'row', height: 50, paddingLeft: 20 }}>
                <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
                    <Icon name={this.props.icon} size={30} color='rgba(54, 175, 160, 1)' />
                </View>
                <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-start' }}>
                    <View style={{ flexDirection: 'column', justifyContent: 'center', paddingLeft: 10 }}>
                        <Text style={{ fontSize: 18, color: 'black' }}>{this.props.value}</Text>
                        <Text style={{ color: 'rgba(0, 0, 0, 0.5)' }}>{this.props.title}</Text>
                    </View>
                </View>
            </View>
        );
    }
}