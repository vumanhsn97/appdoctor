import React, { Component } from 'react';
import { View, Text} from 'react-native';
import { ListItem } from 'react-native-elements';
import AntDesign from 'react-native-vector-icons/AntDesign';

class MyListCard extends Component {

    render() {
        return (
            <ListItem
                title={
                    <Text style={{ fontSize: 20, color: 'black' }}>
                        {this.props.detail}
                    </Text>
                }
                subtitle={this.props.title}
                rightIcon={
                    <AntDesign name='edit' size={25} color='rgba(74, 195, 180, 1)' ></AntDesign>

                }

            />
        );
    }
}

export default MyListCard;