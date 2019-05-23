import React, { Component } from 'react';
import { View, Image, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

class SearchCard extends Component {

    render() {
        return (
            <TouchableOpacity style={{ margin: 10 }}>
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