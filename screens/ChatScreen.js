import React, { Component, PureComponent } from 'react';
import { StyleSheet, Text, View, chatMessage, TouchableOpacity, FlatList, Alert, YellowBox, Dimensions } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Ionicons';
import { Avatar } from "react-native-elements";
import { createAppContainer, createStackNavigator, StackActions, NavigationActions } from 'react-navigation';
import { TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import ApiChat from '../services/api';
import baseURL from '../services/config'
import { importDeclaration } from '@babel/types';
import axiosFetch from '../services/axios-fetch';
import axios from 'axios';
import ImagePicker from "react-native-image-picker";
import ImageResizer from "react-native-image-resizer";
import RNFS from "react-native-fs";
import AntDesign from 'react-native-vector-icons/AntDesign';

YellowBox.ignoreWarnings([
    "Warning: Can't perform a React state update on an unmounted component."
]);

export class DateTime extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            currDate: '',
            time: '',
            chated: 0
        }
    }

    componentDidMount() {
        // Get current dd/MM/yyyy
        let today = new Date(),
            _date = today.getDate(),
            _month = today.getMonth() + 1,
            _year = today.getFullYear();
        let _hr = today.getHours(),
            _min = today.getMinutes();
        this.setState({
            currDate: _date + '-' + _month + '-' + _year,
            time: _hr + ':' + _min,
        });
    }

    render() {
        return (
            <View style={{ justifyContent: 'flex-end', paddingBottom: 7, paddingHorizontal: 10, }}>
                <Text style={{ fontSize: 12, color: 'silver', }}>
                    {this.state.time}
                </Text>
            </View>
        )
    }
}

export class RightListItems extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        let _time = new Date(this.props.item.NgayGioGui);
        //var timezone = _time.getTimezoneOffset() * 60000;
        //_time = new Date(_time.getTime() + timezone);
        // alert(this.props.item.NgayGioGui);
        return (
            <View style={{ flexDirection: 'row', alignSelf: 'flex-end', }}>
                <View style={{ justifyContent: 'flex-end', paddingBottom: 7, paddingHorizontal: 10, }}>
                    <Text style={{ fontSize: 12, color: 'silver', }}>
                        {_time.getDate() + '/' + (_time.getMonth() + 1) + ' - ' + _time.getHours() + ':' + ((_time.getMinutes() < 10) ? '0' : '') + _time.getMinutes()}
                    </Text>
                </View>
                <View style={[styles.BubbleChat, styles.rightBubbleChat]}>
                    {
                        this.props.item.LoaiDoanChat === 1
                            ?
                            <Text style={{ paddingTop: 5, color: 'white', fontSize: 17 }}>
                                {this.props.item.NoiDung}
                            </Text>
                            :
                            <Avatar
                                activeOpacity={0.7}
                                containerStyle={{ height: 200, width: Dimensions.get('window').width - 150 }}
                                source={{ uri: 'data:image/jpeg;base64,' + this.props.item.NoiDung }}
                            />
                    }
                </View>
            </View>
        )
    }
}

export class LeftListItems extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        let _time = new Date(this.props.item.NgayGioGui);
        //var timezone = _time.getTimezoneOffset() * 60000;
        // _time = new Date(_time.getTime() + timezone);
        return (
            <View style={{ flexDirection: 'row', alignSelf: 'flex-start', }}>
                <Avatar
                    size="medium"
                    title={this.props.name ? this.props.name[this.props.name.lastIndexOf(' ') + 1] : ''}
                    rounded
                    source={{ uri: 'data:image/jpeg;base64,' + this.props.avatar }}
                    activeOpacity={0.7}
                />
                <View style={[styles.BubbleChat, styles.leftBubbleChat]}>
                    {
                        this.props.item.LoaiDoanChat === 1
                            ?
                            <Text style={{ paddingTop: 5, color: 'black', fontSize: 17 }}>
                                {this.props.item.NoiDung}
                            </Text>
                            :
                            <Avatar
                                activeOpacity={0.7}
                                containerStyle={{ height: 200, width: Dimensions.get('window').width - 200 }}
                                source={{ uri: 'data:image/jpeg;base64,' + this.props.item.NoiDung }}
                            />
                    }
                </View>
                <View style={{ justifyContent: 'flex-end', paddingBottom: 7, paddingHorizontal: 10, }}>
                    <Text style={{ fontSize: 12, color: 'silver', }}>
                        {_time.getDate() + '/' + (_time.getMonth() + 1) + ' - ' + _time.getHours() + ':' + (_time.getMinutes() < 10 ? '0' : '') + _time.getMinutes()}
                    </Text>
                </View>
            </View>
        )
    }
}

