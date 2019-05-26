import React, { Component } from 'react';
import { View, TextInput, TouchableOpacity, Text, FlatList, ActivityIndicator, ScrollView, Keyboard } from 'react-native';
import SearchCard from '../components/SearchCard';
import Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';

class SearchScreen extends Component {

    constructor(props) {
        super(props);

        this.state ={
            loading: false,
            fail: '',
        }
    }

    _searchPatient = (text) => {
        this.setState({ loading: true, fail: '' });
        if (text.length < 1) return;
        axios(api + 'patients/find-patient-by-id', {
            params: {
                MaBenhNhan: text
            }
          }).then(response => {
            let data = response.data;
            if  (data.status == 'success') {
                this.setState({ fail: 'Số bệnh nhân tìm thấy: ' + data.patient.length + ' người', patients: data.patient })
                
            } else {
                this.setState({ fail: 'Không tìm thấy bệnh nhân nào', patients: []})
            }
            this.setState({ loading: false });
          })
          .catch(error => {
            console.log(error)
          })
    }

    _renderPatients = () => {
       if (!this.state.loading) {
            return(
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
       return(
        <ActivityIndicator size="small" color="#00ff00" />
       )
    }

    render() {
        return(
            <View>
                <View style = {{ flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: 'rgba(54, 175, 160, 1)'}}>
                    <TouchableOpacity onPress={ () => { this.props.navigation.goBack() }}>
                        <View style = {{ paddingRight: 10}}>
                            <Icon name = "arrow-left" size={20} color='white'/>
                        </View>
                    </TouchableOpacity>
                    <TextInput style={{ height: 30, padding: 0, paddingLeft: 5, paddingRight: 5, flex: 1, fontSize: 16, backgroundColor: 'white', marginRight: 20 }} 
                        onChangeText = {(text) => this._searchPatient(text)}
                        autoFocus={true}
                        keyboardType='default'
                    />
                </View>
                {this.state.fail === '' ? <Text></Text> : <Text style={{ marginLeft: 'auto', marginRight: 'auto' }}>{this.state.fail}</Text>}
                {this._renderPatients()}
            </View>
        );
    }
}

export default SearchScreen;