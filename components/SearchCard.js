import React, { Component } from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import { Avatar } from 'react-native-elements';

class SearchCard extends Component {

    render() {
        return (
            <TouchableOpacity style={{ margin: 10 }} onPress={() => this.props.navigation.navigate('PatientProfile', { id: this.props.id })}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <Avatar
                        rounded
                        size='medium'
                        title={this.props.HoTen ? this.props.HoTen[this.props.HoTen.lastIndexOf(' ') + 1] : ''}
                        activeOpacity={0.7}
                        containerStyle={{ width: 40, height: 40, margin: 5 }}
                        source={{ uri: this.props.Avatar }}
                    />
                    <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={{ color: 'black', marginBottom: 3 }}>{this.props.HoTen}</Text>
                        <Text>{(this.props.DiaChi == '' || this.props.DiaChi == null) ? 'Chưa có thông tin' : this.props.DiaChi}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

export default SearchCard;