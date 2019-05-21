import React, { Component } from 'react';
import { Provider, connect } from 'react-redux';
import { View, ScrollView, Text, FlatList, ListView, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import * as actions from '../actions';
import CardMess from '../components/CardMess';

class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            patients: [],
            focus: false,
            textsearch: "",
        }
    }

    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            this._keyboardDidShow,
        );
        this.keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            this._keyboardDidHide,
        );
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow() {
    }

    _keyboardDidHide = () => {
        this.setState({ textsearch: "", focus: false })
    }

    searchPatient = ({ text }) => {
        this.setState({ textsearch: text });
        if (text === "") {
            this.setState({ patients: [] });
            return;
        }
        let list = [...this.state.data];
        for (let i = 0; i < list.length; i++) {
            if (list[i].name.indexOf(text) === -1) {
                list.splice(i, 1);
                i = i - 1;
            }
        }
        this.setState({ patients: list, textsearch: text });
    }

    onInputFocus = ({ text }) => {
        this.setState({ focus: true });
        this.searchPatient(text);
    }

    backClick = () => {
        let list = [...this.state.data];
        this.setState({ focus: false, patients: list, textsearch: "" });
        Keyboard.dismiss();
    }



    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', marginBottom: 10, height: 60, borderBottomColor: '#EFEFEF', backgroundColor: 'rgba(54, 175, 160, 1)', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', backgroundColor: 'white', flex: 1, borderRadius: 15, marginLeft: 5, marginRight: 5 }}>
                        <View style={{ justifyContent: 'center', paddingLeft: 10, paddingRight: 5 }}>
                            {this.state.focus ? <TouchableOpacity onPress={this.backClick} >
                                <Icon name='arrow-circle-left' size={20} color='gray' />
                            </TouchableOpacity> : <Icon name='search' size={20} color='gray' />}
                        </View>
                        <TextInput
                            style={{ flex: 1, padding: 5, }}
                            placeholder=''
                            value={this.state.textsearch}
                            onFocus={(text) => this.onInputFocus({ text })}
                            onChangeText={(text) => this.searchPatient({ text })}
                        />
                    </View>
                    {this.state.focus ? <Text></Text> : <TouchableOpacity>
                        <View style={{ paddingLeft: 10, paddingRight: 10 }}>
                            <Icon name='user-plus' size={20} color='white' />
                        </View>
                    </TouchableOpacity>}
                </View>
                <FlatList
                    data={this.props.patients}
                    keyboardShouldPersistTaps='always'
                    keyExtractor={e => e.id}
                    renderItem={({ item }) => <CardMess
                        id={item.id}
                        highlight={item.highlight}
                        name = {item.name}
                        mess = {item.mess}
                        time = {item.time}
                        avatar = {item.avatar}
                    />}

                />
            </View>
        );
    }
}

const mapStateToProps = state => ({
    patients: state.patients
});

export default connect(mapStateToProps, actions)(HomeScreen)