import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import CardItemProfile from '../components/CardItemProfile';
import MyListCard from '../components/MyListCard';
import * as actions from '../actions';
import { connect } from 'react-redux';
import { Button, ListItem, Avatar, Divider, Card } from 'react-native-elements';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ImagePicker from 'react-native-image-picker';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5'
import axios from 'axios';
import ApiService from '../services/api';

class ProfileScreen extends Component {
    constructor(props) {
        super(props);
        this.apiService = ApiService()
        this.state = {
            image: "",
            loading: false,
            profile: {}
        }
        this._bootstrapAsync();
    }

    static navigationOptions = {
        drawerLabel: 'HomeScreen',
        drawerIcon: ({ tintColor }) => (
            <Icon name='search' size={20} color='black' />
        ),
    };

    _bootstrapAsync = async () => {
        const userId = await AsyncStorage.getItem('UserId');
        const password = await AsyncStorage.getItem('Password');
        await axios.post(api + 'doctors/log-in', {
            MaBacSi: userId,
            Password: password
        })
            .then(async (response) => {
                if (response.data.status == 'success') {
                    let data = response.data.doctor;
                    if (data.GioiTinh !== null) data.GioiTinh = true;
                    this.props.loadMyProfile(data);
                    this.setState({ profile: response.data.doctor, loading: true });
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    componentDidMount() {
        this.setState({ image: this.props.profile.Avatar });
    }

    changeImage = () => {
        const options = {
            title: 'Chọn hình đại diện',
            storageOptions: {
                skipBackup: false,
                path: 'images',
            },
            mediaType: 'photo',
            cancelButtonTitle: 'Hủy',
            takePhotoButtonTitle: 'Chụp ảnh mới',
            chooseFromLibraryButtonTitle: 'Chọn từ thư viện'
        };
        ImagePicker.showImagePicker(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                // var source = { uri: response.uri };

                // You can also display the image using data:
                var source = response.data;
                this.props.updateMyProfile('image', source);
                this.setState({ image: source });
            }
        });
    }

    _signOutAsync = async () => {     
        Alert.alert(
            'Bạn muốn thoát khỏi hệ thống?',
            '',
            [
              {
                text: 'Không',
                onPress: () => console.log('Cancel Pressed'),
              },
              {text: 'Có', onPress: async () => {
                await AsyncStorage.clear();
                await this.apiService.logout();
                this.props.navigation.navigate('LoginStack');
              }},
            ],
            {cancelable: false},
          );
        
      };

    _renderView = () => {
        if (this.state.loading) {
            return (
                <ScrollView >
                    <Avatar
                        activeOpacity={0.7}
                        containerStyle={{ height: 120, width: '100%' }}
                        source={require('../images/hinh_bien.jpg')}
                    />
                    <Avatar
                        title='Avatar'
                        showEditButton
                        rounded
                        size={130}
                        activeOpacity={0.7}
                        containerStyle={{
                            borderWidth: 4,
                            borderColor: "white",
                            alignSelf: 'center',
                            position: 'absolute',
                            marginTop: 30,
                        }}
                        source={{ uri: 'data:image/jpeg;base64,' + (this.state.image ? this.state.image : this.props.profile.Avatar) }}
                        onEditPress={() => this.changeImage()}
                    />
                    <View style={{ marginTop: 40, alignItems: 'center' }}>
                        <Text style={{
                            marginTop: 10,
                            fontSize: 28,
                            color: "#696969",
                            fontWeight: '600',
                        }}>{this.state.profile.HoTen}</Text>
                        <Text style={{
                            fontSize: 16,
                            color: "#00BFFF",
                        }}>{this.state.profile.MaBacSi}</Text>
                    </View>
                    <Card title={
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: 15
                        }}>
                            <AntDesign name="profile" size={20} />
                            <Text style={{
                                fontSize: 20,
                                color: 'black',
                                marginLeft: 15,
                                fontWeight: 'bold',
                                color: 'gray'
                            }}>Thông Tin Cơ Bản</Text>
                        </View>
                    }
                        containerStyle={{
                            borderColor: 'transparent',
                            shadowColor: 'transparent',
                            shadowOffset: { width: 0, height: 0 },
                            shadowOpacity: .0,
                            shadowRadius: 0,
                            elevation: 0
                        }}
                    >
                        <CardItemProfile
                            type='text'
                            label='Chứng minh nhân dân'
                            keyname='cmnd'
                            title={this.state.profile.CMND ? this.state.profile.CMND : 'Chưa có dữ liệu'}
                            settingLabel='Nhập CMND'
                            settingDetail={this.state.profile.CMND ? this.state.profile.CMND : 'Chưa có dữ liệu'}
                        />
                        <CardItemProfile
                            type='gender'
                            label='Giới tính'
                            keyname='gender'
                            title={(this.state.profile.GioiTinh == null) ? 'Nữ' : 'Nam'}
                            settingLabel='Chọn giới tính'
                            settingDetail={(this.state.profile.GioiTinh == null) ? false : true}
                        />
                        <CardItemProfile
                            type='text'
                            label='Bệnh viện'
                            keyname='hospital'
                            title={this.state.profile.BenhVien ? this.state.profile.BenhVien : 'Chưa có dữ liệu'}
                            settingLabel='Nhập tên bệnh viện'
                            settingDetail={this.state.profile.BenhVien ? this.state.profile.BenhVien : 'Chưa có dữ liệu'}
                        />
                        <CardItemProfile
                            type='speciality'
                            label='Chuyên môn'
                            keyname='speciality'
                            title={this.state.profile.ChuyenMon ? this.state.profile.ChuyenMon : 'Chưa có dữ liệu'}
                            settingLabel='Chọn chuyên môn'
                            settingDetail={this.state.profile.ChuyenMon ? this.state.profile.ChuyenMon : 'Chưa có dữ liệu'}
                        />
                    </Card>

                    <Card title={
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: 15
                        }}>
                            <AntDesign name="contacts" size={20} />
                            <Text style={{
                                fontSize: 20,
                                color: 'black',
                                marginLeft: 15,
                                fontWeight: 'bold',
                                color: 'gray'
                            }}>Liên Hệ</Text>
                        </View>
                    }
                        containerStyle={{
                            borderColor: 'transparent',
                            shadowColor: 'transparent',
                            shadowOffset: { width: 0, height: 0 },
                            shadowOpacity: .0,
                            shadowRadius: 0,
                            elevation: 0
                        }}
                    >
                        <Divider />
                        <CardItemProfile
                            type='text'
                            label='Email'
                            keyname='email'
                            title={this.state.profile.Email ? this.state.profile.Email : 'Chưa có dữ liệu'}
                            settingLabel='Nhập email'
                            settingDetail={this.state.profile.Email ? this.state.profile.Email : 'Chưa có dữ liệu'}
                        />
                    </Card>

                    <Card title={
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: 15
                        }}>
                            <AntDesign name="setting" size={20} />
                            <Text style={{
                                fontSize: 20,
                                color: 'black',
                                marginLeft: 15,
                                fontWeight: 'bold',
                                color: 'gray'
                            }}>Cài đặt</Text>
                        </View>
                    }
                        containerStyle={{
                            borderColor: 'transparent',
                            shadowColor: 'transparent',
                            shadowOffset: { width: 0, height: 0 },
                            shadowOpacity: .0,
                            shadowRadius: 0,
                            elevation: 0
                        }}
                    >
                        <Divider />
                        <TouchableOpacity onPress = { () => { this._signOutAsync() }}>
                            <View style={{ flex: 1, flexDirection: 'row', padding: 10, alignItems: "center" }}>
                                <AntDesign name='logout' size={20} />
                                <Text style={{ marginLeft: 10, fontSize: 18, color: 'black' }}>Đăng xuất</Text>
                            </View>
                        </TouchableOpacity>
                    </Card>
                </ScrollView>
            )
        }
        return (
            <View style = {{ alignItems: "center", justifyContent: 'center', flex: 1 }}>
                <ActivityIndicator size="large" color="#00ff00"/>
            </View>
        )
    }

    render() {
        return (
            <View>
                {this._renderView()}
            </View>
        )
    }
}

const mapStateToProps = state => ({
    profile: state.myProfile
})

export default connect(mapStateToProps, actions)(ProfileScreen);