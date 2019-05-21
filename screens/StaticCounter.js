import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';

class StaticCounter extends Component {
    static navigationOptions = {
        title: `Same number, wow!`,
    };

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.paragraph}>{this.props.count}</Text>
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


export default connect(mapStateToProps, null)(StaticCounter);