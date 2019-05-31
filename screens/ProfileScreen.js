import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import CardItemProfile from '../components/CardItemProfile';
import MyListCard from '../components/MyListCard';
import * as actions from '../actions';
import { connect } from 'react-redux';
import { Button, ListItem, Avatar, Divider, Card, Overlay, Input } from 'react-native-elements';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
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
            profile: {},
            isVisiblePasswordScreen: false,
            isVisibleEditNameScreen: false,
            typePassword: "",
            newPassword: "",
            HoTen: ""
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
                    this.setState({ profile: response.data.doctor, loading: true, HoTen: response.data.doctor.HoTen });
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

    // isMatchingPassword = async () => {
    //     const password = await AsyncStorage.getItem('Password');
    //     if (SHA256(password) == SHA256(this.state.typePassword)) {
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }

    onUpdatePassword = async () => {
        //Thuc hien doi mat khau
        var doctor = {
            MaBacSi: this.state.profile.MaBacSi,
            NewPassword: this.state.newPassword,
            OldPassword: this.state.typePassword
        };
        //Update xuống DB
        await this.apiService.changeBacSiPassword(doctor)
            .then((result) => {
                if (result.status === "success") {
                    // Cập nhật thành công
                    alert("Cập nhật mật khẩu thành công!");
                    this.setState({
                        isVisiblePasswordScreen: false
                    })
                }
                else if (result.status === "failed") {
                    if (result.message_error === "Mật khẩu cũ không đúng")
                    alert("Mật khẩu cũ không đúng! Vui lòng kiểm tra lại!");
                }
            })
    }

    changePassword = () => {
        if (this.state.typePassword == "" || this.state.newPassword == "") {
            alert("Mật khẩu không được rỗng!");
        } else {
            // if (this.isMatchingPassword()) {
            //     this.onUpdatePassword();
            // } else {
            //     alert("Mật khẩu cũ không đúng! Vui lòng kiểm tra lại!");
            // }
            this.onUpdatePassword();
        }
    }

    updateFullName = async () => {
        await this.props.updateMyProfile('name', this.state.HoTen);
        this.setState({isVisibleEditNameScreen: false})
    }

    _renderView = () => {
        if (this.state.loading) {
            return (
                <ScrollView >
                    <Overlay isVisible={this.state.isVisibleEditNameScreen}
                        borderRadius={10}
                        height={200}
                        onBackdropPress={() => { this.setState({ isVisibleEditNameScreen: false }) }}>
                        <ScrollView>
                            <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold', marginBottom: 25 }}>Sửa tên</Text>
                            <View style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginHorizontal: 20,
                            }}>
                                <Input autoCapitalize='words' onChangeText={(text) => this.setState({ HoTen: text })} placeholder='Nhập tên của bạn'>{this.state.HoTen}</Input>
                            </View>
                            <Button
                                type='outline'
                                title="Cập nhật"
                                buttonStyle={{ width: 120, alignSelf: 'center', marginTop: 20 }}
                                onPress={() => this.updateFullName()}
                            />
                        </ScrollView>
                    </Overlay>
                    <Overlay isVisible={this.state.isVisiblePasswordScreen}
                        borderRadius={10}
                        height={250}>
                        <ScrollView>
                            <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold', marginBottom: 25 }}>Đổi mật khẩu</Text>
                            <Input onChangeText={(text) => this.setState({ typePassword: text })} placeholder='Nhập mật khẩu cũ' secureTextEntry={true}></Input>
                            <Input onChangeText={(text) => this.setState({ newPassword: text })} placeholder='Nhập mật khẩu mới' secureTextEntry={true}></Input>
                            <View style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginTop: 10
                            }}>
                                <Button
                                    type='outline'
                                    title="Đồng ý"
                                    buttonStyle={{ width: 120 }}
                                    onPress={() => this.changePassword()}
                                />
                                <Button
                                    type='outline'
                                    title="Hủy"
                                    buttonStyle={{ width: 120 }}
                                    onPress={() => this.setState({ isVisiblePasswordScreen: false })}
                                />
                            </View>
                        </ScrollView>
                    </Overlay>

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
                        <Text onPress={() => { this.setState({ isVisibleEditNameScreen: true }) }} style={{
                            marginTop: 10,
                            fontSize: 28,
                            color: "#696969",
                            fontWeight: '600',
                        }}>{this.state.HoTen}&nbsp;<AntDesign name='edit' size={25} color='rgba(74, 195, 180, 1)'></AntDesign></Text>
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
                        <TouchableOpacity onPress = { () => { this.setState({ isVisiblePasswordScreen: true }) }}>
                            <View style={{ flex: 1, flexDirection: 'row', padding: 10, alignItems: "center" }}>
                                <MaterialCommunityIcons name='textbox-password' size={20}></MaterialCommunityIcons>
                                <Text style={{ marginLeft: 10, fontSize: 18, color: 'black' }}>Đổi mật khẩu</Text>
                            </View>
                        </TouchableOpacity>
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