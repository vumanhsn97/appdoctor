import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, AppState, ActivityIndicator } from 'react-native';
import { NavigationEvents } from 'react-navigation'
import * as actions from '../actions';
import api from '../services/config';
import AsyncStorage from '@react-native-community/async-storage';
import { Avatar } from 'react-native-elements';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome5';
import NotiCard from '../components/NotiCard';

class NotifyScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            refreshing: false,
            notifications: [],
            page: 1,
            numbernoti: 0
        }
    }

    onLoadNotification = async () => {
        const userId = await AsyncStorage.getItem('UserId');
        axios.get(api + 'notifications', {
            params: {
                MaTaiKhoan: userId,
                LoaiNguoiChinh: 2,
                page: this.state.page
            }
        }).then(response => {
            let data = response.data;
            if (data.status == 'success') {
                data = data.notifications;

                this.setState({ notifications: [...this.state.notifications, ...data], loading: false, refreshing: false });
            }
        })
            .catch(error => {
                console.log(error)
            })
    }



    componentDidMount = async () => {
        const userId = await AsyncStorage.getItem('UserId');

        //AsyncStorage.clear();
        this.props.screenProps.socket.on('update list notifications', async (info, id) => {
            this.onRefreshing();
            this.props.screenProps.socket.emit('get notifications number', {
                LoaiTaiKhoan: 2,
                MaTaiKhoan: userId
            })
        })
        this.onLoadNotification();
        this.props.screenProps.socket.on('get notifications number', (info) => {
            this.props.screenProps.updateNotification(info);
        })
    }

    updateSeen = async () => {
        const userId = await AsyncStorage.getItem('UserId');
        this.props.screenProps.updateNotification(0);

        this.props.screenProps.socket.emit('seen notifications', {
            LoaiTaiKhoan: 2,
            MaTaiKhoan: userId
        })
    }

    onLoadMoreNotification = () => {
        this.setState({ page: this.state.page + 1 }, async () => { await this.onLoadNotification() });
    }

    onRefreshing = () => {
        this.setState({
            refreshing: true,
            loading: true,
            page: 1,
            notifications: []
        }, async () => { await this.onLoadNotification() })
    }

    _renderLayout = () => {
        if (!this.state.loading) {
            return (<FlatList
                data={this.state.notifications}
                keyboardShouldPersistTaps='always'
                keyExtractor={e => e.Id.toString()}
                renderItem={({ item }) => <NotiCard
                    data={item}
                    navigation={this.props.navigation}
                    socket={this.props.screenProps.socket}
                />}
                refreshing={this.state.refreshing}
                onRefresh={this.onRefreshing}
                onEndReached={this.onLoadMoreNotification}
                onEndReachedThreshold={0.001}
            />)
        }
    }

    _renderNoNoti = () => {
        if (this.state.notifications.length < 1 && !this.state.loading) {
            return (
                <View style={{ alignItems: 'center' }}>
                    <Text>Chưa có thông báo</Text>
                </View>
            )
        }
        if (this.state.loading) {
            return (
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    flexDirection: 'column',
                    justifyContent: 'space-around',
                    padding: 20
                }}>
                    <View style={{
                        flexDirection: 'column'
                    }}>
                        <ActivityIndicator size="large" color="#00ff00" />
                    </View>
                </View>
            )
        }
    }

    render() {
        return (
            <View>
                <NavigationEvents
                    onWillFocus={payload => this.updateSeen()}
                />
                <View style={{ flexDirection: 'row', height: 60, borderBottomColor: '#EFEFEF', backgroundColor: 'rgba(54, 175, 160, 1)', alignItems: 'center' }}>
                    <View style={{ flex: 1, marginLeft: 5, marginRight: 5, alignItems: 'center' }}>
                        <Text style={{ fontSize: 20, color: 'white' }}>Thông báo</Text>
                    </View>
                </View>
                {this._renderNoNoti()}
                {this._renderLayout()}
            </View>
        );
    }
}

export default NotifyScreen;