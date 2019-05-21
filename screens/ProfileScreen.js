import React, { Component } from 'react';
import { View, Text, ScrollView } from 'react-native';
import CardItemProfile from '../components/CardItemProfile';
import MyListCard from '../components/MyListCard';
import * as actions from '../actions';
import { connect } from 'react-redux';
import { Button, ListItem, Avatar, Divider, Card } from 'react-native-elements';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ImagePicker from 'react-native-image-picker';

class ProfileScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            image: "",
        }
    }

    componentDidMount() {
        this.setState({image: this.props.profile.Avatar});
        console.log("hêlo");
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

    render() {
        
        return (
            <ScrollView>
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
                    onEditPress = { () => this.changeImage()}
                />
                <View style={{ marginTop: 40, alignItems: 'center' }}>
                    <Text style={{
                        marginTop: 10,
                        fontSize: 28,
                        color: "#696969",
                        fontWeight: '600',
                    }}>{this.props.profile.HoTen}</Text>
                    <Text style={{
                        fontSize: 16,
                        color: "#00BFFF",
                    }}>{this.props.profile.MaBacSi}</Text>
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
                        title={this.props.profile.CMND}
                        settingLabel='Nhập CMND'
                        settingDetail={this.props.profile.CMND}
                    />

                    <CardItemProfile
                        type='gender'
                        label='Giới tính'
                        keyname='gender'
                        title={(this.props.profile.GioiTinh === null) ? 'Nữ' : 'Nam'}
                        settingLabel='Chọn giới tính'
                        settingDetail={(this.props.profile.GioiTinh === null) ? false : true}
                    />
                    <CardItemProfile
                        type='text'
                        label='Bệnh viện'
                        keyname='hospital'
                        title={this.props.profile.BenhVien}
                        settingLabel='Nhập tên bệnh viện'
                        settingDetail={this.props.profile.BenhVien}
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
                        title={this.props.profile.Email}
                        settingLabel='Nhập email'
                        settingDetail={this.props.profile.Email}
                    />
                </Card>
            </ScrollView>
        );
    }
}

const mapStateToProps = state => ({
    profile: state.myProfile
})

export default connect(mapStateToProps, actions)(ProfileScreen);