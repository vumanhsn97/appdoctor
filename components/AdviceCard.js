import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Swipeout from 'react-native-swipeout';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default class AdviceCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled: false,
        }
    }

    render() {
        const swipeBtns = [
            {
                component: (<View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                    <Icon name='trash' size={20} color='black' />
                </View>),
                backgroundColor: 'white',
                underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
                onPress: () => { this.props.deleteAdvice(this.props.pos) }
            }
        ];

        return (
            <Swipeout right={swipeBtns}
                autoClose={true}
                disabled={this.state.disabled}
                backgroundColor='transparent' >
                <TouchableOpacity onPress={ () => this.setState({ disabled: !this.state.disabled }) }>
                    <View style={{ padding: 10, borderBottomColor: '#EFEFEF', borderBottomWidth: 1, marginBottom: 10, margin: 5 }}>
                        <Text style={{ color: 'black', fontWeight: 'bold', marginBottom: 5 }} numberOfLines={1} >{this.props.title}</Text>
                        {this.state.disabled ? <Text style={{ color: 'black' }} >{this.props.content}</Text> : <Text style={{ color: 'black' }} numberOfLines={1} >{this.props.content}</Text>}
                    </View>
                </TouchableOpacity>
            </Swipeout>
        );
    }
}