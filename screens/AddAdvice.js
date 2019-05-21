import React, { Component } from 'react';
import { View, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import * as actions from '../actions';
import {connect} from 'react-redux';

class AddAdvice extends Component {
    constructor(props) {
        super(props);

        this.state = {
            label: '',
            content: ''
        }
    }

    addAdvice = () => {
        this.props.addAdviceForPatient(this.state.label, this.state.content);
        this.forceUpdate();
        this.props.navigation.goBack();
    }

    render() {
        return (
            <View style={{ flex: 1, flexDirection: 'column' }}>
                <View style={{ flexDirection: 'row', backgroundColor: 'rgba(54, 175, 160, 1)', padding: 20, justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={ () => this.props.navigation.goBack() }>
                        <Icon name='arrow-left' size={20} color='white' />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={ () => this.addAdvice()}>
                        <Icon name='share' size={20} color='white' />
                    </TouchableOpacity>
                </View>
                <View style={{ padding: 5 }}>
                    <TextInput
                        style={{ height: 40, borderColor: '#EFEFEF', borderBottomWidth: 1, marginTop: 10 }}
                        onChangeText={(text) => this.setState({ label: text })}
                        value={this.state.label}
                        placeholder='Tiêu đề'
                    />
                    <TextInput
                        onChangeText={(text) => this.setState({ content: text })}
                        value={this.state.content}
                        multiline={true}
                        placeholder='Nội dung'
                    />
                </View>
            </View>
        );
    }
}

const mapStateToProps = state => ({
    advices: state.patient.advices
})
export default connect(mapStateToProps, actions)(AddAdvice);