export default class ChatScreen extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            myID: '',
            receiverID: this.props.navigation.getParam('data').MaBenhNhan,
            txtInput: '',
            chatMessage: '',
            chatMessages: [],
            page: 1
        };

        this.apiChat = ApiChat();
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('data').HoTen,
            headerTitleStyle: {
                fontWeight: 'bold',
                // color: 'white', người gửi
            },
            headerStyle: {
                backgroundColor: 'rgba(74, 195, 180, 1)',
            },
            headerTintColor: 'white',
        };
    };

    async componentDidMount() {
        this._isMounted = true;

        const userId = await AsyncStorage.getItem('UserId');
        this.setState({
            myID: userId
        });
        this.props.screenProps.socket.emit('join room', {
            MaTaiKhoan: userId,
            LoaiTaiKhoan: 2,
        });

        this.loadMessages();

        this.props.screenProps.socket.on('chat message', (msg) => {
            if (msg !== null) {
                if ((msg.MaNguoiGui === this.state.receiverID && msg.LoaiNguoiGui === 1)
                    || (msg.MaNguoiNhan === this.state.receiverID && msg.LoaiNguoiNhan === 1)) {
                    msg.NgayGioGui = msg.DateValue
                    if (this._isMounted)
                        this.setState({
                            chatMessages: [msg, ...this.state.chatMessages]
                        });
                }
            }
        });

        this.props.screenProps.socket.on('not seen message', async () => {

            if (this._isMounted) {
                await axios.get(baseURL + 'doctors/find-doctor-by-id', {
                    params: {
                        MaBacSi: await AsyncStorage.getItem('UserId')
                    }
                }).then(async (response) => {
                    const info = {
                        MaTaiKhoan: this.state.receiverID,
                        LoaiNguoiChinh: 1,
                        MaTaiKhoanLienQuan: this.state.myID,
                        TenNguoiLienQuan: response.data.doctor[0].HoTen,
                        AvatarNguoiLienQuan: response.data.doctor[0].Avatar,
                        LoaiNguoiLienQuan: 2,
                        LoaiThongBao: 2    // Thông báo có tin nhắn mới từ người khác
                    }

                    await this.props.screenProps.socket.emit('create notifications', info);
                })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
            if (this._isMounted) {
                const info2 = {
                    MaNguoiGui: this.state.myID,
                    LoaiNguoiGui: 2,
                    MaNguoiNhan: this.state.receiverID,
                    LoaiNguoiNhan: 1,
                    updateList: true,
                }
                await this.props.screenProps.socket.emit('update relationship', info2);
            }

        });
    }

    componentWillUnmount() {
        this._isMounted = false;
        this.apiChat.updateSeeing({
            MaTaiKhoan: this.state.myID,
            LoaiTaiKhoan: 2,
            MaTaiKhoanLienQuan: this.state.receiverID,
            LoaiTaiKhoanLienQuan: 1
        })
    }

    async submitChatMessage() {
        let today = new Date();
        let _today = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        //Alert.alert(this.state.receiverID)
        this.setState({ chated: this.state.chated + 1 })
        this.setState({
            chatMessage: {
                MaNguoiGui: this.state.myID,
                LoaiNguoiGui: 2,
                MaNguoiNhan: this.state.receiverID,//ừa
                LoaiNguoiNhan: 1,// 
                NoiDung: this.state.txtInput,
                NgayGioGui: today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' + today.getHours() + ':' + today.getMinutes(),
                DateValue: today,
                LoaiDoanChat: 1,
            },
            txtInput: '',
        }, async () => {
            await this.props.screenProps.socket.emit('chat message', this.state.chatMessage);
        });
    }

    submitChatPicture = async () => {
        const options = {
            title: 'Chọn hình đại diện',
            storageOptions: {
                skipBackup: false,
                path: 'images',
                cameraRoll: true,
                waitUntilSaved: true
            },
            mediaType: 'photo',
            cancelButtonTitle: 'Hủy',
            takePhotoButtonTitle: 'Chụp ảnh mới',
            chooseFromLibraryButtonTitle: 'Chọn từ thư viện'
        };

        ImagePicker.showImagePicker(options, async (response) => {
            if (response.didCancel) {
                alert('User cancelled image picker');
            } else if (response.error) {
                alert('ImagePicker Error: ', response.error);
            } else {
                await ImageResizer.createResizedImage(response.uri, 400, 400, 'JPEG', 50).then((output) => {
                    RNFS.readFile(output.uri, 'base64').then(async (data) => {
                        let today = new Date();
                        let _today = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                        if (this._isMounted) {
                            await this.setState({
                                chatMessage: {
                                    MaNguoiGui: this.state.myID,
                                    LoaiNguoiGui: 2,
                                    MaNguoiNhan: this.state.receiverID,
                                    LoaiNguoiNhan: 1,
                                    NoiDung: data,
                                    NgayGioGui: today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' + today.getHours() + ':' + today.getMinutes(),
                                    DateValue: today,
                                    LoaiDoanChat: 2,
                                }
                            }, () =>
                                    this.props.screenProps.socket.emit('chat message', this.state.chatMessage)
                            )
                        }
                    })
                })
            }
        });
    }

    keyExtractor = (item, index) => index.toString()

    _renderItem = ({ item }) => {
        // alert(JSON.stringify(item))
        if (item.MaNguoiGui === this.state.myID) {
            return (<RightListItems item={item} />);
        }
        else {
            return (<LeftListItems item={item} avatar={this.props.navigation.getParam('data').Avatar} name={this.props.navigation.getParam('data').HoTen} />);
        }
    }

    loadMessages = async () => {
        this.apiChat.getMessages(
            { id: this.state.myID, type: 2 },
            { id: this.state.receiverID, type: 1 },
            this.state.page
        ).then((msg) => {
            let dataTemp = []
            if (msg !== null && this._isMounted) {
                // alert(JSON.parse(JSON.stringify(msg)))   
                msg.map((item) => {
                    // alert(JSON.stringify(item))
                    let date = new Date(item.NgayGioGui);
                    var timezone = date.getTimezoneOffset() * 60000;
                    date = new Date(date.getTime() + timezone);
                    let temp = {
                        MaNguoiGui: item.MaNguoiGui,
                        LoaiNguoiGui: item.LoaiNguoiGui,
                        MaNguoiNhan: item.MaNguoiNhan,
                        LoaiNguoiNhan: item.LoaiNguoiNhan,
                        NoiDung: item.NoiDung,
                        NgayGioGui: date,
                        LoaiDoanChat: item.LoaiDoanChat
                    }

                    dataTemp.push(temp)
                })
            }
            this.setState({
                chatMessages: [...this.state.chatMessages, ...dataTemp]
            }, () => { });
        })
    }

    handleLoadMore = () => {
        this.setState({
            page: this.state.page + 1
        }, () => {
            this.loadMessages();
        })
    }

    render() {
        return (
            <View style={styles.wrapper}>
                <FlatList
                    //contentContainerStyle={{ paddingVertical: 20 }}
                    data={this.state.chatMessages}
                    renderItem={this._renderItem}
                    keyExtractor={this.keyExtractor}
                    onEndReached={this.handleLoadMore}
                    onEndReachedThreshold={0.001}
                    inverted
                >
                </FlatList>
                <View style={[{ flexDirection: 'row' }, styles.customChat]}>
                    <TouchableOpacity
                        onPress={() => { this.submitChatPicture() }}
                        style={[styles.chatPictureBtn]}
                    >
                        <AntDesign name="picture" size={35} color="#1084ff" />
                    </TouchableOpacity>
                    <TextInput
                        placeholder="Nhập tin nhắn..."
                        onChangeText={(txtInput) => this.setState({ txtInput })}
                        value={this.state.txtInput}
                        style={[styles.chatBox]}
                    />
                    <TouchableOpacity
                        onPress={() => { this.submitChatMessage() }}
                        style={[styles.chatBtn]}
                    >
                        <Icon name="md-send" size={35} color="#1084ff" />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

// ======================================================


const styles = StyleSheet.create({
    wrapper: {
        paddingLeft: 15,
        //paddingRight: 15,
        paddingBottom: 0,
        justifyContent: 'flex-end',
        backgroundColor: '#F5FCFF',
        flex: 1,
    },

    customChat: {
        marginHorizontal: 5,
        marginBottom: 15,
        marginVertical: 15,
        height: 40,
    },
    chatBox: {
        borderRadius: 15,
        marginHorizontal: 10,
        paddingVertical: 5,
        paddingHorizontal: 15,
        height: 40,
        borderWidth: 1,
        borderColor: '#1084ff',//black
        flex: 0.8,
    },
    chatBtn: {
        alignItems: 'center',
        marginRight: 10,
        flex: 0.1,
    },
    chatPictureBtn: {
        alignItems: 'center',
        marginLeft: 0,
        flex: 0.1,
    },

    // Custom Bubble Chat
    BubbleChat: {
        //maxWidth: scale(250),
        paddingHorizontal: 15,
        paddingTop: 10,
        paddingBottom: 15,
        borderRadius: 20,
        marginBottom: 10,
    },
    rightBubbleChat: {
        marginRight: 10,
        maxWidth: scale(250),
        alignItems: 'flex-end',
        backgroundColor: '#1084ff',
    },
    leftBubbleChat: {
        marginLeft: 10,
        maxWidth: scale(200),
        alignSelf: 'flex-start',
        backgroundColor: '#ffffff',//white
    },
});
