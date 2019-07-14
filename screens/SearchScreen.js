import React, { Component } from 'react';
import { View, TextInput, TouchableOpacity, Text, FlatList, ActivityIndicator, ScrollView, Keyboard, Share } from 'react-native';
import SearchCard from '../components/SearchCard';
import Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import { Button } from 'react-native-elements';

class SearchScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            fail: true,
        }
    }

    onShare = async () => {
        try {
            const result = await Share.share({
                message:
                    'Truy cập link trên app store để để cài đặt ứng dụng',
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    };

    _searchPatient = (text) => {
        this.setState({ loading: true, fail: true });
        if (text.length < 10) return;
        axios(api + 'patients/find-patient-by-id', {
            params: {
                MaBenhNhan: text
            }
        }).then(response => {
            let data = response.data;
            if (data.status == 'success') {
                this.setState({ fail: true, patients: data.patient })

            } else {
                this.setState({ fail: false, patients: [] })
                
            }
            this.setState({ loading: false });
        })
            .catch(error => {
                console.log(error)
            })
    }

    _renderPatients = () => {
        if (!this.state.loading) {
            return (
                <ScrollView keyboardShouldPersistTaps='always'>
                    <FlatList
                        data={this.state.patients}
                        keyboardShouldPersistTaps='always'
                        keyExtractor={e => e.MaBenhNhan}
                        renderItem={({ item }) => <SearchCard
                            id={item.MaBenhNhan}
                            HoTen={item.HoTen}
                            Avatar={'data:image/jpeg;base64,' + item.Avatar}
                            DiaChi={item.DiaChi}
                            navigation={this.props.navigation}
                        />}

                    />
                </ScrollView>
            );
        }
        return (
            <ActivityIndicator size="small" color="#00ff00" />
        )
    }

    render() {
        return (
            <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: 'rgba(54, 175, 160, 1)' }}>
                    <TouchableOpacity onPress={() => { this.props.navigation.goBack() }}>
                        <View style={{ paddingRight: 15 }}>
                            <Icon name="arrow-left" size={20} color='white' />
                        </View>
                    </TouchableOpacity>
                    <TextInput style={{ height: 40, padding: 0, paddingLeft: 5, paddingRight: 5, flex: 1, fontSize: 16, backgroundColor: 'white', marginRight: 20, fontSize: 20 }}
                        onChangeText={(text) => this._searchPatient(text)}
                        //autoFocus={true}
                        placeholder="Nhập số điện thoại bệnh nhân"
                        keyboardType='numeric'

                    />
                </View>
                {this.state.fail === true ? <Text></Text> : <View style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                    <Text>Không tìm thấy bệnh nhân</Text>
                    <Button
                        title="Gửi yêu cầu"
                        onPress={() => this.onShare()}
                    />
                </View>}
                {this._renderPatients()}
            </View>
        );
    }
}

export default SearchScreen;