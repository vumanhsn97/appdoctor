import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default class EatTable extends Component {

    render() {
        return(
            <View style={{ padding: 5 }}>
                <View style={{ flexDirection: 'row', marginBottom: 5, marginLeft: 5 }}>
                    <Icon name='utensils' size={20} color= 'rgba(54, 175, 160, 1)' />
                    <Text style={{ fontSize: 16, color: 'rgba(54, 175, 160, 1)', marginLeft: 10 }}>Chế độ ăn uống</Text>
                </View>
                <View style={{ borderRadius: 10, borderColor: '#EFEFEF', margin: 5, borderWidth: 1 }}>
                    <View style={{ flexDirection: 'row', padding: 10 }}>
                        <View style={{ width: 70, justifyContent: 'center' }}>
                           <Text style={{ color: 'black' }}>Sáng</Text>
                        </View>
                        <View>
                            <Text style={{ color: 'black' }}>Bánh mì</Text>
                            <Text style={{ color: 'black' }}>Sữa</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', padding: 10, backgroundColor: '#EFEFEF' }}>
                        <View style={{ width: 70, justifyContent: 'center' }}>
                            <Text style={{ color: 'black' }}>Trưa</Text>
                        </View>  
                        <View>
                            <Text style={{ color: 'black' }}>Bánh mì</Text>
                            <Text style={{ color: 'black' }}>Sữa</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', padding: 10 }}>
                        <View style={{ width: 70, justifyContent: 'center' }}>
                            <Text style={{ color: 'black' }}>Tối</Text>
                        </View>
                        <View>
                            <Text style={{ color: 'black' }}>Bánh mì</Text>
                            <Text style={{ color: 'black' }}>Sữa</Text>
                        </View>
                    </View>       
                </View>
            </View>
        );
    }
}