import React, { Component } from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';

class SearchCard extends Component {

    render() {
        return (
            <TouchableOpacity style={{ margin: 10 }} onPress = {() => this.props.navigation.navigate('PatientProfile', {id: this.props.id})}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <Image style={{
                        margin: 5,
                        height: 40,
                        width: 40,
                        borderRadius: 40 / 2,
                        justifyContent: 'flex-start'
                    }} source={{ uri: this.props.Avatar }}></Image>
                    <View style={{ flex: 1 }}>
                        <Text>{this.props.HoTen}</Text>
                        <Text>{this.props.DiaChi}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

export default SearchCard;