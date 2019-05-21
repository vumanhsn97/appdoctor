import React, { Component } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import { Provider, connect } from 'react-redux';
import * as actions from '../actions';

class Counter extends Component {
    static navigationOptions = {
        title: 'Counter!',
    };

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.paragraph}>{this.props.count}</Text>
                <Button
                    title="Increment"
                    onPress={() => this.props.counterIncrease()}
                />
                <Button
                    title="Decrement"
                    onPress={() => this.props.counterDecrease()}
                />

                <Button
                    title="Go to static count screen"
                    onPress={() => this.props.navigation.navigate('StaticCounter')}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ecf0f1',
        padding: 8,
    },
    paragraph: {
        margin: 24,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

const mapStateToProps = (state) => {
    return {
        count: state.count
    }
}


export default connect(mapStateToProps, actions)(Counter);