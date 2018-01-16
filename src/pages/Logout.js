import React, { Component, PropTypes } from 'react'
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight
} from 'react-native';

import { logout } from "../localApis/auth"
import Button from "../components/Button"


class Logout extends Component {
    _onPress = () => {
        logout().then(res => this.props.navigation.navigate("LoggedOut"))
            .catch(err => console.log(err))
    }

    render () {
        return (
            <View style={styles.logoutPage} >
                <Button danger style={styles.btn} onPress={this._onPress} >ログアウト</Button>
            </View>
          
        )
    }
}

Logout.propTypes = {

}

const styles = StyleSheet.create({
    logoutPage: {
        width: "100%",
        flex: .8,
        textAlign: "center",
        justifyContent: "flex-end"
    },
    btn: {
        width: 90,
        marginLeft: "auto",
        marginRight: "auto"
    }
})

export default Logout