import React, { Component } from 'react';
import {
    ImageBackground, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View,
    Dimensions, TouchableWithoutFeedback, Image, ScrollView, KeyboardAvoidingView,
    ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import bgImage from '../images/backgroungImage2.jpg'
import RNAccountKit from 'react-native-facebook-account-kit'
import axios from 'axios';
import api from '../services/config';
const FACEBOOK_APP_ID = '2133371063448949'
const FACEBOOK_APP_SECRET = 'fd29509be484e7e8f741cfa1bb59f98d'
const FACEBOOK_ACCESS_TOKEN_URL = 'https://graph.accountkit.com/v1.0/access_token'
const FACEBOOK_ME_URL = 'https://graph.accountkit.com/v1.0/me'

export default class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isHidePass: true,
            name: '',
            pass: '',
            errorMessage: '',
            loading: false,
        };

    }

    async componentDidMount(): void {
        try {
            const value = await AsyncStorage.getItem('UserId');
            if (value !== null) {
                // We have data!!
                this.props.navigation.navigate('AppStack')
                console.log(value);
            }
        } catch (error) {
            // Error retrieving data
        }
    }

    componentWillMount(): void {
        RNAccountKit.configure({
            responseType: 'code',
            initialPhoneCountryPrefix: '+84',
            defaultCountry: 'VN'
        })
    }

    sendRequestForPhoneNumber = async (token) => {
        try {
            let access_token = ['AA', FACEBOOK_APP_ID, FACEBOOK_APP_SECRET].join('|')
            let url = `${FACEBOOK_ACCESS_TOKEN_URL}?grant_type=authorization_code&code=${token}&access_token=${access_token}`
            let getToken = await axios(url)
            let detailUrl = `${FACEBOOK_ME_URL}?access_token=${getToken.data.access_token}`
            let getDetailUser = await axios(detailUrl)
            return getDetailUser.data
        }
        catch (e) {
            console.log(e)
        }
    }

    loginWithPhone = () => {
        RNAccountKit.loginWithPhone()
            .then(async (token) => {
                if (!token) {
                    console.log('Xác thực sai')
                } else {
                    let acc = await this.sendRequestForPhoneNumber(token.code);
                    console.log(acc);
                    this.props.navigation.navigate('RegisterInformationPage', { acc: acc })
                }
            })
    }

    handleLogin = () => {
        this.setState({ loading: true })
        if (this.state.name === '')
            this.setState({ errorMessage: 'Vui lòng nhập "Số điện thoại" của bạn' })
        else if (this.state.pass === '')
            this.setState({ errorMessage: 'Vui lòng nhập "Mật khẩu"' })
        else {
            axios.post(api + 'doctors/log-in', {
                MaBacSi: this.state.name,
                Password: this.state.pass
            })
                .then(async (response) => {
                    if (response.data.status == 'success') {
                        await AsyncStorage.setItem('UserId', response.data.doctor.MaBacSi)
                        AsyncStorage.setItem('Password', this.state.pass);
                        this.props.navigation.navigate('AppStack');
                    } else {
                        this.setState({errorMessage: 'Tên tài khoản hoặc mật khẩu không đúng.\nVui lòng thử lại.'})
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
            
        }
        this.setState({ loading: false });
    }

    eyeHandleIn = () => {
        this.setState({ isHidePass: false })
    }

    eyeHandleOut = () => {
        this.setState({ isHidePass: true })
    }

    _renderLayout = () => {
        if (!this.state.loading) {
            return(
                <ImageBackground source={bgImage} style={styles.backgroundContainer} blurRadius={1}>
                {/*<Text style={styles.welcome}>Welcome</Text>*/}
                <KeyboardAvoidingView behavior="padding" enabled>
                    <View style={{ height: Dimensions.get('window').height - 30 }}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <ImageBackground
                                style={{ height: 250, width: 250 }}
                                imageStyle={{ borderTopLeftRadius: 25 }}
                                source={require('../images/logo-bigsize.png')}
                            >
                            </ImageBackground>
                        </View>
                        <View style={{ flex: 1 }}>
                            <View style={{ marginTop: 10 }}>
                                <Icon name="phone" size={28} color={'rgba(255, 255, 255, 0.8)'}
                                    style={styles.inputIcon} />
                                <TextInput
                                    style={styles.inputText}
                                    placeholder={'Số điện thoại'}
                                    placeholderTextColor={'rgba(255, 255, 255, 0.7)'}
                                    underlineColorAndroid={'transparent'}
                                    keyboardType='phone-pad'
                                    value={this.state.name}
                                    onChangeText={(text) => this.setState({
                                        name: text,
                                    })}
                                />
                            </View>
                            <View style={{ marginTop: 10 }}>
                                <Icon name="lock" size={28} color={'rgba(255, 255, 255, 0.8)'}
                                    style={styles.inputIcon} />
                                <TextInput
                                    style={styles.inputText}
                                    placeholder={'Mật khẩu'}
                                    placeholderTextColor={'rgba(255, 255, 255, 0.7)'}
                                    underlineColorAndroid={'transparent'}
                                    secureTextEntry={this.state.isHidePass}
                                    value={this.state.pass}
                                    onChangeText={(text) => this.setState({
                                        pass: text,
                                    })}
                                />

                                <TouchableOpacity
                                    style={styles.inputEye}
                                    onPressIn={() => this.eyeHandleIn()}
                                    onPressOut={() => this.eyeHandleOut()}
                                >
                                    <Icon name="eye" size={28} color={'rgba(255, 255, 255, 0.7)'} />
                                </TouchableOpacity>
                            </View>
                            {errorMessage}
                            <TouchableOpacity
                                onPress={() => this.handleLogin()}
                                style={styles.btnLogin}
                            >
                                <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', padding: 10 }}>
                                    ĐĂNG NHẬP
            </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.signUpContent}>

                            <Text style={{ flex: 1, color: 'rgba(255, 0, 0, 0.5)', fontSize: 17, textAlign: 'right', marginRight: 10 }}>
                                Chưa có tài khoản?
          </Text>
                            <TouchableOpacity
                                onPress={() => this.loginWithPhone()}
                                style={{ flex: 1 }}
                            >
                                <Text style={{ color: 'rgba(255, 0, 70, 1)', fontSize: 17, fontWeight: 'bold' }}>
                                    ĐĂNG KÝ NGAY!
            </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </ImageBackground>
            )
        }
        return(
            <View style = {{ alignItems: "center", justifyContent: 'center', flex: 1 }}>
                <ActivityIndicator size="large" color="#00ff00"/>
            </View>
        );
    }

    render() {
        const errorMessage = this.state.errorMessage !== ''
            ? <View style={{
                marginTop: 10,
                paddingLeft: 40,
            }}>
                <Text style={{
                    color: 'red',
                    fontSize: 16,
                }}>
                    {this.state.errorMessage}</Text>
            </View>
            : null

        return (
            <View>
                {this._renderLayout()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    backgroundContainer: {
        flex: 1,
        width: null,
        height: null,
        justifyContent: 'center',
        alignItems: 'center',
    },
    welcome: {
        fontSize: 40,
        fontWeight: 'bold',
        textAlign: 'center',
        margin: 10,
        color: 'white'
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    inputText: {
        width: Dimensions.get('window').width - 55,
        height: 45,
        borderRadius: 25,
        fontSize: 16,
        paddingLeft: 45,
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
        color: 'rgba(255, 255, 255, 1)',
        marginHorizontal: 25,
    },
    inputIcon: {
        position: 'absolute',
        top: 8,
        left: 37,
    },
    inputEye: {
        position: 'absolute',
        top: 8,
        right: 37,
    },
    btnLogin: {
        width: Dimensions.get('window').width - 55,
        height: 45,
        borderRadius: 25,
        // borderWidth: 1.5,
        borderColor: 'rgba(255, 0, 0, 0.7)',
        alignItems: 'center',
        marginTop: 10,
        backgroundColor: 'rgba(54, 175, 160, 1)',//   'rgba(50, 50, 255, 0.9)',
        color: 'rgba(255, 255, 255, 0.7)',
        marginHorizontal: 25,
    },
    signUpContent: {
        bottom: 10,
        position: 'absolute',
        flexDirection: 'row',
    }
});